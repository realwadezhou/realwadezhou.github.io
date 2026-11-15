import type { Claim } from '@/lib/claim-types';
import { verdicts } from '@/lib/rubric';
import { appleLaunches } from '@/lib/apple-launches';

export function GurmanOverview({
  claims,
  select,
  openLaunches,
}: {
  claims: Claim[];
  select: (claim: Claim) => void;
  openLaunches: () => void;
}) {
  const rows = claims.filter((claim) => claim.personId === 'mark-gurman');
  const families = new Set(rows.map((claim) => claim.familyId)).size;
  const reports = new Set(
    rows.flatMap((claim) =>
      claim.sources
        .filter((source) => source.role === 'Forecast')
        .map((source) => source.url),
    ),
  ).size;
  const categories = [
    ...new Set(rows.map((claim) => claim.category || 'Other')),
  ].sort();
  const example = (title: string, label: string) => {
    const claim = rows.find((row) => row.title === title);
    return claim ? (
      <button className="text-link" onClick={() => select(claim)}>
        {label} ({claim.id})
      </button>
    ) : (
      label
    );
  };
  return (
    <section
      className="gurman-overview"
      aria-label="Gurman research assessment"
    >
      <div className="research-summary">
        <p>
          <strong>
            {rows.length} recorded claims · {reports} source pages · {families}{' '}
            forecast families
          </strong>
        </p>
        <p>
          Reports from 2015–2026, reviewed against launches through November 13, 2026, spanning iPhone, Mac, iPad, Watch, audio, TV,
          services, and Vision. Every assessment is provisional. Most Bloomberg
          reporting is recovered through dated public attribution; original
          Gurman articles and an interview are identified separately.
        </p>
        <div className="research-actions">
          <button className="text-link" onClick={openLaunches}>
            Explore {appleLaunches.length} Apple launches →
          </button>
          <a className="text-link" href="/downloads/gurman-evaluations.json" download>
            Download all evaluations · JSON
          </a>
          <a className="text-link" href="/data/gurman-forecasts.json" download>
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
        These are claim counts, not an accuracy percentage. A report can supply
        several correlated details; revisions stay in the same family.
        Possibilities, internal plans, and unresolved evidence are preserved.
        This selective collection has no complete denominator, independence, or
        benchmark for a career-wide accuracy estimate.
      </p>
      <div className="research-findings">
        <h2>What the collected record shows</h2>
        <p>
          Detailed hardware reporting has many supported examples, including the{' '}
          {example(
            'One USB-C port for charging and data',
            'single-port MacBook',
          )}
          , {example('Contextual touch strip above the keyboard', 'Touch Bar')},
          and {example('M4 and M4 Pro options for Mac mini', 'M4 Mac mini')}.
          Naming and specifications still have clear misses, including{' '}
          {example(
            'First headset likely called Apple Reality Pro',
            'Reality Pro branding',
          )}{' '}
          and{' '}
          {example(
            'Flat-edged design on Series 7',
            'flat-edged Apple Watch Series 7',
          )}
          .
        </p>
        <p>
          Timing must be checked separately. The{' '}
          {example(
            'Apple-silicon Mac Pro debuts in 2022',
            '2022 Mac Pro window',
          )}{' '}
          and{' '}
          {example(
            'AirTag 2 around the middle of 2025',
            'mid-2025 AirTag window',
          )}{' '}
          missed. His{' '}
          {example(
            'M3 Pro/Max MacBook Pros in early-to-spring 2024',
            'early-2024 MacBook Pro call',
          )}{' '}
          was followed six days later by a{' '}
          {example(
            'Mac announcement on October 30 or 31',
            'corrected October event call',
          )}
          . Both are retained.
        </p>
        <p>
          These examples support a practical reading: separate product details
          from dates, preserve the latest revision alongside earlier calls, and
          give less weight to loosely worded plans. They do not establish a
          probability that the next rumor will be correct.
        </p>
      </div>
      <details className="coverage-details">
        <summary>Coverage by product · counts and limitations</summary>
        <TableCoverage rows={rows} categories={categories} />
        <p className="fine-print">
          Coverage is uneven: iPhone and Mac supply most claims. There is no
          claim of every newsletter, tweet, SKU, or major launch being
          represented. An iPod forecast pass, original Bloomberg recovery,
          canceled-project histories, more 2025–2026 reports, and independent
          review remain useful extensions.
        </p>
      </details>
    </section>
  );
}

export function TableCoverage({
  rows,
  categories,
}: {
  rows: Claim[];
  categories: string[];
}) {
  return (
    <div className="coverage-scroll">
      <table className="coverage-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Claims</th>
            <th>Supported</th>
            <th>Contradicted</th>
            <th>Other / open</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const items = rows.filter(
              (row) => (row.category || 'Other') === category,
            );
            return (
              <tr key={category}>
                <th>{category}</th>
                <td>{items.length}</td>
                <td>
                  {items.filter((item) => item.status === 'Supported').length}
                </td>
                <td>
                  {
                    items.filter((item) => item.status === 'Contradicted')
                      .length
                  }
                </td>
                <td>
                  {
                    items.filter(
                      (item) =>
                        !['Supported', 'Contradicted'].includes(item.status),
                    ).length
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
