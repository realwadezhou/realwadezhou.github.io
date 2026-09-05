import { productClaims } from './product-claims';
import type { Claim } from './claim-types';
export type { Claim } from './claim-types';

export const people = [
  {
    id: 'andrew-curran',
    name: 'Andrew Curran',
    initials: 'AC',
    description: 'AI releases and industry commentary',
    url: 'https://x.com/AndrewCurran_',
    note: 'Starting with a reported GPT-6 release call. The original prediction and its date must be recovered before assessing lead time or accuracy.',
  },
  {
    id: 'mark-gurman',
    name: 'Mark Gurman',
    initials: 'MG',
    description: 'Apple and consumer technology · Bloomberg',
    url: 'https://www.macrumors.com/2024/04/11/m4-ai-chips-late-2024/',
    note: 'A pilot for evaluating specific product reporting. Source access, original wording, and the difference between reporting and prediction are recorded for each case.',
  },
];

export const claims: Claim[] = [
  ...productClaims,
  {
    id: 'F-001',
    title: 'GPT-6 release timing',
    type: 'models',
    person: 'Andrew Curran',
    personId: 'andrew-curran',
    published: 'Not verified',
    dateNote: 'Original post needed',
    target: 'Not established',
    milestone: 'Release stage unclear',
    status: 'Not assessed',
    statusNote: 'Needs source · collection deferred',
    sourceState: 'Profile provided; exact prediction not recovered',
    summary:
      'A project research lead attributes an advance GPT-6 release call to Andrew Curran. Its wording, timestamp, and forecast window are not yet verified.',
    context:
      'Do not infer a precise prediction from later launch coverage or a profile page. The original post and any updates are needed to establish what was forecast and when.',
    assessment:
      'OpenAI’s announcement distinguishes limited rollout from broader availability over the following days. That outcome alone does not validate this attributed prediction.',
    review:
      'Unresolved source collection. No accuracy verdict, probability score, or lead-time estimate has been assigned.',
    sources: [
      {
        id: 'S1',
        label: 'Andrew Curran on X',
        url: 'https://x.com/AndrewCurran_',
        role: 'Context',
        published: 'Not established',
        note: 'Profile supplied as a lead; the original forecast post has not been recovered. Twitter collection is deferred.',
        access: 'Not retrieved',
        accessed: '2026-09-04',
      },
      {
        id: 'S2',
        label: 'OpenAI · GPT-6 Astra announcement',
        url: 'https://openai.com/index/gpt-6-astra/',
        role: 'Outcome',
        published: '2026-09-03',
        note: 'Official outcome evidence: limited rollout, with broader availability planned over the coming days.',
        access: 'Read',
        accessed: '2026-09-04',
      },
    ],
    rubricVersion: '0.1',
    familyId: 'gpt6-release',
    history: [
      {
        date: '2026-09-04',
        change: 'Initial pilot: Needs source. Research lead.',
      },
      {
        date: '2026-09-04',
        change:
          'Rubric 0.1: Needs source moved to evidence completeness; verdict is Not assessed. Twitter work deferred at the user’s request.',
      },
    ],
    reviewState: 'Unreviewed',
    evidence: 'Incomplete',
    clarity: 'Not assessed',
    clarityNote:
      'The original advance prediction has not been recovered. Source completeness is distinct from claim clarity.',
    criteria:
      'To be defined from the original post. Do not substitute later release coverage for the advance claim.',
    timing: {
      label: 'Not assessed',
      note: 'The original date, target window, and release milestone are unknown. Twitter collection is deferred.',
      observations: [],
    },
    checks: [
      {
        condition: 'Outcome context only',
        finding:
          'OpenAI describes a limited rollout with broader access planned subsequently. This does not establish Curran’s advance call.',
        sourceIds: ['S2'],
      },
    ],
  },
];
