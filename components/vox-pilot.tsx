'use client';

import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RowCountSelect } from './row-count-select';
import { SortableHead, useSortable } from './sortable-head';
import { paginate, type RowCount } from '@/lib/pagination';
import {
  hindsightModels,
  leakageYearGroups,
  modelMeanAbsoluteError,
  outcomeDirectedBias,
  voxPilot,
} from '@/lib/hindsight';
import type { HindsightItem, Probability } from '@/lib/hindsight-types';

const percent = (value: Probability | undefined) =>
  value == null ? '—' : `${Math.round(value * 100)}%`;
const points = (value: number | null) =>
  value === null ? '—' : `${(value * 100).toFixed(1)} pp`;
const outcomeLabel = (outcome: HindsightItem['outcome']) =>
  outcome === null
    ? 'Unresolved'
    : outcome === 1
      ? 'Happened'
      : 'Didn’t happen';
const outcomeSeries = [
  { key: 'happened', label: 'Happened', value: 1, color: '#30745c' },
  { key: 'didnt', label: 'Didn’t happen', value: 0, color: '#aa4843' },
  { key: 'unresolved', label: 'Unresolved', value: null, color: '#74849b' },
] as const;
const chartConfig = Object.fromEntries(
  outcomeSeries.map((series) => [
    series.key,
    { label: series.label, color: series.color },
  ]),
);

function PilotDetail({ item }: { item: HindsightItem }) {
  return (
    <>
      <SheetHeader>
        <div className="eyebrow">
          {item.id} · {item.year}
        </div>
        <SheetTitle className="detail-title">{item.statement}</SheetTitle>
        <SheetDescription>
          {item.author ?? 'Author not recorded'} · Published {item.published}
        </SheetDescription>
      </SheetHeader>
      <div className="detail-body">
        <dl className="claim-facts">
          <div>
            <dt>Stated probability</dt>
            <dd>{percent(item.statedP)}</dd>
          </div>
          <div>
            <dt>Outcome</dt>
            <dd>{outcomeLabel(item.outcome)}</dd>
          </div>
          <div>
            <dt>Rung / provenance</dt>
            <dd>
              {item.rung} / {item.provenance}
            </dd>
          </div>
        </dl>
        {item.inferred.map((entry) => (
          <section key={entry.model}>
            <h3>{entry.model}</h3>
            <p className="fine-print">Inferred · Prompt: {entry.prompt}</p>
            <dl className="claim-facts">
              <div>
                <dt>Low / mid / high</dt>
                <dd>
                  {percent(entry.low)} / {percent(entry.mid)} /{' '}
                  {percent(entry.high)}
                </dd>
              </div>
              <div>
                <dt>Label mapping</dt>
                <dd>
                  {entry.labelPhrase || '—'} → {percent(entry.labelP)}
                </dd>
              </div>
              <div>
                <dt>Statement only</dt>
                <dd>{percent(entry.statementOnlyP)}</dd>
              </div>
            </dl>
            <p>{entry.reason || 'No reason recorded.'}</p>
          </section>
        ))}
        <h3>Human guess · inferred</h3>
        {item.human ? (
          <>
            <p>
              {percent(item.human.p)} · Knew outcome:{' '}
              {item.human.knewOutcome ?? 'Not recorded'}
            </p>
            <p>{item.human.note || 'No note recorded.'}</p>
          </>
        ) : (
          <p>No human label.</p>
        )}
        <a
          className="text-link"
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Vox article ↗
        </a>
      </div>
    </>
  );
}

export function VoxPilot() {
  const [model, setModel] = useState(hindsightModels[0] ?? '');
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [resolution, setResolution] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [rowCount, setRowCount] = useState<RowCount>(25);
  const [selected, setSelected] = useState<HindsightItem | null>(null);
  const years = [...new Set(voxPilot.items.map((item) => item.year))].sort(
    (a, b) => b - a,
  );
  const error = (item: HindsightItem, chosen: string) => {
    const mid = item.inferred.find((entry) => entry.model === chosen)?.mid;
    return mid == null ? -1 : Math.abs(mid - item.statedP);
  };
  const rows = voxPilot.items
    .filter(
      (item) =>
        (!year || item.year === Number(year)) &&
        (resolution === 'all' ||
          (resolution === 'resolved'
            ? item.outcome !== null
            : item.outcome === null)) &&
        `${item.statement} ${item.author ?? ''} ${item.id}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort(
      (a, b) =>
        (sort === 'newest' ? 0 : error(b, sort) - error(a, sort)) ||
        b.year - a.year ||
        b.published.localeCompare(a.published) ||
        a.id.localeCompare(b.id),
    );
  const midOf = (item: HindsightItem, name: string) =>
    item.inferred.find((entry) => entry.model === name)?.mid ?? null;
  const itemSort = useSortable(rows, {
    statement: (i) => i.statement,
    year: (i) => i.year,
    author: (i) => i.author,
    stated: (i) => i.statedP,
    human: (i) => i.human?.p ?? null,
    outcome: (i) => i.outcome,
    ...Object.fromEntries(
      hindsightModels.map((name) => [`mid:${name}`, (i: HindsightItem) => midOf(i, name)]),
    ),
  });
  const { visible, current, pageCount } = paginate(itemSort.sorted, page, rowCount);
  const scatterItems = voxPilot.items.flatMap((item) => {
    const mid = item.inferred.find((entry) => entry.model === model)?.mid;
    return mid == null ? [] : [{ ...item, mid }];
  });
  const recovery = modelMeanAbsoluteError(model);
  return (
    <section aria-label="Vox recovery pilot">
      <div className="research-summary">
        <p>
          <strong>Best-case pilot.</strong> Vox’s prose was written to justify a
          number the team had already agreed, so this shows the reading step can
          work, not that it works on mushy op-eds.
        </p>
        <p>
          Stated probabilities come from Vox; model and human estimates are
          inferred. Export: <time>{voxPilot.generated}</time>. All analyses
          below use the full pilot; filters apply only to the item table.
        </p>
      </div>
      <section className="research-findings" aria-labelledby="recovery-heading">
        <h2 id="recovery-heading">Probability recovery</h2>
        <p>
          Mean absolute error between the recovered and the stated probability;
          lower is better; “always 50%” is the floor to beat. Errors are in
          percentage points (pp).
        </p>
        <Table className="rubric-table fit-table">
          <TableHeader>
            <TableRow>
              <TableHead>Recovery method</TableHead>
              <TableHead>MAE</TableHead>
              <TableHead>n</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voxPilot.recovery.map((entry) => (
              <TableRow key={entry.predictor}>
                <TableCell>{entry.predictor}</TableCell>
                <TableCell>{points(entry.mae)}</TableCell>
                <TableCell>{entry.n}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="fine-print">
          Methods appear in export order. The human quick pass covers only its
          labelled subset; denominators differ.
        </p>
      </section>
      <section className="research-findings" aria-labelledby="scatter-heading">
        <h2 id="scatter-heading">Stated vs recovered probability</h2>
        <div className="research-filters">
          <label>
            Model
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
            >
              {hindsightModels.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="fine-print">
          {recovery.n} estimates · Band-midpoint MAE {points(recovery.mae)} ·
          Dashed line: perfect recovery (y = x).
        </p>
        <ChartContainer
          config={chartConfig}
          className="hindsight-scatter"
          aria-label={`${model}: stated probability on x-axis, inferred midpoint on y-axis; points coloured by outcome`}
        >
          <ScatterChart margin={{ top: 15, right: 25, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="statedP"
              name="Stated"
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={percent}
              label={{
                value: 'Stated probability',
                position: 'insideBottom',
                offset: -15,
              }}
            />
            <YAxis
              type="number"
              dataKey="mid"
              name="Inferred mid"
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={percent}
              label={{
                value: 'Inferred midpoint',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }}
            />
            <ReferenceLine
              segment={[
                { x: 0, y: 0 },
                { x: 1, y: 1 },
              ]}
              stroke="#74849b"
              strokeDasharray="5 5"
            />
            <ChartTooltip
              formatter={(value) =>
                typeof value === 'number' ? percent(value) : '—'
              }
            />
            <Legend verticalAlign="top" />
            {outcomeSeries.map((series) => (
              <Scatter
                key={series.key}
                name={series.label}
                data={scatterItems.filter(
                  (item) => item.outcome === series.value,
                )}
                fill={`var(--color-${series.key})`}
                fillOpacity={0.7}
                isAnimationActive={false}
              />
            ))}
          </ScatterChart>
        </ChartContainer>
      </section>
      <section className="research-summary" aria-labelledby="leakage-heading">
        <h2 id="leakage-heading" className="hindsight-heading">
          Outcome-directed bias
        </h2>
        <p>
          Mean of (mid − stated probability) × (+1 if happened, −1 otherwise),
          over resolved items with a midpoint. Shown as mean ± standard error
          (sample SD / √n), in percentage points.
        </p>
        <p>
          Positive means the model&apos;s estimate leans toward what actually
          happened, which it could only know from hindsight. Llama 3.1
          70B&apos;s training data ends in Dec 2023; Claude Sonnet 5.5 has seen
          all of these outcomes.
        </p>
        <p>
          This is a leakage diagnostic, not proof of leakage: directional errors
          alone cannot establish their cause. Unresolved items are excluded.
        </p>
        <Table className="rubric-table fit-table">
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              {leakageYearGroups.map((group) => (
                <TableHead key={group.label}>
                  {group.label} · mean ± SE
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hindsightModels.map((name) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                {leakageYearGroups.map((group) => {
                  const bias = outcomeDirectedBias(name, group);
                  return (
                    <TableCell key={group.label}>
                      {bias.mean !== null && bias.mean > 0 ? '+' : ''}
                      {points(bias.mean)} ± {points(bias.se)}
                      <span className="cell-note">n = {bias.n}</span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <h2 className="hindsight-heading">Item ledger</h2>
      <div className="research-filters">
        <label>
          Search items
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Statement, author, item ID…"
          />
        </label>
        <label>
          Year
          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setPage(0);
            }}
          >
            <option value="">All years</option>
            {years.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Resolution
          <select
            value={resolution}
            onChange={(event) => {
              setResolution(event.target.value);
              setPage(0);
            }}
          >
            <option value="all">All outcomes</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>
        </label>
        <label>
          Sort
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value);
              setPage(0);
            }}
          >
            <option value="newest">Newest first</option>
            {hindsightModels.map((name) => (
              <option key={name} value={name}>
                Largest absolute error · {name}
              </option>
            ))}
          </select>
        </label>
        <RowCountSelect
          value={rowCount}
          onChange={(value) => {
            setRowCount(value);
            setPage(0);
          }}
        />
      </div>
      <p className="fine-print" aria-live="polite">
        {rows.length} matching items · Model columns show inferred midpoints.
        Human guesses are inferred; — means unavailable. Open an item for bands
        and reasoning.
      </p>
      <Table className="launch-table hindsight-items fit-table">
        <TableHeader>
          <TableRow>
            <SortableHead label="Statement" column="statement" sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }} />
            <SortableHead label="Year" column="year" sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }} numeric />
            <SortableHead label="Author" column="author" sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }} />
            <SortableHead label="Stated" column="stated" sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }} numeric />
            {hindsightModels.map((name) => (
              <SortableHead
                key={name}
                label={`${name} · mid`}
                column={`mid:${name}`}
                sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }}
                numeric
              />
            ))}
            <SortableHead label="Human" column="human" sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }} numeric />
            <SortableHead label="Outcome" column="outcome" sort={itemSort.sort} onSort={(c, n) => { itemSort.toggle(c, n); setPage(0); }} numeric />
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((item) => (
            <TableRow key={item.id} onClick={() => setSelected(item)}>
              <TableCell>
                <button
                  className="claim-link"
                  onClick={() => setSelected(item)}
                >
                  {item.statement}
                </button>
                <span className="cell-note">{item.id}</span>
              </TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.author ?? '—'}</TableCell>
              <TableCell>{percent(item.statedP)}</TableCell>
              {hindsightModels.map((name) => (
                <TableCell key={name}>
                  {percent(
                    item.inferred.find((entry) => entry.model === name)?.mid,
                  )}
                </TableCell>
              ))}
              <TableCell>{percent(item.human?.p)}</TableCell>
              <TableCell>{outcomeLabel(item.outcome)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!rows.length && (
        <p className="empty-state">No items match these filters.</p>
      )}
      <div className="research-pagination">
        {rowCount === 'all' ? (
          <span aria-live="polite">Showing all {rows.length} rows</span>
        ) : (
          <>
            <button
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              Previous
            </button>
            <span aria-live="polite">
              Page {current + 1} of {pageCount}
            </span>
            <button
              disabled={current + 1 === pageCount}
              onClick={() => setPage(current + 1)}
            >
              Next
            </button>
          </>
        )}
      </div>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="claim-sheet" side="right">
          {selected && <PilotDetail item={selected} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}
