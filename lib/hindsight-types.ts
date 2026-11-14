export type Probability = number | null;

export type HindsightInference = {
  model: string;
  prompt: string;
  low: Probability;
  mid: Probability;
  high: Probability;
  reason: string | null;
  labelPhrase: string | null;
  labelP: Probability;
  statementOnlyP: Probability;
};

export type HindsightItem = {
  id: string;
  year: number;
  author: string | null;
  statement: string;
  statedP: number;
  outcome: 0 | 1 | null;
  sourceUrl: string;
  published: string;
  rung: 'stated';
  provenance: 'stated';
  inferred: HindsightInference[];
  human: {
    p: Probability;
    knewOutcome: string | null;
    note: string | null;
  } | null;
};

export type HindsightPilot = {
  generated: string;
  report: string;
  recovery: { predictor: string; mae: number; n: number }[];
  items: HindsightItem[];
};

export type HindsightChecklist = {
  generated: string;
  items: {
    section: string;
    done: boolean;
    text: string;
    owner: string | null;
  }[];
};

export type MushyPoint = {
  docId: string;
  date: string;
  datePrecision: 'day' | 'month';
  title: string | null;
  outlet: string | null;
  author: string | null;
  url: string | null;
  reader: string;
  stance: 'yes' | 'no' | 'none' | null;
  commitment: number | null;
  category: string | null;
  p: Probability;
  low: Probability;
  high: Probability;
  outcome: 0 | 1;
  brier: number | null;
  consensusBefore: number | null;
  deltaVsConsensus: number | null;
};

export type MushySeries = {
  id: string;
  provider: 'Polymarket' | 'Kalshi' | 'Metaculus' | string;
  name: string;
  rung?: string;
  fit: string;
  why?: string;
  url?: string;
  points: [string, number][];
};

export type MushyQuestion = {
  qid: string;
  topic: string;
  text: string;
  resolution: string;
  ladder: string[];
  primaryRung: string;
  askedFrom: string;
  outcome: 0 | 1;
  settledOn: string;
  resolutionVerified: boolean;
  priority: boolean;
  diffuse: boolean;
  outcomeAware: boolean;
  points: MushyPoint[];
  conventionalWisdom: Record<
    string,
    { bandwidthDays: number | null; points: [string, number][] }
  >;
  series: MushySeries[];
};

export type MushyExport = {
  generated: string;
  readers: string[];
  primaryRule: string;
  report: string;
  questions: MushyQuestion[];
};
