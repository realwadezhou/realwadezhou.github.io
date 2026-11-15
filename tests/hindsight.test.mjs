import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const pilot = JSON.parse(
  fs.readFileSync(
    new URL(
      '../public/data/hindsight/hindsight-vox-pilot.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const checklist = JSON.parse(
  fs.readFileSync(
    new URL(
      '../public/data/hindsight/hindsight-checklist.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const compiled = ts.transpileModule(
  fs.readFileSync(new URL('../lib/hindsight.ts', import.meta.url), 'utf8'),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const moduleSource = compiled
  .replace(
    /import pilot from '[^']+';/,
    `const pilot = ${JSON.stringify(pilot)};`,
  )
  .replace(
    /import checklist from '[^']+';/,
    `const checklist = ${JSON.stringify(checklist)};`,
  );
const {
  modelMeanAbsoluteError,
  outcomeDirectedBias,
  hindsightModels,
  leakageYearGroups,
} = await import(
  `data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`
);

function probability(value, label) {
  assert.ok(
    value === null ||
      (typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 1),
    `${label}: ${value}`,
  );
}

test('Vox items have unique IDs, valid probabilities, ordered bands and valid outcomes', () => {
  assert.ok(pilot.items.length);
  const ids = new Set();
  for (const item of pilot.items) {
    assert.ok(
      item.id && !ids.has(item.id),
      `duplicate or missing ID: ${item.id}`,
    );
    ids.add(item.id);
    probability(item.statedP, `${item.id}.statedP`);
    assert.ok([0, 1, null].includes(item.outcome), item.id);
    if (item.year === 2026) assert.equal(item.outcome, null, item.id);
    assert.equal(item.rung, 'stated');
    assert.equal(item.provenance, 'stated');
    assert.equal(
      new Set(item.inferred.map((entry) => entry.model)).size,
      item.inferred.length,
    );
    for (const entry of item.inferred) {
      for (const field of ['low', 'mid', 'high', 'labelP', 'statementOnlyP'])
        probability(entry[field], `${item.id}.${entry.model}.${field}`);
      if ([entry.low, entry.mid, entry.high].every((value) => value !== null)) {
        assert.ok(
          entry.low <= entry.mid && entry.mid <= entry.high,
          `${item.id}.${entry.model}: unordered band`,
        );
      }
    }
    if (item.human !== null) probability(item.human.p, `${item.id}.human.p`);
  }
  for (const entry of pilot.recovery) {
    probability(entry.mae, `${entry.predictor}.mae`);
    assert.ok(Number.isInteger(entry.n) && entry.n > 0);
  }
});

test('checklist items have non-empty sections and text', () => {
  assert.ok(checklist.items.length);
  for (const item of checklist.items) {
    assert.ok(typeof item.section === 'string' && item.section.trim());
    assert.ok(typeof item.text === 'string' && item.text.trim());
    assert.equal(typeof item.done, 'boolean');
    assert.ok(item.owner === null || typeof item.owner === 'string');
  }
});

test('MAE and directed bias handle signs, year boundaries, missing values and sample SE', () => {
  const row = (year, statedP, mid, outcome) => ({
    year,
    statedP,
    outcome,
    inferred: [{ model: 'fixture', mid }],
  });
  const rows = [
    row(2019, 0.5, 0.7, 1),
    row(2023, 0.5, 0.5, 0),
    row(2023, 0.5, null, 1),
    row(2024, 0.5, 0.8, 0),
    row(2025, 0.5, 0.6, 1),
    row(2026, 0.5, 0.9, null),
    row(2022, 0.5, 0.9, null),
  ];
  const early = outcomeDirectedBias('fixture', leakageYearGroups[0], rows);
  assert.equal(early.n, 2);
  assert.ok(Math.abs(early.mean - 0.1) < 1e-12);
  assert.ok(Math.abs(early.se - 0.1) < 1e-12);
  const late = outcomeDirectedBias('fixture', leakageYearGroups[1], rows);
  assert.equal(late.n, 2);
  assert.ok(Math.abs(late.mean + 0.1) < 1e-12);
  assert.ok(Math.abs(late.se - 0.2) < 1e-12);
  assert.deepEqual(outcomeDirectedBias('missing', leakageYearGroups[0], rows), {
    mean: null,
    se: null,
    n: 0,
  });
  assert.equal(
    outcomeDirectedBias('fixture', { start: 2019, end: 2019 }, rows).se,
    null,
  );
  const mae = modelMeanAbsoluteError('fixture', rows);
  assert.equal(mae.n, 6);
  assert.ok(Math.abs(mae.mae - 1.4 / 6) < 1e-12);
  assert.deepEqual(modelMeanAbsoluteError('missing', rows), {
    mae: null,
    n: 0,
  });
});

test('computed midpoint MAE matches the rounded recovery export', () => {
  for (const model of hindsightModels) {
    const actual = modelMeanAbsoluteError(model);
    const exported = pilot.recovery.find(
      (entry) => entry.predictor === `${model}, band`,
    );
    assert.ok(exported, model);
    assert.equal(actual.n, exported.n);
    assert.ok(Math.abs(actual.mae - exported.mae) <= 0.0005, model);
  }
});
