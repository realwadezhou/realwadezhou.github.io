import { ai2027, ai2040, situational } from './essay-data';
import type { Clarity, TimingLabel, Verdict } from './rubric';

export const ESSAY_AS_OF = '2026-09-05';
export type EssaySlug = 'ai-2027' | 'ai-2040-plan-a' | 'situational-awareness';
export type ClaimKind =
  | 'Forecast'
  | 'Conditional forecast'
  | 'Policy proposal'
  | 'Already observable';
export type EssaySource = {
  id: string;
  title: string;
  url: string;
  published: string;
  note: string;
};
export type EssayClaim = {
  id: string;
  family: string;
  title: string;
  target: string;
  deadline?: string;
  kind: ClaimKind;
  condition?: string;
  grade: Verdict;
  clarity: Clarity;
  timing: TimingLabel;
  criteria: string;
  assessment: string;
  sourceId: string;
  section: string;
  evidenceIds: string[];
};
export type Essay = {
  slug: EssaySlug;
  title: string;
  authors: string;
  published: string;
  url: string;
  form: string;
  summary: string[];
  interpretation: string;
  coverage: string;
  sources: EssaySource[];
  claims: EssayClaim[];
};
export function essayCounts(essay: Essay) {
  const forecasts = essay.claims.filter(
    (c) => c.kind === 'Forecast' || c.kind === 'Conditional forecast',
  );
  return {
    forecasts: forecasts.length,
    proposals: essay.claims.filter((c) => c.kind === 'Policy proposal').length,
    context: essay.claims.filter((c) => c.kind === 'Already observable').length,
    supported: forecasts.filter((c) => c.grade === 'Supported').length,
    contradicted: forecasts.filter((c) => c.grade === 'Contradicted').length,
    pending: forecasts.filter((c) => c.grade === 'Pending').length,
    unresolvable: forecasts.filter((c) => c.grade === 'Unresolvable').length,
    notAssessed: forecasts.filter((c) => c.grade === 'Not assessed').length,
  };
}

export const essays: Essay[] = [ai2027, ai2040, situational];
