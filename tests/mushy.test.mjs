import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const mushy = JSON.parse(
  fs.readFileSync(
    new URL('../public/data/hindsight/hindsight-mushy.json', import.meta.url),
    'utf8',
  ),
);
const inUnit = (p) => p === null || (typeof p === 'number' && p >= 0 && p <= 1);

test('mushy questions have unique ids and valid resolutions', () => {
  const ids = mushy.questions.map((q) => q.qid);
  assert.equal(new Set(ids).size, ids.length);
  for (const q of mushy.questions) {
    assert.ok([0, 1].includes(q.outcome), q.qid);
    assert.ok(q.ladder.includes(q.primaryRung), q.qid);
    assert.match(q.settledOn, /^\d{4}-\d{2}-\d{2}$/, q.qid);
  }
});

test('mushy points and series are probabilities, low <= mid <= high', () => {
  for (const q of mushy.questions) {
    for (const p of q.points) {
      assert.ok(mushy.readers.includes(p.reader), `${q.qid} ${p.reader}`);
      for (const v of [p.p, p.low, p.high]) assert.ok(inUnit(v), q.qid);
      if (p.p !== null) assert.ok(p.low <= p.p && p.p <= p.high, q.qid);
    }
    for (const s of q.series)
      for (const [, v] of s.points) assert.ok(inUnit(v), s.id);
    for (const cw of Object.values(q.conventionalWisdom))
      for (const [, v] of cw.points) assert.ok(inUnit(v), q.qid);
  }
});

test('no article text, quotes or model reasons are exported', () => {
  const raw = JSON.stringify(mushy);
  assert.ok(!raw.includes('"quotes"'));
  assert.ok(!raw.includes('"reason"'));
  assert.ok(!raw.includes('"text_path"'));
});

test('brier equals (reading - outcome)^2 and consensus delta is consistent', () => {
  for (const q of mushy.questions)
    for (const p of q.points) {
      assert.equal(p.outcome, q.outcome, q.qid);
      if (p.p === null) {
        assert.equal(p.brier, null);
        continue;
      }
      assert.ok(Math.abs(p.brier - (p.p - q.outcome) ** 2) < 1e-3, q.qid);
      if (p.deltaVsConsensus !== null) {
        const cb = (p.consensusBefore - q.outcome) ** 2;
        assert.ok(Math.abs(p.deltaVsConsensus - (p.brier - cb)) < 1e-3, q.qid);
      }
    }
});
