#!/usr/bin/env node
/**
 * Seed editorial queue → trigger Layer B on n8n → sync brief to content_drafts.
 * Usage: node scripts/run-editorial-layer-b-batch.mjs
 *        node scripts/run-editorial-layer-b-batch.mjs --from 01 --to 05 --skip-push
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { parseMeta } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKFLOW_NAME = 'Magnix Layer B — Editorial Brief (intake → meta)';
const POLL_MS = 20000;
const POLL_MAX = 90;

function parseArgs() {
  const args = process.argv.slice(2);
  let from = '01';
  let to = '05';
  let skipPush = false;
  let skipSeed = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--from') from = args[++i];
    if (args[i] === '--to') to = args[++i];
    if (args[i] === '--skip-push') skipPush = true;
    if (args[i] === '--skip-seed') skipSeed = true;
  }
  return { from, to, skipPush, skipSeed };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status})`);
}

async function findWorkflowId(base, apiKey) {
  const envId = process.env.N8N_LAYER_B_WORKFLOW_ID;
  if (envId) return envId;
  const res = await fetch(`${base}/api/v1/workflows?limit=100`, {
    headers: { 'X-N8N-API-KEY': apiKey },
  });
  const data = await res.json();
  const list = data.data || data;
  const hit = list.find((w) => w.name === WORKFLOW_NAME);
  if (!hit?.id) throw new Error(`Không tìm thấy workflow "${WORKFLOW_NAME}" trên n8n`);
  return hit.id;
}

async function triggerWorkflow(base, apiKey, workflowId) {
  const env = loadEnv();
  const token = env.MAGNIX_WEBHOOK_TOKEN || '';
  const webhookUrl = `${base}/webhook/magnix/editorial-brief`;
  const whHeaders = { 'Content-Type': 'application/json' };
  if (token) whHeaders.Authorization = `Bearer ${token}`;

  const wh = await fetch(webhookUrl, {
    method: 'POST',
    headers: whHeaders,
    body: JSON.stringify({ trigger: 'editorial_batch', at: new Date().toISOString() }),
  });
  const whText = await wh.text();
  if (wh.ok) {
    console.log(`Triggered via webhook → ${wh.status}`);
    const started = Date.now();
    await sleep(3000);
    for (let i = 0; i < 10; i += 1) {
      const ex = await fetch(`${base}/api/v1/executions?workflowId=${workflowId}&limit=1`, {
        headers: { 'X-N8N-API-KEY': apiKey },
      }).then((r) => r.json());
      const latest = (ex.data || [])[0];
      if (latest?.id && new Date(latest.startedAt).getTime() >= started - 5000) {
        console.log(`   execution ${latest.id} (${latest.status})`);
        return String(latest.id);
      }
      await sleep(2000);
    }
    const fallback = await fetch(`${base}/api/v1/executions?workflowId=${workflowId}&limit=1`, {
      headers: { 'X-N8N-API-KEY': apiKey },
    }).then((r) => r.json());
    const latest = (fallback.data || [])[0];
    if (latest?.id) {
      console.log(`   execution ${latest.id} (latest)`);
      return String(latest.id);
    }
  } else {
    console.log(`Webhook ${wh.status}: ${whText.slice(0, 120)}`);
  }

  const headers = { 'X-N8N-API-KEY': apiKey, 'Content-Type': 'application/json' };
  const attempts = [
    { method: 'POST', url: `${base}/api/v1/workflows/${workflowId}/execute`, body: {} },
    { method: 'POST', url: `${base}/api/v1/workflows/${workflowId}/run`, body: {} },
  ];
  for (const a of attempts) {
    const res = await fetch(a.url, { method: a.method, headers, body: JSON.stringify(a.body) });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text.slice(0, 200) };
    }
    if (res.ok) {
      const executionId = data.executionId || data.id || data.data?.executionId;
      if (executionId) {
        console.log(`Triggered Layer B → execution ${executionId}`);
        return String(executionId);
      }
    }
    console.log(`Skip ${a.url.replace(base, '')}: ${res.status} ${text.slice(0, 120)}`);
  }
  throw new Error('Không trigger được Layer B — webhook hoặc chạy manual trên n8n UI');
}

async function pollExecution(base, apiKey, executionId) {
  for (let i = 0; i < POLL_MAX; i += 1) {
    await sleep(POLL_MS);
    const ex = await fetch(`${base}/api/v1/executions/${executionId}?includeData=true`, {
      headers: { 'X-N8N-API-KEY': apiKey },
    }).then((r) => r.json());
    const status = ex.status || ex.data?.status;
    process.stdout.write(`\r  poll ${i + 1}/${POLL_MAX}: ${status}   `);
    if (status === 'success' || status === 'error' || status === 'failed') {
      console.log('');
      return ex;
    }
  }
  throw new Error('Poll timeout — xem execution trên n8n UI');
}

function extractSummary(ex) {
  const runData = ex.data?.resultData?.runData || ex.resultData?.runData || {};
  const summary = runData['Build Summary']?.[0]?.data?.main?.[0]?.[0]?.json;
  const filter = runData['Parse Filter Needs Brief']?.[0]?.data?.main?.[0]?.[0]?.json;
  return { summary, filter, runData, status: ex.status || ex.data?.status };
}

async function countBriefsInQueue(from, to) {
  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  let n = 0;
  for (const r of rows) {
    const nk = String(r.normalized_key || '');
    if (!nk.startsWith('editorial:queue:2026w27:')) continue;
    const id = nk.split(':').pop();
    if (id < from || id > to) continue;
    const meta = parseMeta(r.meta);
    if (meta.editorial_brief_v1) n += 1;
  }
  return n;
}

async function main() {
  const { from, to, skipPush, skipSeed } = parseArgs();
  const env = loadEnv();
  const base = (env.N8N_PUBLIC_URL || '').replace(/\/$/, '');
  const apiKey = env.N8N_API_KEY;
  if (!base || !apiKey) throw new Error('Thiếu N8N_PUBLIC_URL hoặc N8N_API_KEY trong n8n-workflows/.env');

  console.log(`=== Layer B batch editorial ${from}–${to} ===\n`);

  if (!skipPush) {
    console.log('1. Rebuild + push workflow (editorial priority + webhook)...');
    runNode('n8n-workflows/build-content-editorial-brief.mjs');
    runNode('scripts/push-n8n-workflows.mjs', ['--only', 'content-editorial-brief.workflow.json', '--activate']);
  }

  if (!skipSeed) {
    console.log('\n2. Seed content_queue...');
    runNode('scripts/seed-editorial-queue-layer-b.mjs', ['--from', from, '--to', to]);
  }

  console.log('\n3. Trigger Layer B on n8n...');
  const workflowId = await findWorkflowId(base, apiKey);
  console.log(`   workflow id: ${workflowId}`);
  const executionId = await triggerWorkflow(base, apiKey, workflowId);
  const ex = await pollExecution(base, apiKey, executionId);
  const { summary, filter, status } = extractSummary(ex);
  console.log('   execution status:', status);
  if (summary) console.log('   summary:', JSON.stringify(summary, null, 2));
  if (filter?.empty) console.warn('   WARN: filter empty —', filter.message);

  const briefCount = await countBriefsInQueue(from, to);
  console.log(`\n4. Queue rows with brief (${from}–${to}): ${briefCount}`);
  if (briefCount === 0) {
    console.error('Không có editorial_brief_v1 trên queue — kiểm tra execution trên n8n.');
    process.exit(1);
  }

  console.log('\n5. Sync brief → content_drafts...');
  runNode('scripts/sync-editorial-brief-to-drafts.mjs', ['--from', from, '--to', to]);

  console.log(`\n✓ Layer B batch ${from}–${to} hoàn tất.`);
  console.log(`   n8n: ${base}/workflow/${workflowId}/executions/${executionId}`);
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
