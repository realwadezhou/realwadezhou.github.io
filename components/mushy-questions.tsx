'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  Scatter,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
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

const DAY = 86_400_000;
const ts = (d: string) => Date.parse(d.length === 7 ? `${d}-15` : d);
const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });
const pct = (p: number | null | undefined) =>
  p == null ? '—' : `${Math.round(p * 100)}%`;
const COMMITMENT = ['', 'stated', 'flat call', 'hedged', 'implicit', 'none'];

const chartConfig = {
  pundits: {
    label: 'Pundits (as read)',
    theme: { light: '#2a78d6', dark: '#3987e5' },
  },
  markets: { label: 'Markets', theme: { light: '#eb6834', dark: '#d95926' } },
  metaculus: {
    label: 'Metaculus',
    theme: { light: '#1baf7a', dark: '#199e70' },
  },
};

type Dot = MushyPoint & { x: number; y: number };

function PointTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: Dot | { x: number; y: number; name?: string } }[];
}) {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  if ('docId' in d)
    return (
      <div className="mushy-tooltip">
        <strong>{d.title ?? d.docId}</strong>
        <span>
          {d.outlet ?? 'Unknown outlet'} · {d.date}
        </span>
        <span>
          {pct(d.p)} ({d.category?.replace(/_/g, ' ')}) ·{' '}
          {COMMITMENT[d.commitment ?? 0] || '—'}
        </span>
      </div>
    );
  return (
    <div className="mushy-tooltip">
      <strong>{d.name}</strong>
      <span>
        {fmtDate(d.x)} · {pct(d.y)}
      </span>
    </div>
  );
}

function QuestionChart({
  q,
  reader,
}: {
  q: MushyQuestion;
  reader: string;
}) {
  const dots: Dot[] = q.points
    .filter((p) => p.reader === reader && p.p != null)
    .map((p) => ({ ...p, x: ts(p.date), y: p.p as number }));
  const dates = q.points.map((p) => ts(p.date));
  const settled = ts(q.settledOn);
  const lo = Math.min(...dates, settled);
  const hi = Math.max(...dates, settled);
  const pad = Math.max((hi - lo) * 0.05, 2 * DAY);
  const domain: [number, number] = [lo - pad, hi + pad];
  const inDomain = ([d]: [string, number]) => {
    const t = ts(d);
    return t >= domain[0] && t <= Math.min(domain[1], settled);
  };
  const cw = (q.conventionalWisdom[reader]?.points ?? []).map(([d, p]) => ({
    x: ts(d),
    y: p,
    name: 'Conventional wisdom (smoothed)',
  }));
  const series = q.series.map((s) => ({
    ...s,
    key: s.provider === 'Metaculus' ? 'metaculus' : 'markets',
    data: s.points
      .filter(inDomain)
      .map(([d, p]) => ({ x: ts(d), y: p, name: s.name })),
  }));
  const noStance = q.points.filter(
    (p) => p.reader === reader && p.p == null,
  ).length;
  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mushy-chart"
        aria-label={`${q.text} Probability over time: pundit readings by ${reader}, a smoothed conventional-wisdom line${series.length ? ', reference forecasts' : ''}, and the resolution.`}
      >
        <ComposedChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            type="number"
            dataKey="x"
            domain={domain}
            ticks={Array.from(
              { length: 6 },
              (_, i) =>
                Math.round(
                  (domain[0] + ((domain[1] - domain[0]) * i) / 5) / DAY,
                ) * DAY,
            )}
            tickFormatter={fmtDate}
            allowDataOverflow
            label={{ value: 'Date', position: 'insideBottom', offset: -15 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 1]}
            ticks={[0, 0.25, 0.5, 0.75, 1]}
            tickFormatter={(v: number) => pct(v)}
            label={{
              value: 'Probability',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
            }}
          />
          <ChartTooltip content={<PointTooltip />} />
          <Legend verticalAlign="top" height={32} />
          <ReferenceLine
            x={settled}
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeDasharray="4 4"
          />
          {series.map((s) => (
            <Line
              key={s.id}
              data={s.data}
              dataKey="y"
              name={`${s.provider}${q.ladder.length > 1 && s.rung ? ` · ${s.rung}` : ''}`}
              type="stepAfter"
              stroke={`var(--color-${s.key})`}
              strokeOpacity={!s.rung || s.rung === q.primaryRung ? 1 : 0.55}
              strokeWidth={2}
              strokeDasharray={
                s.provider === 'Metaculus'
                  ? '6 3'
                  : s.provider === 'Kalshi'
                    ? '2 3'
                    : s.provider === 'PredictIt'
                      ? '8 2 2 2'
                      : undefined
              }
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <Line
            data={cw}
            dataKey="y"
            name="Conventional wisdom (smoothed)"
            type="monotone"
            stroke="var(--color-pundits)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Scatter
            data={dots}
            name="Pundit readings"
            fill="var(--color-pundits)"
            fillOpacity={0.55}
            shape="cross"
            isAnimationActive={false}
          />
          <ReferenceDot
            x={settled}
            y={q.outcome}
            r={7}
            fill="var(--resolution-mark, #6250d6)"
            stroke="var(--background)"
            strokeWidth={2}
            label={{
              value: q.outcome ? 'Resolved yes' : 'Resolved no',
              position: q.outcome ? 'bottom' : 'top',
              offset: 10,
              fill: 'currentColor',
              fontSize: 12,
            }}
          />
        </ComposedChart>
      </ChartContainer>
      <p className="fine-print">
        Each cross is one article, read by {reader} at the{' '}
        {q.ladder.length > 1 ? `primary rung (${q.primaryRung})` : 'deadline'}.{' '}
        {noStance} article{noStance === 1 ? '' : 's'} took no stance and{' '}
        {noStance === 1 ? 'is' : 'are'} not plotted. The line is a
        Gaussian-weighted average of the crosses
        {q.conventionalWisdom[reader]?.bandwidthDays
          ? ` (bandwidth ${q.conventionalWisdom[reader].bandwidthDays} days)`
          : ''}
        . Dashed vertical: outcome known ({q.settledOn}). Brier compares each
        reading with the outcome. Δ vs consensus compares it with a trailing
        consensus built only from earlier articles: negative means the article
        beat the room.
      </p>
      {series.length > 0 && (
        <ul className="fine-print mushy-series-notes">
          {q.series.map((s) => (
            <li key={s.id}>
              {s.url ? (
                <a
                  className="text-link"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.name}
                </a>
              ) : (
                s.name
              )}
              {s.rung ? ` (deadline ${s.rung})` : ''} — <strong>{s.fit}</strong>
              {s.why ? `: ${s.why}` : '.'}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function MushyQuestions() {
  const questions = useMemo(
    () =>
      [...mushyData.questions].sort(
        (a, b) =>
          Number(b.priority) - Number(a.priority) ||
          Number(b.series.length > 0) - Number(a.series.length > 0) ||
          a.qid.localeCompare(b.qid),
      ),
    [],
  );
  const [qid, setQid] = useState(questions[0]?.qid);
  const [reader, setReader] = useState(mushyData.readers[0]);
  const q = questions.find((x) => x.qid === qid) ?? questions[0];
  const rows = q.points
    .filter((p) => p.reader === reader)
    .sort((a, b) => a.date.localeCompare(b.date));
  const { sorted, sort, toggle } = useSortable(rows, {
    author: (p) => p.author,
    outlet: (p) => p.outlet,
    date: (p) => p.date,
    article: (p) => p.title ?? p.docId,
    reading: (p) => p.p,
    commitment: (p) => p.commitment,
    brier: (p) => p.brier,
    delta: (p) => p.deltaVsConsensus,
  });
  const stances = rows.filter((p) => p.p != null);
  const mean = stances.length
    ? stances.reduce((s, p) => s + (p.p as number), 0) / stances.length
    : null;
  return (
    <section aria-label="Mushy questions">
      <div className="research-summary">
        <p>
          What pundits implied, over time, against what markets and Metaculus
          said and what happened. Each article’s probability is read by a model
          from its prose (pass 4), on frozen questions. Readings are not yet
          validated against careful human labels; see{' '}
          <code>{mushyData.report}</code>.
        </p>
      </div>
      <div className="filter-row mushy-filters">
        <label>
          Question{' '}
          <select value={q.qid} onChange={(e) => setQid(e.target.value)}>
            {questions.map((x) => (
              <option key={x.qid} value={x.qid}>
                {x.priority ? '★ ' : ''}
                {x.qid} — {x.text.slice(0, 70)}
                {x.text.length > 70 ? '…' : ''}
              </option>
            ))}
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
      </div>
      <article className="mushy-question">
        <h2 className="hindsight-heading">{q.text}</h2>
        <div className="mushy-badges">
          <span className="badge">
            {q.outcome ? '✓ Happened' : '✗ Didn’t happen'} · settled{' '}
            {q.settledOn}
          </span>
          {q.priority && <span className="badge">★ Priority set</span>}
          {q.diffuse && <span className="badge">Diffuse topic</span>}
          {q.outcomeAware && (
            <span className="badge">Threshold chosen knowing outcome</span>
          )}
          {!q.resolutionVerified && (
            <span className="badge">Resolution not yet verified</span>
          )}
        </div>
        <details>
          <summary>Resolution rule and deadlines</summary>
          <p>{q.resolution}</p>
          <p>
            Deadlines: {q.ladder.join(' · ')}. Primary: {q.primaryRung}.
          </p>
        </details>
        <QuestionChart q={q} reader={reader} />
        <h3 className="hindsight-heading">
          Articles ({rows.length}; mean reading {pct(mean)})
        </h3>
        <div>
          <Table className="fit-table">
            <colgroup>
              <col style={{ width: '14%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '28%' }} />
              <col style={{ width: '12%' }} />
              <col className="hide-narrow" style={{ width: '9%' }} />
              <col style={{ width: '7%' }} />
              <col className="hide-narrow" style={{ width: '10%' }} />
            </colgroup>
            <TableHeader>
              <TableRow>
                <SortableHead label="Author" column="author" sort={sort} onSort={toggle} />
                <SortableHead label="Outlet" column="outlet" sort={sort} onSort={toggle} />
                <SortableHead label="Date" column="date" sort={sort} onSort={toggle} />
                <SortableHead label="Article" column="article" sort={sort} onSort={toggle} />
                <SortableHead label="Reading" column="reading" sort={sort} onSort={toggle} numeric />
                <SortableHead
                  label="Commit."
                  column="commitment"
                  sort={sort}
                  onSort={toggle}
                  numeric
                  className="hide-narrow"
                  title="Commitment rung: 1 stated, 2 flat call, 3 hedged, 4 implicit"
                />
                <SortableHead
                  label="Brier"
                  column="brier"
                  sort={sort}
                  onSort={toggle}
                  numeric
                  title="(reading − outcome)²; 0 is perfect, 0.25 is a coin flip"
                />
                <SortableHead
                  label="Δ vs consensus"
                  column="delta"
                  sort={sort}
                  onSort={toggle}
                  numeric
                  className="hide-narrow"
                  title="Article Brier minus the Brier of the trailing consensus (earlier articles only). Negative = beat the consensus."
                />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((p) => (
                <TableRow key={p.docId}>
                  <TableCell>{p.author ?? '—'}</TableCell>
                  <TableCell>{p.outlet ?? '—'}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    {p.url ? (
                      <a
                        className="text-link clamp-2"
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        title={p.title ?? p.docId}
                      >
                        {p.title ?? p.docId}
                      </a>
                    ) : (
                      <span className="clamp-2" title={p.title ?? p.docId}>
                        {p.title ?? p.docId}
                      </span>
                    )}
                    {p.categories.length > 0 && (
                      <span className="cat-tags">
                        {p.categories.map((c) => (
                          <span key={c} className="cat-tag">
                            {c}
                          </span>
                        ))}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.p == null
                      ? 'no stance'
                      : `${pct(p.p)} · ${p.category?.replace(/_/g, ' ')}`}
                  </TableCell>
                  <TableCell className="hide-narrow">
                    {COMMITMENT[p.commitment ?? 0] || '—'}
                  </TableCell>
                  <TableCell>{p.brier == null ? '—' : p.brier.toFixed(3)}</TableCell>
                  <TableCell className="hide-narrow">
                    {p.deltaVsConsensus == null
                      ? '—'
                      : `${p.deltaVsConsensus > 0 ? '+' : ''}${p.deltaVsConsensus.toFixed(3)}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </article>
    </section>
  );
}
