import { productClaims } from './product-claims';

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
  status: 'Supported' | 'Needs source';
  statusNote: string;
  sourceState: string;
  summary: string;
  context: string;
  quote?: string;
  assessment: string;
  review: string;
  sources: { label: string; url: string; note: string }[];
};
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
    status: 'Needs source',
    statusNote: 'Research lead',
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
        label: 'Andrew Curran on X',
        url: 'https://x.com/AndrewCurran_',
        note: 'Profile supplied as a discovery lead; not an original prediction permalink.',
      },
      {
        label: 'OpenAI · GPT-6 Astra announcement',
        url: 'https://openai.com/index/gpt-6-astra/',
        note: 'Official outcome evidence: limited rollout, with broader availability planned over the coming days.',
      },
    ],
  },
];
