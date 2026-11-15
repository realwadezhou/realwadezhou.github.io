// Write the Gurman and Kuo evaluation downloads as static JSON (the site is a static export).
// Runs before every build (npm "prebuild"); output in public/downloads/ is gitignored.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('..', import.meta.url).pathname } });
const { claims } = await jiti.import('../lib/claims.ts');
const { kuoClaims, kuoCorpus } = await jiti.import('../lib/kuo-claims.ts');
const { AS_OF, RUBRIC_VERSION } = await jiti.import('../lib/rubric.ts');

const out = new URL('../public/downloads/', import.meta.url);
mkdirSync(out, { recursive: true });
const write = (name, data) => writeFileSync(new URL(name, out), JSON.stringify(data, null, 1) + '\n');
write('gurman-evaluations.json', {
  asOf: AS_OF,
  rubricVersion: RUBRIC_VERSION,
  scope: 'Selective historical collection, 2015–2026. Provisional assessments; no career-wide accuracy estimate.',
  claims: claims.filter((claim) => claim.personId === 'mark-gurman'),
});
write('kuo-evaluations.json', {
  asOf: kuoCorpus.asOf,
  rubricVersion: RUBRIC_VERSION,
  scope: kuoCorpus.scope,
  claims: kuoClaims,
});
console.log('wrote public/downloads/gurman-evaluations.json and kuo-evaluations.json');
