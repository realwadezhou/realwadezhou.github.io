'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mushyData } from '@/lib/mushy';
import { SortableHead, useSortable } from './sortable-head';
import type { MushyPoint, MushyQuestion } from '@/lib/hindsight-types';

type GroupBy = 'author' | 'outlet' | 'category';
type Stance = MushyPoint & { qid: string; p: number; diffuse: boolean };

const pct = (p: number | null) => (p == null ? '—' : `${Math.round(p * 100)}%`);
const num = (x: number | null, d = 3) => (x == null ? '—' : x.toFixed(d));
const signed = (x: number | null, d = 3) =>
  x == null ? '—' : `${x > 0 ? '+' : ''}${x.toFixed(d)}`;
const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
const keysOf = (p: MushyPoint, by: GroupBy): string[] =>
  by === 'category'
    ? p.categories.length
      ? p.categories
      : ['(uncategorised)']
    : [
        (by === 'author' ? p.author : p.outlet) ??
          (by === 'author' ? '(unknown author)' : '(unknown outlet)'),
      ];

/** One stance per group per question: the latest article (protocol §10). */
function stances(
  questions: MushyQuestion[],
  reader: string,
  by: GroupBy,
  wellPosedOnly: boolean,
  category: string,
  batch: string,
): Map<string, Stance[]> {
  // An article with several categories counts once in each of them.
  const latest = new Map<string, [string, Stance]>();
  for (const q of questions) {
    if (wellPosedOnly && q.diffuse) continue;
    if (batch && String(q.batch) !== batch) continue;
    for (const p of q.points) {
      if (p.reader !== reader || p.p == null) continue;
      if (category && !p.categories.includes(category)) continue;
      for (const g of keysOf(p, by)) {
        // Authors/outlets: latest article per question (protocol §10). Categories: every article.
        const k =
          by === 'category'
            ? `${g}\u0000${q.qid}\u0000${p.docId}`
            : `${g}\u0000${q.qid}`;
        const prev = latest.get(k);
        if (!prev || p.date > prev[1].date)
          latest.set(k, [g, { ...p, p: p.p, qid: q.qid, diffuse: q.diffuse }]);
      }
    }
  }
  const groups = new Map<string, Stance[]>();
  for (const [g, s] of latest.values())
    groups.set(g, [...(groups.get(g) ?? []), s]);
  return groups;
}

function summary(xs: Stance[]) {
  const leaning = xs.filter((s) => s.p !== 0.5);
  const deltas = xs.flatMap((s) =>
    s.deltaVsConsensus == null ? [] : [s.deltaVsConsensus],
  );
  const bits = xs.flatMap((s) =>
    s.bitsVsConsensus == null ? [] : [s.bitsVsConsensus],
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
    bits: mean(bits),
    boldness: mean(xs.map((s) => Math.abs(s.p - 0.5))),
  };
}

export function MushyCalibration() {
  const [by, setBy] = useState<GroupBy>('author');
  // Only GPT-6.1 Terra read every article; the other readers covered the MVP set only.
  const reader = 'GPT-6.1 Terra';
  const [wellPosed, setWellPosed] = useState(false);
  const [minN, setMinN] = useState(3);
  const [category, setCategory] = useState('');

  const groups = useMemo(
    () => stances(mushyData.questions, reader, by, wellPosed, category, ''),
    [by, wellPosed, category],
  );
  // Bylines we couldn't attribute are counted in the totals but not ranked.
  const isUnknown = (g: string) => g === '(unknown author)' || g === '(unknown outlet)';
  const nUnknown = [...groups.entries()]
    .filter(([g]) => isUnknown(g))
    .reduce((n, [, xs]) => n + xs.length, 0);
  const rows = [...groups.entries()]
    .filter(([g]) => !isUnknown(g))
    .map(([g, xs]) => ({ g, ...summary(xs) }))
    .filter((r) => r.n >= minN)
    .sort(
      (a, b) =>
        (b.bits ?? -Infinity) - (a.bits ?? -Infinity) ||
        (a.brier ?? 1) - (b.brier ?? 1),
    );
  const overall = summary([...groups.values()].flat());

  const groupSort = useSortable(rows, {
    name: (r) => r.g,
    n: (r) => r.n,
    articles: (r) => r.articles,
    hit: (r) => r.hit,
    brier: (r) => r.brier,
    delta: (r) => r.delta,
    bits: (r) => r.bits,
    boldness: (r) => r.boldness,
  });

  return (
    <section aria-label="Calibration by author and outlet">
      <div className="research-summary">
        <p>How well did the pundits (as inferred by LLMs) do as forecasters?</p>
        <p>We grade authors on a few metrics:</p>
        <ul>
          <li>
            <strong>
              <a
                href="https://en.wikipedia.org/wiki/Brier_score"
                target="_blank"
                rel="noreferrer"
              >
                Brier score
              </a>
              :
            </strong>{' '}
            Lower is better. 0 is a perfect record; 0.25 is what you would get
            by always saying 50%.
          </li>
          <li>
            <strong>Δ vs consensus:</strong> The Brier score of the forecast
            minus that of a consensus, an average of views up until that point.
            Negative scores mean the author beat the consensus.
          </li>
          <li>
            <strong>Boldness:</strong> How far the author’s forecasts sat from
            50%. A boldness of 0% means they never leaned either way, while 50%
            means every call they made was a flat yes or no.
          </li>
          <li>
            <strong>Bits vs consensus:</strong> How much better (in bits) the
            author did than the consensus, per forecast. Positive means they
            beat it; confident calls against the crowd that turn out right earn
            the most.
          </li>
        </ul>
        <p>
          We’re still gathering more articles; most values have not been
          manually checked. All values are tentative.
        </p>
      </div>
      <div className="filter-row mushy-filters">
        <label>
          Group by{' '}
          <select
            value={by}
            onChange={(e) => {
              setBy(e.target.value as GroupBy);
            }}
          >
            <option value="author">Author</option>
            <option value="outlet">Outlet</option>
            <option value="category">Category</option>
          </select>
        </label>
        <label>
          Category{' '}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">All</option>
            {mushyData.categories.map((c) => (
              <option key={c}>{c}</option>
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
        {overall.nDelta}) · bits vs consensus {signed(overall.bits, 2)}.
      </p>
      <div>
        <Table className="fit-table calib-table">
          <TableHeader>
            <TableRow>
              <SortableHead
                label={
                  by === 'author'
                    ? 'Author'
                    : by === 'outlet'
                      ? 'Outlet'
                      : 'Category'
                }
                column="name"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
              />
              <SortableHead
                label={by === 'category' ? 'Stances' : 'Questions'}
                column="n"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
              />
              <SortableHead
                label="Articles"
                column="articles"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
              />
              <SortableHead
                label="Hit rate"
                column="hit"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
                title="Share of stances leaning the right way (50% readings excluded)"
              />
              <SortableHead
                label="Mean Brier"
                column="brier"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
              />
              <SortableHead
                label="Δ vs consensus"
                column="delta"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
              />
              <SortableHead
                label="Boldness"
                column="boldness"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
                title="How far forecasts sat from 50%, on average (0% = never leaned, 50% = always a flat yes or no)"
              />
              <SortableHead
                label="Bits vs consensus"
                column="bits"
                sort={groupSort.sort}
                onSort={groupSort.toggle}
                numeric
                title="Mean log₂(probability the author gave the outcome ÷ probability the earlier consensus gave it). Positive beats the room."
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupSort.sorted.map((r) => (
              <TableRow key={r.g}>
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
                <TableCell>{signed(r.bits, 2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {nUnknown > 0 && (
          <p className="fine-print">
            {nUnknown} stances from articles with no identifiable {by} are left
            out of the table but counted in the totals above.
          </p>
        )}
      </div>
    </section>
  );
}

/** Phrase-scale check: when a piece read as a category, how often did the event happen? */
export function PhraseReliability() {
  // Same pool as the leaderboard's totals: GPT-6.1 Terra, latest article per author per question.
  const pool = useMemo(
    () => [
      ...stances(mushyData.questions, 'GPT-6.1 Terra', 'author', false, '', '').values(),
    ].flat(),
    [],
  );
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

  return (
    <Table className="fit-table">
      <TableHeader>
        <TableRow>
          <TableHead>Likelihood</TableHead>
          <TableHead title="One per author per question: their latest article">
            Forecasts
          </TableHead>
          <TableHead title="The probability our reader assigned to this phrasing, on average">
            Implied probability
          </TableHead>
          <TableHead>Actually happened</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reliability.map((r) => (
          <TableRow key={r.c}>
            <TableCell>{r.c.replace(/_/g, ' ')}</TableCell>
            <TableCell>{r.n}</TableCell>
            <TableCell>{pct(r.reading)}</TableCell>
            <TableCell>{pct(r.observed)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
