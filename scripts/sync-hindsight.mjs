import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SOURCE_RELATIVE_TO_SITE = '../../hindsight_research/exports/site/';
const site = fileURLToPath(new URL('../', import.meta.url));
const source = path.resolve(site, SOURCE_RELATIVE_TO_SITE);
const destination = path.join(site, 'public/data/hindsight');
const files = (await readdir(source, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /^hindsight-.*\.json$/.test(entry.name))
  .map((entry) => entry.name)
  .sort();
for (const required of [
  'hindsight-vox-pilot.json',
  'hindsight-checklist.json',
]) {
  if (!files.includes(required))
    throw new Error(`Missing export: ${path.join(source, required)}`);
}
await mkdir(destination, { recursive: true });
for (const name of files) {
  await copyFile(path.join(source, name), path.join(destination, name));
  console.log(
    `Copied ${path.join(source, name)} → ${path.join(destination, name)}`,
  );
}
