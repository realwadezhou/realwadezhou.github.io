// GitHub Pages: where both foo.html and a foo/ folder exist (e.g. /essays, /research), GitHub
// serves the folder, so copy foo.html to foo/index.html. Also add .nojekyll (paths start with _next).
import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/client/', import.meta.url).pathname;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      const html = `${p}.html`;
      if (existsSync(html) && !existsSync(join(p, 'index.html'))) copyFileSync(html, join(p, 'index.html'));
    }
  }
};
walk(root);
writeFileSync(join(root, '.nojekyll'), '');
console.log('pages postbuild: index.html copies and .nojekyll written');
