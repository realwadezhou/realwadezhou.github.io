import corpus from '../public/data/kuo-forecasts.json';
import additional from '../public/data/kuo-outcome-sources.json';
import { launchById } from './apple-launches';
import type { Claim, Source } from './claim-types';
import type { TimingLabel, Verdict } from './rubric';

export const kuoCorpus = corpus;
export const kuoClaims: Claim[] = corpus.claims.map((row) => {
  const forecast = corpus.sources[row.sourceId as keyof typeof corpus.sources];
  const launches = row.launchIds.map((id) => {
    const launch = launchById.get(id);
    if (!launch) throw new Error(`${row.id}: unknown launch ${id}`);
    return launch;
  });
  const sources: Source[] = [
    {
      id: 'S1',
      label: forecast.label,
      url: forecast.url,
      published: forecast.date,
      accessed: forecast.accessed,
      role: 'Forecast',
      access: 'Read',
      note: forecast.note,
    },
  ];
  for (const launch of launches) {
    for (const source of launch.sources) {
      if (sources.some((item) => item.url === source.url)) continue;
      sources.push({
        id: `S${sources.length + 1}`,
        label: source.title,
        url: source.url,
        role: 'Outcome',
        access: 'Read',
        published: source.publishedText,
        accessed: source.accessed,
        note: `Launch catalog: ${launch.product}. ${launch.notes || 'Apple announcement and launch specifications.'}`,
      });
    }
  }
  for (const extra of additional.sources.filter((source) =>
    source.claimIds.includes(row.id),
  )) {
    sources.push({
      id: `S${sources.length + 1}`,
      label: extra.label,
      url: extra.url,
      role: extra.role as Source['role'],
      access: 'Read',
      published: extra.published,
      accessed: extra.accessed,
      note: extra.note,
    });
  }
  const outcomeSources = sources.filter((source) => source.role === 'Outcome');
  const observations = launches.flatMap((launch) => {
    const sourceId = sources.find(
      (source) => source.url === launch.milestoneSources.announcementDate,
    )!.id;
    const availableSource = sources.find(
      (source) => source.url === launch.milestoneSources.availabilityDate,
    )?.id;
    return [
      {
        label: `${launch.product} · announcement`,
        date: launch.announcementDate,
        sourceId,
      },
      ...(availableSource &&
      launch.availabilityDate &&
      launch.availabilityPrecision === 'day' &&
      launch.availabilityDate <= corpus.asOf
        ? [
            {
              label: `${launch.product} · ${launch.availabilityMilestone.toLowerCase()}`,
              date: launch.availabilityDate,
              sourceId: availableSource,
            },
          ]
        : []),
    ];
  });
  for (const extra of additional.sources.filter(
    (item) => item.claimIds.includes(row.id) && item.observationDate,
  )) {
    observations.push({
      label: extra.observationLabel!,
      date: extra.observationDate!,
      sourceId: sources.find((item) => item.url === extra.url)!.id,
    });
  }
  const ambiguity = row.status === 'Unresolvable';
  const incomplete = !outcomeSources.length || row.status === 'Not assessed';
  return {
    id: row.id,
    title: row.title,
    type: 'products',
    person: 'Ming-Chi Kuo',
    personId: 'ming-chi-kuo',
    published: forecast.date,
    probability: row.probability
      ? { ...row.probability, kind: 'lower-bound' }
      : undefined,
    dateNote:
      forecast.evidence === 'Direct'
        ? 'Direct dated source'
        : 'Dated attribution',
    target: row.target,
    milestone: /production|manufactur/i.test(`${row.target} ${row.title}`)
      ? 'Manufacturing milestone; not retail availability'
      : row.timing === 'Not specified'
        ? 'Feature / product condition'
        : 'See milestone distinctions',
    status: row.status as Verdict,
    statusNote: row.qualifier,
    sourceState: forecast.note,
    summary: `${row.title}. Qualifier: ${row.qualifier}.`,
    context: `Normalized paraphrase of the cited report, collected retrospectively. ${row.note || 'Scope is the named generation or event; an unrelated later product does not fulfill it.'}`,
    assessment: row.outcome,
    review:
      'Initial assessment by Codex on September 7, 2026. No independent human review. This is a selective historical corpus; related details and revisions are correlated.',
    sources,
    rubricVersion: '0.1',
    clarity:
      row.status === 'Not assessed'
        ? 'Not assessed'
        : ambiguity
          ? 'Unresolvable'
          : row.note || row.qualifier !== 'Reported expectation'
            ? 'Interpretation needed'
            : 'Clear',
    clarityNote:
      row.note ||
      (row.kind === 'development'
        ? 'Internal development is not independently observable from the shipped product.'
        : 'Evaluate the recorded product condition with the source qualifier retained.'),
    evidence: incomplete
      ? 'Incomplete'
      : (forecast.evidence as Claim['evidence']),
    reviewState: 'Provisional',
    criteria: `${row.title}. Target: ${row.target}. ${row.kind !== 'expectation' ? 'This is a possibility or internal-development report and is excluded from binary expectation totals.' : 'Compare the stated condition with the linked outcome evidence; preserve any missed window even if the product arrived later.'}`,
    familyId: row.familyId,
    category: row.category,
    kind: row.kind as Claim['kind'],
    launchIds: row.launchIds,
    timing: {
      label: row.timing as TimingLabel,
      note: `${row.timing}. ${row.deadline ? `Normalized window ends ${row.deadline}${row.start ? ` and begins ${row.start}` : ''}. ` : ''}${row.note || ''} Announcement and customer availability are shown separately below; these are reference dates, not interchangeable milestones.`,
      observations,
    },
    checks: [
      {
        condition: 'Recovered claim',
        finding: `${row.title}. ${row.qualifier}.`,
        sourceIds: ['S1'],
      },
      {
        condition: outcomeSources.length
          ? 'Outcome comparison'
          : 'Resolution remains limited',
        finding: row.outcome,
        sourceIds: outcomeSources.length
          ? outcomeSources.map((source) => source.id)
          : sources.map((source) => source.id),
      },
    ],
    history: [
      {
        date: corpus.asOf,
        change: `Added to historical corpus. ${row.status}; provisional. ${row.note}`,
      },
    ],
  };
});
