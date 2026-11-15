import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import {
  evaluateTiming,
  verdicts,
  clarityLevels,
  evidenceLevels,
  reviewStates,
  timingLabels,
  RUBRIC_VERSION,
} from '../lib/rubric.ts';
const require = createRequire(import.meta.url);
const ts = require('typescript');
// Load the local seed modules without installing a separate test runtime.
function dataModule(path, dependencies = {}) {
  const output = ts.transpileModule(
    fs.readFileSync(new URL(path, import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  const exports = {};
  new Function('exports', 'require', output)(exports, (id) => dependencies[id]);
  return exports;
}
const { productClaims } = dataModule('../lib/product-claims.ts');
const catalog = JSON.parse(
  fs.readFileSync(
    new URL('../public/data/apple-launches.json', import.meta.url),
    'utf8',
  ),
);
const corpus = JSON.parse(
  fs.readFileSync(
    new URL('../public/data/gurman-forecasts.json', import.meta.url),
    'utf8',
  ),
);
const additional = JSON.parse(
  fs.readFileSync(
    new URL('../public/data/gurman-outcome-sources.json', import.meta.url),
    'utf8',
  ),
);
const launchById = new Map(
  catalog.launches.map((launch) => [launch.id, launch]),
);
const { gurmanClaims } = dataModule('../lib/gurman-claims.ts', {
  '../public/data/gurman-forecasts.json': corpus,
  '../public/data/gurman-outcome-sources.json': additional,
  './apple-launches': { launchById },
});
const kuoCorpus = JSON.parse(
  fs.readFileSync(
    new URL('../public/data/kuo-forecasts.json', import.meta.url),
    'utf8',
  ),
);
const kuoAdditional = JSON.parse(
  fs.readFileSync(
    new URL('../public/data/kuo-outcome-sources.json', import.meta.url),
    'utf8',
  ),
);
const { kuoClaims } = dataModule('../lib/kuo-claims.ts', {
  '../public/data/kuo-forecasts.json': kuoCorpus,
  '../public/data/kuo-outcome-sources.json': kuoAdditional,
  './apple-launches': { launchById },
});
const { paginate } = dataModule('../lib/pagination.ts');
const { claims } = dataModule('../lib/claims.ts', {
  './product-claims': { productClaims },
  './gurman-claims': { gurmanClaims },
  './kuo-claims': { kuoClaims },
});
const deadline = { kind: 'by', end: '2024-06-30' };
const month = { kind: 'during', start: '2024-06-01', end: '2024-06-30' };

test('a deadline permits earlier arrival; a during-window does not', () => {
  assert.deepEqual(evaluateTiming(deadline, '2024-05-28', '2024-07-10'), {
    label: 'On time',
    days: 0,
  });
  assert.deepEqual(evaluateTiming(month, '2024-05-28', '2024-07-10'), {
    label: 'Early',
    days: -4,
  });
});
test('window endpoints are inclusive', () => {
  for (const day of ['2024-06-01', '2024-06-30'])
    assert.deepEqual(evaluateTiming(month, day, '2024-07-10'), {
      label: 'On time',
      days: 0,
    });
});
test('late arrival has a signed delay to the deadline', () => {
  assert.deepEqual(evaluateTiming(deadline, '2024-07-10', '2024-07-10'), {
    label: 'Late',
    days: 10,
  });
});
test('unobserved events are pending through the deadline, overdue after it', () => {
  assert.deepEqual(evaluateTiming(deadline, null, '2024-06-30'), {
    label: 'Pending',
    days: null,
  });
  assert.deepEqual(evaluateTiming(deadline, null, '2024-07-10'), {
    label: 'Overdue',
    days: 10,
  });
});
test('calendar arithmetic handles leap days and is independent of daylight saving', () => {
  assert.equal(
    evaluateTiming(
      { kind: 'by', end: '2024-02-28' },
      '2024-03-01',
      '2024-03-01',
    ).days,
    2,
  );
  assert.equal(
    evaluateTiming(
      { kind: 'by', end: '2024-03-09' },
      '2024-03-11',
      '2024-03-11',
    ).days,
    2,
  );
});
test('invalid dates, inverted windows, and future observations fail closed', () => {
  assert.throws(() =>
    evaluateTiming({ kind: 'by', end: '2024-02-30' }, null, '2024-03-01'),
  );
  assert.throws(() =>
    evaluateTiming(
      { kind: 'during', start: '2024-07-01', end: '2024-06-30' },
      null,
      '2024-07-02',
    ),
  );
  assert.throws(() => evaluateTiming(deadline, '2024-07-10', '2024-07-09'));
});
test('all pilot labels come from the published rubric, with a version and review history', () => {
  assert.equal(new Set(claims.map((c) => c.id)).size, claims.length);
  for (const c of claims) {
    for (const [field, allowed] of [
      ['status', verdicts],
      ['clarity', clarityLevels],
      ['evidence', evidenceLevels],
      ['reviewState', reviewStates],
    ])
      assert.ok(
        allowed.some((x) => x.label === c[field]),
        `${c.id}: ${field}`,
      );
    assert.ok(timingLabels.some((x) => x.label === c.timing.label));
    assert.equal(c.rubricVersion, RUBRIC_VERSION);
    assert.ok(c.history.length && c.criteria && c.familyId);
  }
});
test('every factual check, quote, and timing observation has a readable supporting source', () => {
  for (const c of claims) {
    const source = (id) => c.sources.find((s) => s.id === id);
    assert.equal(new Set(c.sources.map((s) => s.id)).size, c.sources.length);
    const referenced = [
      ...c.checks.flatMap((check) => {
        assert.ok(check.sourceIds.length);
        return check.sourceIds;
      }),
      ...c.timing.observations.map((o) => o.sourceId),
      ...(c.quote ? [c.quoteSourceId] : []),
    ];
    for (const id of referenced) {
      assert.ok(source(id), `${c.id}: unknown source ${id}`);
      assert.equal(source(id).access, 'Read', `${c.id}: unread evidence ${id}`);
    }
    for (const s of c.sources) {
      assert.ok(s.published && s.accessed && s.note);
      assert.equal(new URL(s.url).protocol, 'https:');
    }
    if (['Supported', 'Contradicted'].includes(c.status)) {
      for (const role of ['Forecast', 'Outcome'])
        assert.ok(
          c.sources.some((s) => s.role === role && s.access === 'Read'),
          `${c.id}: missing ${role}`,
        );
    }
  }
});
test('both iPad release milestones miss April; the later revision does not erase the earlier call', () => {
  const earlier = claims.find((c) => c.id === 'F-005'),
    revised = claims.find((c) => c.id === 'F-002');
  assert.equal(earlier.status, 'Contradicted');
  assert.equal(earlier.familyId, revised.familyId);
  assert.deepEqual(
    earlier.timing.observations.map(
      (o) => evaluateTiming(earlier.timing.rule, o.date, '2026-09-04').days,
    ),
    [7, 15],
  );
  assert.equal(revised.status, 'Not assessed');
  assert.ok(
    revised.history.some((h) => h.change.includes('Supported → Not assessed')),
  );
});
test('a supported chip call does not acquire an invented calendar forecast', () => {
  const chip = claims.find((c) => c.id === 'F-003');
  assert.equal(chip.status, 'Supported');
  assert.equal(chip.timing.label, 'Not specified');
  assert.equal(chip.timing.rule, undefined);
});

test('launch dates have explicit source bindings, precision, and future-date handling', () => {
  assert.equal(launchById.size, catalog.launches.length);
  for (const launch of catalog.launches) {
    assert.ok(launch.sources.length && launch.verifiedAt);
    const urls = new Set(launch.sources.map((source) => source.url));
    for (const field of ['announcementDate', 'orderDate', 'availabilityDate']) {
      if (!launch[field]) {
        assert.equal(launch.milestoneSources[field], null);
        continue;
      }
      assert.match(launch[field], /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(
        new Date(`${launch[field]}T00:00:00Z`).toISOString().slice(0, 10),
        launch[field],
      );
      assert.ok(
        urls.has(launch.milestoneSources[field]),
        `${launch.id}: missing ${field} evidence`,
      );
    }
    assert.ok(launch.announcementDate <= catalog.asOf);
    if (launch.orderDate)
      assert.ok(launch.announcementDate <= launch.orderDate);
    if (launch.availabilityDate) {
      assert.ok(launch.announcementDate <= launch.availabilityDate);
      if (launch.availabilityDate > catalog.asOf)
        assert.equal(launch.availabilityStatus, 'Scheduled');
      else assert.notEqual(launch.availabilityStatus, 'Scheduled');
    }
    for (const source of launch.sources)
      assert.ok(source.title && source.publishedDate && source.accessed);
  }
  assert.equal(launchById.get('homepod-mini').availabilityPrecision, 'week');
  assert.equal(launchById.get('airpods-1').availabilityDate, null);
  assert.equal(launchById.get('airtag-2').availabilityDate, null);
  assert.equal(launchById.get('watch-original').announcementDate, '2014-09-09');
  assert.equal(launchById.get('watch-original').availabilityDate, '2015-04-24');
});
test('every forecast-launch and supplementary evidence link resolves', () => {
  for (const claim of claims)
    for (const id of claim.launchIds || [])
      assert.ok(launchById.has(id), `${claim.id}: ${id}`);
  const ids = new Set(claims.map((claim) => claim.id));
  for (const source of [...additional.sources, ...kuoAdditional.sources]) {
    assert.ok(source.claimIds.length);
    for (const id of source.claimIds) assert.ok(ids.has(id));
  }
  for (const claim of gurmanClaims)
    for (const observation of claim.timing.observations)
      assert.ok(observation.date <= catalog.asOf);
});
test('ambiguous season, uncertain attribution, and post-event leads do not enter binary verdicts', () => {
  const byTitle = (title) =>
    gurmanClaims.find((claim) => claim.title === title);
  assert.equal(byTitle('M4 MacBook Air in spring 2025').status, 'Unresolvable');
  assert.equal(
    byTitle('Next low-cost iPhone expected below $500').status,
    'Not assessed',
  );
  assert.equal(
    byTitle('USB-C Mac accessories at October 2023 event').status,
    'Not assessed',
  );
  const earlier = byTitle('M3 Pro/Max MacBook Pros in early-to-spring 2024');
  const revised = byTitle('Mac announcement on October 30 or 31');
  assert.equal(earlier.familyId, revised.familyId);
  assert.equal(earlier.status, 'Contradicted');
  assert.equal(revised.status, 'Supported');
});

test('row limits include every match in All mode and clamp pages after filtering', () => {
  const rows = Array.from({ length: 216 }, (_, i) => i);
  assert.deepEqual(paginate(rows, 8, 'all'), {
    pageCount: 1,
    current: 0,
    visible: rows,
  });
  assert.deepEqual(paginate(rows, 8, 25).visible, rows.slice(200));
  assert.deepEqual(paginate(rows.slice(0, 3), 8, 10), {
    pageCount: 1,
    current: 0,
    visible: [0, 1, 2],
  });
  assert.deepEqual(paginate([], 4, 'all'), {
    pageCount: 1,
    current: 0,
    visible: [],
  });
  for (const size of [10, 25, 50, 100]) {
    const pages = Array.from(
      { length: paginate(rows, 0, size).pageCount },
      (_, page) => paginate(rows, page, size).visible,
    );
    assert.deepEqual(pages.flat(), rows);
  }
});
test('Kuo revisions retain the original forecast and distinguish production from launch', () => {
  const claim = (id) => kuoClaims.find((row) => row.id === id);
  assert.equal(kuoClaims.length, 290);
  assert.ok(Object.keys(kuoCorpus.sources).length > 50);
  for (const [earlier, later] of [
    ['K-126', 'K-152'],
    ['K-171', 'K-172'],
    ['K-177', 'K-178'],
  ]) {
    assert.equal(claim(earlier).familyId, claim(later).familyId);
    assert.equal(claim(earlier).status, 'Contradicted');
    assert.equal(claim(later).status, 'Supported');
    assert.ok(claim(earlier).published < claim(later).published);
  }
  for (const row of kuoClaims.filter((row) => /production/i.test(row.title)))
    assert.equal(row.status, 'Not assessed', row.id);
  assert.equal(claim('K-158').timing.label, 'Early');
  assert.equal(claim('K-200').status, 'Unresolvable');
  assert.deepEqual(claim('K-046').probability, {
    kind: 'lower-bound',
    value: 0.7,
    strict: true,
  });
  assert.deepEqual(claim('K-048').probability, {
    kind: 'lower-bound',
    value: 0.5,
    strict: true,
  });
  assert.ok(
    claim('K-114').timing.observations.some((o) => o.date === '2020-06-22'),
  );
  for (const row of kuoClaims) {
    assert.equal(row.personId, 'ming-chi-kuo');
    assert.ok(row.published <= kuoCorpus.asOf);
    for (const observation of row.timing.observations)
      assert.ok(observation.date <= kuoCorpus.asOf);
    assert.equal(row.reviewState, 'Provisional');
  }
});

test('November launch review preserves history, missed windows, and deferred software', () => {
  const g = (id) => gurmanClaims.find((row) => row.id === id);
  const k = (id) => kuoClaims.find((row) => row.id === id);
  assert.equal(corpus.asOf, '2026-11-13');
  assert.equal(kuoCorpus.asOf, '2026-11-13');
  assert.equal(gurmanClaims.length, 329);
  assert.equal(g('G-192').status, 'Supported');
  assert.deepEqual(g('G-192').history.map((r) => r.date), ['2026-09-05', '2026-11-13']);
  assert.match(g('G-192').history[0].change, /Pending/);
  assert.equal(k('K-213').status, 'Supported');
  assert.equal(k('K-214').status, 'Contradicted');
  assert.equal(k('K-215').status, 'Supported');
  assert.equal(k('K-216').status, 'Unresolvable');
  assert.equal(k('K-137').status, 'Contradicted');
  assert.equal(g('G-259').status, 'Contradicted');
  assert.equal(g('G-259').timing.label, 'Late');
  for (const id of ['G-285', 'G-308', 'G-312', 'G-313'])
    assert.equal(g(id).status, 'Pending', id);
  assert.equal(g('G-218').kind, 'possibility');
  assert.equal(g('G-218').status, 'Supported');
  assert.equal(launchById.get('siri-ai').availabilityDate, '2026-09-14');
  assert.match(launchById.get('siri-ai').availabilityMilestone, /beta/);
  assert.equal(launchById.get('apple-home-collection').availabilityDate, null);
  for (const claim of [...gurmanClaims, ...kuoClaims]) {
    const initial = claim.history[0].date;
    assert.ok(initial >= claim.published, claim.id);
    assert.equal(claim.reviewState, 'Provisional');
  }
});
