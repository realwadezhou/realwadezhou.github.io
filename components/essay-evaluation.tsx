'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, BookOpen } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  essays,
  essayCounts,
  ESSAY_AS_OF,
  type Essay,
  type EssayClaim,
} from '@/lib/essays';
import { verdicts, RUBRIC_VERSION } from '@/lib/rubric';
import { EpochPolicy } from '@/components/epoch-policy';

function Grade({ claim }: { claim: EssayClaim }) {
  if (claim.kind === 'Policy proposal' || claim.kind === 'Already observable')
    return (
      <span className="essay-kind">
        {claim.kind === 'Policy proposal'
          ? 'Not graded · proposal'
          : 'Context · not scored'}
      </span>
    );
  return (
    <span
      className={`status status-${verdicts.find((v) => v.label === claim.grade)?.tone ?? 'neutral'}`}
    >
      <span aria-hidden="true" />
      {claim.grade}
    </span>
  );
}
export function EssayCollection() {
  return (
    <section
      className="essay-collection"
      aria-labelledby="essay-collection-title"
    >
      <div className="collection-meta">
        <h2 id="essay-collection-title">Essay evaluations</h2>
        <span>Three bounded source corpora</span>
      </div>
      <div className="essay-cards">
        {essays.map((essay) => {
          const counts = essayCounts(essay);
          return (
            <Link
              className="essay-card"
              href={`/essays/${essay.slug}`}
              key={essay.slug}
            >
              <span className="eyebrow">{essay.published}</span>
              <h3>
                {essay.title}
                <ChevronRight size={16} />
              </h3>
              <p>{essay.authors}</p>
              <span>
                {counts.forecasts} predictions ·{' '}
                {counts.supported + counts.contradicted} resolved
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
function Source({
  essay,
  id,
  section,
}: {
  essay: Essay;
  id: string;
  section?: string;
}) {
  const source = essay.sources.find((s) => s.id === id);
  if (!source) return null;
  const page = section?.match(/PDF pp?\. (\d+)/)?.[1];
  const url =
    source.url.endsWith('.pdf') && page
      ? `${source.url}#page=${page}`
      : source.url;
  return (
    <a className="external-link" href={url} target="_blank" rel="noreferrer">
      {source.title}
      <ArrowUpRight size={14} />
    </a>
  );
}
export function EssayEvaluation({ essay }: { essay: Essay }) {
  const [selected, setSelected] = useState<EssayClaim | null>(null);
  const counts = essayCounts(essay);
  const families = [...new Set(essay.claims.map((c) => c.family))];
  return (
    <>
      <div className="essay-byline">
        <span>{essay.authors}</span>
        <span>Published {essay.published}</span>
        <a href={essay.url} target="_blank" rel="noreferrer">
          Read the essay <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="essay-summary">
        {essay.summary.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="essay-interpretation">
        <BookOpen size={20} aria-hidden="true" />
        <div>
          <strong>{essay.form}</strong>
          <p>{essay.interpretation}</p>
        </div>
      </div>
      <div className="essay-stats" aria-label="Prediction grades">
        {[
          [counts.forecasts, 'Predictions'],
          [counts.supported, 'Supported'],
          [counts.contradicted, 'Contradicted'],
          [counts.pending, 'Pending'],
          [counts.notAssessed, 'Not assessed'],
          [counts.unresolvable, 'Unresolvable'],
        ].map(([count, label]) => (
          <div key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <EpochPolicy />
      <p className="fine-print essay-score-note">
        As of {ESSAY_AS_OF} · Provisional assessment by Codex · Rubric{' '}
        {RUBRIC_VERSION}. Counts describe claims, not independent bets or
        forecasting accuracy.{' '}
        {counts.proposals > 0
          ? `${counts.proposals} policy proposals are tracked separately. `
          : ''}
        {counts.context > 0
          ? `${counts.context} already-observable statements receive no forecasting credit. `
          : ''}
        No essay-wide letter grade or probability score.
      </p>
      <details className="essay-method">
        <summary>How these evaluations work</summary>
        <p>{essay.coverage}</p>
        <p>
          All claim titles are paraphrases. The resolution tests below were
          written on {ESSAY_AS_OF}, after publication; they were not registered
          by the authors. Approximate dates and numerical tolerances need
          explicit interpretation. A later author update does not move an
          original deadline.
        </p>
        <p>
          Pending means the forecast window or stated condition is still open.
          Not assessed means essential evidence or interpretation is missing,
          including passed deadlines where non-occurrence has not been
          established. A proposal is not a prediction. Branches and related
          subclaims share a family and must not be counted as independent
          confirmations.
        </p>
        <p>
          The cited original passages were reviewed. Linked outcome evidence is
          described at claim level; a vendor announcement establishes its
          release or reported result, not independently verified general
          capability. No pre-publication archive or second human review is
          recorded. Sources were accessed on {ESSAY_AS_OF}.
        </p>
        <Link className="text-link" href="/?view=method">
          Read rubric {RUBRIC_VERSION}
          <ChevronRight size={14} />
        </Link>
      </details>
      <nav className="essay-jumps" aria-label="Claim families">
        {families.map((family, i) => (
          <a href={`#family-${i}`} key={family}>
            {family}
            <span>
              {essay.claims.filter((c) => c.family === family).length}
            </span>
          </a>
        ))}
      </nav>
      {families.map((family, i) => (
        <section className="essay-family" key={family} id={`family-${i}`}>
          <h2>{family}</h2>
          <Table className="forecast-table essay-table">
            <TableHeader>
              <TableRow>
                <TableHead>Verifiable claim</TableHead>
                <TableHead>Window / condition</TableHead>
                <TableHead>Assessment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {essay.claims
                .filter((c) => c.family === family)
                .map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>
                      <div className="row-type">
                        {claim.id} · {claim.kind}
                      </div>
                      <button
                        className="claim-link"
                        onClick={() => setSelected(claim)}
                      >
                        {claim.title}
                        <ChevronRight size={15} aria-hidden="true" />
                      </button>
                      <span className="cell-note">{claim.section}</span>
                    </TableCell>
                    <TableCell>
                      {claim.target}
                      <span className="cell-note">
                        {claim.condition ?? 'No additional branch condition'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Grade claim={claim} />
                      <span className="cell-note">
                        {claim.kind === 'Policy proposal' ||
                        claim.kind === 'Already observable'
                          ? 'Outside accuracy counts'
                          : claim.clarity}
                      </span>
                      {claim.observation && (
                        <span className="cell-note essay-observation">
                          {claim.observation}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </section>
      ))}
      <details className="essay-method essay-source-register">
        <summary>Source register · {essay.sources.length} sources</summary>
        <ol className="sources">
          {essay.sources.map((source) => (
            <li key={source.id}>
              <Source essay={essay} id={source.id} />
              <p>{source.note}</p>
              <span className="fine-print">
                {source.id} · Published {source.published} · Read {ESSAY_AS_OF}
              </span>
            </li>
          ))}
        </ol>
      </details>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="claim-sheet" side="right">
          {selected && (
            <>
              <SheetHeader>
                <div className="eyebrow">
                  {selected.id} · {selected.kind}
                </div>
                <SheetTitle className="detail-title">
                  {selected.title}
                </SheetTitle>
                <SheetDescription>
                  {essay.title} · {selected.family}
                </SheetDescription>
              </SheetHeader>
              <div className="detail-body">
                <div className="grade-line">
                  <Grade claim={selected} />
                  <span>Provisional · {ESSAY_AS_OF}</span>
                </div>
                <h3>Assessment</h3>
                <p>{selected.assessment}</p>
                <dl className="claim-facts">
                  <div>
                    <dt>Target</dt>
                    <dd>{selected.target}</dd>
                  </div>
                  <div>
                    <dt>Timing</dt>
                    <dd>{selected.timing}</dd>
                  </div>
                  <div>
                    <dt>Resolution clarity</dt>
                    <dd>{selected.clarity}</dd>
                  </div>
                  <div>
                    <dt>Probability</dt>
                    <dd>Not assigned to this extracted claim</dd>
                  </div>
                  <div>
                    <dt>Evidence</dt>
                    <dd>
                      {selected.evidenceIds.length
                        ? 'Original source + cited outcome / context evidence'
                        : 'Original source read; outcome evidence incomplete'}
                    </dd>
                  </div>
                  {selected.canonicalSource && (
                    <div>
                      <dt>Hardware authority</dt>
                      <dd>{selected.canonicalSource} · estimates accepted</dd>
                    </div>
                  )}
                  <div>
                    <dt>Family</dt>
                    <dd>{selected.family}</dd>
                  </div>
                </dl>
                {selected.condition && (
                  <>
                    <h3>Condition / dependency</h3>
                    <p>{selected.condition}</p>
                  </>
                )}
                <h3>Resolution test · tracker interpretation</h3>
                <p>{selected.criteria}</p>
                <p className="fine-print">
                  Written {ESSAY_AS_OF}. Paraphrase and operationalization, not
                  an author quotation or pre-registered test.
                </p>
                <h3>Original claim</h3>
                <p>{selected.section}</p>
                <Source
                  essay={essay}
                  id={selected.sourceId}
                  section={selected.section}
                />
                <h3>Outcome evidence</h3>
                {selected.evidenceIds.length ? (
                  <ul className="sources">
                    {selected.evidenceIds.map((id) => (
                      <li key={id}>
                        <Source essay={essay} id={id} />
                        <p>{essay.sources.find((s) => s.id === id)?.note}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No resolving outcome source is recorded. The original essay
                    is evidence of the claim, not evidence that its predicted
                    event happened.
                  </p>
                )}
                <h3>Review record</h3>
                <p>
                  {ESSAY_AS_OF}: Initial extraction and provisional assessment
                  by Codex. No independent human review. This row is not an
                  independent trial of the essay’s overall thesis.
                </p>
                {selected.reviewHistory?.map((review, i) => (
                  <div className="essay-review" key={`${review.date}-${i}`}>
                    <p>
                      <strong>{review.date} · Follow-up review</strong>
                      <br />
                      {review.reviewer} · Rubric {review.rubricVersion}
                      <br />
                      Previously {review.previous.grade}. {review.reason}
                    </p>
                    {review.addedEvidenceIds.length > 0 && (
                      <p className="fine-print">
                        Sources added:{' '}
                        {review.addedEvidenceIds
                          .map(
                            (id) =>
                              essay.sources.find((s) => s.id === id)?.title ??
                              id,
                          )
                          .join('; ')}
                        .
                      </p>
                    )}
                    <details>
                      <summary>Previous assessment and resolution test</summary>
                      <p>{review.previous.assessment}</p>
                      <p>
                        Target: {review.previous.target} · Timing:{' '}
                        {review.previous.timing}
                      </p>
                      <p>{review.previous.criteria}</p>
                    </details>
                  </div>
                ))}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
