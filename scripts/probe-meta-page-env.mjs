#!/usr/bin/env node
/**
 * Validate META_PAGE_* env without printing full token.
 * Usage: node scripts/probe-meta-page-env.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, 'n8n-workflows/.env');

if (!existsSync(envPath)) {
  console.error('Missing n8n-workflows/.env');
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

const pageId = env.META_PAGE_ID || '';
const token = env.META_PAGE_ACCESS_TOKEN || '';
const enabled = String(env.CONTENT_PAGE_PUBLISH_ENABLED || '').toLowerCase() === 'true';
const version = env.META_GRAPH_API_VERSION || 'v21.0';

const checks = {
  CONTENT_PAGE_PUBLISH_ENABLED: enabled ? 'OK' : 'FAIL (must be true)',
  META_PAGE_ID: /^\d{10,20}$/.test(pageId) ? `OK (${pageId.length} digits)` : `FAIL (${pageId || 'empty'})`,
  META_PAGE_ACCESS_TOKEN:
    /^EAA/.test(token) && token.length >= 80
      ? `OK (EAA…, ${token.length} chars)`
      : token.length === 0
        ? 'FAIL (empty)'
        : `FAIL (len=${token.length}, expected EAA… 80+ chars)`,
  META_GRAPH_API_VERSION: version ? `OK (${version})` : 'OK (default v21.0)',
};

const formatOk =
  enabled && /^\d{10,20}$/.test(pageId) && /^EAA/.test(token) && token.length >= 80;

const report = { checks, page_id: pageId || null };

if (!formatOk) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(2);
}

const debugRes = await fetch(
  `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(token)}`
);
const debug = await debugRes.json();
const dbg = debug.data || {};

report.token_type = dbg.type || null;
report.token_app_id = dbg.app_id || null;
report.token_scopes = dbg.scopes || [];
report.has_pages_manage_posts = (dbg.scopes || []).includes('pages_manage_posts');

if (dbg.app_id && dbg.app_id === pageId) {
  report.page_id_warning =
    'META_PAGE_ID trùng App ID — phải dùng Page ID (About → Page ID), không phải App ID';
}

const accountsRes = await fetch(
  `https://graph.facebook.com/${version}/me/accounts?fields=id,name,tasks&access_token=${encodeURIComponent(token)}`
);
const accounts = await accountsRes.json();
report.pages_from_token = (accounts.data || []).map((p) => ({
  id: p.id,
  name: p.name,
  tasks: p.tasks,
}));

if (report.pages_from_token.length && !report.pages_from_token.some((p) => p.id === pageId)) {
  report.page_id_warning =
    (report.page_id_warning ? `${report.page_id_warning}; ` : '') +
    `META_PAGE_ID không khớp Page nào trong token — gợi ý: ${report.pages_from_token[0].id}`;
}

if (!report.has_pages_manage_posts) {
  report.permission_warning =
    'Token thiếu pages_manage_posts — cần generate lại Page token trong Meta App (Business Manager / Graph Explorer)';
}

const pageRes = await fetch(
  `https://graph.facebook.com/${version}/${pageId}?fields=id,name&access_token=${encodeURIComponent(token)}`
);
const pageData = await pageRes.json();
if (pageData.error) {
  report.page_read = { ok: false, message: pageData.error.message };
} else {
  report.page_read = { ok: true, id: pageData.id, name: pageData.name };
}

const hardFail =
  report.page_id_warning ||
  report.permission_warning ||
  report.page_read?.ok === false;

if (!report.has_pages_manage_posts) {
  report.next_steps = [
    'Meta Developers → App → Permissions → thêm pages_manage_posts',
    'Graph API Explorer: User token → Get Page Access Token → chọn Page',
    'Gán META_PAGE_ACCESS_TOKEN = Page token (EAA…), META_PAGE_ID = Page ID (không phải App ID)',
  ];
}

console.log(JSON.stringify(report, null, 2));
process.exit(hardFail ? 1 : 0);
