import data from '../public/data/hindsight/hindsight-essays-v02.json';

/** Draft rubric-0.2 grades (docs/essay-grading-v0.2.md): sealed reading, web-search verdict. */
export type V02Evidence = {
  date: string | null;
  item: string | null;
  shows: string | null;
  source: string | null;
  url: string | null;
};
export type V02Claim = {
  thesis: string | null;
  weight: string | null; // Core, Supporting or Minor
  condition: string | null;
  horizon: string | null;
  indicatorsYes: string[] | null;
  indicatorsNo: string[] | null;
  thesisVerdict: string | null;
  detailVerdict: string | null;
  timing: string | null;
  trajectory: string | null;
  credence: number | null;
  strictVerdict: string | null;
  conditionStatus: string | null;
  readingFlag: string | null;
  reasoning: string | null;
  resolvedOn?: string | null;
  measure?: string | null;
  measureUsed?: string | null;
  evidence: V02Evidence[];
  searchCount: number;
};
export type V02Essay = {
  run: string;
  model: string;
  graded: string;
  method: string;
  claims: Record<string, V02Claim>;
};
export type V02Export = {
  generated: string;
  rubric: string;
  essays: Record<string, V02Essay>;
};

export const essaysV02 = data as unknown as V02Export;

export const V02_ORDER = [
  'Yes',
  'Mostly',
  'Partly',
  'No',
  'Too early',
  'Condition not met',
  'Unresolvable',
];

export function v02Tone(verdict: string | null | undefined) {
  if (verdict === 'Yes' || verdict === 'Mostly') return 'supported';
  if (verdict === 'Partly') return 'mixed';
  if (verdict === 'No') return 'contradicted';
  if (verdict === 'Too early') return 'pending';
  return 'neutral';
}
