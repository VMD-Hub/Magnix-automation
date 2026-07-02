#!/usr/bin/env node
/**
 * Upload file thủ công → Drive → patch Sheet meta.
 *
 * Usage:
 *   node scripts/upload-manual-asset-to-drive.mjs --editorial 05 --type cover --file cover.png
 *   node scripts/upload-manual-asset-to-drive.mjs --editorial 06 --type video --file reel.mp4
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId, parseMeta } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (flag) => {
    const i = a.indexOf(flag);
    return i >= 0 ? a[i + 1] : '';
  };
  return {
    editorial: get('--editorial'),
    type: get('--type'),
    file: get('--file'),
    dryRun: a.includes('--dry-run'),
  };
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
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
  if (!data.access_token) throw new Error(data.error?.message || JSON.stringify(data));
  return data.access_token;
}

async function uploadFile(token, folderId, filePath) {
  const name = path.basename(filePath);
  const buf = fs.readFileSync(filePath);
  const ext = path.extname(name).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.mp4' ? 'video/mp4'
    : 'application/octet-stream';

  const boundary = `magnix_${Date.now()}`;
  const metadata = JSON.stringify({ name, parents: [folderId], mimeType: mime });
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${mime}\r\n\r\n`),
    buf,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink&supportsAllDrives=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || res.statusText);
  await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions?supportsAllDrives=true`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });
  return data;
}

async function sheetsToken(sa) {
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
      grant_type: 'urn:ietf:params:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(JSON.stringify(data));
  return data.access_token;
}

function folderForType(type, env, folders) {
  if (type === 'cover') {
    return env.DRIVE_PAGE_COVERS_FOLDER_ID || folders.page_covers?.folder_id || '1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ';
  }
  if (type === 'video') {
    return env.DRIVE_VIDEO_FOLDER_READY || folders.folders?.ready_for_review?.id || '1Po-s54cgin2IgvJ8RYUyOxPidXQC3V_8';
  }
  throw new Error('type phải là cover hoặc video');
}

async function main() {
  const { editorial, type, file, dryRun } = parseArgs();
  if (!editorial || !type || !file) {
    console.error('Usage: --editorial 05 --type cover|video --file path');
    process.exit(1);
  }
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);

  const cfg = loadPublicConfig();
  const env = loadEnv();
  const sid = sheetId(env, cfg);
  const tab = cfg.content_drafts_tab || 'content_drafts';
  const key = `editorial:page:2026w27:${String(editorial).padStart(2, '0')}`;

  const foldersPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
  const folders = fs.existsSync(foldersPath) ? JSON.parse(fs.readFileSync(foldersPath, 'utf8')) : {};
  const folderId = folderForType(type, env, folders);

  if (dryRun) {
    console.log({ key, type, folderId, file });
    return;
  }

  const sa = loadServiceAccount();
  const driveTok = await getAccessToken(sa);
  const uploaded = await uploadFile(driveTok, folderId, file);
  const publicUrl =
    type === 'cover'
      ? `https://drive.google.com/uc?export=view&id=${uploaded.id}`
      : `https://drive.google.com/uc?export=download&id=${uploaded.id}`;

  const stok = await sheetsToken(sa);
  const sheetRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${encodeURIComponent(`${tab}!A:N`)}`,
    { headers: { Authorization: `Bearer ${stok}` } }
  );
  const sheet = await sheetRes.json();
  let rowNum = null;
  let meta = {};
  for (let i = 1; i < (sheet.values || []).length; i++) {
    if (sheet.values[i][0] === key) {
      rowNum = i + 1;
      meta = parseMeta(sheet.values[i][13]);
      break;
    }
  }
  if (!rowNum) throw new Error(`Row not found: ${key}`);

  if (type === 'cover') {
    meta.publish_image_url = publicUrl;
    meta.cover_source = 'canva';
    meta.drive_cover_file_id = uploaded.id;
    meta.publish_image_pending = false;
    if (meta.manual_assets) meta.manual_assets.status = 'cover_ready';
  } else {
    meta.manual_video_url = publicUrl;
    meta.drive_video_file_id = uploaded.id;
    if (meta.manual_assets) meta.manual_assets.status = 'video_ready';
  }
  meta.manual_upload_at = new Date().toISOString();

  const range = encodeURIComponent(`${tab}!N${rowNum}`);
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sid}/values/${range}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${stok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [[JSON.stringify(meta).slice(0, 50000)]] }),
  });

  console.log('✓ Uploaded', uploaded.name, uploaded.id);
  console.log('✓ Patched', key, 'row', rowNum);
  console.log('URL:', publicUrl);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
