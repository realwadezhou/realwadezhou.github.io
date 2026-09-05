'use client';
import { useState } from 'react';
import {
  appleLaunches,
  availabilityText,
  launchAsOf,
} from '@/lib/apple-launches';
import type { Claim } from '@/lib/claim-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function AppleLaunchTable({
  claims,
  select,
}: {
  claims: Claim[];
  select: (claim: Claim) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [order, setOrder] = useState('newest');
  const [page, setPage] = useState(0);
  const categories = [
    ...new Set(appleLaunches.map((launch) => launch.category)),
  ].sort();
  const years = [
    ...new Set(
      appleLaunches.map((launch) => launch.announcementDate.slice(0, 4)),
    ),
  ]
    .sort()
    .reverse();
  const rows = appleLaunches
    .filter(
      (launch) =>
        (!category || launch.category === category) &&
        (!year || launch.announcementDate.startsWith(year)) &&
        `${launch.product} ${launch.id} ${launch.notes}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      order === 'newest'
        ? b.announcementDate.localeCompare(a.announcementDate)
        : a.announcementDate.localeCompare(b.announcementDate),
    );
  const pageCount = Math.max(1, Math.ceil(rows.length / 25));
  const current = Math.min(page, pageCount - 1);
  return (
    <section aria-label="Apple launch reference">
      <div className="research-summary">
        <p>
          <strong>{appleLaunches.length} launch records</strong> covering major
          hardware generations and selected services from 2015 through{' '}
          {launchAsOf}. The original Watch’s 2014 preview is retained alongside
          its 2015 launch.
        </p>
        <p>
          Dates refer to the US or first launch markets. Announcement, ordering,
          and customer availability are separate. A blank means the exact date
          is not established here. Future availability is marked scheduled;
          historical dates are Apple-stated unless a source note says otherwise.
        </p>
        <a className="text-link" href="/data/apple-launches.json" download>
          Download launch catalog · JSON
        </a>
      </div>
      <div className="research-filters">
        <label>
          Search products
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="iPhone 12, M4, AirPods…"
          />
        </label>
        <label>
          Product
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All products</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Announcement year
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All years</option>
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(0);
            }}
          >
            <option value="newest">Newest announcement</option>
            <option value="oldest">Oldest announcement</option>
          </select>
        </label>
      </div>
      <p className="fine-print" aria-live="polite">
        {rows.length} matching launch records · Expand a product for sources and
        linked forecasts.
      </p>
      <Table className="launch-table">
        <TableHeader>
          <TableRow>
            <TableHead>Product & sources</TableHead>
            <TableHead>Announced</TableHead>
            <TableHead>Orders open</TableHead>
            <TableHead>Customer availability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(current * 25, (current + 1) * 25).map((launch) => {
            const related = claims.filter((claim) =>
              claim.launchIds?.includes(launch.id),
            );
            return (
              <TableRow key={launch.id} id={`launch-${launch.id}`}>
                <TableCell>
                  <details className="launch-details">
                    <summary>
                      <span className="row-type">{launch.category}</span>
                      <strong>{launch.product}</strong>
                      <span className="cell-note">
                        {launch.sources.length} source
                        {launch.sources.length === 1 ? '' : 's'} ·{' '}
                        {related.length} linked claims
                      </span>
                    </summary>
                    <div className="launch-evidence">
                      <p>
                        {launch.notes ||
                          'Dates and product identity drawn from the references below.'}
                      </p>
                      <p>
                        {launch.region} · Checked {launch.verifiedAt}
                      </p>
                      <ul>
                        {launch.sources.map((source) => (
                          <li key={source.url}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {source.title}
                            </a>
                            <span className="cell-note">
                              {source.publishedText}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {related.length > 0 && (
                        <>
                          <h3>Forecasts resolved against this product</h3>
                          <ul>
                            {related.map((claim) => (
                              <li key={claim.id}>
                                <button
                                  className="text-link"
                                  onClick={() => select(claim)}
                                >
                                  {claim.id} · {claim.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </details>
                </TableCell>
                <TableCell>
                  <time>{launch.announcementDate}</time>
                </TableCell>
                <TableCell>{launch.orderDate || '—'}</TableCell>
                <TableCell>
                  {launch.availabilityDate ? availabilityText(launch) : '—'}
                  <span className="cell-note">
                    {launch.availabilityStatus === 'Scheduled'
                      ? 'Scheduled · future date'
                      : launch.availabilityDate
                        ? launch.availabilityPrecision === 'week'
                          ? 'Week only; exact day unknown'
                          : launch.availabilityMilestone
                        : 'Exact date not established'}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!rows.length && (
        <p className="empty-state">No launches match these filters.</p>
      )}
      <div className="research-pagination">
        <button disabled={current === 0} onClick={() => setPage(current - 1)}>
          Previous
        </button>
        <span>
          Page {current + 1} of {pageCount}
        </span>
        <button
          disabled={current + 1 === pageCount}
          onClick={() => setPage(current + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
