import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import * as data from '../lib/essay-data.ts';
import { verdicts, clarityLevels, timingLabels } from '../lib/rubric.ts';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const compiled = ts.transpileModule(
  fs.readFileSync(new URL('../lib/essays.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.ESNext } },
).outputText;
const moduleSource = compiled.replace(
  "'./essay-data'",
  JSON.stringify(new URL('../lib/essay-data.ts', import.meta.url).href),
);
const { essays, essayCounts, ESSAY_AS_OF } = await import(
  `data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`
);

test('the three essay routes have complete, unique, attributable records', () => {
  assert.deepEqual(
    essays.map((e) => e.slug),
    ['ai-2027', 'ai-2040-plan-a', 'situational-awareness'],
  );
  const ids = new Set();
  for (const essay of essays) {
    assert.ok(
      essay.summary.length &&
        essay.authors &&
        essay.published &&
        essay.interpretation,
    );
    assert.equal(
      new Set(essay.sources.map((s) => s.id)).size,
      essay.sources.length,
    );
    for (const claim of essay.claims) {
      assert.ok(!ids.has(claim.id), `duplicate ${claim.id}`);
      ids.add(claim.id);
      assert.ok(
        claim.title &&
          claim.family &&
          claim.target &&
          claim.criteria &&
          claim.assessment &&
          claim.section,
      );
      for (const [value, vocabulary] of [
        [claim.grade, verdicts],
        [claim.clarity, clarityLevels],
        [claim.timing, timingLabels],
      ])
        assert.ok(
          vocabulary.some((v) => v.label === value),
          `${claim.id}: ${value}`,
        );
      for (const id of [claim.sourceId, ...claim.evidenceIds])
        assert.ok(
          essay.sources.some((s) => s.id === id),
          `${claim.id}: missing source ${id}`,
        );
      if (claim.deadline)
        assert.equal(
          new Date(`${claim.deadline}T00:00:00Z`).toISOString().slice(0, 10),
          claim.deadline,
        );
    }
  }
});
test('resolved predictions have outcome citations, not just the original essay', () => {
  for (const essay of essays)
    for (const c of essay.claims)
      if (['Supported', 'Contradicted'].includes(c.grade)) {
        assert.ok(c.evidenceIds.length, c.id);
        assert.ok(
          c.evidenceIds.every((id) => id !== c.sourceId),
          c.id,
        );
        assert.equal(
          c.kind,
          'Forecast',
          `${c.id}: conditional resolutions need a documented trigger`,
        );
      }
});
test('past deadlines cannot silently remain Pending', () => {
  for (const essay of essays)
    for (const c of essay.claims)
      if (c.deadline && c.deadline < ESSAY_AS_OF)
        assert.notEqual(c.grade, 'Pending', c.id);
});
test('conditional forecasts preserve their prerequisites and distinct failure branches', () => {
  for (const essay of essays)
    for (const c of essay.claims)
      if (c.kind === 'Conditional forecast') assert.ok(c.condition, c.id);
  const byId = (id) => data.ai2040.claims.find((c) => c.id === id);
  assert.match(byId('A40-060').condition, /covert project/);
  assert.match(byId('A40-061').condition, /flawed safety-case/);
  assert.notEqual(byId('A40-060').condition, byId('A40-058').condition);
});
test('policies and pre-publication observations never receive accuracy credit', () => {
  assert.equal(
    data.ai2040.claims.find((c) => c.id === 'A40-057').kind,
    'Policy proposal',
  );
  assert.equal(
    data.ai2027.claims.find((c) => c.id === 'A27-004').kind,
    'Already observable',
  );
  for (const essay of essays) {
    const counts = essayCounts(essay);
    assert.equal(
      counts.forecasts + counts.proposals + counts.context,
      essay.claims.length,
    );
    assert.equal(
      counts.supported +
        counts.contradicted +
        counts.pending +
        counts.notAssessed +
        counts.unresolvable,
      counts.forecasts,
    );
    for (const c of essay.claims.filter((c) =>
      ['Policy proposal', 'Already observable'].includes(c.kind),
    ))
      assert.equal(c.grade, 'Not assessed', c.id);
  }
});
test('aggregate counts exclude proposals even if a later editor gives one a factual status', () => {
  const base = { ...data.ai2040, claims: [] };
  const c = data.ai2040.claims[0];
  const fixture = {
    ...base,
    claims: [
      { ...c, kind: 'Forecast', grade: 'Supported' },
      { ...c, kind: 'Policy proposal', grade: 'Supported' },
      { ...c, kind: 'Already observable', grade: 'Supported' },
      { ...c, kind: 'Conditional forecast', grade: 'Pending' },
    ],
  };
  const counts = essayCounts(fixture);
  assert.equal(counts.forecasts, 2);
  assert.equal(counts.supported, 1);
  assert.equal(counts.pending, 1);
  assert.equal(counts.proposals, 1);
  assert.equal(counts.context, 1);
});
