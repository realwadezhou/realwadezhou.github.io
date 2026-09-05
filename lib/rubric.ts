/** The single source of truth for the published rubric and allowed labels. */
export const RUBRIC_VERSION = '0.1';
export const AS_OF = '2026-09-04';
export const verdicts = [
  {
    label: 'Supported',
    tone: 'supported',
    definition:
      'The stated event and every material condition, including any deadline, match the evidence. This is support for the recorded claim, not proof of forecasting skill.',
  },
  {
    label: 'Contradicted',
    tone: 'contradicted',
    definition:
      'Reliable evidence shows that a material condition failed. A missed deadline stays a miss even if the event occurs later.',
  },
  {
    label: 'Mixed',
    tone: 'mixed',
    definition:
      'A bundle contains both supported and contradicted subclaims. Show those separate grades. A bundle is a summary, never an extra scored prediction or arbitrary half-credit.',
  },
  {
    label: 'Pending',
    tone: 'pending',
    definition:
      'The claim is evaluable, but its resolution condition is still open. A passed, clearly missed deadline is not pending.',
  },
  {
    label: 'Unresolvable',
    tone: 'neutral',
    definition:
      'The recovered claim has no defensible empirical test, or reasonable interpretations yield different verdicts and the ambiguity cannot be resolved.',
  },
  {
    label: 'Not assessed',
    tone: 'neutral',
    definition:
      'Review is unfinished or essential wording, dates, or evidence are missing. This carries no accuracy implication.',
  },
] as const;
export type Verdict = (typeof verdicts)[number]['label'];
export const clarityLevels = [
  {
    label: 'Clear',
    definition:
      'The event, applicable time condition, and outcome test are explicit. Example: a named model available through a public API by a stated date.',
  },
  {
    label: 'Interpretation needed',
    definition:
      'A phrase, milestone, or measurement needs an explicit reading. Publish the alternatives and whether they would change the grade.',
  },
  {
    label: 'Unresolvable',
    definition:
      'No defensible unique outcome test remains after review. Do not force a verdict by inventing a definition.',
  },
  {
    label: 'Not assessed',
    definition:
      'There is not enough original claim material to assess clarity yet.',
  },
] as const;
export type Clarity = (typeof clarityLevels)[number]['label'];
export const evidenceLevels = [
  {
    label: 'Direct',
    definition:
      'The original dated claim was read, and the outcome has an authoritative source. Archive availability is recorded separately.',
  },
  {
    label: 'Attributed',
    definition:
      'A dated public report quotes or clearly attributes the claim, and the outcome has an authoritative source. This supports provisional work without pretending the original was read.',
  },
  {
    label: 'Incomplete',
    definition:
      'Material claim or outcome evidence is missing or conflicting. A source link alone does not establish its contents.',
  },
] as const;
export type Evidence = (typeof evidenceLevels)[number]['label'];
export const reviewStates = [
  {
    label: 'Unreviewed',
    definition: 'A collection lead; no completed assessment.',
  },
  {
    label: 'Provisional',
    definition:
      'An initial assessment, with reviewer identity and limitations stated.',
  },
  {
    label: 'Reviewed',
    definition:
      'A second independent human reviewer has checked the claim, sources, and rubric application. This is not a promise of infallibility.',
  },
  {
    label: 'Disputed',
    definition:
      'A substantive disagreement is open. Show the competing interpretations and exclude the case from aggregate accuracy until adjudicated.',
  },
] as const;
export type ReviewState = (typeof reviewStates)[number]['label'];
export const timingLabels = [
  {
    label: 'On time',
    definition:
      'The event falls within the stated window or occurs by its deadline. An earlier occurrence satisfies a “by” forecast.',
  },
  {
    label: 'Early',
    definition:
      'The event occurs before the start of a specified “during” window. Report days before the lower boundary.',
  },
  {
    label: 'Late',
    definition:
      'The event occurred after the upper boundary or deadline. Report days after it; keep the full forecast contradicted.',
  },
  {
    label: 'Overdue',
    definition:
      'The deadline has passed and the event is documented as not having occurred as of the review date. Report elapsed days as a lower bound, not a final delay.',
  },
  {
    label: 'Pending',
    definition:
      'The timing window remains open and the event has not yet been observed.',
  },
  {
    label: 'Not specified',
    definition:
      'No separate calendar timing claim was made. Evaluate the event or specification without inventing a date prediction.',
  },
  {
    label: 'Ambiguous',
    definition:
      'Timing depends on an unresolved meaning of a date phrase or release milestone. No exact timing penalty is assigned.',
  },
  {
    label: 'Not assessed',
    definition:
      'A timing assessment has not been completed or the dated claim is missing.',
  },
] as const;
export type TimingLabel = (typeof timingLabels)[number]['label'];
export type TimeRule =
  | { kind: 'by'; end: string }
  | { kind: 'during'; start: string; end: string };
const DAY = 86_400_000;
function epoch(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error(`Use a calendar date: ${date}`);
  const result = Date.parse(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(result) ||
    new Date(result).toISOString().slice(0, 10) !== date
  )
    throw new Error(`Invalid calendar date: ${date}`);
  return result;
}
/** Calendar-day arithmetic. Null observation requires a sourced as-of check of non-occurrence. */
export function evaluateTiming(
  rule: TimeRule,
  observedOn: string | null,
  asOf: string,
) {
  const end = epoch(rule.end),
    checked = epoch(asOf);
  const start = rule.kind === 'during' ? epoch(rule.start) : null;
  if (start !== null && start > end)
    throw new Error('Window start must precede its end');
  if (observedOn === null)
    return {
      label: checked > end ? ('Overdue' as const) : ('Pending' as const),
      days: checked > end ? (checked - end) / DAY : null,
    };
  const actual = epoch(observedOn);
  if (actual > checked)
    throw new Error('An observation cannot be after the review date');
  if (actual > end)
    return { label: 'Late' as const, days: (actual - end) / DAY };
  if (start !== null && actual < start)
    return { label: 'Early' as const, days: (actual - start) / DAY };
  return { label: 'On time' as const, days: 0 };
}
