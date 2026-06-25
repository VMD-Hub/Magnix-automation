#!/usr/bin/env node
/**
 * Deploy Agent 7 v2 end-to-end: rebuild → push → repair credentials → verify
 * Usage: node scripts/deploy-agent7-full.mjs
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(label, cmd, args) {
  console.log(`\n>> ${label}`);
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: false });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function verifyV2() {
  const env = loadEnv();
  const base = (env.N8N_PUBLIC_URL || 'https://n8n.vmd.asia').replace(/\/$/, '');
  const key = env.N8N_API_KEY;
  const wfId = process.env.N8N_AGENT7_WORKFLOW_ID || 'fLOl48TY0PjMLqGZ';
  const wf = await fetch(`${base}/api/v1/workflows/${wfId}`, {
    headers: { 'X-N8N-API-KEY': key },
  }).then((r) => r.json());
  const code = wf.nodes?.find((n) => n.name === 'Build Creatomate Payload')?.parameters?.jsCode || '';
  const fetchNode = wf.nodes?.find((n) => n.name === 'Fetch video_drafts');
  const v2 = code.includes('fetchElevenLabsBatch');
  const mp4Payload = code.includes('...renderSource') && code.includes("output_format: 'mp4'");
  const wrappedBug = code.includes('source: renderSource');
  const credOk = fetchNode?.parameters?.nodeCredentialType === 'googleApi';
  console.log('\n=== VERIFY ===');
  console.log('v2 (ElevenLabs + beats):', v2 ? 'OK' : 'FAIL — vẫn workflow cũ');
  console.log('flat MP4 payload:', mp4Payload ? 'OK' : 'FAIL — Creatomate sẽ ra JPG');
  console.log('wrapped source bug:', wrappedBug ? 'YES (bad)' : 'no');
  console.log('Fetch credential type:', fetchNode?.parameters?.nodeCredentialType, credOk ? 'OK' : 'FAIL');
  if (!v2 || !mp4Payload || wrappedBug || !credOk) process.exit(1);
  console.log('\nAgent 7 v2 sẵn sàng. Chạy manual trên n8n sau khi reset row trên Sheet.');
}

run('Rebuild Agent 7', 'node', ['n8n-workflows/build-content-video-render.mjs']);
run('Push Agent 7', 'node', ['scripts/push-n8n-workflows.mjs', '--only=content-video-render.workflow.json']);
run('Repair credentials', 'node', ['scripts/repair-agent7-credentials.mjs']);
await verifyV2();
