#!/usr/bin/env node
/**
 * E2E test Agent 7: seed v3 row → trigger n8n → poll → render URL
 * Usage: node scripts/run-agent7-e2e-test.mjs
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKFLOW_ID = process.env.N8N_AGENT7_WORKFLOW_ID || 'fLOl48TY0PjMLqGZ';
const TEST_KEY = 'agent7-test:noxh-checklist-v1';
const POLL_MS = 15000;
const POLL_MAX = 40;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    throw new Error(`${script} failed (exit ${r.status})`);
  }
  return r.stdout.trim();
}

async function triggerWorkflow(base, apiKey) {
  const headers = {
    'X-N8N-API-KEY': apiKey,
    'Content-Type': 'application/json',
  };
  const attempts = [
    { method: 'POST', url: `${base}/api/v1/workflows/${WORKFLOW_ID}/execute`, body: {} },
    { method: 'POST', url: `${base}/api/v1/workflows/${WORKFLOW_ID}/run`, body: {} },
  ];

  for (const a of attempts) {
    const res = await fetch(a.url, {
      method: a.method,
      headers,
      body: JSON.stringify(a.body),
    });
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
        console.log(`Triggered via ${a.url.replace(base, '')} → execution ${executionId}`);
        return String(executionId);
      }
    }
    console.log(`Skip ${a.url.replace(base, '')}: ${res.status} ${text.slice(0, 120)}`);
  }
  throw new Error('Không trigger được Agent 7 qua API — chạy manual trên n8n UI');
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
  const build = runData['Build Creatomate Payload']?.[0]?.data?.main?.[0]?.[0]?.json;
  const parse = runData['Parse Filter Approved']?.[0]?.data?.main?.[0]?.[0]?.json;
  const submit = runData['Parse Creatomate Create']?.[0]?.data?.main?.[0]?.[0]?.json
    || runData['Evaluate Poll Creatomate']?.[0]?.data?.main?.[0]?.[0]?.json;

  return { summary, build, parse, submit, runData };
}

async function findTestRowMeta() {
  const values = await fetchTab('video_drafts', 'A:V');
  const { rows } = rowsToObjects(values);
  const row = rows.find((r) => r.source_normalized_key === TEST_KEY);
  if (!row) return null;
  let meta = {};
  try {
    meta = row.meta ? JSON.parse(row.meta) : {};
  } catch {
    meta = {};
  }
  return { sheet_row: row.sheet_row, meta, status: row.status };
}

async function main() {
  const env = loadEnv();
  const base = (env.N8N_PUBLIC_URL || '').replace(/\/$/, '');
  const apiKey = env.N8N_API_KEY || '';
  if (!base || !apiKey) throw new Error('Thiếu N8N_PUBLIC_URL hoặc N8N_API_KEY trong n8n-workflows/.env');

  console.log('=== Agent 7 E2E test ===\n');

  console.log('1) Seed test row (beats v3 + stock_query EN)...');
  runNode('scripts/seed-agent7-test-video.mjs');

  const seeded = await findTestRowMeta();
  if (!seeded) throw new Error('Không tìm thấy test row sau seed');
  console.log(`   Row ${seeded.sheet_row} · key=${TEST_KEY}`);

  if (seeded.meta?.render_url) {
    console.log('2) Reset meta để render lại...');
    runNode('scripts/reset-agent7-row.mjs', [String(seeded.sheet_row)]);
  } else {
    console.log('2) Row sẵn sàng (approved, meta trống hoặc chưa render)');
  }

  console.log('3) Trigger Agent 7 trên n8n...');
  let executionId;
  try {
    executionId = await triggerWorkflow(base, apiKey);
  } catch (e) {
    console.error(`\n${e.message}`);
    console.log('\n→ Mở n8n: Magnix Agent 7 → Execute workflow (manual)');
    process.exit(2);
  }

  console.log('4) Poll execution (3–10 phút)...');
  const ex = await pollExecution(base, apiKey, executionId);
  const { summary, build, submit } = extractSummary(ex);

  console.log('\n=== KẾT QUẢ ===');
  if (summary) {
    console.log('Build Summary:', JSON.stringify(summary.stats || summary, null, 2));
    if (summary.skip_hint) console.log('skip_hint:', summary.skip_hint);
  }

  if (build?.ok === false) {
    console.log('\nPayload FAIL:', build.error, build.hint || '');
    if (build.render_spec_errors) console.log(JSON.stringify(build.render_spec_errors, null, 2));
    process.exit(1);
  }

  if (build?.ok) {
    console.log('\nPexels:', build.pexels_hit_rate || build.pexels_scenes?.map((p) => `${p.i}:${p.ok ? 'OK' : 'MISS'}`).join(' '));
    console.log('TTS:', build.tts?.provider, `${build.tts?.ok_count || 0} tracks`);
    console.log('Render duration:', build.render_duration_sec || build.creatomate_payload?.duration, 's');
  }

  const finalRow = await findTestRowMeta();
  const renderUrl = finalRow?.meta?.render_url || submit?.render_url;
  const driveUrl = finalRow?.meta?.drive_view_url;

  if (renderUrl) {
    console.log('\n✓ MP4 render_url:');
    console.log(renderUrl);
    if (driveUrl) console.log('✓ Drive:', driveUrl);
    console.log(`\nSheet row ${finalRow.sheet_row} · status=${finalRow.status}`);
    process.exit(0);
  }

  console.log('\nChưa có render_url — kiểm tra execution trên n8n:', `${base}/workflow/${WORKFLOW_ID}/executions/${executionId}`);
  process.exit(1);
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
