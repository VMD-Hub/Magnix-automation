#!/usr/bin/env node
/**
 * Agent 2 tier 1 — LLM classify content_queue (DeepSeek hoặc Anthropic)
 *
 * Usage:
 *   node scripts/batch-llm-classify-content-queue.mjs --dry-run
 *   node scripts/batch-llm-classify-content-queue.mjs --pool unclassified --limit 100
 *   node scripts/batch-llm-classify-content-queue.mjs --pool unclassified --limit 1546
 *   node scripts/batch-llm-classify-content-queue.mjs --pool review --limit 200
 *
 * --pool: unclassified | review | all
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CLASSIFY_SYSTEM,
  parseLlmClassify,
  applyLlmClassify,
} from '../n8n-workflows/code/shared/llm-classify.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const TAB = 'content_queue';

function loadEnv() {
  const envPath = path.join(root, 'n8n-workflows/.env');
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claim}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const jwt = `${unsigned}.${base64url(sign.sign(sa.private_key))}`;

  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(JSON.stringify(data));
  return data.access_token;
}

async function sheetsApi(token, method, pathSuffix, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${pathSuffix}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

function colLetter(n) {
  let s = '';
  let x = n + 1;
  while (x > 0) {
    s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

function headerIndex(headers, name) {
  return headers.findIndex((h) => h === name);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callLlm(env, { post_id, platform, text, meta }) {
  const userPayload = JSON.stringify({
    post_id,
    platform,
    text: String(text || '').slice(0, 4000),
    meta: typeof meta === 'object' ? meta : {},
  });

  if (env.DEEPSEEK_API_KEY) {
    const res = await fetch(env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL || 'deepseek-chat',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: CLASSIFY_SYSTEM },
          { role: 'user', content: userPayload },
        ],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    const raw = data.choices?.[0]?.message?.content;
    return parseLlmClassify(raw);
  }

  if (env.ANTHROPIC_API_KEY) {
    const model =
      env.ANTHROPIC_CLASSIFY_MODEL ||
      env.ANTHROPIC_MODEL ||
      'claude-haiku-4-5-20251001';
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 256,
        temperature: 0.2,
        system: CLASSIFY_SYSTEM,
        messages: [{ role: 'user', content: userPayload }],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    const raw = data.content?.[0]?.text;
    return parseLlmClassify(raw);
  }

  throw new Error('Thiếu DEEPSEEK_API_KEY hoặc ANTHROPIC_API_KEY trong n8n-workflows/.env');
}

function matchesPool(row, idx, pool) {
  const segment = String(row[idx.segment] ?? '').trim().toLowerCase();
  const status = String(row[idx.status] ?? '').trim().toLowerCase();
  const metaStr = idx.meta >= 0 ? String(row[idx.meta] ?? '') : '';
  let metaObj = {};
  try {
    if (metaStr) metaObj = JSON.parse(metaStr);
  } catch {
    /* ignore */
  }
  if (metaObj.classify_method === 'llm') return false;

  if (pool === 'unclassified') {
    return !segment || segment === 'unclassified';
  }
  if (pool === 'review') {
    return status === 'review';
  }
  if (pool === 'all') {
    return (
      !segment ||
      segment === 'unclassified' ||
      status === 'review'
    );
  }
  return false;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const poolArg = process.argv.find((a) => a.startsWith('--pool='))?.split('=')[1]
    || (process.argv.includes('--pool') ? process.argv[process.argv.indexOf('--pool') + 1] : 'unclassified');
  const limitArg = process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1]
    || (process.argv.includes('--limit') ? process.argv[process.argv.indexOf('--limit') + 1] : '100');
  const concurrencyArg = process.argv.find((a) => a.startsWith('--concurrency='))?.split('=')[1]
    || (process.argv.includes('--concurrency') ? process.argv[process.argv.indexOf('--concurrency') + 1] : '4');

  const pool = poolArg || 'unclassified';
  const limit = Math.max(1, parseInt(limitArg, 10) || 100);
  const concurrency = Math.max(1, Math.min(8, parseInt(concurrencyArg, 10) || 4));

  const env = loadEnv();
  const sheetId =
    env.GOOGLE_SHEET_CONTENT_METRICS_ID ||
    JSON.parse(fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8'))
      .google_sheet_id;

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa);

  const llmProvider = env.DEEPSEEK_API_KEY ? 'DeepSeek' : env.ANTHROPIC_API_KEY ? 'Anthropic' : 'NONE';
  console.log(`Pool: ${pool} | Limit: ${limit} | LLM: ${llmProvider}`);

  const val = await sheetsApi(token, 'GET', `${sheetId}/values/${encodeURIComponent(`${TAB}!A:O`)}`);
  const rows = val.values || [];
  const headers = rows[0].map((h) => String(h ?? '').trim().toLowerCase());

  const idx = {
    nk: headerIndex(headers, 'normalized_key'),
    post_id: headerIndex(headers, 'post_id'),
    platform: headerIndex(headers, 'platform'),
    text: headerIndex(headers, 'text'),
    segment: headerIndex(headers, 'segment'),
    score: headerIndex(headers, 'score'),
    claude_verdict: headerIndex(headers, 'claude_verdict'),
    interest_key: headerIndex(headers, 'interest_key'),
    status: headerIndex(headers, 'status'),
    tags: headerIndex(headers, 'tags'),
    meta: headerIndex(headers, 'meta'),
  };

  const candidates = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    while (row.length < headers.length) row.push('');
    if (!matchesPool(row, idx, pool)) continue;
    candidates.push({ sheetRow: r + 1, rowIndex: r, row });
  }

  console.log(`Tìm thấy ${candidates.length} dòng phù hợp pool "${pool}"`);
  const batch = candidates.slice(0, limit);
  console.log(`Sẽ xử lý: ${batch.length} dòng`);

  if (!batch.length) return;

  if (dryRun) {
    console.log('[dry-run] Mẫu 3 dòng:');
    batch.slice(0, 3).forEach((c, i) => {
      console.log(`  ${i + 1}. row ${c.sheetRow}: ${String(c.row[idx.text]).slice(0, 80)}...`);
    });
    return;
  }

  const stats = { ok: 0, fail: 0, reject: 0, by_segment: {} };
  const updates = [];

  async function processOne(item) {
    const { sheetRow, row } = item;
    let metaObj = {};
    try {
      if (row[idx.meta]) metaObj = JSON.parse(row[idx.meta]);
    } catch {
      metaObj = {};
    }

    try {
      const classify = await callLlm(env, {
        post_id: row[idx.post_id],
        platform: row[idx.platform],
        text: row[idx.text],
        meta: metaObj,
      });
      const applied = applyLlmClassify(row[idx.meta], classify);

      row[idx.segment] = applied.segment;
      row[idx.score] = applied.score;
      row[idx.interest_key] = applied.interest_key;
      row[idx.status] = applied.status;
      row[idx.claude_verdict] = applied.claude_verdict;
      row[idx.tags] = applied.tags;
      row[idx.meta] = applied.meta;

      stats.ok += 1;
      stats.by_segment[applied.segment] = (stats.by_segment[applied.segment] || 0) + 1;
      if (applied.claude_verdict === 'reject') stats.reject += 1;

      const minCol = Math.min(
        idx.segment,
        idx.score,
        idx.claude_verdict,
        idx.interest_key,
        idx.status,
        idx.tags,
        idx.meta
      );
      const maxCol = Math.max(
        idx.segment,
        idx.score,
        idx.claude_verdict,
        idx.interest_key,
        idx.status,
        idx.tags,
        idx.meta
      );

      updates.push({
        sheetRow,
        range: `${TAB}!${colLetter(minCol)}${sheetRow}:${colLetter(maxCol)}${sheetRow}`,
        values: [row.slice(minCol, maxCol + 1)],
      });
    } catch (e) {
      stats.fail += 1;
      console.warn(`  FAIL row ${sheetRow}: ${e.message}`);
    }
  }

  for (let i = 0; i < batch.length; i += concurrency) {
    const chunk = batch.slice(i, i + concurrency);
    await Promise.all(chunk.map(processOne));
    if ((i + concurrency) % 20 === 0 || i + concurrency >= batch.length) {
      console.log(`  LLM progress: ${Math.min(i + concurrency, batch.length)}/${batch.length}`);
    }
    await sleep(150);
  }

  const BATCH = 400;
  for (let i = 0; i < updates.length; i += BATCH) {
    const chunk = updates.slice(i, i + BATCH);
    await sheetsApi(token, 'POST', `${sheetId}/values:batchUpdate`, {
      valueInputOption: 'USER_ENTERED',
      data: chunk.map((u) => ({ range: u.range, values: u.values })),
    });
    console.log(`  sheetUpdate: ${Math.min(i + BATCH, updates.length)}/${updates.length}`);
  }

  console.log('\n--- Kết quả LLM classify ---');
  console.log('OK:', stats.ok, '| Fail:', stats.fail, '| Reject:', stats.reject);
  console.log('Segment:', stats.by_segment);
  console.log(`Còn lại pool "${pool}": ~${Math.max(0, candidates.length - batch.length)} dòng — chạy lại nếu cần.`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
