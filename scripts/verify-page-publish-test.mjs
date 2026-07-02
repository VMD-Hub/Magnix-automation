#!/usr/bin/env node
/** Verify Page Publish test row on Sheet after n8n run */
import crypto from 'node:crypto';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId } from './lib/magnix-env.mjs';

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

async function getValues(tok, sid, range) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${tok}` } }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.values || [];
}

async function main() {
  const cfg = loadPublicConfig();
  const sid = sheetId(loadEnv(), cfg);
  const tab = cfg.content_drafts_tab || 'content_drafts';
  const metricsTab = cfg.content_metrics_tab || 'content_metrics';
  const tok = await token(loadServiceAccount());

  const rows = await getValues(tok, sid, `${tab}!A:N`);
  const headers = (rows[0] || []).map((h) => String(h).trim().toLowerCase());
  const idx = (name) => headers.indexOf(name);

  let testRow = null;
  let testRowNum = null;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (String(r[idx('source_normalized_key')] || '') === 'test:page_publish:001') {
      testRow = r;
      testRowNum = i + 1;
      break;
    }
  }

  const issues = [];
  const ok = [];

  if (!testRow) {
    console.log(JSON.stringify({ error: 'Không tìm thấy test:page_publish:001' }, null, 2));
    process.exit(1);
  }

  const status = String(testRow[idx('status')] || '');
  let meta = {};
  try {
    meta = JSON.parse(testRow[idx('meta')] || '{}');
  } catch {
    issues.push('meta JSON parse fail');
  }

  if (status === 'published') ok.push('status=published');
  else issues.push(`status=${status || 'empty'} (expected published)`);

  if (meta.page_published === true) ok.push('meta.page_published=true');
  else issues.push('meta.page_published not true');

  if (meta.fb_post_id) ok.push(`fb_post_id=${meta.fb_post_id}`);
  else issues.push('missing meta.fb_post_id');

  if (meta.fb_permalink) ok.push(`fb_permalink set`);
  else issues.push('missing meta.fb_permalink');

  if (meta.publish_error) issues.push(`publish_error leftover: ${meta.publish_error}`);

  const metrics = await getValues(tok, sid, `${metricsTab}!A:F`);
  const fbMetrics = metrics.filter((r, i) => i > 0 && String(r[1]) === 'fb_page');
  const matchedMetric = fbMetrics.find((r) => String(r[0]) === String(meta.fb_post_id));

  if (matchedMetric) ok.push('content_metrics row appended');
  else if (meta.fb_post_id) issues.push('content_metrics: no matching fb_page row for fb_post_id');

  let graphOk = null;
  if (meta.fb_post_id && process.env.META_PAGE_ACCESS_TOKEN) {
    // skip - don't read token from env in verify for security; optional Graph check via env
  }

  console.log(
    JSON.stringify(
      {
        sheet_row: testRowNum,
        title: testRow[idx('title')],
        status,
        fb_post_id: meta.fb_post_id || null,
        fb_permalink: meta.fb_permalink || null,
        published_at: meta.published_at || null,
        ok,
        issues,
        verdict: issues.length ? 'PARTIAL_OR_FAIL' : 'FULL_OK',
      },
      null,
      2
    )
  );

  process.exit(issues.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
