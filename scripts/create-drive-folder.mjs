#!/usr/bin/env node
/**
 * Tạo (hoặc tìm) folder con trong Magnix Drive root.
 * Usage: node scripts/create-drive-folder.mjs Trade_Project
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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
  const signature = base64url(sign.sign(sa.private_key));
  const jwt = `${unsigned}.${signature}`;

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
  const folderName = process.argv[2];
  if (!folderName) {
    console.error('Usage: node scripts/create-drive-folder.mjs <FolderName>');
    process.exit(1);
  }

  const env = loadEnv();
  const publicConfig = JSON.parse(
    fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8')
  );
  const parentId =
    env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID ||
    env.GOOGLE_DRIVE_FOLDER_ID ||
    publicConfig.drive_folder_id;

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');

  if (!fs.existsSync(saPath)) {
    console.error('Service account not found:', saPath);
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa, ['https://www.googleapis.com/auth/drive']);

  console.log(`Parent: ${parentId}`);
  let folder = await findChildFolder(token, parentId, folderName);
  if (folder) {
    console.log(`· Đã có: ${folderName} (${folder.id})`);
  } else {
    folder = await createFolder(token, parentId, folderName);
    console.log(`✓ Tạo: ${folderName} (${folder.id})`);
  }

  const link = folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`;
  console.log(JSON.stringify({ id: folder.id, name: folder.name, webViewLink: link }, null, 2));
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
