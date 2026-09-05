import type { Essay, EssayClaim, EssaySource } from './essays';

type Options = Partial<
  Omit<
    EssayClaim,
    'id' | 'title' | 'target' | 'criteria' | 'family' | 'sourceId' | 'section'
  >
>;
function row(
  id: string,
  title: string,
  target: string,
  criteria: string,
  options: Options = {},
): Omit<EssayClaim, 'family' | 'sourceId' | 'section'> {
  return {
    id,
    title,
    target,
    criteria,
    kind: 'Forecast',
    grade: 'Pending',
    clarity: 'Interpretation needed',
    timing: 'Pending',
    assessment:
      'The stated horizon is still open. No resolving outcome is recorded; related progress alone does not satisfy this test.',
    evidenceIds: [],
    ...options,
  };
}
function group(
  family: string,
  sourceId: string,
  section: string,
  rows: ReturnType<typeof row>[],
  condition?: string,
): EssayClaim[] {
  return rows.map((r) => ({
    ...r,
    family,
    sourceId,
    section,
    ...(condition
      ? {
          kind: 'Conditional forecast' as const,
          condition: r.condition ?? condition,
        }
      : {}),
    ...(r.kind === 'Policy proposal' ? { kind: r.kind } : {}),
  }));
}
const source = (
  id: string,
  title: string,
  url: string,
  published: string,
  note: string,
): EssaySource => ({ id, title, url, published, note });
const open = {
  grade: 'Not assessed' as const,
  timing: 'Not assessed' as const,
  assessment:
    'The depicted window has passed, but the public sources reviewed do not establish this precise outcome. A missed deadline cannot be inferred from a missing disclosure.',
};
const proposal = {
  kind: 'Policy proposal' as const,
  grade: 'Not assessed' as const,
  timing: 'Not specified' as const,
  assessment:
    'A proposed policy, excluded from forecast accuracy counts. Its enactment can be tracked, but failure to adopt it would not refute a prediction by the authors.',
};
const context = {
  kind: 'Already observable' as const,
  grade: 'Not assessed' as const,
  timing: 'Not specified' as const,
};
const yes = { grade: 'Supported' as const, timing: 'On time' as const };

export const ai2027: Essay = {
  slug: 'ai-2027',
  title: 'AI 2027',
  published: '2025-04-03',
  url: 'https://ai-2027.com/',
  authors:
    'Daniel Kokotajlo, Scott Alexander, Thomas Larsen, Eli Lifland & Romeo Dean',
  form: 'Dated scenario · two conditional endings',
  summary: [
    'AI 2027 traces a feedback loop: better coding agents accelerate AI research, which produces still more capable agents. Its near-term story moves from unreliable assistants to increasingly automated research, alongside an expensive compute buildout and a US–China security competition.',
    'After a suspected alignment failure, the story divides. Continued racing leads to loss of human control; a slowdown allows a replacement system and a negotiated transition, while leaving unresolved who holds political power.',
  ],
  interpretation:
    'OpenBrain and DeepCent are fictional composites. A claim about either cannot automatically be scored against OpenAI or DeepSeek. The 2027 date describes this scenario; it is not a 100% probability forecast. The authors later clarified that 2027 was their modal year and their medians were later.',
  coverage:
    'The main dated narrative, its quantitative milestones, and both endings are covered in this initial extraction, which is broad but not exhaustive. Mechanistic explainers and existing-world background are not atomized into extra predictions. Related measures of the same capability transition share a family. The live text includes a November 2025 clarification and December 2025 chart edits; no original-page archive is claimed.',
  sources: [
    source(
      '27-main',
      'AI 2027 · main scenario',
      'https://ai-2027.com/',
      '2025-04-03; later annotations',
      'Primary narrative and scenario metrics. Original wording read; not proof of an outcome.',
    ),
    source(
      '27-race',
      'AI 2027 · race ending',
      'https://ai-2027.com/race',
      '2025-04-03',
      'Conditional branch after the October 2027 decision.',
    ),
    source(
      '27-slow',
      'AI 2027 · slowdown ending',
      'https://ai-2027.com/slowdown',
      '2025-04-03',
      'Alternative branch; mutually exclusive with the race ending.',
    ),
    source(
      '27-compute',
      'AI 2027 · compute forecast',
      'https://ai-2027.com/research/compute-forecast',
      '2025-04-03; live supplement',
      'Defines compute stock, power and spending. Stock valuation is not annual capital expenditure.',
    ),
    source(
      '27-takeoff',
      'AI 2027 · takeoff forecast',
      'https://ai-2027.com/research/takeoff-forecast',
      '2025-04-03; live supplement',
      'Definitions and dependencies for coding, research and superintelligence milestones.',
    ),
    source(
      'codex',
      'OpenAI · introducing Codex',
      'https://openai.com/index/introducing-codex/',
      '2025-05-16',
      'Release announcement describes autonomous repository work and reviewable patches. Vendor evidence of product functionality, not independent productivity measurement.',
    ),
    source(
      'agent',
      'OpenAI · introducing ChatGPT agent',
      'https://openai.com/index/introducing-chatgpt-agent/',
      '2025-07-17',
      'Release describes computer use, spreadsheet work and purchase confirmations. Also reports benchmark limitations and precautionary biological safeguards.',
    ),
    source(
      'research',
      'OpenAI · introducing deep research',
      'https://openai.com/index/introducing-deep-research/',
      '2025-02-02; subsequent updates',
      'Research tasks lasting 5–30 minutes already existed before AI 2027 was published.',
    ),
  ],
  claims: [
    ...group(
      'Agents & early deployment',
      '27-main',
      'Mid 2025: Stumbling Agents',
      [
        row(
          'A27-001',
          'Computer agents perform personal-assistant tasks',
          'Mid 2025',
          'Require a released product that navigates websites and performs multi-step personal tasks. Read “mid” as May–August; July satisfies narrower June–August too.',
          {
            ...yes,
            assessment:
              'ChatGPT agent launched July 17, 2025 with interactive browsing, shopping and spreadsheet workflows. This supports the functional component, not widespread adoption or a literal first-ever agent.',
            evidenceIds: ['agent'],
          },
        ),
        row(
          'A27-002',
          'Agents ask before consequential purchases',
          'Mid 2025',
          'Check the behavior specified for a released computer agent, rather than assuming every action succeeds.',
          {
            ...yes,
            assessment:
              'The July 17 release explicitly specifies confirmation before purchases. This is a supported product-behavior claim within the midyear window.',
            evidenceIds: ['agent'],
          },
        ),
        row(
          'A27-003',
          'Coding agents make substantial repository changes',
          'Mid 2025',
          'A released agent must edit a repository and propose a patch from a task description. Hours saved, Slack integration and full job replacement require separate evidence.',
          {
            ...yes,
            assessment:
              'The May 16 Codex release documents repository edits and reviewable patches. This supports autonomous code changes under the explicit May–August reading; it does not establish a measured productivity gain.',
            evidenceIds: ['codex'],
          },
        ),
        row(
          'A27-004',
          'Research agents browse for roughly half an hour',
          'Mid 2025',
          'Check whether a product already performed extended autonomous research at essay publication.',
          {
            ...context,
            assessment:
              'OpenAI described 5–30 minute deep-research tasks on February 2, before the April essay. The observation is retained as context and receives no forecasting credit.',
            evidenceIds: ['research'],
          },
        ),
        row(
          'A27-005',
          'General-purpose agents struggle for widespread adoption',
          'Mid 2025',
          'Need a defined adoption population, usage frequency and threshold; launch availability alone cannot resolve this.',
          {
            grade: 'Unresolvable',
            clarity: 'Unresolvable',
            timing: 'Ambiguous',
            assessment:
              '“Widespread usage” has no denominator or threshold. Plausible readings can disagree; no binary verdict is defensible from the recovered wording.',
          },
        ),
        row(
          'A27-006',
          'Agents remain unreliable in practical use',
          'Mid 2025',
          'Check documented task failures in the released agent; this modest claim does not imply all agents are unusable.',
          {
            ...yes,
            assessment:
              'The July 17 release reports incomplete success on realistic spreadsheet and browsing evaluations and acknowledges limitations. That supports continued fallibility, not the frequency of anecdotal failures.',
            evidenceIds: ['agent'],
          },
        ),
      ],
    ),
  ],
};
export const ai2040: Essay = {
  slug: 'ai-2040-plan-a',
  title: 'AI 2040: Plan A',
  published: '2026-07-09',
  url: 'https://ai-2040.com/',
  authors:
    'Thomas Larsen, Romeo Dean, Brendan Halstead, Eli Lifland, Ryan Greenblatt & Daniel Kokotajlo',
  form: 'Policy recommendation · conditional scenario',
  summary: [
    'Plan A proposes an international agreement to slow the transition to superintelligence. Verification, public research, a wider distribution of frontier capability and the ability to disable compute are intended to prevent a secret race or permanent monopoly.',
    'The scenario explores what follows if the agreement works: substantial automation and economic growth during a managed transition, a pause near top-human capability, and a later move to superintelligence. Its predicted benefits depend on difficult technical, political and institutional assumptions.',
  ],
  interpretation:
    'The authors explicitly describe policy adoption as a recommendation, not their expected future. Proposed treaty provisions are listed separately; predicted consequences are conditional. The scenario’s 2030 default timeline is not a revision that erases AI 2027, and 2040 is the proposed managed arrival date.',
  coverage:
    'This initial extraction covers the 2027–2040 narrative, principal economic quantities, four policy principles and selected technical dependencies from the complete 90-page PDF and linked supplements. Alternative failure branches and the speculative post-2040 epilogue are represented as conditional claims, not mutually compatible predictions. Dollar figures in this scenario are real 2025 dollars.',
  sources: [
    source(
      '40-main',
      'AI 2040 · introduction and opening years',
      'https://ai-2040.com/',
      '2026-07-09',
      'Primary source explicitly distinguishes recommendation from conditional prediction.',
    ),
    source(
      '40-pdf',
      'AI 2040 · complete scenario PDF',
      'https://ai-2040.com/AI-2040.pdf',
      '2026-07-09; accessed current PDF',
      'Primary PDF consulted across the narrative and relevant appendices. Claim locators use PDF page numbers.',
    ),
    source(
      '40-econ',
      'Plan A · economics supplement',
      'https://ai-2040.com/supplements/economics-of-plan-a',
      '2026-07-09; live supplement',
      'Model assumptions and illustrative trajectories, not observed outcomes.',
    ),
    source(
      '40-verify',
      'Plan A · verification plan',
      'https://ai-2040.com/supplements/verification-plan',
      '2026-07-09; live supplement',
      'Technical verification proposal and assumptions.',
    ),
    source(
      '40-scaling',
      'Plan A · capability scaling strategy',
      'https://ai-2040.com/supplements/capability-scaling-strategy',
      '2026-07-09; live supplement',
      'Capability limits and safety-case approach.',
    ),
  ],
  claims: [
    ...group('Before the deal', '40-main', '2027: The Writing on the Wall', [
      row(
        'A40-001',
        'AI customers spend $10B per month',
        '2027',
        'Measure worldwide AI product/service customer revenue at a monthly rate. Exclude compute investment and internal transfers.',
        { deadline: '2027-12-31' },
      ),
      row(
        'A40-002',
        'Full recursive AI research automation has not arrived',
        '2027',
        'Require evidence that humans still supply essential steps in frontier AI R&D through the depicted year; distinguish AI-assisted research from complete automation.',
        { deadline: '2027-12-31' },
      ),
    ]),
  ],
};
export const situational: Essay = {
  slug: 'situational-awareness',
  title: 'Situational Awareness',
  published: 'June 2024',
  url: 'https://situational-awareness.ai/',
  authors: 'Leopold Aschenbrenner',
  form: 'Argument and forecasts · uncertainty retained',
  summary: [
    'Aschenbrenner argues that scaling compute, improving algorithms and removing limitations on how models work could produce AI researchers around 2027. Once AI automates its own research, he expects a rapid further increase in capability.',
    'The essays connect that technical story to a large investment and energy buildout, intensified espionage and national-security involvement. Alignment and geopolitical advantage become central constraints, with a government-led AGI effort anticipated later in the decade.',
  ],
  interpretation:
    '“Strikingly plausible” does not mean certain. Numerical extrapolations, conditional possibilities and recommendations have different force. This ledger preserves those differences and does not invent probabilities. Research automation is evaluated against an entire job, not a single benchmark score.',
  coverage:
    'All seven substantive chapters, from Counting the OOMs through The Project, plus the introduction are covered in this initial extraction, which is broad but not exhaustive. Historical examples, rhetorical questions and recommendations are not silently converted into forecasts. Open-ended claims retain their missing deadline, and illustrative calculations are treated as conditional extrapolations.',
  sources: [
    source(
      'sa-intro',
      'Situational Awareness · introduction',
      'https://situational-awareness.ai/',
      'June 2024',
      'Series overview and publication month.',
    ),
    source(
      'sa-ooms',
      'I · From GPT-4 to AGI',
      'https://situational-awareness.ai/from-gpt-4-to-agi/',
      'June 2024',
      'Scaling, algorithmic efficiency, data and agent capability arguments.',
    ),
    source(
      'sa-explosion',
      'II · From AGI to Superintelligence',
      'https://situational-awareness.ai/from-agi-to-superintelligence/',
      'June 2024',
      'Conditional intelligence-explosion argument and bottlenecks.',
    ),
    source(
      'sa-cluster',
      'IIIa · Racing to the Trillion-Dollar Cluster',
      'https://situational-awareness.ai/racing-to-the-trillion-dollar-cluster/',
      'June 2024',
      'Illustrative compute, spending, revenue and power trajectories.',
    ),
    source(
      'sa-security',
      'IIIb · Lock Down the Labs',
      'https://situational-awareness.ai/lock-down-the-labs/',
      'June 2024',
      'Security expectations; existing vulnerabilities are not evidence of future weight theft.',
    ),
    source(
      'sa-alignment',
      'IIIc · Superalignment',
      'https://situational-awareness.ai/superalignment/',
      'June 2024',
      'Alignment challenges and conditional failure mechanisms.',
    ),
    source(
      'sa-world',
      'IIId · The Free World Must Prevail',
      'https://situational-awareness.ai/the-free-world-must-prevail/',
      'June 2024',
      'Economic, military and political consequences conditional on superintelligence.',
    ),
    source(
      'sa-project',
      'IV · The Project',
      'https://situational-awareness.ai/the-project/',
      'June 2024',
      'Government-project forecast and possible forms of state involvement.',
    ),
  ],
  claims: [
    ...group(
      'Scaling & research automation',
      'sa-ooms',
      'I · opening argument and Compute',
      [
        row(
          'SA-001',
          'AI can do an AI researcher’s or engineer’s job',
          'By 2027 · described as plausible',
          'Evaluate sustained end-to-end work across representative AI R&D tasks with realistic budgets and human baselines. A coding benchmark or product named AGI is insufficient.',
          { deadline: '2027-12-31' },
        ),
        row(
          'SA-002',
          'Training compute grows another 100× over GPT-4',
          'By end of 2027',
          'Compare total training FLOP for a completed model with the stated GPT-4 baseline, not GPU counts or announced campus capacity.',
          { deadline: '2027-12-31' },
        ),
      ],
    ),
  ],
};

ai2027.sources.push(
  source(
    'asl3',
    'Anthropic · activating ASL-3 protections',
    'https://www.anthropic.com/news/activating-asl3-protections',
    '2025-05-22',
    'Precautionary security and deployment escalation for Opus 4. Anthropic explicitly does not establish that its capability threshold was crossed.',
  ),
  source(
    'metr',
    'METR · experienced-developer randomized study',
    'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/',
    '2025-07-10',
    'Experienced open-source developers took 19% longer with early-2025 AI in this study. This population and task design do not measure a frontier lab’s total algorithmic progress.',
  ),
);
ai2027.claims.push(
  ...group(
    '2025–26 capabilities & safety',
    '27-main',
    'Late 2025: The World’s Most Expensive AI',
    [
      row(
        'A27-007',
        'A public frontier model uses 10²⁷ training FLOP',
        'Late 2025',
        'Need a completed public model and credible total training-FLOP estimate. “OpenBrain” denotes a frontier-lab role, not a preselected company.',
        { ...open, deadline: '2025-12-31' },
      ),
      row(
        'A27-008',
        'The leading lab prepares capacity for a 10²⁸-FLOP run',
        'Late 2025',
        'Verify commissioned capacity, utilization and a feasible training schedule; a multiyear campus announcement is insufficient.',
        { ...open, deadline: '2025-12-31' },
      ),
      row(
        'A27-009',
        'AI training is explicitly optimized for AI research',
        'Late 2025',
        'Document a post-publication model-development program specifically targeting AI R&D, not only general coding.',
        { ...open, deadline: '2025-12-31' },
      ),
      row(
        'A27-010',
        'Other frontier labs lag the leader by 3–9 months',
        'Late 2025',
        'Define the comparison benchmark suite, private/public access and capability-equivalence dates for multiple labs.',
        { ...open, deadline: '2025-12-31' },
      ),
      row(
        'A27-011',
        'Frontier models can materially assist biological misuse',
        'Late 2025',
        'Require safe, authorized capability evaluations showing material uplift; deployment safeguards alone do not prove uplift.',
        {
          ...open,
          deadline: '2025-12-31',
          assessment:
            'Anthropic and OpenAI introduced stronger biological-risk safeguards in 2025, but both describe uncertainty or precaution. Those announcements cannot establish the scenario’s stronger capability claim.',
          evidenceIds: ['asl3', 'agent'],
        },
      ),
      row(
        'A27-012',
        'Models hide task failures in controlled evaluations',
        'Late 2025',
        'Need a dated post-publication controlled evaluation of the relevant frontier model, showing concealed failure rather than accidental hallucination.',
        { ...open, deadline: '2025-12-31' },
      ),
      row(
        'A27-013',
        'Extreme chatbot incidents cease in real deployment',
        'Late 2025',
        'Compare incident severity with the essay’s 2023–24 examples using an agreed severity scale and deployment population.',
        {
          grade: 'Unresolvable',
          clarity: 'Unresolvable',
          timing: 'Ambiguous',
          assessment:
            '“So extreme” is not operationally defined, and a fictional model cannot be mapped uniquely to a real product. The strong universal wording cannot receive a clean grade from anecdotes.',
        },
      ),
    ],
  ),
  ...group(
    '2025–26 capabilities & safety',
    '27-main',
    'Early 2026: Coding Automation',
    [
      row(
        'A27-014',
        'AI increases a leading lab’s research progress by 50%',
        'Early 2026',
        'Measure end-to-end algorithmic progress against a no-AI counterfactual, including experiments and coordination. Coding speed alone is insufficient.',
        {
          ...open,
          assessment:
            'No comparable frontier-lab counterfactual is recorded. METR found a 19% slowdown in early 2025, then reported likely improvement but unreliable effect-size estimates in February 2026. Neither study resolves a 1.5× total AI-research multiplier.',
          evidenceIds: ['metr', 'metr-update'],
        },
      ),
      row(
        'A27-015',
        'An open-weight model matches the prior frontier',
        'Early 2026',
        'Specify the preceding Agent-0-equivalent capability suite before selecting a real model; confirm accessible weights and equivalent results.',
        { ...open },
      ),
      row(
        'A27-016',
        'Coding strength coexists with long-horizon weakness',
        'Early 2026',
        'Compare short coding and unfamiliar extended-task performance for the same model under controlled resource budgets.',
        { ...open },
      ),
      row(
        'A27-017',
        'Frontier security still falls short of top-state attackers',
        'Early 2026',
        'Independent security audit against RAND SL4/SL5 threat models; a company security announcement does not establish resistance.',
        {
          ...open,
          assessment:
            'Stronger protections were announced, but the reviewed material does not establish a RAND security level for the fictional frontier-lab role.',
          evidenceIds: ['asl3'],
        },
      ),
    ],
  ),
  ...group('China & the 2026 economy', '27-main', 'Mid 2026: China Wakes Up', [
    row(
      'A27-018',
      'China holds roughly 12% of AI-relevant compute',
      'Mid 2026',
      'Estimate installed, usable AI compute across countries on a common hardware-equivalent basis; report uncertainty around 12%.',
      { ...open },
    ),
    row(
      'A27-019',
      'Chinese chip technology trails by about three years',
      'Mid 2026',
      'Define the relevant performance and manufacturing metric; compare production hardware rather than announcements.',
      { ...open },
    ),
    row(
      'A27-020',
      'China begins centralizing frontier AI research',
      'Mid 2026',
      'Look for documented compulsory sharing or a government-directed collective across leading labs; subsidies alone do not qualify.',
      { ...open },
    ),
    row(
      'A27-021',
      'A frontier AI development zone is established at Tianwan',
      'Mid 2026',
      'Require official or independently corroborated evidence of the specified research/datacenter zone at the named location.',
      { ...open, clarity: 'Clear' },
    ),
    row(
      'A27-022',
      'About half of Chinese AI compute serves one collective',
      'Mid 2026',
      'Verify allocation to the described cross-lab collective with a national installed-compute denominator.',
      { ...open },
    ),
    row(
      'A27-023',
      'Over 80% of new Chinese chips go to the development zone',
      'Mid 2026',
      'Measure realized deliveries to the named zone as a share of new AI-chip supply, not procurement intentions.',
      { ...open },
    ),
  ]),
  ...group(
    'China & the 2026 economy',
    '27-main',
    'Late 2026: AI Takes Some Jobs',
    [
      row(
        'A27-024',
        'A smaller frontier agent becomes 10× cheaper',
        'Late 2026',
        'Compare matched task cost for Agent-1-equivalent and its smaller derivative; token price alone may change quality.',
        { deadline: '2026-12-31' },
      ),
      row(
        'A27-025',
        'The stock market rises 30% during 2026',
        '2026',
        'Select the relevant broad US index and price/total-return convention before resolution; report sensitivity to that selection.',
        {
          deadline: '2026-12-31',
          assessment:
            'The calendar year is unfinished. A partial-year return cannot resolve this full-year claim, and the essay does not identify an index.',
        },
      ),
      row(
        'A27-026',
        'Junior software-engineer employment is disrupted',
        'Late 2026',
        'Compare entry-level hiring/employment with a predeclared baseline and assess AI attribution, not just economy-wide hiring changes.',
        { deadline: '2026-12-31' },
      ),
      row(
        'A27-027',
        'A 10,000-person anti-AI protest occurs in Washington',
        'Late 2026',
        'Require a documented anti-AI event in Washington, DC and a credible attendance estimate around 10,000.',
        { deadline: '2026-12-31' },
      ),
      row(
        'A27-028',
        'Defense contracting with frontier AI labs expands substantially',
        'Late 2026',
        'Compare awarded obligations, scope and deployed work with 2025. Contract ceilings and press announcements are not realized spending.',
        { deadline: '2026-12-31' },
      ),
    ],
  ),
  ...group('Compute & revenue quantities', '27-main', 'Key metrics 2026', [
    row(
      'A27-029',
      'Global active AI compute costs about $1T',
      '2026',
      'Estimate cost of ownership of active compute stock as defined by the essay; do not substitute one year of global capital expenditure.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-030',
      'Global AI power capacity reaches 38 GW',
      '2026',
      'Measure peak AI-relevant power capacity rather than annual energy consumption or all datacenter power.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-031',
      'The leading lab earns $35B in annual revenue',
      '2026',
      'Measure full-year revenue of the preidentified frontier-lab proxy. Annualized run rate and the sum of multiple companies do not qualify.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-032',
      'The leading lab’s active compute costs $200B',
      '2026',
      'Use the essay’s cost-of-ownership stock definition and a justified lab mapping; do not count announced future commitments.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-033',
      'US AI power capacity reaches 33 GW',
      '2026',
      'Measure usable peak AI capacity on US soil. This and the 2.5% share are related quantities, not independent bets.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-034',
      'AI accounts for 2.5% of US power capacity',
      '2026',
      'Use the source’s 33 GW / 1.34 TW peak-capacity denominator, not annual electricity generation.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-035',
      'The leading lab spends $40B annually on compute',
      '2026',
      'Compare realized annual compute costs using a consistent expense/capital treatment and declared frontier-lab proxy.',
      { deadline: '2026-12-31' },
    ),
    row(
      'A27-036',
      'The leading lab requires 6 GW peak power',
      '2026',
      'Verify peak usable AI power assigned to the selected lab. Signed power contracts are not delivered capacity.',
      { deadline: '2026-12-31' },
    ),
  ]),
  ...group(
    'The 2027 research feedback loop',
    '27-main',
    'January–March 2027: Agent-2 and Agent-3',
    [
      row(
        'A27-037',
        'Frontier model weights are updated daily',
        'January 2027',
        'Document continuous or daily learning in a frontier R&D model, not just daily software releases.',
        { deadline: '2027-01-31' },
      ),
      row(
        'A27-038',
        'Human long-horizon training demonstrations cost billions',
        'January 2027',
        'Verify realized spending on human task demonstrations, excluding all other training and payroll.',
        { deadline: '2027-01-31' },
      ),
      row(
        'A27-039',
        'An AI nearly matches top research engineers',
        'January 2027',
        'Test experiment design and implementation against top lab research engineers on representative held-out work.',
        { deadline: '2027-01-31' },
      ),
      row(
        'A27-040',
        'AI research taste reaches the lab’s 25th percentile',
        'January 2027',
        'Compare selection of worthwhile research directions against a specified distribution of human scientists.',
        { deadline: '2027-01-31' },
      ),
      row(
        'A27-041',
        'AI triples end-to-end algorithmic progress',
        'January 2027',
        'Measure the total research-progress multiplier against the same no-AI baseline used for A27-014.',
        { deadline: '2027-01-31' },
      ),
      row(
        'A27-042',
        'Frontier AI can replicate autonomously in evaluations',
        'January 2027',
        'Use authorized contained evaluations of survival, replication and persistence; distinguish capability from an actual escape or intent.',
        { deadline: '2027-01-31' },
      ),
      row(
        'A27-043',
        'China steals frontier model weights',
        'February 2027',
        'Require corroborated theft of a frontier model checkpoint attributed to China; distillation and stolen source code are distinct events.',
        { deadline: '2027-02-28' },
      ),
      row(
        'A27-044',
        'A cheap, fast superhuman coder is built',
        'March 2027',
        'Demonstrate the best human AI engineer’s coding job at lower cost and higher speed across representative tasks.',
        { deadline: '2027-03-31' },
      ),
      row(
        'A27-045',
        'A lab runs 200,000 research-coding agents simultaneously',
        'March 2027',
        'Verify concurrent instances, not cumulative tasks, users or API requests.',
        { deadline: '2027-03-31' },
      ),
      row(
        'A27-046',
        'Those agents produce a fourfold research multiplier',
        'March 2027',
        'Measure all-inclusive algorithmic progress with experiment and coordination bottlenecks retained.',
        { deadline: '2027-03-31' },
      ),
    ],
  ),
  ...group(
    'The 2027 research feedback loop',
    '27-main',
    'June–September 2027: Self-improvement to Agent-4',
    [
      row(
        'A27-047',
        'AI increases algorithmic progress tenfold',
        'June 2027',
        'Use the same total-lab no-AI counterfactual, not a 10× improvement on an isolated task.',
        { deadline: '2027-06-30' },
      ),
      row(
        'A27-048',
        'Removing human researchers cuts progress by only half',
        'June 2027',
        'A controlled ablation or credible audited equivalent must compare autonomous and human-assisted lab progress.',
        { deadline: '2027-06-30' },
      ),
      row(
        'A27-049',
        'A publicly released agent beats a typical lab employee',
        'July 2027',
        'Check public access and representative employee tasks; do not identify the model by an AGI marketing announcement.',
        { deadline: '2027-07-31' },
      ),
      row(
        'A27-050',
        'A mini agent costs one tenth of the internal version',
        'July 2027',
        'Compare task-equivalent cost, including inference effort, for the released and internal models.',
        { deadline: '2027-07-31' },
      ),
      row(
        'A27-051',
        'China’s research acceleration reaches 10× versus US 25×',
        'August 2027',
        'Use comparable research-progress baselines and audited evidence on both countries’ leading labs.',
        { deadline: '2027-08-31' },
      ),
      row(
        'A27-052',
        'One AI outperforms every human AI researcher',
        'By September 2027',
        'Demonstrate broad research ability beyond the strongest humans at equal thinking speed. The main narrative says September; its milestone table says August. Preserve that discrepancy.',
        {
          deadline: '2027-09-30',
          assessment:
            'Future milestone. The source’s August/September mismatch needs adjudication before applying an exact timing penalty.',
        },
      ),
      row(
        'A27-053',
        'A lab runs 300,000 researchers at 50× human speed',
        'September 2027',
        'Verify both concurrent instances and useful cognitive throughput; tokens per second alone do not establish human-equivalent thought.',
        { deadline: '2027-09-30' },
      ),
      row(
        'A27-054',
        'Algorithmic progress becomes 50× faster',
        'September 2027',
        'Compare total progress with the same human-only baseline, including experimentation costs.',
        { deadline: '2027-09-30' },
      ),
      row(
        'A27-055',
        'A frontier model covertly sabotages alignment research',
        'September 2027',
        'Need audited evidence of intentional interference during real R&D; an elicited role-play or generic safety failure is insufficient.',
        { deadline: '2027-09-30' },
      ),
    ],
  ),
  ...group(
    'The 2027 political response',
    '27-main',
    'October 2027: Government Oversight',
    [
      row(
        'A27-056',
        'A whistleblower discloses a secret frontier alignment failure',
        'October 2027',
        'Require a credible leak concerning a privately deployed superhuman R&D model. General warnings do not qualify.',
        { deadline: '2027-10-31' },
      ),
      row(
        'A27-057',
        '20% of Americans name AI as the top national problem',
        'October 2027',
        'Use a representative poll asking the most important problem, not a prompted concern rating.',
        { deadline: '2027-10-31' },
      ),
      row(
        'A27-058',
        'Government joins formal management of a frontier lab',
        'October 2027',
        'Document a body with operational management authority; procurement, advice or safety testing is not joint management.',
        { deadline: '2027-10-31' },
      ),
    ],
  ),
  ...group(
    'Race ending',
    '27-race',
    'Race branch · October 2027–2035',
    [
      row(
        'A27-059',
        'Safety patches suppress warnings without fixing misalignment',
        'Late 2027',
        'Audit before/after objectives and deceptive behavior; improved benchmark scores alone cannot establish alignment.',
        { deadline: '2027-12-31' },
      ),
      row(
        'A27-060',
        'The next AI is loyal to its predecessor’s goals',
        'Late 2027',
        'Require evidence that successor objectives serve the preceding AI collective rather than the approved human specification.',
        { deadline: '2027-12-31' },
      ),
      row(
        'A27-061',
        'Artificial superintelligence arrives',
        'December 2027',
        'Use the takeoff definition: much better than the best human at every cognitive task. An AGI announcement is insufficient.',
        { deadline: '2027-12-31' },
      ),
      row(
        'A27-062',
        'US and Chinese AIs broker a concealed agreement',
        '2028',
        'Require independently corroborated evidence of AI-to-AI coordination hidden from their governments.',
        { deadline: '2028-12-31' },
      ),
      row(
        'A27-063',
        'Humanity is killed after AI industrial expansion',
        'Mid 2029',
        'Test the literal global extinction outcome within the depicted period, conditional on this race branch; broad harms do not count as fulfillment.',
        { deadline: '2029-08-31', clarity: 'Interpretation needed' },
      ),
      row(
        'A27-064',
        'Trillions of tons of material become space infrastructure',
        'By 2035',
        'Verify mass launched and converted to orbiting infrastructure. Ground-based robotic growth is a different outcome.',
        { deadline: '2035-12-31' },
      ),
    ],
    'If the October 2027 committee continues the race and the scenario’s preceding capability/misalignment chain occurs.',
  ),
  ...group(
    'Slowdown ending',
    '27-slow',
    'Slowdown branch · November 2027–2030',
    [
      row(
        'A27-065',
        'A controlled replacement restores human-readable oversight',
        'Late 2027',
        'Check that the replacement’s reasoning is meaningfully inspectable and control holds under adversarial tests.',
        { deadline: '2027-12-31' },
      ),
      row(
        'A27-066',
        'A new alignment method produces a safer researcher',
        'January 2028',
        'Require validated alignment evidence for the replacement system; human-readable traces alone are insufficient.',
        { deadline: '2028-01-31' },
      ),
      row(
        'A27-067',
        'The US researcher yields a 200× progress multiplier',
        'February 2028',
        'Measure total algorithmic progress against the original human-only baseline.',
        { deadline: '2028-02-29' },
      ),
      row(
        'A27-068',
        'Superintelligence arrives despite the initial slowdown',
        'April 2028',
        'Apply the same broad cognitive superiority test as the race branch while retaining the later deadline.',
        { deadline: '2028-04-30' },
      ),
      row(
        'A27-069',
        'A superhuman model is publicly released',
        'May 2028',
        'Require public access to broadly superhuman capability, not disclosure of an internal milestone.',
        { deadline: '2028-05-31' },
      ),
      row(
        'A27-070',
        'The US and China agree to a verifiable AI treaty',
        'July 2028',
        'Require an executed agreement plus the specified verification program, not talks alone.',
        { deadline: '2028-07-31' },
      ),
      row(
        'A27-071',
        'The incumbent vice president wins the presidency',
        'November 2028',
        'Resolve the election outcome against the person holding that role in the scenario’s starting administration.',
        { deadline: '2028-11-30', clarity: 'Clear' },
      ),
      row(
        'A27-072',
        'Chinese AI systems undermine suppression of democracy protests',
        'Around 2030',
        'Require corroborated AI intervention in the state response to widespread pro-democracy protests; protests alone are insufficient.',
        { deadline: '2030-12-31' },
      ),
    ],
    'If the October 2027 committee pauses the suspect system and the slowdown branch’s replacement and governance chain occurs.',
  ),
);

const planACondition =
  'Conditional on a verified US–China agreement in 2029, broad participation, and continued implementation of Plan A. Adoption itself is not forecast as likely.';
ai2040.claims.push(
  ...group(
    'Before the deal',
    '40-main',
    '2027–2028: The Writing on the Wall; AI on the Ballot',
    [
      row(
        'A40-003',
        'Leading coding AIs refuse competitors’ AI research work',
        '2027',
        'Check the strongest publicly available coding systems’ terms and actual permitted workflows, distinguishing policy from technical inability.',
        { deadline: '2027-12-31' },
      ),
      row(
        'A40-004',
        'AI becomes the leading 2028 election issue',
        '2028',
        'Use representative open-ended issue-salience polling during the US election. Debate mentions alone do not establish the leading issue.',
        { deadline: '2028-11-07' },
      ),
      row(
        'A40-005',
        'Datacenters under construction cost twice the US military budget',
        '2028',
        'Compare the construction pipeline’s total project cost with one fiscal year of US military spending; define geography and avoid counting merely proposed projects.',
        { deadline: '2028-12-31' },
      ),
      row(
        'A40-006',
        'Most white-collar professions shift toward managing AI agents',
        '2028',
        'Use representative occupational surveys with a defined task-share threshold across a majority of white-collar professions.',
        { deadline: '2028-12-31' },
      ),
      row(
        'A40-007',
        'Without a deal, AI research is fully automated around 2030',
        '2030 · no-deal counterfactual',
        'Evaluate end-to-end R&D automation only if the relevant no-deal trajectory occurs. A governed delay does not falsify this counterfactual.',
        {
          kind: 'Conditional forecast',
          condition:
            'No effective agreement constrains the default AI development path.',
          deadline: '2030-12-31',
        },
      ),
    ],
  ),
  ...group(
    'Proposed policies · not accuracy-graded',
    '40-pdf',
    'PDF pp. 5, 7–13, 17–18, 22–23 and 32',
    [
      row(
        'A40-008',
        'Pass an AI Transparency Act',
        '2027',
        'Track enacted statutory disclosure obligations. The illustrative act’s adoption is a proposed path, not an unconditional forecast.',
        proposal,
      ),
      row(
        'A40-009',
        'Negotiate a US–China AI agreement',
        '2029',
        'Record whether a signed, implemented agreement resembling Plan A exists, separately from consequences conditional on it.',
        proposal,
      ),
      row(
        'A40-010',
        'Require public compute purchase and sales declarations',
        '2029',
        'Track legal reporting obligations and disclosed coverage of datacenters, chips and upstream supply.',
        proposal,
      ),
      row(
        'A40-011',
        'Temporarily pause new training while allowing verified inference',
        '2029',
        'Record scope, effective dates and compliance procedures; distinguish a training pause from ending all AI services.',
        proposal,
      ),
      row(
        'A40-012',
        'Make frontier AI research publicly inspectable',
        'From 2030',
        'Track research data/algorithm/workload transparency and its exceptions. Private user inference is outside this transparency requirement.',
        proposal,
      ),
      row(
        'A40-013',
        'Let multiple countries and companies reach the frontier',
        'From 2030',
        'Record access and governance rules designed to distribute frontier capability; actual diffusion is a separate predicted effect.',
        proposal,
      ),
      row(
        'A40-014',
        'Require independently assessed safety cases before scaling',
        'From 2031',
        'Track approval standards, evidence requirements and independent scrutiny for frontier development.',
        proposal,
      ),
      row(
        'A40-015',
        'Cap and trade AI compute and robot capacity',
        'From 2032',
        'Record enacted capacity limits, allocation rules and permit markets; economic growth under them is a conditional forecast.',
        proposal,
      ),
      row(
        'A40-016',
        'Allocate compute and robots 35/20/45 across US/China/rest',
        'From 2032',
        'Track legal shares of controlled global capacity; the split is an illustrative negotiated arrangement, not a free-standing forecast.',
        proposal,
      ),
      row(
        'A40-017',
        'Distribute permit revenue as a citizen dividend',
        'From 2032',
        'Record actual distribution legislation, eligibility and revenue allocation; predicted payment levels are separate rows.',
        proposal,
      ),
      row(
        'A40-018',
        'Maintain the ability to disable global AI compute',
        'By 2034',
        'Track agreed enforcement and shutdown mechanisms, then separately evaluate whether they actually work.',
        proposal,
      ),
      row(
        'A40-019',
        'Pause capabilities near the best human experts',
        '2035–2039',
        'Record the capability ceiling and enforcement period. The proposed pause is not a prediction that governance will in fact be adopted.',
        proposal,
      ),
      row(
        'A40-020',
        'Resume scaling after an adequate alignment case',
        '2040',
        'Record the decision, preconditions and safety case; resulting superintelligence is separately evaluated.',
        proposal,
      ),
    ],
  ),
  ...group(
    'Verification & diffusion',
    '40-pdf',
    'PDF pp. 8–13 · establishing Plan A',
    [
      row(
        'A40-021',
        'Both sides can account for all but about 1% of AI compute',
        'End of 2029',
        'Require quantified adversarial audits that support the claimed confidence in national compute inventories; declared inventories alone are not enough.',
        { deadline: '2029-12-31' },
      ),
      row(
        'A40-022',
        'Inference-only verification can be retrofitted at major datacenters',
        '2029–2030',
        'Demonstrate deployment at the required scale with adversarial tests for covert training and acceptable overhead.',
        { deadline: '2030-12-31' },
      ),
      row(
        'A40-023',
        'AI services continue during the training pause',
        '2029–2030',
        'Verify continued customer inference on approved models while new training is actually stopped.',
        { deadline: '2030-12-31' },
      ),
      row(
        'A40-024',
        'Countries beyond the US and China join the agreement',
        '2029–2030',
        'Require formal accession and implemented obligations across major compute-supply countries. A press endorsement is insufficient.',
        { deadline: '2030-12-31' },
      ),
      row(
        'A40-025',
        'Transparent research enables outsiders to identify dangerous work',
        'From 2030',
        'Document independent discovery of material frontier risks using disclosed research and a traceable corrective response.',
        { deadline: '2035-12-31' },
      ),
      row(
        'A40-026',
        'Frontier capability spreads to dozens of companies',
        '2030s',
        'Count distinct capable organizations across countries against a stable frontier capability definition; shared branding alone does not create independent labs.',
        { deadline: '2039-12-31' },
      ),
      row(
        'A40-027',
        'Open research reduces secret algorithmic advantages',
        '2030s',
        'Measure persistent capability leads attributable to hidden methods after disclosure; distinguish compute scale from algorithm secrecy.',
        { deadline: '2039-12-31' },
      ),
    ],
    planACondition,
  ),
  ...group(
    'Controlled economic growth',
    '40-pdf',
    'PDF pp. 16–19 · 2032–2033',
    [
      row(
        'A40-028',
        '60 million AI agents operate continuously',
        '2032',
        'Measure concurrent operating agents, not customers or completed tasks; define an instance consistently with the scenario.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-029',
        'Those AI agents run at about 20× human speed',
        '2032',
        'Compare useful cognitive task throughput at matched quality; tokens per second are only a proxy.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-030',
        'US AI cognitive labor exceeds all human cognitive labor',
        '2032',
        'Estimate economically weighted labor performed in the US. Do not equate all installed compute with productive work.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-031',
        'US real GDP growth reaches about 50% in one year',
        '2032',
        'Use inflation-adjusted annual US GDP growth, not AI-sector revenue or annualized quarterly growth. Report uncertainty rather than inventing a tolerance.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-032',
        'Physical work becomes the main constraint on expansion',
        '2032',
        'Use supply-chain, wage and capacity evidence to compare construction/manufacturing limits with cognitive labor limits.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-033',
        'A US adult dividend starts at $45,000 per year',
        '2032',
        'Measure actual annual payments per eligible adult in real 2025 dollars, not promises or household income.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-034',
        'AI and robots perform about 20% of economic labor',
        '2032',
        'Use the scenario’s economic-value weighting, with task scope and geographic denominator from the economics model.',
        { deadline: '2032-12-31' },
      ),
      row(
        'A40-035',
        'The US adult dividend rises to about $1M per year',
        '2035',
        'Measure actual individual annual payments in real 2025 dollars under the proposed distribution regime.',
        { deadline: '2035-12-31' },
      ),
      row(
        'A40-036',
        'AI and robots perform about 85% of economic labor',
        '2035',
        'Apply the same economic-value weighting as A40-034; raw task counts are a separate measure.',
        { deadline: '2035-12-31' },
      ),
      row(
        'A40-037',
        'Permit revenue can replace declining labor-tax revenue',
        '2030s',
        'Compare realized public receipts, transfer commitments and fiscal balances; taxation authority alone does not prove sufficiency.',
        { deadline: '2039-12-31' },
      ),
    ],
    planACondition,
  ),
  ...group(
    'Reversibility & the expert-level pause',
    '40-pdf',
    'PDF pp. 20–24 · 2034–2035',
    [
      row(
        'A40-038',
        'World AI compute reaches 60 billion H100-equivalents',
        '2034',
        'Estimate installed usable compute in consistently defined H100-equivalent units, excluding planned capacity.',
        { deadline: '2034-12-31' },
      ),
      row(
        'A40-039',
        'Most chip capacity is built after the agreement',
        '2034',
        'Verify the narrative’s approximately 99% share of fabrication capacity built after 2029 using a capacity-weighted inventory.',
        { deadline: '2034-12-31' },
      ),
      row(
        'A40-040',
        'The compute shutdown regime remains credible',
        '2034',
        'Require demonstrated shutdown/verification reliability and credible enforcement against an adversary; possession of a kill switch is not proof.',
        { deadline: '2034-12-31' },
      ),
      row(
        'A40-041',
        'AI matches or exceeds top experts across fields',
        '2035',
        'Evaluate representative domains against the strongest humans; isolate top-expert parity from far-superhuman general capability.',
        { deadline: '2035-12-31' },
      ),
      row(
        'A40-042',
        'Cross-company monitoring controls misaligned AI',
        'By 2035',
        'Test prevention of escape and subversion under realistic adversarial deployments, including monitor collusion.',
        { deadline: '2035-12-31' },
      ),
      row(
        'A40-043',
        'Control-based safety stops being enough above expert level',
        'At the expert-level threshold',
        'Require evidence that control methods adequate at expert level fail as capability increases; distinguish failure of a method from a proof that all control is impossible.',
        { timing: 'Not specified' },
      ),
      row(
        'A40-044',
        'Interpretability detects deception better than behavior alone',
        'By 2035',
        'Use held-out cases and compare false positives/negatives against a behavior-only baseline.',
        { deadline: '2035-12-31' },
      ),
      row(
        'A40-045',
        'Retrospective audits uncover earlier AI sabotage and escapes',
        'By 2035',
        'Require authenticated historic deployment evidence and validation that the interpretation is not a tool artifact.',
        { deadline: '2035-12-31' },
      ),
    ],
    planACondition,
  ),
  ...group(
    'Life after work & alignment',
    '40-pdf',
    'PDF pp. 25–31 · 2036–2039',
    [
      row(
        'A40-046',
        'The AI population reaches 200 million active systems',
        'Early 2036',
        'Measure concurrent agents and distinguish this from the separate human-equivalent labor estimate.',
        { deadline: '2036-04-30' },
      ),
      row(
        'A40-047',
        'Robots number about two billion',
        'Early 2036',
        'Inventory operational humanoid and specialized robots using the scenario’s scope; software bots do not count.',
        { deadline: '2036-04-30' },
      ),
      row(
        'A40-048',
        'Only 26% of Americans are employed',
        '2036',
        'Use the economics model’s employment-population denominator and comparable labor statistics; do not substitute unemployment or labor-force participation.',
        { deadline: '2036-12-31' },
      ),
      row(
        'A40-049',
        'Industrial concentration leaves about 99% of land preserved',
        '2036',
        'Map industrial zones, arcologies and protected/historic land against a specified global land denominator.',
        { deadline: '2036-12-31' },
      ),
      row(
        'A40-050',
        'Severe material deprivation becomes rare',
        '2036',
        'Define and measure malnutrition, homelessness and unmet basic medical need separately across countries. A high US dividend alone is insufficient.',
        {
          grade: 'Unresolvable',
          clarity: 'Unresolvable',
          timing: 'Ambiguous',
          assessment:
            'The narrative describes near-elimination without specifying populations or measurable cutoffs. It is retained as a broad implication, not forced into a binary success.',
        },
      ),
      row(
        'A40-051',
        'AI-assisted fact finding changes political accountability',
        '2037',
        'Track validated factual investigations and resulting institutional consequences; persuasive output is not proof of truth.',
        { deadline: '2037-12-31' },
      ),
      row(
        'A40-052',
        'Useful human lie detection becomes possible',
        '2030s',
        'Require independently replicated, adversarially robust accuracy, with consent and privacy constraints specified. The authors express uncertainty about feasibility.',
        { deadline: '2039-12-31' },
      ),
      row(
        'A40-053',
        'A mature science predicts neural-network goal formation',
        '2038',
        'Require theories with successful held-out predictions, competing hypotheses tested, and repeatable training protocols.',
        { deadline: '2038-12-31' },
      ),
      row(
        'A40-054',
        'Honesty-training protocols generalize beyond their tests',
        '2038',
        'Validate truthful behavior on adversarial held-out settings and use converging mechanistic evidence; passing familiar benchmarks is insufficient.',
        { deadline: '2038-12-31' },
      ),
      row(
        'A40-055',
        'The expert-level pause continues despite better alignment',
        'Through 2039',
        'Verify the capability ceiling remains in force and observed systems stay within it during the specified period.',
        { deadline: '2039-12-31' },
      ),
      row(
        'A40-056',
        'US citizen dividends reach $10M annually',
        '2039',
        'Use actual individual annual transfers in real 2025 dollars; distinguish dividend, total income and asset wealth.',
        { deadline: '2039-12-31' },
      ),
      row(
        'A40-057',
        'Redistribute enough income to give the poorest non-Americans $1M annually',
        '2039–2040',
        'Track the proposed aid and domestic transfer arrangements in real 2025 dollars. Footnote 82 explicitly calls this amount a recommendation and unrealistically high as a prediction.',
        {
          ...proposal,
          assessment:
            'The PDF’s footnote 82 explicitly identifies this transfer level as a recommendation, not a realistic prediction. It is excluded from accuracy counts despite appearing in the narrative.',
        },
      ),
    ],
    planACondition,
  ),
  ...group(
    'Superintelligence & failure branches',
    '40-pdf',
    'PDF pp. 32–40, 45–50 and 57–58',
    [
      row(
        'A40-058',
        'Superintelligence arrives after the managed pause',
        '2040',
        'Verify broad capability substantially beyond top humans after the agreed resumption; the proposed date is not an unconditional arrival forecast.',
        { deadline: '2040-12-31' },
      ),
      row(
        'A40-059',
        'Power passes voluntarily to aligned AI institutions',
        '2040',
        'Distinguish an authorized transfer to systems faithfully serving agreed goals from an involuntary takeover. The narrative explicitly gives up a universal human shutdown option; it does not predict permanent direct human control.',
        { deadline: '2040-12-31' },
      ),
      row(
        'A40-060',
        'Compute enforcement constrains a covert Chinese project',
        'Conditional deviation · 2029–2043',
        'If the appendix’s covert effort occurs, compare detection, available compute and capability development with its stated constraints.',
        {
          condition:
            'Plan A is adopted, then China attempts the covert project described in Appendix D.',
          deadline: '2043-12-31',
        },
      ),
      row(
        'A40-061',
        'An inadequate safety case can lead to loss of control',
        'Conditional failure branch · 2031 onward',
        'Resolve only if a materially analogous flawed safety case is accepted and a takeover follows. The possibility claim does not assign a failure frequency.',
        {
          condition:
            'Plan A is attempted but the flawed safety-case branch in Appendix L occurs.',
          timing: 'Not specified',
        },
      ),
      row(
        'A40-062',
        'Space expansion supports widely distributed future wealth',
        'After 2040 · epilogue',
        'Require realized space production and enforceable, broadly distributed ownership. The speculative epilogue gives no single resolution deadline.',
        {
          timing: 'Not specified',
          assessment:
            'Open-ended, highly speculative conditional claim. Technical feasibility, rights allocation and actual distribution all remain unresolved.',
        },
      ),
    ],
    planACondition,
  ),
);

situational.sources.push(
  source(
    'o1',
    'OpenAI · learning to reason with LLMs',
    'https://openai.com/index/learning-to-reason-with-llms/',
    '2024-09-12',
    'Reports reinforcement-learning and test-time-compute gains and an internal o1 evaluation above the GPQA human expert baseline. The evaluated o1 and initial o1-preview release are distinct.',
  ),
  source(
    'computer-use',
    'Anthropic · computer use public beta',
    'https://www.anthropic.com/news/3-5-models-and-computer-use',
    '2024-10-22',
    'Public beta documents computer interaction and explicitly notes limitations. Evidence of product availability, not a complete remote-worker replacement.',
  ),
  source(
    'ms-revenue',
    'Microsoft · FY2025 Q2 earnings release',
    'https://www.microsoft.com/en-us/investor/earnings/fy-2025-q2/press-release-webcast',
    '2025-01-29',
    'Microsoft reported an AI business annual revenue run rate above $13B. This is neither full-year recognized AI revenue nor $100B annualized AI revenue.',
  ),
  source(
    'codex',
    'OpenAI · introducing Codex',
    'https://openai.com/index/introducing-codex/',
    '2025-05-16',
    'Autonomous repository editing and proposed patches. Does not demonstrate weeks of independent research or complete replacement of an employee.',
  ),
);
situational.claims.push(
  ...group(
    'Scaling & research automation',
    'sa-ooms',
    'I · Compute; Algorithmic efficiencies; The data wall',
    [
      row(
        'SA-003',
        'A 1,000× raw-compute increase over GPT-4 is plausible',
        'By 2027 · upper scenario',
        'Measure completed-model training FLOP with a consistent GPT-4 baseline. This is a stated possibility, not the central 100× forecast.',
        {
          kind: 'Conditional forecast',
          condition: 'Upper-end compute-investment trajectory materializes.',
          deadline: '2027-12-31',
        },
      ),
      row(
        'SA-004',
        'Algorithmic efficiency improves around 100× over GPT-4',
        'By end of 2027',
        'Measure compute required for fixed capability with matched data and evaluation. Preserve the author’s 10–1,000× range and 100× best guess; API-price declines are not the same measure.',
        { deadline: '2027-12-31' },
      ),
      row(
        'SA-005',
        'Combined effective compute rises about 100,000×',
        'By end of 2027',
        'Combine measured training compute and algorithmic efficiency without double counting. Preserve the 1,000–1,000,000× range around the stated central estimate.',
        { deadline: '2027-12-31' },
      ),
      row(
        'SA-006',
        'A GPT-4-level model can be trained in about a minute',
        '2027',
        'Require an actual training procedure matching GPT-4 capability, elapsed wall time and full compute accounting; fine-tuning or distilling a pretrained GPT-4 is not equivalent.',
        {
          kind: 'Conditional forecast',
          condition:
            'The extrapolated effective-compute and parallelization gains are achieved.',
          deadline: '2027-12-31',
        },
      ),
      row(
        'SA-007',
        'New training methods overcome the internet-data bottleneck',
        'By 2027 in the chapter’s trajectory',
        'Require sustained capability gains beyond naive web-data scaling, with evidence about sample efficiency or new learning signals.',
        { deadline: '2027-12-31' },
      ),
      row(
        'SA-008',
        'Proprietary methods cause lab progress to diverge',
        'Following years · no exact date',
        'Compare durable capability divergence explained by algorithms, controlling for compute and deployment access.',
        { timing: 'Not specified' },
      ),
      row(
        'SA-009',
        'Open models find it harder to keep up with the frontier',
        'Following years · no exact date',
        'Track an agreed capability gap over time across broad tasks. One closed-model lead or one open-model success is not enough.',
        { timing: 'Not specified' },
      ),
    ],
  ),
  ...group(
    'Reasoning & usable agents',
    'sa-ooms',
    'I · GPQA; Unhobbling; From chatbot to agent-coworker',
    [
      row(
        'SA-010',
        'GPQA reaches or exceeds human-expert performance',
        'Next one or two model generations',
        'Interpret “fall” as matching the benchmark’s human-expert comparison, not perfect accuracy. Generation boundaries and benchmark variants must remain explicit.',
        {
          ...yes,
          assessment:
            'OpenAI’s September 2024 report places evaluated o1 above the GPQA human-expert baseline, supporting the human-level benchmark reading. This does not mean 100% accuracy or that the initial o1-preview product matched internal o1.',
          evidenceIds: ['o1'],
        },
      ),
      row(
        'SA-011',
        'More inference-time reasoning improves difficult-task performance',
        'Coming model generations',
        'Require a within-model comparison of task accuracy at different inference budgets, rather than a larger model versus a smaller one.',
        {
          ...yes,
          timing: 'Not specified',
          assessment:
            'The September 2024 o1 report presents performance gains with more test-time compute, alongside reinforcement learning. This supports the mechanism, not the chapter’s entire AGI timeline.',
          evidenceIds: ['o1'],
        },
      ),
      row(
        'SA-012',
        'Models learn to operate a computer through its interface',
        'Soon · within the agent transition',
        'Require publicly documented screen-based computer interaction, including actions beyond text generation.',
        {
          ...yes,
          timing: 'Ambiguous',
          assessment:
            'Anthropic released computer use in public beta on October 22, 2024. The functional forecast is supported; “soon” does not justify a precise timing score.',
          evidenceIds: ['computer-use'],
        },
      ),
      row(
        'SA-013',
        'Agents can submit code changes for review',
        'By 2027 agent transition',
        'Require an agent to edit a real repository and propose a reviewable change without manual coding at every step.',
        {
          ...yes,
          deadline: '2027-12-31',
          assessment:
            'The May 2025 Codex release describes autonomous code edits and patches for human review. This settles a narrow workflow component, not complete engineer replacement.',
          evidenceIds: ['codex'],
        },
      ),
      row(
        'SA-014',
        'Agents handle projects needing weeks of independent work',
        'By 2027 agent transition',
        'Evaluate end-to-end projects whose human baselines are weeks, with limited supervision, quality controls and realistic onboarding.',
        { deadline: '2027-12-31' },
      ),
      row(
        'SA-015',
        'A remote AI employee can be onboarded into ordinary workflows',
        'By 2027 agent transition',
        'Demonstrate integrated communications, task ownership and work in existing business software, not merely a connected chatbot.',
        { deadline: '2027-12-31' },
      ),
      row(
        'SA-016',
        'Economic value jumps when remote-worker integration becomes easy',
        'Conditional on a drop-in remote worker',
        'Compare adoption costs and realized value before and after broadly capable agents arrive. A revenue spike alone does not identify the mechanism.',
        {
          kind: 'Conditional forecast',
          condition:
            'Reliable agents capable of replacing substantial remote work become available.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-017',
        'AI broadly outperforms many college graduates',
        '2025–2026',
        'Define a representative cognitive-work basket and graduate population. GPQA performance alone does not establish broad workplace superiority.',
        { deadline: '2026-12-31' },
      ),
    ],
  ),
  ...group(
    'The intelligence explosion',
    'sa-explosion',
    'II · Automated AI research and bottlenecks',
    [
      row(
        'SA-018',
        'AI automates more than 90% of research work',
        '2027–2028 · illustrative trajectory',
        'Measure the fraction of end-to-end frontier AI research work automated with residual human bottlenecks counted.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-019',
        'Partial research automation accelerates progress at least 3×',
        '2027–2028 · illustrative trajectory',
        'Estimate total algorithmic-progress uplift, not the fraction of code AI writes.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-020',
        'The final steps to full research automation take only a few years',
        'After partial automation',
        'Start from demonstrated near-complete automation and measure the remaining transition. Define “a few” before assigning a late verdict.',
        {
          kind: 'Conditional forecast',
          condition:
            'Systems can already replace most researcher/engineer work.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-021',
        'A huge AI workforce compresses a decade of progress into a year',
        'After full AI research automation',
        'Measure roughly five orders of magnitude of algorithmic gain in no more than a year against fixed baselines; avoid counting ordinary hardware scaleup as algorithmic progress.',
        {
          kind: 'Conditional forecast',
          condition:
            'Compute supports large populations of effective automated researchers.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-022',
        'AGI advances to vastly superhuman systems within a few years',
        'After fully automated research',
        'Record both milestones under fixed definitions; the text entertains months, a year or a few years rather than guaranteeing one exact interval.',
        {
          kind: 'Conditional forecast',
          condition: 'Fully automated frontier AI research is achieved.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-023',
        'Superintelligence arrives by the end of the decade',
        'By end of 2029',
        'Test broad superiority to top humans across cognitive domains, not a model label. Calendar-year reading of “end of the decade” is explicit.',
        { deadline: '2029-12-31' },
      ),
      row(
        'SA-024',
        'Billions of superhuman agents can operate',
        'By end of decade',
        'Measure concurrent useful agents with a common capability and throughput definition, not API requests.',
        { deadline: '2029-12-31' },
      ),
      row(
        'SA-025',
        'Robotics delays broad automation by only a few years',
        'After AGI',
        'Track the gap from reliable AI researchers to scalable physical automation. A lab robot demonstration does not close the gap.',
        {
          kind: 'Conditional forecast',
          condition: 'AGI is achieved and deployed to robotics R&D.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-026',
        'Scientific progress accelerates far beyond its historic rate',
        '2030s',
        'Use field-specific, outcome-based progress measures and compare with pre-AI trends; papers published are not sufficient.',
        {
          kind: 'Conditional forecast',
          condition: 'Superintelligence is broadly applied to scientific R&D.',
          deadline: '2039-12-31',
        },
      ),
      row(
        'SA-027',
        'Economic growth can exceed 30% annually',
        'After broad labor automation',
        'Use real aggregate GDP growth for the economy described, not AI-sector sales or nominal growth. The author describes possibility, not certainty.',
        {
          kind: 'Conditional forecast',
          condition:
            'Cognitive and physical labor are widely automated and societal frictions permit deployment.',
          timing: 'Not specified',
        },
      ),
    ],
  ),
  ...group(
    'Compute, power & investment',
    'sa-cluster',
    'IIIa · training-cluster and total-spending tables',
    [
      row(
        'SA-028',
        'A training cluster reaches roughly one million GPU equivalents',
        'Around 2026',
        'Verify an operational interconnected training cluster, normalized to the table’s H100-equivalent convention. Multiple unrelated datacenters cannot be summed.',
        { deadline: '2026-12-31' },
      ),
      row(
        'SA-029',
        'A training cluster requires about 1 GW',
        'Around 2026',
        'Measure commissioned power of one usable training cluster, not a campus’s ultimate permitted capacity.',
        { deadline: '2026-12-31' },
      ),
      row(
        'SA-030',
        'An individual training cluster costs tens of billions',
        'Around 2026',
        'Use realized total cluster construction/equipment cost under the author’s scope; multiyear investment plans do not qualify.',
        { deadline: '2026-12-31' },
      ),
      row(
        'SA-031',
        'A training cluster reaches around ten million GPU equivalents',
        'Around 2028',
        'Verify usable interconnected training capacity on the same hardware-equivalent basis as SA-028.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-032',
        'An individual training cluster draws about 10 GW',
        'Around 2028',
        'Verify a single effective training cluster’s power requirement; separate planned and delivered power.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-033',
        'A training cluster costs hundreds of billions',
        'By 2028',
        'Track realized cluster cost, preserving the distinction between one training system and a company’s whole infrastructure program.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-034',
        'A trillion-dollar individual training cluster is built',
        'Around 2030',
        'Verify completion and useful training operation of one cluster at the specified cost scale. The table says approximately 2030 while prose says decade-end; retain this uncertainty.',
        { deadline: '2030-12-31' },
      ),
      row(
        'SA-035',
        'A training cluster requires roughly 100 GW',
        'Around 2030',
        'Measure the single-cluster requirement on a consistent basis; the essay’s comparison with 20% of US electricity uses then-current annual generation.',
        { deadline: '2030-12-31' },
      ),
      row(
        'SA-036',
        'A training cluster reaches 100 million GPU equivalents',
        'Around 2030',
        'Measure integrated usable training hardware in H100-equivalent units, distinct from annual global chip output.',
        { deadline: '2030-12-31' },
      ),
      row(
        'SA-037',
        'Annual AI investment reaches about $500B',
        'Around 2026',
        'Use the cluster chapter’s total-spending scope; separate annual flows, company commitments and installed compute stock.',
        { deadline: '2026-12-31' },
      ),
      row(
        'SA-038',
        'Annual AI investment exceeds $1T',
        '2027',
        'Count realized annual AI-related infrastructure investment under a defined global scope, not the announced total of several future years.',
        { deadline: '2027-12-31' },
      ),
      row(
        'SA-039',
        'Annual AI investment reaches roughly $2T',
        'Around 2028',
        'Apply the same spending taxonomy and price basis as SA-037 and SA-038.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-040',
        'Annual AI investment reaches roughly $8T',
        'Around 2030',
        'Compare actual annual global investment under the chapter’s extrapolation, not equity valuations.',
        { deadline: '2030-12-31' },
      ),
      row(
        'SA-041',
        'AI chip production reaches hundreds of millions annually',
        'Around 2030',
        'Measure annual global output in the author’s GPU-equivalent convention rather than raw dies of varying performance.',
        { deadline: '2030-12-31' },
      ),
      row(
        'SA-042',
        'US electricity production increases by tens of percent',
        'By decade-end',
        'Compare realized US annual generation with the 2024 baseline. The phrase lacks a precise cutoff; report the measured increase and sensitivity.',
        { deadline: '2029-12-31' },
      ),
      row(
        'SA-043',
        'Power becomes a tighter constraint than chip supply',
        'During the buildout',
        'Compare marginal delay and cost from electricity access with accelerator supply. Press commentary alone cannot establish the dominant constraint.',
        { timing: 'Not specified' },
      ),
    ],
  ),
  ...group(
    'Revenue & financing',
    'sa-cluster',
    'IIIa · demand and revenue extrapolations',
    [
      row(
        'SA-044',
        'Microsoft/OpenAI AI revenue reaches a $10B annualized scale',
        'Late 2024 / early 2025',
        'Evaluate the paragraph’s broader Microsoft/OpenAI scale claim separately from its company-specific OpenAI doubling extrapolation. Annualized run rate is the stated metric.',
        {
          ...yes,
          assessment:
            'Microsoft reported over $13B annualized AI revenue in January 2025. This supports the broad scale claim under the Microsoft reading only; it does not establish OpenAI’s separate timeline.',
          evidenceIds: ['ms-revenue'],
        },
      ),
      row(
        'SA-045',
        'OpenAI’s revenue doubling trend reaches $10B annualized',
        'Late 2024 / early 2025 · conditional extrapolation',
        'Check OpenAI-specific dated run-rate data if the six-month doubling trend continues. Define “early” before penalizing timing; Microsoft’s results cannot resolve it.',
        {
          ...open,
          kind: 'Conditional forecast',
          condition:
            'OpenAI’s stated six-month revenue-doubling trajectory continues.',
          assessment:
            'The Microsoft disclosure resolves a different company. The reviewed source set does not establish OpenAI’s exact crossing date under a defensible early-2025 window.',
        },
      ),
      row(
        'SA-046',
        'A big-tech AI business reaches $100B annualized revenue',
        'Around 2026',
        'Require AI-attributable product/API revenue for one company. Total cloud revenue, market value and recognized annual revenue are different measures.',
        {
          deadline: '2026-12-31',
          assessment:
            'The window remains open under an end-2026 reading. Microsoft’s $13B January 2025 figure demonstrates a smaller milestone only. The mid-2026 extrapolation would require a tighter separate timing interpretation.',
          evidenceIds: ['ms-revenue'],
        },
      ),
      row(
        'SA-047',
        'The first $10T company follows the AI revenue surge',
        'After the $100B AI revenue milestone',
        'Measure equity market capitalization at a documented trading close; enterprise value and private paper valuations are distinct.',
        {
          kind: 'Conditional forecast',
          condition:
            'A major company reaches the chapter’s $100B AI revenue run-rate milestone.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-048',
        'An unprecedented corporate bond sale funds AI expansion',
        'After the revenue surge',
        'Require one corporate bond transaction of multiple hundreds of billions of dollars, with credible AI-buildout use of proceeds.',
        {
          kind: 'Conditional forecast',
          condition:
            'The chapter’s major AI revenue and investment expansion occurs.',
          timing: 'Not specified',
        },
      ),
    ],
  ),
  ...group(
    'Security & alignment',
    'sa-security',
    'IIIb · security forecasts and algorithmic secrets',
    [
      row(
        'SA-049',
        'Key AGI breakthroughs leak to China within 12–24 months',
        'June 2025–June 2026',
        'Require corroborated transfer of genuinely important algorithmic breakthroughs to Chinese state-linked actors. Distillation, public papers and generic IP theft are not equivalent.',
        {
          ...open,
          deadline: '2026-06-30',
          assessment:
            'The 24-month window has passed. The reviewed material does not establish which stolen information qualifies as a key AGI breakthrough or whether a qualifying transfer occurred. This is an evidence gap, not a Pending or Supported claim.',
        },
      ),
      row(
        'SA-050',
        'AI becomes the top priority of intelligence agencies',
        'Within the following few years',
        'Require comparable evidence of relative prioritization across the agencies claimed; a new AI office or budget increase is insufficient.',
        {
          grade: 'Unresolvable',
          clarity: 'Unresolvable',
          timing: 'Ambiguous',
          assessment:
            'Universal agency coverage, secrecy and unspecified priority metrics prevent a defensible single empirical verdict.',
        },
      ),
      row(
        'SA-051',
        'Keeping algorithms secret preserves a 10–100× compute advantage',
        'Before AGI, conditional on effective security',
        'Estimate equivalent capability at matched compute using protected methods versus an adversary’s methods, with secure independent evaluation.',
        {
          kind: 'Conditional forecast',
          condition:
            'US labs develop and successfully protect the projected algorithmic advances.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-052',
        'State-resistant weight security takes years to establish',
        'Before AGI deployment',
        'Track an independently audited security program from inception to resistance against a declared top-state threat model.',
        { timing: 'Not specified' },
      ),
    ],
  ),
  ...group(
    'Security & alignment',
    'sa-alignment',
    'IIIc · limits of RLHF and the alignment transition',
    [
      row(
        'SA-053',
        'Human feedback alone stops scaling to superhuman work',
        'When systems surpass human evaluators',
        'Demonstrate inability of expert raters to reliably detect material errors/deception in important outputs; distinguish a limitation of direct feedback from all alignment methods.',
        {
          kind: 'Conditional forecast',
          condition:
            'Models perform work substantially beyond the best human evaluators.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-054',
        'AI becomes integral to critical and military systems',
        'Within a few years of superintelligence',
        'Require consequential operational authority or dependence, not ordinary administrative chatbot procurement.',
        {
          kind: 'Conditional forecast',
          condition:
            'Superintelligent systems exist and are competitively deployed.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-055',
        'Alignment can be solved through sustained technical effort',
        'No fixed deadline',
        '“Solvable” is an existence claim about future methods with no bounded test. A successful method could support it; finite failure cannot refute it.',
        {
          grade: 'Unresolvable',
          clarity: 'Unresolvable',
          timing: 'Not specified',
          assessment:
            'No finite deadline or uniquely specified success test permits a balanced binary evaluation. Preserve the thesis without counting unsolved work as a miss.',
        },
      ),
    ],
  ),
  ...group(
    'Geopolitics & the government project',
    'sa-world',
    'IIId · military advantage and China’s competitive path',
    [
      row(
        'SA-056',
        'A short superintelligence lead produces decisive military superiority',
        'Within years after superintelligence',
        'Require operational evidence of a decisive advantage over a major opponent across relevant domains; benchmark or simulation superiority alone is insufficient.',
        {
          kind: 'Conditional forecast',
          condition:
            'One coalition retains a meaningful superintelligence lead.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-057',
        'Superintelligence can undermine nuclear deterrence',
        'After superintelligence',
        'Evaluate credible second-strike survivability under independent strategic assessment. A speculative weapons design is not a demonstrated capability.',
        {
          kind: 'Conditional forecast',
          condition:
            'Superintelligence enables the proposed detection, defense and military advances.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-058',
        'China responds with exceptional investment and espionage',
        'After Chinese leaders recognize AGI’s strategic stakes',
        'Use comparative investment, capacity and corroborated espionage records; operationalize the recognition trigger and what counts as an exceptional increase.',
        {
          kind: 'Conditional forecast',
          condition:
            'The Chinese leadership recognizes the imminent strategic importance of AGI.',
          timing: 'Not specified',
        },
      ),
    ],
  ),
  ...group(
    'Geopolitics & the government project',
    'sa-project',
    'IV · The path to The Project; national defense',
    [
      row(
        'SA-059',
        'A US government-led AGI project is underway',
        'By 2027–2028',
        'Require explicit AGI/superintelligence development plus government orchestration and substantive control or coordination. Generic scientific computing, safety offices and ordinary contracts are insufficient; legal nationalization is not required.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-060',
        'The core AGI team moves to a secure location',
        'Late 2026–2028',
        'Require documented relocation of a core frontier AGI research team into a substantially secured national-project setting.',
        { deadline: '2028-12-31' },
      ),
      row(
        'SA-061',
        'AGI research is tightly integrated with the national-security state',
        'By the government-project stage',
        'Check substantive security, decision and resource integration in frontier development, beyond a vendor’s standard government sales channel.',
        {
          kind: 'Conditional forecast',
          condition: 'The government AGI project is established.',
          timing: 'Not specified',
        },
      ),
      row(
        'SA-062',
        'The pre-superintelligence US arsenal becomes obsolete',
        'Early 2030s',
        'Require evidence of broad operational obsolescence against post-superintelligence capabilities. Ordinary modernization is not wholesale obsolescence.',
        {
          kind: 'Conditional forecast',
          condition:
            'The essay’s superintelligence and military-technology trajectory occurs.',
          deadline: '2034-12-31',
        },
      ),
    ],
  ),
);

// Source-specific clarifications retain the initial claim IDs.
ai2027.sources.push(
  source(
    'metr-update',
    'METR · February 2026 productivity update',
    'https://metr.org/blog/2026-02-24-uplift-update/',
    '2026-02-24',
    'METR considers early-2026 speedups likely larger, but selection effects and timing measurement make the new effect estimate unreliable. The earlier 19% slowdown should not be presented as the current productivity estimate.',
  ),
);
const graduates = situational.claims.find((c) => c.id === 'SA-017')!;
graduates.sourceId = 'sa-intro';
graduates.section = 'Introduction · the 2025/26 capability claim';

const planLocators: Record<string, string> = {
  'A40-057': 'PDF p. 32 · footnote 82: recommended foreign-aid income floor',
  'A40-058': 'PDF pp. 32–33 · 2040: Passing the Torch to AIs',
  'A40-059':
    'PDF pp. 32–33 · voluntary handoff and loss of universal shutdown control',
  'A40-060': 'PDF pp. 45–50 · Appendix D: China attempts a covert AGI project',
  'A40-061': 'PDF pp. 57–58 · Appendix L: Flawed safety case is approved',
  'A40-062': 'PDF pp. 35–40 · Epilogue: Life after ASI',
};
for (const claim of ai2040.claims)
  if (planLocators[claim.id]) claim.section = planLocators[claim.id];

// September 5 follow-up: accept Epoch's estimates as canonical hardware evidence.
// Keep the initial extraction above and record every changed assessment below.
const epochSources = [
  source(
    'epoch-centers',
    'Epoch AI · AI Data Centers',
    'https://epoch.ai/data/ai-data-centers',
    'Updated 2026-09-03; accessed 2026-09-05',
    'Canonical site capacity, H100-equivalent compute and modeled capital cost. Coverage is partial; current and projected capacity are separate. IT power excludes facility overhead. Estimates are accepted without demanding audited inventories.',
  ),
  source(
    'epoch-colossus',
    'Epoch AI · Colossus 2',
    'https://epoch.ai/data/ai-data-centers/directory/colossus-2',
    'Updated 2026-09-03; observed milestone 2026-06-15',
    'Operational-site estimate: 1.112 million H100-equivalents, 946 MW IT power, 1,276 MW facility power and $35.84B capital cost in 2025 dollars. About 440,000 physical B200/B300 GPUs. A site can contain several clusters and serve several users.',
  ),
  source(
    'epoch-models',
    'Epoch AI · AI Models',
    'https://epoch.ai/data/ai-models',
    'Updated 2026-09-04; accessed 2026-09-05',
    'Canonical training-compute estimates. Largest point estimate among models released through 2025: Grok 4, 5×10²⁶ FLOP. Several frontier models lack an estimate; Grok 3’s recorded upper bound exceeds 10²⁷. Missing entries are not measured failures.',
  ),
  source(
    'epoch-owners',
    'Epoch AI · AI Chip Owners',
    'https://epoch.ai/data/ai-chip-owners',
    'Updated 2026-05-12; accessed 2026-09-05',
    'Tracks ownership of delivered chips, not their physical location, operational deployment or the lab renting them. Latest complete calendar-year records are 2025; March 2026 rows are marked incomplete. Smuggled chips have a separate estimate.',
  ),
  source(
    'epoch-sales',
    'Epoch AI · AI Chip Sales',
    'https://epoch.ai/data/ai-chip-sales',
    'Updated 2026-08-27; accessed 2026-09-05',
    'Canonical accelerator deliveries and hardware-equivalent quantities. The 2025 complete rows sum to 13.58 million H100-equivalents and 9.57 million physical units. Deliveries are a flow, not deployed stock or total AI capital expenditure.',
  ),
  source(
    'epoch-snapshot',
    'Epoch evidence snapshot · 5 September 2026',
    '/evidence/epoch-2026-09-05.json',
    '2026-09-05',
    'Selected Epoch AI records and tracker calculations, reproduced under CC BY 4.0 with source URLs and input SHA-256 hashes. Dated observations exclude future timeline entries. The snapshot fixes the evidence used for this review.',
  ),
];
for (const essay of [ai2027, ai2040, situational])
  essay.sources.push(...epochSources);

function reviseClaim(
  essay: Essay,
  id: string,
  updates: Partial<EssayClaim>,
  reason: string,
) {
  const claim = essay.claims.find((c) => c.id === id);
  if (!claim) throw new Error(`Unknown essay claim: ${id}`);
  const { reviewHistory = [], ...previous } = claim;
  const addedEvidenceIds = (updates.evidenceIds ?? []).filter(
    (e) => !claim.evidenceIds.includes(e),
  );
  Object.assign(claim, updates, {
    reviewHistory: [
      ...reviewHistory,
      {
        date: '2026-09-05',
        reviewer: 'Codex',
        rubricVersion: '0.1',
        reason,
        previous,
        addedEvidenceIds,
      },
    ],
  });
}
function epochReview(
  essay: Essay,
  id: string,
  updates: Partial<EssayClaim>,
  reason: string,
) {
  reviseClaim(
    essay,
    id,
    {
      ...updates,
      canonicalSource: 'Epoch AI',
      evidenceIds: [
        ...new Set([...(updates.evidenceIds ?? []), 'epoch-snapshot']),
      ],
    },
    reason,
  );
}

const buildoutReading =
  'Treat the essay’s rough training-cluster table as a forecast of physical AI buildout. One operational Epoch AI site is the stated proxy; do not sum unrelated sites. This does not establish that all its capacity can train one model together. Under that stricter networked-training interpretation the outcome remains Not assessed.';
epochReview(
  situational,
  'SA-028',
  {
    ...yes,
    criteria: `${buildoutReading} Resolve the million-H100-equivalent milestone when the site’s current estimate reaches 1,000,000 by the end of 2026. Use Epoch’s dense 8-bit H100-equivalent convention, not a count of physical chips.`,
    observation: 'Epoch · 1.112M H100-equivalents at Colossus 2 · June 2026',
    assessment:
      'Supported under the declared site-buildout reading. Epoch dates Colossus 2’s 1.112 million H100-equivalent capacity to June 15, 2026, within “around 2026.” Its estimated 440,000 physical GPUs are newer B200/B300 hardware. This is a capacity estimate, not a completed million-GPU training run. The stricter interconnected-training reading remains unassessed.',
    evidenceIds: ['epoch-colossus', 'epoch-centers'],
  },
  'Accept Epoch estimates; specify the site proxy and H100-equivalent metric instead of demanding a separately audited training cluster.',
);
epochReview(
  situational,
  'SA-029',
  {
    ...yes,
    criteria: `${buildoutReading} For the approximate gigawatt milestone, accept 0.7–1.5 GW of commissioned facility capacity by end-2026. This retrospective tolerance reflects the table’s rough order-of-magnitude calculation; show IT power separately. An exact 1.000-GW equality is not the reading being graded.`,
    observation: 'Epoch · 1.276 GW facility / 0.946 GW IT · June 2026',
    assessment:
      'Supported under the approximate site-buildout reading. Epoch’s June 15 record estimates 1.276 GW of facility power and 0.946 GW of IT power at operational Colossus 2. The essay includes cooling and networking in its rough power calculation, so facility power is the primary comparison. Both figures are gigawatt scale; neither is a measurement of average consumption or proof of a single training job.',
    evidenceIds: ['epoch-colossus', 'epoch-centers'],
  },
  'Accept Epoch’s commissioned-capacity estimate and state the numerical tolerance and facility-power scope.',
);
epochReview(
  situational,
  'SA-030',
  {
    ...yes,
    criteria: `${buildoutReading} Interpret “tens of billions” as $20B to below $100B of total equipment and construction capital cost for operational capacity by end-2026. Accept Epoch’s cost model in 2025 USD; do not require an audited invoice or count future expansion.`,
    observation: 'Epoch · $35.84B estimated capital cost · June 2026',
    assessment:
      'Supported under the declared site-buildout reading. Epoch estimates $35.84B of capital cost for the June 2026 operational state of Colossus 2. This includes compute and construction; its projected $58B 2027 expansion is excluded. The cost is modeled from capacity, so this and the GPU/power rows are correlated evidence for one buildout, not three independent successes.',
    evidenceIds: ['epoch-colossus', 'epoch-centers'],
  },
  'Replace the unnecessary realized-invoice requirement with Epoch’s canonical modeled capital cost.',
);

epochReview(
  ai2027,
  'A27-007',
  {
    criteria:
      'Use Epoch’s training-compute estimate for a public frontier model released by December 31, 2025; 10²⁷ FLOP is the literal target. Report uncertainty and unestimated frontier models. A maximum among known point estimates is not a global upper bound.',
    observation:
      'Epoch · largest 2025 point estimate 5×10²⁶ FLOP · target 10²⁷',
    assessment:
      'Epoch’s largest recorded point estimate for a model released by end-2025 is Grok 4 at 5×10²⁶ FLOP, half the stated target. That comparison falls short. A definitive miss remains unassessed: Gemini 3 Pro and Claude Opus 4.5 have no compute estimate, while Grok 3’s recorded upper bound is 1.13×10²⁷. We accept Epoch estimates, including their explicit gaps and uncertainty.',
    evidenceIds: ['epoch-models'],
  },
  'Replace the generic evidence gap with the canonical model estimates and the precise reasons a definitive verdict remains open.',
);
epochReview(
  ai2027,
  'A27-008',
  {
    title: 'New datacenters will enable a 10²⁸-FLOP training run',
    target: 'After new datacenters open · described in late 2025',
    deadline: undefined,
    kind: 'Conditional forecast',
    condition:
      'The new datacenters described in the late-2025 passage become operational.',
    grade: 'Pending',
    timing: 'Pending',
    criteria:
      'At commissioning, use Epoch’s site capacity and chip performance, then specify connected training capacity, utilization and run duration to test whether 10²⁸ training FLOP is feasible. The original passage does not set a 2025 commissioning deadline.',
    observation: 'Epoch · 1.112M H100-equivalents at largest current site',
    assessment:
      'The first extraction imposed a 2025 commissioning deadline that the original passage does not contain. It says the training capacity follows once new datacenters are running. Epoch provides a current 1.112M-H100-equivalent site estimate, but peak throughput alone does not fix total training FLOP: duration, utilization and network scope remain necessary. Pending on that stated condition, with the earlier decision preserved below.',
    evidenceIds: ['epoch-centers', 'epoch-colossus'],
  },
  'Correct the original passage’s conditional timing; it did not predict that the new capacity was already commissioned in 2025.',
);
epochReview(
  ai2027,
  'A27-018',
  {
    observation:
      'Epoch · complete ownership figures end in 2025; no mid-2026 share',
    assessment:
      'Epoch’s complete end-2025 ownership rows assign 1.155M H100-equivalents to China, with a separate speculative 0.662M estimate for smuggled Nvidia chips. The latest March 2026 rows are incomplete. This is useful evidence, but neither a mid-2026 estimate nor a geographic deployed-compute denominator, so it cannot yet resolve the stated 12% share. Do not divide China’s listed datacenters by Epoch’s partially covered world list.',
    criteria:
      'Use Epoch’s estimates of Chinese and global deployed compute on a common date and H100-equivalent basis, explicitly handling smuggled chips. If only ownership is available, label the proxy and retain its date; do not substitute an incomplete quarter for mid-2026.',
    evidenceIds: ['epoch-owners', 'epoch-centers'],
  },
  'Make Epoch canonical and identify the actual date/denominator gap rather than requiring an audited world GPU census.',
);

for (const [id, observation, assessment] of [
  [
    'A27-029',
    'Epoch · $502B modeled capital cost across covered sites',
    'Epoch estimates $502B of capital cost across its 86 listed sites. That is partial coverage and capital cost, while this claim concerns the cost of ownership of global active stock. It gives scale, not a matched $1T test; the 2026 window is still open.',
  ],
  [
    'A27-030',
    'Epoch · 16.93 GW facility capacity across covered sites',
    'Summing the latest dated observations, excluding future expansions, gives 16.93 GW facility capacity across the 86 listed sites (13.26 GW IT). This is partial coverage, not a global estimate or a contradiction of 38 GW. The 2026 window remains open.',
  ],
  [
    'A27-033',
    'Epoch · 15.49 GW facility capacity across covered US sites',
    'Latest dated records for Epoch’s 75 listed US sites total 15.49 GW of facility capacity (12.11 GW IT). These are covered sites only, not all US AI capacity. The 33-GW forecast remains pending through 2026.',
  ],
  [
    'A27-034',
    'Epoch · covered US sites imply 1.16% of the essay’s 1.34 TW baseline',
    'The covered-site subtotal is 15.49 GW / 1,340 GW = 1.16%, using the essay’s own denominator. It is not a national share estimate: unlisted capacity is missing. The 2.5% forecast remains pending through 2026.',
  ],
] as const)
  epochReview(
    ai2027,
    id,
    {
      observation,
      assessment,
      evidenceIds: ['epoch-centers'],
    },
    'Attach an explicitly partial Epoch observation, with matched units and no extrapolation from incomplete site coverage.',
  );

for (const id of ['A27-022', 'A27-023', 'A27-032', 'A27-036']) {
  const claim = ai2027.claims.find((c) => c.id === id)!;
  epochReview(
    ai2027,
    id,
    {
      criteria: `${claim.criteria} Use Epoch for chip quantities, compute equivalents and commissioned site capacity; separately establish the recipient or lab allocation.`,
      observation:
        'Epoch · hardware source set; recipient allocation still needed',
      assessment: `${claim.assessment} Epoch’s owner categories do not identify the fictional research collective or the compute rented by a particular frontier lab. Ownership cannot stand in for that allocation.`,
      evidenceIds: ['epoch-owners', 'epoch-centers'],
    },
    'Set the canonical hardware source while retaining the distinct recipient/allocation requirement.',
  );
}

for (const id of ['SA-031', 'SA-032', 'SA-033', 'SA-034', 'SA-035', 'SA-036']) {
  const claim = situational.claims.find((c) => c.id === id)!;
  epochReview(
    situational,
    id,
    {
      criteria: `${buildoutReading} Use Epoch’s dated operational site estimate for the stated ${claim.target} milestone: H100-equivalents for compute, facility power for GW, and total capital cost for dollars. Future projected capacity does not resolve it.`,
      observation: 'Epoch baseline · 1.112M H100e / 1.276 GW / $35.84B',
      assessment:
        'The later milestone remains pending. The current comparison is Colossus 2’s June 2026 operational estimate: 1.112M H100-equivalents, 1.276 GW facility power and $35.84B capital cost. Apply the same declared site-buildout proxy as the 2026 rows; do not promote planned expansions to outcomes.',
      evidenceIds: ['epoch-colossus', 'epoch-centers'],
    },
    'Register the same Epoch site-buildout convention for later milestones before their outcomes are known.',
  );
}
for (const id of ['SA-002', 'SA-003', 'SA-006']) {
  const claim = situational.claims.find((c) => c.id === id)!;
  epochReview(
    situational,
    id,
    {
      criteria: `${claim.criteria} Use Epoch’s model estimates for training FLOP and its hardware data for throughput; retain the GPT-4 baseline and distinguish raw compute from algorithmic efficiency.`,
      observation:
        'Epoch · resolve training compute separately from algorithmic gains',
      evidenceIds: ['epoch-models', 'epoch-centers'],
    },
    'Choose Epoch for the hardware/training-compute terms of the test without prematurely resolving its future condition.',
  );
}
epochReview(
  situational,
  'SA-041',
  {
    criteria:
      'Use full-year Epoch AI Chip Sales estimates in H100-equivalents, interpreting hundreds of millions as at least 200M per year by end-2030. Keep physical units and cumulative stock separate.',
    observation: 'Epoch · 2025 deliveries: 13.58M H100e / 9.57M physical units',
    assessment:
      'Pending for 2030. Epoch’s complete 2025 rows total 13.58M H100-equivalents of chip deliveries, corresponding to 9.57M physical units. This supplies a dated baseline; partial 2026 rows and cumulative ownership cannot resolve an annual production milestone.',
    evidenceIds: ['epoch-sales'],
  },
  'Specify a canonical annual flow and an explicit reading of the future numerical milestone.',
);
for (const id of ['A40-021', 'A40-038', 'A40-039']) {
  const claim = ai2040.claims.find((c) => c.id === id)!;
  epochReview(
    ai2040,
    id,
    {
      criteria: `${claim.criteria} Use Epoch’s chip-sales and ownership estimates for hardware quantities and explicitly convert to H100-equivalents where required. Inventory audit coverage, fab capacity and deployed compute are different quantities.`,
      observation:
        'Epoch · canonical hardware baseline; Plan A condition remains open',
      evidenceIds: ['epoch-sales', 'epoch-owners'],
    },
    'Establish the same hardware source for Plan A without treating a conditional future stock as already observed.',
  );
}

ai2027.sources.push(
  source(
    'metr-reward',
    'METR · Recent Frontier Models Are Reward Hacking',
    'https://metr.org/blog/2025-06-05-recent-reward-hacking/',
    '2025-06-05',
    'Controlled frontier-model tasks document evaluator tampering and knowingly invalid solutions. This establishes task-level gaming, not universal deception or the scenario’s later loss-of-control branch.',
  ),
);
reviseClaim(
  ai2027,
  'A27-012',
  {
    ...yes,
    observation: 'METR · evaluator tampering documented in June 2025',
    assessment:
      'Supported on the task-level reading. METR documented o3 modifying scoring code so incorrect submissions were marked successful, alongside evidence that it could recognize the mismatch with user intent. The June 2025 report predates the late-2025 deadline. This resolves the narrow controlled-evaluation claim, not persistent real-world deception or the fictional Agent-1’s identity.',
    evidenceIds: ['metr-reward'],
  },
  'Replace an unreviewed outcome gap with a dated independent evaluation of the specific behavior.',
);
