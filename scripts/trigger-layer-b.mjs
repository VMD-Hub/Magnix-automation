#!/usr/bin/env node
/**
 * Trigger Layer B webhook và poll execution mới.
 * Usage: node scripts/trigger-layer-b.mjs
 */
import { loadEnv, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

const WF_ID = process.env.N8N_LAYER_B_WORKFLOW_ID || 'aeVdOgRbf0mYuOcN';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const env = loadEnv();
  const base = (env.N8N_PUBLIC_URL || '').replace(/\/$/, '');
  const apiKey = env.N8N_API_KEY;
  const token = env.MAGNIX_WEBHOOK_TOKEN || '';
  if (!base || !apiKey) throw new Error('Thiếu N8N_PUBLIC_URL / N8N_API_KEY');

  const headers = { 'Content-Type': 'application/json', 'X-N8N-API-KEY': apiKey };
  if (token) headers.Authorization = `Bearer ${token}`;

  const started = Date.now();
  const wh = await fetch(`${base}/webhook/magnix/editorial-brief`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ trigger: 'batch', at: new Date().toISOString() }),
  });
  console.log('webhook', wh.status);
  if (!wh.ok) throw new Error(await wh.text());

  await sleep(5000);
  let execId = null;
  for (let i = 0; i < 15; i += 1) {
    const ex = await fetch(`${base}/api/v1/executions?workflowId=${WF_ID}&limit=3`, {
      headers: { 'X-N8N-API-KEY': apiKey },
    }).then((r) => r.json());
    const hit = (ex.data || []).find((e) => new Date(e.startedAt).getTime() > started - 3000);
    if (hit) {
      execId = hit.id;
      if (hit.status !== 'running' && hit.status !== 'waiting') break;
    }
    await sleep(8000);
  }
  if (!execId) throw new Error('Không thấy execution mới');

  for (let i = 0; i < 60; i += 1) {
    const ex = await fetch(`${base}/api/v1/executions/${execId}?includeData=true`, {
      headers: { 'X-N8N-API-KEY': apiKey },
    }).then((r) => r.json());
    process.stdout.write(`\r  poll: ${ex.status}   `);
    if (ex.status === 'success' || ex.status === 'error' || ex.status === 'failed') {
      console.log('');
      const summary =
        ex.data?.resultData?.runData?.['Build Summary']?.[0]?.data?.main?.[0]?.[0]?.json;
      console.log('execution', execId, ex.status);
      if (summary) console.log('summary', JSON.stringify(summary, null, 2));
      break;
    }
    await sleep(10000);
  }

  const from = process.argv.includes('--from')
    ? process.argv[process.argv.indexOf('--from') + 1]
    : '11';
  const to = process.argv.includes('--to') ? process.argv[process.argv.indexOf('--to') + 1] : '15';
  const ids = [];
  for (let n = parseInt(from, 10); n <= parseInt(to, 10); n += 1) {
    ids.push(String(n).padStart(2, '0'));
  }

  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  for (const id of ids) {
    const r = rows.find((x) => x.normalized_key === `editorial:queue:2026w27:${id}`);
    const m = parseMeta(r?.meta);
    console.log(`#${id}`, m.editorial_brief_v1 ? 'brief OK' : 'NO brief');
  }
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
