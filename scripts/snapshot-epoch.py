"""Freeze the Epoch evidence used by the essay review (stdlib only).

Run: python3 scripts/snapshot-epoch.py --input-dir /path/to/downloaded/csvs
Without --input-dir, download the current CSVs. Output never silently overwrites
an existing review snapshot. Inspect a new snapshot before changing any grades.
Epoch AI data is licensed CC BY: https://creativecommons.org/licenses/by/4.0/
"""

import argparse
import csv
import hashlib
import io
import json
from pathlib import Path
from urllib.request import urlopen

parser = argparse.ArgumentParser()
parser.add_argument('--input-dir', type=Path)
parser.add_argument('--as-of', required=True)
parser.add_argument('--output', required=True, type=Path)
args = parser.parse_args()
paths = {
    'centers': 'data_centers/data_centers.csv',
    'timelines': 'data_centers/data_center_timelines.csv',
    'chips': 'data_centers/data_centers_chip_quantities.csv',
    'models': 'all_ai_models.csv',
    'owners': 'ai_chip_owners_cumulative_by_designer.csv',
    'sales': 'ai_chip_sales_timelines_by_chip.csv',
}
tables, inputs = {}, {}
for key, path in paths.items():
    url = 'https://epoch.ai/data/' + path
    raw = ((args.input_dir / Path(path).name).read_bytes()
           if args.input_dir else urlopen(url, timeout=30).read())
    tables[key] = list(csv.DictReader(io.StringIO(raw.decode('utf-8-sig'))))
    inputs[key] = {'url': url, 'sha256': hashlib.sha256(raw).hexdigest(),
                   'rows': len(tables[key])}

def select(row, fields):
    return {key: row[key] for key in fields}

model_fields = ['Model', 'Publication date', 'Training compute (FLOP)',
                'Training compute lower bound', 'Training compute upper bound',
                'Training compute estimation method']
released = [r for r in tables['models'] if r['Publication date']
            and r['Publication date'] <= '2025-12-31']
known = [r for r in released if r['Training compute (FLOP)']]
known.sort(key=lambda r: float(r['Training compute (FLOP)']), reverse=True)
latest = {}
for row in sorted(tables['timelines'], key=lambda r: r['Date']):
    if row['Date'] <= args.as_of:
        latest[row['Data center']] = row
timeline_fields = ['Data center', 'Date', 'IT power (MW)', 'Power (MW)',
                   'H100 equivalents', 'Total capital cost (2025 USD billions)']
latest_chips = {}
for row in sorted(tables['chips'], key=lambda r: r['Date']):
    if row['Data center'] == 'Colossus 2' and row['Date'] <= args.as_of:
        latest_chips[row['Chip type']] = row
snapshot = {
    'accessed': args.as_of,
    'attribution': 'Epoch AI. Selected records and calculations, CC BY 4.0.',
    'license': 'https://creativecommons.org/licenses/by/4.0/',
    'inputs': inputs,
    'method': 'Dated rows only; no interpolation or future capacity counted. '
              'Epoch estimates are accepted as estimates. Missing values are not zero. '
              'Data-center totals cover listed sites, not the world.',
    'colossus2': select(latest['Colossus 2'], timeline_fields),
    'colossus2Chips': [select(r, ['Date', 'Chip type', 'Number of Units'])
                      for r in latest_chips.values()],
    'modelsReleasedThrough2025': {
        'totalRows': len(released), 'rowsWithComputeEstimate': len(known),
        'missingCompute': len(released) - len(known),
        'largestEstimates': [select(r, model_fields) for r in known[:5]],
        'unestimatedFrontierExamples': [select(r, model_fields) for r in released
            if r['Model'] in ['Gemini 3 Pro', 'Claude Opus 4.5']],
    },
    'chinaOwnership2025': [select(r, ['Owner', 'Chip manufacturer', 'End date',
        'Compute estimate in H100e (median)', 'H100e (5th percentile)',
        'H100e (95th percentile)']) for r in tables['owners']
        if r['End date'] == '2025-12-31' and r['Owner'].startswith('China')],
    'ownershipLatestRows': {
        'date': max(r['End date'] for r in tables['owners']),
        'incomplete': all(r['Incomplete'] == 'True' for r in tables['owners']
                          if r['End date'] == max(x['End date'] for x in tables['owners'])),
    },
}
for group, country in [('coveredWorld', None), ('coveredUS', 'United States')]:
    names = {r['Name'] for r in tables['centers'] if not country or r['Country'] == country}
    rows = [r for name, r in latest.items() if name in names]
    snapshot[group] = {
        'listedSites': len(names), 'sitesWithDatedRecords': len(rows),
        'ITPowerMW': sum(float(r['IT power (MW)'] or 0) for r in rows),
        'facilityPowerMW': sum(float(r['Power (MW)'] or 0) for r in rows),
        'H100e': sum(float(r['H100 equivalents'] or 0) for r in rows),
        'capitalCost2025USDBillions': sum(float(r['Total capital cost (2025 USD billions)'] or 0) for r in rows),
    }
sales2025 = [r for r in tables['sales'] if r['Start date'].startswith('2025')
             and not r['Incomplete']]
snapshot['chipDeliveries2025'] = {
    'rows': len(sales2025),
    'H100e': sum(float(r['Compute estimate in H100e (median)']) for r in sales2025),
    'units': sum(float(r['Number of Units']) for r in sales2025),
    'scope': 'Covered chip deliveries; not deployed stock or all AI investment.',
}
args.output.parent.mkdir(parents=True, exist_ok=True)
with args.output.open('x') as file:
    json.dump(snapshot, file, indent=2)
    file.write('\n')
print(args.output)
