"""Apply the dated, paraphrase-only November Apple review to curated ledgers.

Builders retain their original ledgers; this overlay preserves their first
assessment and appends review history. It also applies idempotently to an
already generated JSON file without fetching publisher pages.
"""
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEW = ROOT / 'scripts/data/apple-review-2026-11-13.json'


def apply_review(dataset, kind):
    review = json.loads(REVIEW.read_text())
    result = copy.deepcopy(dataset)
    patch = review[kind]
    if kind == 'launches':
        by_id = {r['id']: r for r in result['launches']}
        for row in patch:
            by_id[row['id']] = row
        result['launches'] = list(by_id.values())
    else:
        result['sources'].update(patch['sources'])
        by_id = {r['id']: r for r in result['claims']}
        for row in by_id.values():
            row.setdefault('history', [{
                'date': row['assessedAt'],
                'change': f"Added to historical corpus. {row['status']}; provisional. {row['note']}"
            }])
        for update in patch['updates']:
            row = by_id[update['id']]
            if not any(h.get('reviewId') == review['reviewId'] for h in row['history']):
                row['history'].append({
                    'date': review['asOf'], 'reviewId': review['reviewId'],
                    'change': f"{row['status']} → {update['changes'].get('status', row['status'])}. {update['reason']}"
                })
            row.update(update['changes'])
            row['assessedAt'] = review['asOf']
        for new in patch['claims']:
            row = copy.deepcopy(new)
            row['history'] = [{
                'date': review['asOf'], 'reviewId': review['reviewId'],
                'change': f"Added from locally parsed saved HTML. {row['status']}; provisional; retrospective collection."
            }]
            by_id[row['id']] = row
        result['claims'] = list(by_id.values())
    result['asOf'] = review['asOf']
    return result


if __name__ == '__main__':
    for kind, filename in [('launches', 'apple-launches'), ('gurman', 'gurman-forecasts'), ('kuo', 'kuo-forecasts')]:
        path = ROOT / f'public/data/{filename}.json'
        result = apply_review(json.loads(path.read_text()), kind)
        path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
        print(filename, len(result.get('claims', result.get('launches', []))))
