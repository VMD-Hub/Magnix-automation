#!/usr/bin/env node
/** Chạy diagnostic cho Agent 1–7 (read-only Sheet) */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const scripts = [
  'diagnose-agent1-listening.mjs',
  'diagnose-agent2-candidates.mjs',
  'diagnose-agent3-candidates.mjs',
  'diagnose-agent4-candidates.mjs',
  'diagnose-agent5-candidates.mjs',
  'diagnose-agent6-candidates.mjs',
  'diagnose-agent7-candidates.mjs',
];

for (const s of scripts) {
  console.log('\n' + '='.repeat(60));
  const r = spawnSync(process.execPath, [path.join(dir, s)], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
