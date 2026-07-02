#!/usr/bin/env node
/**
 * Tạo folder Google Drive "Magnix_Page_Covers" cho ảnh cover Facebook Page.
 *
 * Usage:
 *   node scripts/init-magnix-drive-page-covers.mjs
 *   node scripts/init-magnix-drive-page-covers.mjs --dry-run
 *
 * Output: cập nhật magnix-public-config.json + magnix-drive-folders.json
 * Env: DRIVE_PAGE_COVERS_FOLDER_ID
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const FOLDER_NAME = 'Magnix_Page_Covers';

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
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: scopes.join(' '),
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
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function driveApi(token, method, urlPath, body, headers = {}) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/${urlPath}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...headers },
    body,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(data.error?.message || text || `Drive ${res.status}`);
  return data;
}

async function findChildFolder(token, parentId, name) {
  const q = encodeURIComponent(
    `'${parentId}' in parents and name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const data = await driveApi(
    token,
    'GET',
    `files?q=${q}&fields=files(id,name,webViewLink)&pageSize=5&supportsAllDrives=true&includeItemsFromAllDrives=true`
  );
  return data.files?.[0] || null;
}

async function createFolder(token, parentId, name) {
  return driveApi(
    token,
    'POST',
    'files?fields=id,name,webViewLink&supportsAllDrives=true',
    JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
    { 'Content-Type': 'application/json' }
  );
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const env = loadEnv();
  const publicConfigPath = path.join(root, 'n8n-workflows/magnix-public-config.json');
  const driveFoldersPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
  const publicConfig = JSON.parse(fs.readFileSync(publicConfigPath, 'utf8'));
  const driveFolders = JSON.parse(fs.readFileSync(driveFoldersPath, 'utf8'));

  const existingId = env.DRIVE_PAGE_COVERS_FOLDER_ID || publicConfig.drive_page_covers_folder_id;
  if (existingId) {
    console.log('Folder already configured:', existingId);
    console.log(`https://drive.google.com/drive/folders/${existingId}`);
    return;
  }

  const rootFolderId =
    env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID || env.GOOGLE_DRIVE_FOLDER_ID || publicConfig.drive_folder_id;
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON || path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));

  if (dryRun) {
    console.log('[dry-run] Would create', FOLDER_NAME, 'under', rootFolderId);
    return;
  }

  const token = await getAccessToken(sa, ['https://www.googleapis.com/auth/drive']);
  let folder = await findChildFolder(token, rootFolderId, FOLDER_NAME);
  if (!folder) {
    folder = await createFolder(token, rootFolderId, FOLDER_NAME);
    console.log('Created folder:', folder.id);
  } else {
    console.log('Found existing folder:', folder.id);
  }

  const link = folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`;

  publicConfig.drive_page_covers_folder_id = folder.id;
  fs.writeFileSync(publicConfigPath, `${JSON.stringify(publicConfig, null, 2)}\n`);

  driveFolders.page_covers = {
    folder_id: folder.id,
    folder_name: FOLDER_NAME,
    webViewLink: link,
    note: 'Ảnh cover Facebook Page (Gemini → publish_image_url)',
    updated_at: new Date().toISOString(),
  };
  fs.writeFileSync(driveFoldersPath, `${JSON.stringify(driveFolders, null, 2)}\n`);

  console.log('\nAdd to n8n-workflows/.env:');
  console.log(`DRIVE_PAGE_COVERS_FOLDER_ID=${folder.id}`);
  console.log(`CONTENT_PAGE_COVER_ENABLED=true`);
  console.log(`GEMINI_API_KEY=<from https://aistudio.google.com/apikey>`);
  console.log('\nFolder:', link);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
