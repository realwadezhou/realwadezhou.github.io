import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { evaluateTiming, verdicts, clarityLevels, evidenceLevels, reviewStates, timingLabels, RUBRIC_VERSION } from '../lib/rubric.ts';
const require = createRequire(import.meta.url);
const ts = require('typescript');
// Load the local seed modules without installing a separate test runtime.
function dataModule(path, dependencies = {}) {
  const output = ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  new Function('exports', 'require', output)(exports, id => dependencies[id]);
  return exports;
}
const { productClaims } = dataModule('../lib/product-claims.ts');
const { claims } = dataModule('../lib/claims.ts', { './product-claims': { productClaims } });
const deadline = { kind: 'by', end: '2024-06-30' };
const month = { kind: 'during', start: '2024-06-01', end: '2024-06-30' };

test('a deadline permits earlier arrival; a during-window does not', () => {
  assert.deepEqual(evaluateTiming(deadline, '2024-05-28', '2024-07-10'), { label: 'On time', days: 0 });
  assert.deepEqual(evaluateTiming(month, '2024-05-28', '2024-07-10'), { label: 'Early', days: -4 });
});
test('window endpoints are inclusive', () => {
  for (const day of ['2024-06-01','2024-06-30']) assert.deepEqual(evaluateTiming(month, day, '2024-07-10'), { label: 'On time', days: 0 });
});
test('late arrival has a signed delay to the deadline', () => {
  assert.deepEqual(evaluateTiming(deadline, '2024-07-10', '2024-07-10'), { label: 'Late', days: 10 });
});
test('unobserved events are pending through the deadline, overdue after it', () => {
  assert.deepEqual(evaluateTiming(deadline, null, '2024-06-30'), { label: 'Pending', days: null });
  assert.deepEqual(evaluateTiming(deadline, null, '2024-07-10'), { label: 'Overdue', days: 10 });
});
test('calendar arithmetic handles leap days and is independent of daylight saving', () => {
  assert.equal(evaluateTiming({ kind: 'by', end: '2024-02-28' }, '2024-03-01', '2024-03-01').days, 2);
  assert.equal(evaluateTiming({ kind: 'by', end: '2024-03-09' }, '2024-03-11', '2024-03-11').days, 2);
});
test('invalid dates, inverted windows, and future observations fail closed', () => {
  assert.throws(() => evaluateTiming({ kind:'by', end:'2024-02-30' }, null, '2024-03-01'));
  assert.throws(() => evaluateTiming({ kind:'during', start:'2024-07-01', end:'2024-06-30' }, null, '2024-07-02'));
  assert.throws(() => evaluateTiming(deadline, '2024-07-10', '2024-07-09'));
});
test('all pilot labels come from the published rubric, with a version and review history', () => {
  assert.equal(new Set(claims.map(c=>c.id)).size, claims.length);
  for (const c of claims) {
    for (const [field, allowed] of [['status',verdicts],['clarity',clarityLevels],['evidence',evidenceLevels],['reviewState',reviewStates]]) assert.ok(allowed.some(x=>x.label===c[field]), `${c.id}: ${field}`);
    assert.ok(timingLabels.some(x=>x.label===c.timing.label));
    assert.equal(c.rubricVersion, RUBRIC_VERSION);
    assert.ok(c.history.length && c.criteria && c.familyId);
  }
});
test('every factual check, quote, and timing observation has a readable supporting source', () => {
  for (const c of claims) {
    const source = id => c.sources.find(s=>s.id===id);
    assert.equal(new Set(c.sources.map(s=>s.id)).size,c.sources.length);
    const referenced = [...c.checks.flatMap(check=> { assert.ok(check.sourceIds.length); return check.sourceIds; }), ...c.timing.observations.map(o=>o.sourceId), ...(c.quote?[c.quoteSourceId]:[])];
    for (const id of referenced) { assert.ok(source(id),`${c.id}: unknown source ${id}`); assert.equal(source(id).access,'Read',`${c.id}: unread evidence ${id}`); }
    for (const s of c.sources) { assert.ok(s.published && s.accessed && s.note); assert.equal(new URL(s.url).protocol,'https:'); }
    if (['Supported','Contradicted'].includes(c.status)) {
      for(const role of ['Forecast','Outcome']) assert.ok(c.sources.some(s=>s.role===role && s.access==='Read'), `${c.id}: missing ${role}`);
    }
  }
});
test('both iPad release milestones miss April; the later revision does not erase the earlier call', () => {
  const earlier=claims.find(c=>c.id==='F-005'), revised=claims.find(c=>c.id==='F-002');
  assert.equal(earlier.status,'Contradicted');
  assert.equal(earlier.familyId,revised.familyId);
  assert.deepEqual(earlier.timing.observations.map(o=>evaluateTiming(earlier.timing.rule,o.date,'2026-09-04').days),[7,15]);
  assert.equal(revised.status,'Not assessed');
  assert.ok(revised.history.some(h=>h.change.includes('Supported → Not assessed')));
});
test('a supported chip call does not acquire an invented calendar forecast', () => {
  const chip=claims.find(c=>c.id==='F-003');
  assert.equal(chip.status,'Supported');assert.equal(chip.timing.label,'Not specified');assert.equal(chip.timing.rule,undefined);
});
