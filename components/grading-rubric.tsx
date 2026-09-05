import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  clarityLevels,
  evidenceLevels,
  reviewStates,
  timingLabels,
  verdicts,
  RUBRIC_VERSION,
} from '@/lib/rubric';
function Vocabulary({
  rows,
  title,
}: {
  rows: readonly { label: string; definition: string }[];
  title: string;
}) {
  return (
    <Table className="rubric-table">
      <TableHeader>
        <TableRow>
          <TableHead>{title}</TableHead>
          <TableHead>Definition</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell>
              <strong>{row.label}</strong>
            </TableCell>
            <TableCell>{row.definition}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export function GradingRubric() {
  return (
    <div className="prose-content rubric-content">
      <div className="rubric-version">
        Rubric {RUBRIC_VERSION} · Draft adopted 4 September 2026 · Retrospective
        assessments
      </div>
      <p>
        A grade answers whether a specific forecast matched reality. Timing,
        resolution clarity, evidence, and review status are separate fields.
        These labels are categories, not points on a numerical scale.
      </p>
      <h2>Every possible grade</h2>
      <Vocabulary rows={verdicts} title="Grade" />
      <p className="rubric-note">
        Split independently testable claims before grading. “An M4 iPad in
        April” contains a specification and a time condition: the chip can match
        while the full dated claim is contradicted. Reserve Mixed for an
        explicit summary of separately graded subclaims; never use it to hide a
        timing miss.
      </p>
      <h2>Timing: keep the promise’s original window</h2>
      <p>
        <strong>By a date</strong> is a deadline: earlier counts as on time.{' '}
        <strong>During a period</strong> has both boundaries: earlier or later
        misses the window. A stated month or year ends on its last calendar day.
        Preserve the original timezone; record the normalization before
        calculating an error.
      </p>
      <p>
        For exact windows, report signed calendar days to the nearest missed
        boundary: negative for early, positive for late, zero inside the window.
        For an event that has not occurred after the deadline, report the
        elapsed delay as a lower bound, dated “as of.” Evidence must establish
        non-occurrence; silence in a search is insufficient.
      </p>
      <p>
        <strong>No automatic grace period.</strong> “Soon,” “around,” “early,”
        and “late” are not exact dates. Write down the interpretation and
        alternatives. Use a precise boundary only if it was explicit or
        established by an applicable rule before the outcome. Historical cases
        may show a clearly labeled sensitivity analysis; they must not acquire
        invented precision.
      </p>
      <h3>Worked examples · hypothetical</h3>
      <Table className="rubric-table examples-table">
        <TableHeader>
          <TableRow>
            <TableHead>Forecast</TableHead>
            <TableHead>Observation</TableHead>
            <TableHead>Timing / full grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Available by June 30</TableCell>
            <TableCell>Available July 10</TableCell>
            <TableCell>
              Late · +10 days
              <br />
              <strong>Contradicted</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Available by June 30</TableCell>
            <TableCell>Available May 28</TableCell>
            <TableCell>
              On time
              <br />
              <strong>Supported</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>First available June 1–30</TableCell>
            <TableCell>First available May 28</TableCell>
            <TableCell>
              Early · −4 days
              <br />
              <strong>Contradicted</strong>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Available by June 30</TableCell>
            <TableCell>Confirmed absent July 10</TableCell>
            <TableCell>
              Overdue · at least 10 days
              <br />
              <strong>Contradicted</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Vocabulary rows={timingLabels} title="Timing label" />
      <p>
        Announcement, private preview, limited rollout, public API access, and
        general availability are different events. Later success does not erase
        an earlier miss. Keep revisions as dated entries in the same forecast
        family; do not count each revision as an independent success.
      </p>
      <h2>How easy is this to resolve?</h2>
      <Vocabulary rows={clarityLevels} title="Resolution clarity" />
      <p>
        A clear claim can be wrong. An ambiguous claim can sound right. Clarity
        measures how readily the claim can be tested, not how difficult the
        future was to predict. Compare forecasters within comparable clarity,
        domain, horizon, and specificity groups.
      </p>
      <h2>What sources support the assessment?</h2>
      <Vocabulary rows={evidenceLevels} title="Evidence level" />
      <p>
        Each checked case lists its forecast and outcome sources. Each factual
        check points to the sources supporting it. A source entry records its
        role, publication date or uncertainty, access date, whether it was
        actually read, and what it establishes. An unread original link remains
        visibly unread.
      </p>
      <p>
        Public articles that quote Gurman are valid discovery and provisional
        attribution sources. Prefer the original when available, preserve short
        exact excerpts and surrounding context, and mark paraphrases. A second
        article repeating the same report is not independent confirmation of
        that report’s truth.
      </p>
      <h2>Who has reviewed it?</h2>
      <Vocabulary rows={reviewStates} title="Review status" />
      <p>
        Every change records the rubric version, reviewer, source additions, and
        reason. “Needs source” from the first prototype is now an evidence
        limitation, not an accuracy grade. Previously assessed cases keep their
        earlier decisions in the review history.
      </p>
      <h2>What can receive a numerical score?</h2>
      <p>
        Only registered probabilistic forecasts with probabilities and
        resolution rules recorded before the outcome can receive a proper score
        such as Brier or log loss. These historical public statements receive
        qualitative grades. We do not translate confident wording into a
        probability, assign arbitrary 1–5 scores, or infer forecasting skill
        from this selective pilot.
      </p>
      <p>
        For future comparisons, freeze the source corpus and inclusion rules
        first. Include misses, revisions, and unresolvable statements. Report
        denominators, independent forecast families, baselines, and uncertainty.
        Disputed or unassessed cases do not enter accuracy calculations; bundle
        summaries are never double-counted.
      </p>
      <p className="rubric-note">
        This is our project rubric, not an external standard. Useful
        methodological references:{' '}
        <a
          href="https://www.metaculus.com/faq/"
          target="_blank"
          rel="noreferrer"
        >
          Metaculus on resolution and ambiguity
        </a>{' '}
        and{' '}
        <a
          href="https://www.metaculus.com/help/scores-faq/"
          target="_blank"
          rel="noreferrer"
        >
          proper forecast scoring
        </a>
        .
      </p>
    </div>
  );
}
