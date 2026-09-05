import type { Claim } from './claim-types';

export const productClaims: Claim[] = [
  {
    id: 'F-002',
    title: 'New iPads introduced in early May',
    type: 'products',
    person: 'Mark Gurman',
    personId: 'mark-gurman',
    published: '28 Mar 2024',
    dateNote: 'Secondary report date',
    target: 'Early May 2024',
    milestone: 'Launch · meaning unresolved',
    status: 'Not assessed',
    statusNote: 'Release milestone ambiguous',
    sourceState: 'Bloomberg link identified; full original not retrieved',
    summary:
      'A public March 28 report attributes an early-May iPad launch window to Gurman. The release milestone remains ambiguous.',
    context:
      'MacRumors reports an updated May window and notes earlier March and April expectations. The earlier end-of-April call is preserved with its own public quotation in case F-005.',
    assessment:
      'Apple introduced the iPad Pro on May 7 and began customer availability on May 15. The earlier pilot selected the announcement reading; rubric 0.1 withdraws that grade until the intended milestone is established.',
    review:
      'Initial review by the project assistant. Public secondary attribution and Apple’s dated release are available. The original milestone interpretation and independent review are outstanding.',
    sources: [
      {
        id: 'S1',
        label: 'MacRumors · iPads expected in May',
        url: 'https://www.macrumors.com/2024/03/28/new-ipad-models-may-launch/',
        role: 'Forecast',
        published: '2024-03-28',
        note: 'Dated secondary attribution; also records earlier timing revisions.',
        access: 'Read',
        accessed: '2026-09-04',
      },
      {
        id: 'S2',
        label: 'Bloomberg · original March 28 report',
        url: 'https://www.bloomberg.com/news/articles/2024-03-28/when-is-the-new-ipad-pro-ipad-air-coming-out-apple-plans-early-may-launch',
        role: 'Original link',
        published: '2024-03-28 (linked edition)',
        note: 'Primary source identified from MacRumors. Full content was not accessible.',
        access: 'Not retrieved',
        accessed: '2026-09-04',
      },
      {
        id: 'S3',
        label: 'Apple · new iPad Pro announcement',
        url: 'https://www.apple.com/newsroom/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/',
        role: 'Outcome',
        published: '2024-05-07',
        note: 'May 7 announcement; May 15 store availability.',
        access: 'Read',
        accessed: '2026-09-04',
      },
    ],
    rubricVersion: '0.1',
    familyId: 'ipad-2024',
    history: [
      {
        date: '2026-09-04',
        change: 'Initial pilot: Supported. Provisional · secondary source.',
      },
      {
        date: '2026-09-04',
        change:
          'Rubric 0.1: Supported → Not assessed. A favorable announcement reading cannot silently substitute for an ambiguous launch milestone.',
      },
    ],
    reviewState: 'Provisional',
    evidence: 'Attributed',
    clarity: 'Interpretation needed',
    clarityNote:
      '“Launch in early May” could mean announcement or customer availability. Those readings may change the verdict.',
    criteria:
      'Identify what “launch” meant in the original report before applying the early-May condition. Do not choose May 7 simply because it yields a match.',
    timing: {
      label: 'Ambiguous',
      note: 'May 7 announcement versus May 15 availability. “Early May” was not defined as an exact interval in advance; no day penalty is assigned.',
      observations: [
        {
          label: 'Announcement',
          date: '2024-05-07',
          sourceId: 'S3',
        },
        {
          label: 'Customer availability',
          date: '2024-05-15',
          sourceId: 'S3',
        },
      ],
    },
    checks: [
      {
        condition: 'Forecast timing',
        finding:
          'The public report attributes an early-May launch window to Gurman and records earlier revisions.',
        sourceIds: ['S1'],
      },
      {
        condition: 'Actual milestone dates',
        finding:
          'Announcement: May 7. Store availability: May 15. These are different resolution events.',
        sourceIds: ['S3'],
      },
    ],
  },
  {
    id: 'F-003',
    title: 'M4 chip in the next iPad Pro',
    type: 'products',
    person: 'Mark Gurman',
    personId: 'mark-gurman',
    published: '29 Apr 2024',
    dateNote: 'Public quotation date',
    target: 'Next iPad Pro',
    milestone: 'Chip specification',
    status: 'Supported',
    statusNote: 'Provisional · attributed quote',
    sourceState: 'Dated public quotation found; Bloomberg original not read',
    summary:
      'A public April 29 article reproduces Gurman’s expectation that the next iPad Pro could use M4. Apple subsequently announced that specification.',
    context:
      '9to5Mac attributes the comment to Gurman’s Sunday report. It supplies an accessible quotation dated before the announcement. The prior MacRumors date conflict remains in the history but is no longer the sole evidence of the call.',
    assessment:
      'The new iPad Pro used M4, supporting the specification expectation. The verbal hedge is preserved; the case receives no inferred probability or timing-prediction credit.',
    review:
      'Provisional assessment by the project assistant from a public attributed quotation and Apple’s outcome source. No pre-event archived snapshot or independent second review is recorded.',
    sources: [
      {
        id: 'S1',
        label: 'MacRumors · M4 iPad Pro report',
        url: 'https://www.macrumors.com/2024/04/28/ipad-pro-m4-chip-and-apple-pencil-haptic-rumors/',
        role: 'Context',
        published: 'Conflicting date signals',
        note: 'Date conflict observed September 4, 2026: URL says April 28; displayed date says May 14.',
        access: 'Read',
        accessed: '2026-09-04',
      },
      {
        id: 'S2',
        label: 'Bloomberg · linked Power On newsletter',
        url: 'https://www.bloomberg.com/news/newsletters/2024-04-28/apple-rivals-retool-to-compete-with-iphone-and-vision-pro-ios-18-and-ai-details-lvjhucsv',
        role: 'Original link',
        published: '2024-04-28 (linked edition)',
        note: 'Original source lead; full text was not accessible.',
        access: 'Not retrieved',
        accessed: '2026-09-04',
      },
      {
        id: 'S3',
        label: 'Apple · M4 introduction',
        url: 'https://www.apple.com/newsroom/2024/05/apple-introduces-m4-chip/',
        role: 'Outcome',
        published: '2024-05-07',
        note: 'Official announcement dated May 7, 2024.',
        access: 'Read',
        accessed: '2026-09-04',
      },
      {
        id: 'S4',
        label: '9to5Mac · dated quotation of Gurman',
        url: 'https://9to5mac.com/2024/04/29/m4-ipad-pro-rumor/',
        role: 'Forecast',
        published: '2024-04-29',
        note: 'Filipe Espósito reproduces Gurman’s M4 comment. Read publicly; it is an attributed quotation, not a direct reading of Bloomberg.',
        access: 'Read',
        accessed: '2026-09-04',
      },
    ],
    rubricVersion: '0.1',
    familyId: 'ipad-2024',
    history: [
      {
        date: '2026-09-04',
        change: 'Initial pilot: Needs source. Timestamp conflict.',
      },
      {
        date: '2026-09-04',
        change:
          'Rubric 0.1: Needs source → Supported (provisional). Added a public pre-announcement quotation; evaluated only the chip specification, with no inferred date or numeric probability.',
      },
    ],
    reviewState: 'Provisional',
    evidence: 'Attributed',
    clarity: 'Clear',
    clarityNote:
      'The next iPad Pro containing M4 rather than M3 has a clear specification test. The quoted confidence is verbal, not numerical.',
    criteria:
      'The next iPad Pro generation uses M4 rather than M3. Evaluate this specification only; the quoted excerpt makes no separate calendar-date prediction.',
    quote:
      'I’m hearing there is a strong possibility that the chip in the new iPad Pro will be the M4, not the M3.',
    quoteSourceId: 'S4',
    timing: {
      label: 'Not specified',
      note: 'The quoted claim forecasts the chip in the next generation. The known May 7 event date is context, not a separate timing prediction.',
      observations: [
        {
          label: 'M4 specification announced',
          date: '2024-05-07',
          sourceId: 'S3',
        },
      ],
    },
    checks: [
      {
        condition: 'Attributed forecast',
        finding:
          'The dated April 29 article quotes Gurman’s M4 expectation with its verbal hedge intact.',
        sourceIds: ['S4'],
      },
      {
        condition: 'Observed specification',
        finding:
          'Apple’s May 7 announcement identifies M4 as the chip in the new iPad Pro.',
        sourceIds: ['S3'],
      },
    ],
  },
  {
    id: 'F-004',
    title: 'First M4 Macs arrive in late 2024',
    type: 'products',
    person: 'Mark Gurman',
    personId: 'mark-gurman',
    published: '11 Apr 2024',
    dateNote: 'Secondary report date',
    target: 'Late 2024',
    milestone: 'First Mac release',
    status: 'Supported',
    statusNote: 'Provisional · secondary source',
    sourceState: 'Contemporary secondary attribution; original still needed',
    summary:
      'MacRumors attributed a late-2024 start for M4 Mac releases to Gurman. This case evaluates only the first M4 Mac arrival, not every model on the wider roadmap.',
    context:
      'The report describes a staged rollout across the Mac family. Each model-specific deadline would need a separate linked claim; one matching release does not validate the entire roadmap.',
    assessment:
      'Apple announced an M4 iMac on October 28, 2024, with customer availability beginning November 8. Both milestones fall in late 2024 and support this narrow reading of the reported call.',
    review:
      'Provisional historical assessment using secondary attribution and a primary outcome source. Original forecast capture and independent review remain outstanding.',
    sources: [
      {
        id: 'S1',
        label: 'MacRumors · M4 Mac roadmap',
        url: 'https://www.macrumors.com/2024/04/11/m4-ai-chips-late-2024/',
        role: 'Forecast',
        published: '2024-04-11',
        note: 'April 11, 2024 report attributing the late-2024 window to Gurman.',
        access: 'Read',
        accessed: '2026-09-04',
      },
      {
        id: 'S2',
        label: 'Apple · M4 iMac announcement',
        url: 'https://www.apple.com/newsroom/2024/10/apple-introduces-new-imac-supercharged-by-m4-and-apple-intelligence/',
        role: 'Outcome',
        published: '2024-10-28',
        note: 'October 28, 2024 announcement; November 8 customer availability.',
        access: 'Read',
        accessed: '2026-09-04',
      },
    ],
    rubricVersion: '0.1',
    familyId: 'm4-mac-2024',
    history: [
      {
        date: '2026-09-04',
        change: 'Initial pilot: Supported. Provisional · secondary source.',
      },
      {
        date: '2026-09-04',
        change:
          'Applied rubric 0.1; retained Supported as provisional, and recorded the qualitative timing interpretation.',
      },
    ],
    reviewState: 'Provisional',
    evidence: 'Attributed',
    clarity: 'Interpretation needed',
    clarityNote:
      '“Late 2024” is a broad qualitative period. October/November fit the reading used here; no exact starting boundary or daily precision is claimed.',
    criteria:
      'The first M4 Mac arrives in late 2024. This narrow claim excludes later models in the wider roadmap. October/November are treated as late 2024; this is a retrospective interpretation.',
    timing: {
      label: 'On time',
      note: 'October 28 announcement and November 8 availability fit the stated late-2024 period. Exact day error is not computed from a vague boundary.',
      observations: [
        {
          label: 'iMac announcement',
          date: '2024-10-28',
          sourceId: 'S2',
        },
        {
          label: 'Customer availability',
          date: '2024-11-08',
          sourceId: 'S2',
        },
      ],
    },
    checks: [
      {
        condition: 'Forecast window',
        finding:
          'The April 11 report attributes a late-2024 start to the M4 Mac rollout to Gurman.',
        sourceIds: ['S1'],
      },
      {
        condition: 'First qualifying Mac',
        finding:
          'Apple announced an M4 iMac October 28, with availability November 8.',
        sourceIds: ['S2'],
      },
    ],
  },
  {
    id: 'F-005',
    title: 'New iPad Pro by the end of April',
    type: 'products',
    person: 'Mark Gurman',
    personId: 'mark-gurman',
    published: '11 Mar 2024',
    dateNote: 'Public quotation date',
    target: 'End of March / April',
    milestone: 'Launch (stage ambiguous)',
    status: 'Contradicted',
    statusNote: 'Provisional · timing miss',
    sourceState: 'Public quotation of the March 10 newsletter',
    summary:
      'A public quotation placed the new iPad hardware around the end of March or in April. The iPad Pro arrived in May.',
    context:
      'This records the earlier expectation separately from F-002’s revised May window. It isolates the iPad Pro arrival claim; other specifications and accessories in the report are not graded here.',
    quote: 'Look for that new hardware around the end of March or in April',
    quoteSourceId: 'S1',
    assessment:
      'Using April 30 as the last day of the stated month, the May 7 announcement was 7 days late and May 15 customer availability was 15 days late. Both release-stage readings miss the month. The hardware did arrive; that does not turn the dated forecast into a success.',
    review:
      'Provisional assessment by the project assistant. April 30 is the explicit calendar-month reading used retrospectively; no grace period was added to “around.” This evaluates the published expectation, not whether Apple changed an internal plan.',
    rubricVersion: '0.1',
    clarity: 'Interpretation needed',
    clarityNote:
      'The release stage is ambiguous, but both announcement and availability fall after April. The timing-miss verdict is unchanged under those two readings.',
    evidence: 'Attributed',
    reviewState: 'Provisional',
    criteria:
      'Interpret “or in April” as ending April 30, 2024, with no post-hoc grace period. Test announcement and customer availability separately because “new hardware” does not uniquely identify a release stage.',
    familyId: 'ipad-2024',
    timing: {
      label: 'Late',
      note: '7 days late to announcement; 15 days late to customer availability. These are two milestone readings, not a statistical confidence interval.',
      rule: {
        kind: 'by',
        end: '2024-04-30',
      },
      observations: [
        {
          label: 'Announcement',
          date: '2024-05-07',
          sourceId: 'S2',
        },
        {
          label: 'Customer availability',
          date: '2024-05-15',
          sourceId: 'S2',
        },
      ],
    },
    checks: [
      {
        condition: 'Stated forecast period',
        finding:
          'The March 11 article quotes the March 10 newsletter’s end-of-March or April expectation.',
        sourceIds: ['S1'],
      },
      {
        condition: 'Observed dates',
        finding:
          'Apple announced the new iPad Pro May 7 and specified May 15 availability; both are later than April 30.',
        sourceIds: ['S2'],
      },
      {
        condition: 'Later revision',
        finding:
          'The March 28 public report records a new early-May window. The earlier April call is retained as F-005.',
        sourceIds: ['S3'],
      },
    ],
    sources: [
      {
        id: 'S1',
        label: 'MacRumors · Gurman’s March/April quotation',
        url: 'https://www.macrumors.com/2024/03/11/new-ipads-end-of-march-or-april-gurman/',
        role: 'Forecast',
        published: '2024-03-11',
        note: 'A public quotation of the prior Sunday’s newsletter. The launch-stage ambiguity is retained.',
        access: 'Read',
        accessed: '2026-09-04',
      },
      {
        id: 'S2',
        label: 'Apple · iPad Pro announcement and availability',
        url: 'https://www.apple.com/newsroom/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/',
        role: 'Outcome',
        published: '2024-05-07',
        note: 'Official announcement May 7; store availability May 15.',
        access: 'Read',
        accessed: '2026-09-04',
      },
      {
        id: 'S3',
        label: 'MacRumors · revised May window',
        url: 'https://www.macrumors.com/2024/03/28/new-ipad-models-may-launch/',
        role: 'Context',
        published: '2024-03-28',
        note: 'A later revision of the same release sequence, not a replacement for the earlier record.',
        access: 'Read',
        accessed: '2026-09-04',
      },
    ],
    history: [
      {
        date: '2026-09-04',
        change:
          'Added under rubric 0.1 to preserve an earlier timing miss. Linked to F-002 and F-003 through the same iPad release family.',
      },
    ],
  },
];
