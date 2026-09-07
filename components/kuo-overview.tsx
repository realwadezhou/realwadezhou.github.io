import type { Claim } from '@/lib/claim-types';
import { verdicts } from '@/lib/rubric';
import { appleLaunches } from '@/lib/apple-launches';
import { TableCoverage } from './gurman-overview';

export function KuoOverview({
  claims,
  select,
  openLaunches,
}: {
  claims: Claim[];
  select: (claim: Claim) => void;
  openLaunches: () => void;
}) {
  const rows = claims.filter((claim) => claim.personId === 'ming-chi-kuo');
  const families = new Set(rows.map((claim) => claim.familyId)).size;
  const reports = new Set(rows.map((claim) => claim.sources[0].url)).size;
  const direct = new Set(
    rows
      .filter((row) => row.dateNote === 'Direct dated source')
      .map((row) => row.sources[0].url),
  ).size;
  const categories = [
    ...new Set(rows.map((row) => row.category || 'Other')),
  ].sort();
  const example = (title: string, label: string) => {
    const row = rows.find((claim) => claim.title === title);
    return row ? (
      <button className="text-link" onClick={() => select(row)}>
        {label} ({row.id})
      </button>
    ) : (
      label
    );
  };
  return (
    <section className="gurman-overview" aria-label="Kuo research assessment">
      <div className="research-summary">
        <p>
          <strong>
            {rows.length} recorded claims · {reports} source pages · {families}{' '}
            forecast families
          </strong>
        </p>
        <p>
          Reports from 2015–2025, evaluated through September 7, 2026. Coverage
          includes iPhone, iPad, Mac, Watch, AirPods, HomePod, Apple TV, iPod,
          accessories and Vision. {direct} original Kuo posts were recovered;
          the remaining source pages explicitly attribute client notes or public
          posts to him.
        </p>
        <div className="research-actions">
          <button className="text-link" onClick={openLaunches}>
            Explore {appleLaunches.length} Apple launches →
          </button>
          <a className="text-link" href="/api/kuo" download>
            Download all evaluations · JSON
          </a>
          <a className="text-link" href="/data/kuo-forecasts.json" download>
            Extraction ledger
          </a>
        </div>
      </div>
      <div className="verdict-counts">
        {verdicts.map((verdict) => (
          <div key={verdict.label}>
            <strong>
              {rows.filter((row) => row.status === verdict.label).length}
            </strong>
            <span>{verdict.label}</span>
          </div>
        ))}
      </div>
      <p className="fine-print">
        All assessments are provisional. These counts include correlated
        details, revisions and qualified possibilities. They are not a career
        accuracy rate or a fair ranking against Gurman: collection coverage,
        lead times and claim granularity differ.
      </p>
      <div className="research-findings">
        <h2>What the collected record shows</h2>
        <p>
          The sample contains many supported hardware details, from{' '}
          {example('MagSafe returns to Pro notebooks', 'MagSafe’s return')} and{' '}
          {example(
            'At least some 2023 iPhones switch to USB-C',
            'USB-C iPhones',
          )}{' '}
          to{' '}
          {example(
            'Lower-cost MacBook powered by A18 Pro',
            'the A18 Pro MacBook',
          )}
          . Specific misses include{' '}
          {example(
            '2022 MacBook Air uses M1, possibly modified',
            'M1 in the redesigned Air',
          )}
          , {example('OLED iPad Pro uses M3', 'M3 in the OLED iPad Pro')}, and{' '}
          {example(
            'iPhone 17 front camera rises to 24 MP',
            'the 24 MP selfie camera',
          )}
          .
        </p>
        <p>
          Timing and revisions change the picture. The{' '}
          {example(
            'Redesigned MacBook Pros release in Q3 2021',
            'Q3 2021 MacBook Pro window',
          )}{' '}
          missed. The{' '}
          {example(
            'No M3-series MacBooks expected before end of 2023',
            'no-M3-MacBooks call',
          )}{' '}
          was followed by a{' '}
          {example(
            'Revised call: M3-series MacBook Pros at October event',
            'corrected event forecast',
          )}
          . Earlier calls remain visible alongside their revisions.
        </p>
        <p>
          Production dates cannot be graded from retail dates. The{' '}
          {example(
            'OLED iPad Pros enter production late Q1–Q2 2024',
            'original iPad production schedule',
          )}{' '}
          is therefore unassessed. Possibilities and conditional claims retain
          their wording; unpublished internal plans cannot be disproved simply
          because a feature did not ship.
        </p>
        <p>
          Kuo and Gurman sometimes report overlapping claims, but overlap does
          not establish who supplied the information. This collection attributes
          each dated statement to its documented speaker and makes no general
          claim that Kuo is Gurman’s source.
        </p>
      </div>
      <details className="coverage-details">
        <summary>Coverage by product · counts and limitations</summary>
        <TableCoverage rows={rows} categories={categories} />
        <p className="fine-print">
          This is a broad, selective historical collection, not every research
          note, post or product launch. iPhone and Mac are more heavily
          represented. Client-note originals, component-level verification,
          shipment data and independent human review remain incomplete. Forecast
          families group related products and revisions; they are not
          independent statistical trials.
        </p>
      </details>
    </section>
  );
}
