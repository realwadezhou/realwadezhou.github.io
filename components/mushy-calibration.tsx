'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mushyData } from '@/lib/mushy';
import { SortableHead, useSortable } from './sortable-head';
import type { MushyPoint, MushyQuestion } from '@/lib/hindsight-types';

type GroupBy = 'author' | 'outlet';
type Stance = MushyPoint & { qid: string; p: number; diffuse: boolean };

const pct = (p: number | null) => (p == null ? '—' : `${Math.round(p * 100)}%`);
const num = (x: number | null, d = 3) => (x == null ? '—' : x.toFixed(d));
const signed = (x: number | null) =>
  x == null ? '—' : `${x > 0 ? '+' : ''}${x.toFixed(3)}`;
const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
const keyOf = (p: MushyPoint, by: GroupBy) =>
  (by === 'author' ? p.author : p.outlet) ??
  (by === 'author' ? '(unknown author)' : '(unknown outlet)');

/** One stance per group per question: the latest article (protocol §10). */
function stances(
  questions: MushyQuestion[],
  reader: string,
  by: GroupBy,
  wellPosedOnly: boolean,
): Map<string, Stance[]> {
  const latest = new Map<string, Stance>();
  for (const q of questions) {
    if (wellPosedOnly && q.diffuse) continue;
    for (const p of q.points) {
      if (p.reader !== reader || p.p == null) continue;
      const k = `${keyOf(p, by)}\u0000${q.qid}`;
      const prev = latest.get(k);
      if (!prev || p.date > prev.date)
        latest.set(k, { ...p, p: p.p, qid: q.qid, diffuse: q.diffuse });
    }
  }
  const groups = new Map<string, Stance[]>();
  for (const s of latest.values()) {
    const g = keyOf(s, by);
    groups.set(g, [...(groups.get(g) ?? []), s]);
  }
  return groups;
}

function summary(xs: Stance[]) {
  const leaning = xs.filter((s) => s.p !== 0.5);
  const deltas = xs.flatMap((s) =>
    s.deltaVsConsensus == null ? [] : [s.deltaVsConsensus],
  );
  return {
    n: xs.length,
    articles: new Set(xs.map((s) => s.docId)).size,
    hit: leaning.length
      ? leaning.filter((s) => s.p > 0.5 === (s.outcome === 1)).length /
        leaning.length
      : null,
    brier: mean(xs.map((s) => (s.p - s.outcome) ** 2)),
    delta: mean(deltas),
    nDelta: deltas.length,
    boldness: mean(xs.map((s) => Math.abs(s.p - 0.5))),
  };
}

export function MushyCalibration() {
  const [by, setBy] = useState<GroupBy>('author');
  const [reader, setReader] = useState(mushyData.readers[0]);
  const [wellPosed, setWellPosed] = useState(false);
  const [minN, setMinN] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const groups = useMemo(
    () => stances(mushyData.questions, reader, by, wellPosed),
    [reader, by, wellPosed],
  );
  const rows = [...groups.entries()]
    .map(([g, xs]) => ({ g, ...summary(xs) }))
    .filter((r) => r.n >= minN)
    .sort((a, b) => b.n - a.n || (a.brier ?? 1) - (b.brier ?? 1));
  const all = [...groups.values()].flat();
  const pool = selected ? (groups.get(selected) ?? []) : all;
  const overall = summary(all);

  const byCategory = new Map<string, Stance[]>();
  for (const s of pool) {
    const c = s.category ?? 'unknown';
    byCategory.set(c, [...(byCategory.get(c) ?? []), s]);
  }
  const reliability = [...byCategory.entries()]
    .map(([c, xs]) => ({
      c,
      n: xs.length,
      reading: mean(xs.map((s) => s.p)),
      observed: mean(xs.map((s) => s.outcome)),
    }))
    .sort((a, b) => (a.reading ?? 0) - (b.reading ?? 0));

  const groupSort = useSortable(rows, {
    name: (r) => r.g,
    n: (r) => r.n,
    articles: (r) => r.articles,
    hit: (r) => r.hit,
    brier: (r) => r.brier,
    delta: (r) => r.delta,
    boldness: (r) => r.boldness,
  });
  const relSort = useSortable(reliability, {
    category: (r) => r.reading,
    n: (r) => r.n,
    reading: (r) => r.reading,
    observed: (r) => r.observed,
  });

  return (
    <section aria-label="Calibration by author and outlet">
      <div className="research-summary">
        <p>
          How well did pundits’ implied probabilities match what happened?
          One stance per {by} per question (the latest article, protocol §10),
          read at the primary deadline. Brier: 0 is perfect, 0.25 is always
          saying 50%. Δ vs consensus: Brier minus that of a trailing consensus
          of earlier articles; negative means beating the room. Readings are
          model-inferred and not yet validated; most groups have very few
          questions, so treat every row as anecdote.
        </p>
      </div>
      <div className="filter-row mushy-filters">
        <label>
          Group by{' '}
          <select
            value={by}
            onChange={(e) => {
              setBy(e.target.value as GroupBy);
              setSelected(null);
            }}
          >
            <option value="author">Author</option>
            <option value="outlet">Outlet</option>
          </select>
        </label>
        <label>
          Reader{' '}
          <select value={reader} onChange={(e) => setReader(e.target.value)}>
            {mushyData.readers.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>
          Topics{' '}
          <select
            value={wellPosed ? 'well' : 'all'}
            onChange={(e) => setWellPosed(e.target.value === 'well')}
          >
            <option value="all">All</option>
            <option value="well">Well-posed only</option>
          </select>
        </label>
        <label>
          Min. questions{' '}
          <select
            value={minN}
            onChange={(e) => setMinN(Number(e.target.value))}
          >
            {[1, 2, 3, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="fine-print">
        All groups: {overall.n} stances · hit rate {pct(overall.hit)} · mean
        Brier {num(overall.brier)} · Δ vs consensus {signed(overall.delta)} (n=
        {overall.nDelta}).
      </p>
      <div>
        <Table className="fit-table calib-table">
          <TableHeader>
            <TableRow>
              <SortableHead label={by === 'author' ? 'Author' : 'Outlet'} column="name" sort={groupSort.sort} onSort={groupSort.toggle} />
              <SortableHead label="Questions" column="n" sort={groupSort.sort} onSort={groupSort.toggle} numeric />
              <SortableHead label="Articles" column="articles" sort={groupSort.sort} onSort={groupSort.toggle} numeric />
              <SortableHead
                label="Hit rate"
                column="hit"
                sort={groupSort.sort} onSort={groupSort.toggle}
                numeric
                title="Share of stances leaning the right way (50% readings excluded)"
              />
              <SortableHead label="Mean Brier" column="brier" sort={groupSort.sort} onSort={groupSort.toggle} numeric />
              <SortableHead label="Δ vs consensus" column="delta" sort={groupSort.sort} onSort={groupSort.toggle} numeric />
              <SortableHead
                label="Boldness"
                column="boldness"
                sort={groupSort.sort} onSort={groupSort.toggle}
                numeric
                title="Mean distance of readings from 50%"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupSort.sorted.map((r) => (
              <TableRow
                key={r.g}
                className={
                  selected === r.g ? 'mushy-row-selected' : 'mushy-row'
                }
                onClick={() => setSelected(selected === r.g ? null : r.g)}
              >
                <TableCell>
                  <span className="clamp-2" title={r.g}>
                    {r.g}
                  </span>
                </TableCell>
                <TableCell>{r.n}</TableCell>
                <TableCell>{r.articles}</TableCell>
                <TableCell>{pct(r.hit)}</TableCell>
                <TableCell>{num(r.brier)}</TableCell>
                <TableCell>
                  {signed(r.delta)}
                  {r.nDelta ? ` (n=${r.nDelta})` : ''}
                </TableCell>
                <TableCell>{pct(r.boldness)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <h3 className="hindsight-heading">
        Reliability by phrase category{selected ? ` — ${selected}` : ' — all'}
      </h3>
      <p className="fine-print">
        When a piece read as a given category, how often did the event happen?
        Well calibrated: observed close to the reading.
        {selected ? ' Click the row again to show all.' : ' Click a row above to filter.'}
      </p>
      <div>
        <Table className="fit-table">
          <TableHeader>
            <TableRow>
              <SortableHead label="Category" column="category" sort={relSort.sort} onSort={relSort.toggle} numeric />
              <SortableHead label="Stances" column="n" sort={relSort.sort} onSort={relSort.toggle} numeric />
              <SortableHead label="Reading" column="reading" sort={relSort.sort} onSort={relSort.toggle} numeric />
              <SortableHead label="Observed" column="observed" sort={relSort.sort} onSort={relSort.toggle} numeric />
            </TableRow>
          </TableHeader>
          <TableBody>
            {relSort.sorted.map((r) => (
              <TableRow key={r.c}>
                <TableCell>{r.c.replace(/_/g, ' ')}</TableCell>
                <TableCell>{r.n}</TableCell>
                <TableCell>{pct(r.reading)}</TableCell>
                <TableCell>{pct(r.observed)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
