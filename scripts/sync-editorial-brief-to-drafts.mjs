#!/usr/bin/env node
/**
 * Copy meta.editorial_brief_v1 + legal_retrieval_pack từ content_queue → content_drafts.
 * Usage: node scripts/sync-editorial-brief-to-drafts.mjs
 *        node scripts/sync-editorial-brief-to-drafts.mjs --from 01 --to 05 --dry-run
 */
import crypto from 'node:crypto';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

function parseArgs() {
  const args = process.argv.slice(2);
  let from = '01';
  let to = '05';
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--from') from = args[++i];
    if (args[i] === '--to') to = args[++i];
  }
  return { from, to, dryRun };
}

function b64u(s) {
  return Buffer.from(s).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function token(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64u(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const u = `${h}.${c}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(u);
  const jwt = `${u}.${b64u(sign.sign(sa.private_key))}`;
  const res = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(JSON.stringify(d));
  return d.access_token;
}

function inRange(pageKey, from, to) {
  const m = pageKey.match(/editorial:page:2026w27:(\d+)/);
  if (!m) return false;
  return m[1] >= from && m[1] <= to;
}

async function putMeta(tok, sid, tab, row, metaStr) {
  const range = encodeURIComponent(`${tab}!N${row}`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${range}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [[metaStr]] }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
}

async function main() {
  const { from, to, dryRun } = parseArgs();
  const cfg = loadPublicConfig();
  const queueTab = cfg.content_queue_tab || 'content_queue';
  const draftsTab = cfg.content_drafts_tab || 'content_drafts';

  const { rows: queueRows } = rowsToObjects(await fetchTab(queueTab, 'A:O'));
  const briefByPageKey = new Map();
  for (const r of queueRows) {
    const meta = parseMeta(r.meta);
    if (!meta.editorial_brief_v1) continue;
    const pageKey = meta.editorial_page_key
      || String(r.normalized_key || '').replace('editorial:queue:', 'editorial:page:');
    if (!inRange(pageKey, from, to)) continue;
    briefByPageKey.set(pageKey, meta);
  }

  const { rows: draftRows } = rowsToObjects(await fetchTab(draftsTab, 'A:N'));
  let updated = 0;
  let missing = 0;

  const env = loadEnv();
  const sid = sheetId(env);
  const sa = loadServiceAccount();
  const tok = dryRun ? null : await token(sa);

  for (const d of draftRows) {
    const key = String(d.source_normalized_key || '').trim();
    if (!inRange(key, from, to)) continue;
    const src = briefByPageKey.get(key);
    if (!src?.editorial_brief_v1) {
      missing += 1;
      console.log(`  thiếu brief queue → draft ${key}`);
      continue;
    }
    const meta = parseMeta(d.meta);
    if (meta.editorial_brief_v1) {
      console.log(`  skip ${key}: draft đã có brief`);
      continue;
    }
    const merged = {
      ...meta,
      editorial_brief_v1: src.editorial_brief_v1,
      editorial_brief_at: src.editorial_brief_at || new Date().toISOString(),
      needs_editorial_brief: false,
    };
    if (src.legal_retrieval_pack) {
      merged.legal_retrieval_pack = src.legal_retrieval_pack;
      merged.legal_retrieval_pack_at = src.legal_retrieval_pack_at || new Date().toISOString();
    }
    if (src.legal_gate) merged.legal_gate = src.legal_gate;
    const metaStr = JSON.stringify(merged).slice(0, 50000);
    if (dryRun) {
      console.log(`  [dry-run] sync ${key} row ${d.sheet_row}`);
    } else {
      await putMeta(tok, sid, draftsTab, d.sheet_row, metaStr);
      console.log(`  ✓ sync ${key} → content_drafts row ${d.sheet_row}`);
    }
    updated += 1;
  }

  console.log(`\nSync ${from}–${to}: updated ${updated}, missing brief ${missing}`);
  if (missing) process.exit(2);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
