// Dump the tracker's essays (claims and sources) as JSON for hindsight_research's essay grader.
//   node scripts/dump_essays.mjs ../../hindsight_research/data/ref/tracker_essays.json
import { writeFileSync } from 'node:fs';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
const { essays } = await jiti.import('../lib/essays.ts');
const out = process.argv[2] ?? 'essays.json';
writeFileSync(out, JSON.stringify(essays, null, 1) + '\n');
console.log(`${essays.length} essays, ${essays.reduce((n, e) => n + e.claims.length, 0)} claims -> ${out}`);
