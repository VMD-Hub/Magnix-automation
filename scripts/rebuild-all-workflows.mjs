#!/usr/bin/env node
/**
 * Rebuild tất cả workflow JSON từ code modules.
 * Usage: node scripts/rebuild-all-workflows.mjs
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const wfDir = path.join(root, 'n8n-workflows');

const BUILDS = [
  'build-uid-ingest.mjs',
  'build-social-listening.mjs',
  'build-social-listening-facebook.mjs',
  'build-content-classify.mjs',
  'build-content-editorial-brief.mjs',
  'build-content-draft.mjs',
  'build-content-video-draft.mjs',
  'build-content-video-render.mjs',
  'build-outreach-queue.mjs',
  'build-content-scorecard.mjs',
  'build-telegram-notify.mjs',
  'build-telegram-reminder.mjs',
  'build-telegram-resolver.mjs',
];

let failed = 0;

console.log('\n>> build-legal-pack-bundle.mjs');
const bundle = spawnSync(process.execPath, [path.join(root, 'scripts', 'build-legal-pack-bundle.mjs')], {
  stdio: 'inherit',
  cwd: root,
});
if (bundle.status !== 0) failed += 1;

for (const file of BUILDS) {
  const script = path.join(wfDir, file);
  console.log('\n>>', file);
  const r = spawnSync(process.execPath, [script], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) failed += 1;
}

if (failed) {
  console.error(`\n${failed} build(s) failed`);
  process.exit(1);
}
console.log(`\nOK — ${BUILDS.length} workflows rebuilt`);
