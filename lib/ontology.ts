import type { Claim } from './claim-types';

export const gradingKinds = [
  {
    label: 'Claim grading',
    definition:
      'Starts from a document: “what did this person assert, and were they right?”',
    unit: 'Claim',
    output: 'Categorical verdict',
    probability:
      'Uses a probability only if the author wrote one. This is what the rest of the site does.',
  },
  {
    label: 'Prior grading',
    definition:
      'Starts from a question: “what did each person who wrote about it believe?”',
    unit: 'Stance (author × question × date)',
    output: 'Brier score on an inferred probability band',
    probability:
      'Reads a probability band from prose and covers people who never committed. The companion project tests whether this can be done without hindsight leakage.',
  },
] as const;

export const rungs = [
  {
    label: 'stated',
    title: 'Stated',
    definition:
      'The author wrote a number. Examples: Vox lists, Kuo’s probability lower bounds.',
  },
  {
    label: 'flat call',
    title: 'Flat call',
    definition: 'An unhedged assertion (“ships in Q4”). Most Gurman claims.',
  },
  {
    label: 'hedged call',
    title: 'Hedged call',
    definition: 'An assertion with hedge words.',
  },
  {
    label: 'implicit stance',
    title: 'Implicit stance',
    definition: 'The view is in the framing.',
  },
  {
    label: 'no stance',
    title: 'No stance',
    definition: 'No stance on the question is expressed.',
  },
] as const;
export type Rung = (typeof rungs)[number]['label'];

export const provenances = [
  { label: 'stated', definition: 'From the author.' },
  { label: 'convention', definition: 'A flat call treated as near-certain.' },
  { label: 'inferred', definition: 'Read from prose by a model or a person.' },
] as const;
export const provenanceRule =
  'Never present an inferred probability as stated, and never mix provenances in one score.';

/** A coarse badge for the existing claim corpus, not a new probability or grade. */
export function rungForClaim(claim: Claim): Rung {
  return claim.probability != null ? 'stated' : 'flat call';
}
