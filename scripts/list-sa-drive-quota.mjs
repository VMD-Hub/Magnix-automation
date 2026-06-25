#!/usr/bin/env node
/** List files owned by Service Account (quota debug). */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  const map = {};
  for (const line of fs.readFileSync(path.join(root, 'n8n-workflows/.env'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function b64(i) {
  return Buffer.from(i).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const h = b64(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const c = b64(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: sa.token_uri,
      iat: now,
      exp: now + 3600,
    })
  );
  const u = `${h}.${c}`;
  const s = crypto.createSign('RSA-SHA256');
  s.update(u);
  const jwt = `${u}.${b64(s.sign(sa.private_key))}`;
  const r = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const d = await r.json();
  if (!d.access_token) throw new Error(JSON.stringify(d));
  return d.access_token;
}

async function main() {
  const env = loadEnv();
  const sa = JSON.parse(fs.readFileSync(env.GOOGLE_SERVICE_ACCOUNT_JSON, 'utf8'));
  const token = await getToken(sa);
  const q = encodeURIComponent('trashed=false');
  let pageToken = '';
  let total = 0;
  let bytes = 0;
  const byType = {};
  for (let page = 0; page < 20; page++) {
    const url =
      `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=100&fields=nextPageToken,files(id,name,mimeType,size,quotaBytesUsed,createdTime)&supportsAllDrives=true&includeItemsFromAllDrives=true` +
      (pageToken ? `&pageToken=${pageToken}` : '');
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    for (const f of data.files || []) {
      total++;
      const sz = Number(f.quotaBytesUsed || f.size || 0);
      bytes += sz;
      const k = f.mimeType || 'unknown';
      byType[k] = (byType[k] || 0) + sz;
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  const about = await fetch('https://www.googleapis.com/drive/v3/about?fields=storageQuota,user', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());

  console.log('SA:', sa.client_email);
  console.log('Storage quota:', about.storageQuota || about.error);
  console.log('Files listed:', total);
  console.log('Quota bytes (sum):', bytes, `(${(bytes / 1e9).toFixed(2)} GB)`);
  console.log('By mimeType:', Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 8));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
