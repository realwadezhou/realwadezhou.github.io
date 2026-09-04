import type { Claim } from './claims';

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
    milestone: 'Announcement',
    status: 'Supported',
    statusNote: 'Provisional · secondary source',
    sourceState: 'Bloomberg link identified; full original not retrieved',
    summary:
      'A March 28 report attributes an early-May introduction window for new iPads to Gurman. This case evaluates the announcement timing only.',
    context:
      'MacRumors reports an updated May window and notes earlier March and April expectations. Those earlier versions need their own sources; they have not been erased by this later call.',
    assessment:
      'Apple announced the new iPad Pro on May 7, 2024, and stated store availability would start May 15. The announcement supports an early-May introduction reading; retail availability is a distinct event. The primary forecast and pre-event archive still require verification.',
    review:
      'Provisional historical assessment by the project assistant. No independent second review or archived pre-event copy. This case does not assess the full report’s product specifications.',
    sources: [
      {
        label: 'MacRumors · iPads expected in May',
        url: 'https://www.macrumors.com/2024/03/28/new-ipad-models-may-launch/',
        note: 'Dated secondary attribution; also records earlier timing revisions.',
      },
      {
        label: 'Bloomberg · original March 28 report',
        url: 'https://www.bloomberg.com/news/articles/2024-03-28/when-is-the-new-ipad-pro-ipad-air-coming-out-apple-plans-early-may-launch',
        note: 'Primary source identified from MacRumors. Full content was not accessible.',
      },
      {
        label: 'Apple · new iPad Pro announcement',
        url: 'https://www.apple.com/li/newsroom/2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro/',
        note: 'May 7 announcement; May 15 store availability.',
      },
    ],
  },
  {
    id: 'F-003',
    title: 'M4 chip in the next iPad Pro',
    type: 'products',
    person: 'Mark Gurman',
    personId: 'mark-gurman',
    published: 'Date under review',
    dateNote: 'April 28 / May 14 conflict',
    target: '7 May 2024',
    milestone: 'Specification announcement',
    status: 'Needs source',
    statusNote: 'Timestamp conflict',
    sourceState:
      'Newsletter link found; original wording and date need verification',
    summary:
      'Secondary coverage attributes an M4 expectation to Gurman ahead of Apple’s May 7 event. The accessible page has conflicting date signals, so the advance call is not yet verified.',
    context:
      'The MacRumors URL and linked newsletter point to April 28, 2024, but the page currently displays May 14, after the event. It describes a strong possibility, not a numeric probability. We cannot establish publication chronology from the URL alone.',
    assessment:
      'Apple announced M4 in the iPad Pro on May 7. The specification matches the reported expectation, but outcome agreement does not resolve the source-date conflict. A pre-event snapshot or the dated original is needed before assigning a verdict.',
    review:
      'Source review remains open. No probability, exact lead time, or success verdict assigned. Related to the 2024 iPad reporting sequence in F-002.',
    sources: [
      {
        label: 'MacRumors · M4 iPad Pro report',
        url: 'https://www.macrumors.com/2024/04/28/ipad-pro-m4-chip-and-apple-pencil-haptic-rumors/',
        note: 'Date conflict observed September 4, 2026: URL says April 28; displayed date says May 14.',
      },
      {
        label: 'Bloomberg · linked Power On newsletter',
        url: 'https://www.bloomberg.com/news/newsletters/2024-04-28/apple-rivals-retool-to-compete-with-iphone-and-vision-pro-ios-18-and-ai-details-lvjhucsv',
        note: 'Original source lead; full text was not accessible.',
      },
      {
        label: 'Apple · M4 introduction',
        url: 'https://www.apple.com/newsroom/2024/05/apple-introduces-m4-chip/',
        note: 'Official announcement dated May 7, 2024.',
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
        label: 'MacRumors · M4 Mac roadmap',
        url: 'https://www.macrumors.com/2024/04/11/m4-ai-chips-late-2024/',
        note: 'April 11, 2024 report attributing the late-2024 window to Gurman.',
      },
      {
        label: 'Apple · M4 iMac announcement',
        url: 'https://www.apple.com/newsroom/2024/10/apple-introduces-new-imac-supercharged-by-m4-and-apple-intelligence/',
        note: 'October 28, 2024 announcement; November 8 customer availability.',
      },
    ],
  },
];
