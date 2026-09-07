import type {
  Clarity,
  Evidence,
  ReviewState,
  TimeRule,
  TimingLabel,
  Verdict,
} from './rubric';
export type Source = {
  id: string;
  label: string;
  url: string;
  note: string;
  role: 'Forecast' | 'Outcome' | 'Context' | 'Original link';
  access: 'Read' | 'Not retrieved';
  published: string;
  accessed: string;
};
export type Claim = {
  id: string;
  title: string;
  type: 'models' | 'products';
  person: string;
  personId: string;
  published: string;
  dateNote: string;
  target: string;
  milestone: string;
  status: Verdict;
  statusNote: string;
  sourceState: string;
  summary: string;
  context: string;
  probability?: { kind: 'lower-bound'; value: number; strict: boolean };
  quote?: string;
  quoteSourceId?: string;
  assessment: string;
  review: string;
  sources: Source[];
  rubricVersion: string;
  clarity: Clarity;
  clarityNote: string;
  evidence: Evidence;
  reviewState: ReviewState;
  criteria: string;
  familyId: string;
  category?: string;
  kind?: 'expectation' | 'possibility' | 'development';
  launchIds?: string[];
  timing: {
    label: TimingLabel;
    note: string;
    rule?: TimeRule;
    observations: { label: string; date: string; sourceId: string }[];
  };
  checks: { condition: string; finding: string; sourceIds: string[] }[];
  history: { date: string; change: string }[];
};
