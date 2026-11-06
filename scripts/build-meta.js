// Plugin Vite : identifiant de build, version.json et service worker générés.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function git(cmd) {
  try { return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return ''; }
}

export function buildMeta() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || git('rev-parse HEAD') || Date.now().toString(16);
  const build = sha.slice(0, 10);
  const msg = (process.env.VERCEL_GIT_COMMIT_MESSAGE || git('log -1 --format=%s') || '').split('\n')[0];
  let outDir = 'dist';
  return {
    name: 'fd-build-meta',
    config: () => ({ define: { __BUILD__: JSON.stringify(build), __BUILD_MSG__: JSON.stringify(msg) } }),
    configResolved(c) { outDir = c.build.outDir; },
    writeBundle() {
      const files = [];
      const walk = (d) => {
        for (const f of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, f.name);
          if (f.isDirectory()) walk(p);
          else files.push(path.relative(outDir, p).split(path.sep).join('/'));
        }
      };
      walk(outDir);
      const list = ['./', ...files.filter((f) => f !== 'index.html' && f !== 'sw.js' && f !== 'version.json' && !f.startsWith('.') && !f.endsWith('.mp4') && !f.endsWith('-anim.webp'))].sort();
      fs.writeFileSync(path.join(outDir, 'version.json'), JSON.stringify({ v: build, m: msg }));
      const tpl = fs.readFileSync('scripts/sw.template.js', 'utf8');
      fs.writeFileSync(path.join(outDir, 'sw.js'), tpl.replace('__BUILD__', () => build).replace('__FILES__', () => JSON.stringify(list)));
    },
  };
}
