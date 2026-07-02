#!/usr/bin/env node
/**
 * Tạo folder Google Drive "Magnix_NOXH_Mau_Ho_So" + upload drive-pack + share link.
 *
 * Usage:
 *   node scripts/init-magnix-drive-noxh-templates.mjs
 *   node scripts/init-magnix-drive-noxh-templates.mjs --dry-run
 *
 * Output: cập nhật n8n-workflows/magnix-drive-folders.json → noxh_templates
 * Env: DRIVE_NOXH_TEMPLATES_FOLDER_ID, DRIVE_NOXH_TEMPLATES_PUBLIC_URL
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PACK_DIR = path.join(root, 'legal-sources/noxh/drive-pack');
const FOLDER_NAME = 'Magnix_NOXH_Mau_Ho_So';

const PACK_FILES = [
  '00-HUONG-DAN-DOC-TRUOC.md',
  '02-checklist-tu-kiem-dieu-kien.md',
  '03-danh-muc-giay-to-photo.md',
  '04-huong-dan-mau-01.md',
];

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

async function findFileInFolder(token, folderId, name) {
  const q = encodeURIComponent(
    `'${folderId}' in parents and name='${name.replace(/'/g, "\\'")}' and trashed=false`
  );
  const data = await driveApi(
    token,
    'GET',
    `files?q=${q}&fields=files(id,name)&pageSize=3&supportsAllDrives=true&includeItemsFromAllDrives=true`
  );
  return data.files?.[0] || null;
}

async function uploadTextFile(token, folderId, name, content) {
  const boundary = 'magnix_drive_boundary';
  const meta = JSON.stringify({ name, parents: [folderId], mimeType: 'text/markdown' });
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n` +
    `--${boundary}\r\nContent-Type: text/markdown\r\n\r\n${content}\r\n` +
    `--${boundary}--`;
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
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(data.error?.message || text || `Upload ${res.status}`);
  return data;
}

async function shareAnyoneReader(token, fileId) {
  return driveApi(
    token,
    'POST',
    `files/${fileId}/permissions?supportsAllDrives=true`,
    JSON.stringify({ role: 'reader', type: 'anyone' }),
    { 'Content-Type': 'application/json' }
  );
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const env = loadEnv();
  const publicConfig = JSON.parse(
    fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8')
  );
  const rootFolderId =
    env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID || env.GOOGLE_DRIVE_FOLDER_ID || publicConfig.drive_folder_id;

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  if (!fs.existsSync(saPath)) {
    console.error('Service account not found:', saPath);
    process.exit(1);
  }

  for (const f of PACK_FILES) {
    if (!fs.existsSync(path.join(PACK_DIR, f))) {
      console.error('Missing pack file:', f);
      process.exit(1);
    }
  }

  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa, ['https://www.googleapis.com/auth/drive']);

  console.log(`Drive root: ${rootFolderId}`);

  let folder = await findChildFolder(token, rootFolderId, FOLDER_NAME);
  if (!folder) {
    if (dryRun) {
      console.log(`[dry-run] Sẽ tạo folder: ${FOLDER_NAME}`);
      folder = { id: '(dry-run)', webViewLink: '(dry-run)' };
    } else {
      folder = await createFolder(token, rootFolderId, FOLDER_NAME);
      console.log(`✓ Tạo folder ${FOLDER_NAME} (${folder.id})`);
    }
  } else {
    console.log(`· Đã có folder (${folder.id})`);
  }

  const uploaded = [];
  let uploadWarning = null;
  for (const name of PACK_FILES) {
    const content = fs.readFileSync(path.join(PACK_DIR, name), 'utf8');
    if (dryRun) {
      console.log(`[dry-run] Upload ${name}`);
      uploaded.push({ name, id: '(dry-run)' });
      continue;
    }
    const existing = await findFileInFolder(token, folder.id, name);
    if (existing) {
      console.log(`· Bỏ qua (đã có): ${name}`);
      uploaded.push({ name, id: existing.id, skipped: true });
      continue;
    }
    try {
      const file = await uploadTextFile(token, folder.id, name, content);
      console.log(`✓ Upload ${name} (${file.id})`);
      uploaded.push({ name, id: file.id, webViewLink: file.webViewLink });
    } catch (e) {
      uploadWarning = uploadWarning || e.message;
      console.warn(`⚠ Không upload được ${name}: ${e.message}`);
      uploaded.push({ name, id: null, manual_upload: true });
    }
  }

  if (!dryRun && folder.id !== '(dry-run)') {
    try {
      await shareAnyoneReader(token, folder.id);
      console.log('✓ Share folder: anyone with link → reader');
    } catch (e) {
      console.warn('⚠ Share folder:', e.message);
    }
  }

  if (uploadWarning) {
    console.log('\n⚠ Upload thủ công: kéo file từ legal-sources/noxh/drive-pack/ vào folder Drive trên UI.');
  }

  const publicUrl =
    folder.webViewLink || `https://drive.google.com/drive/folders/${folder.id}`;

  const driveFoldersPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
  let driveFolders = {};
  if (fs.existsSync(driveFoldersPath)) {
    try {
      driveFolders = JSON.parse(fs.readFileSync(driveFoldersPath, 'utf8'));
    } catch {
      driveFolders = {};
    }
  }

  driveFolders.noxh_templates = {
    folder_id: folder.id,
    folder_name: FOLDER_NAME,
    public_url: publicUrl,
    files: uploaded,
    pack_source: 'legal-sources/noxh/drive-pack',
    upload_note: uploadWarning || null,
    updated_at: new Date().toISOString(),
  };

  if (!dryRun) {
    fs.writeFileSync(driveFoldersPath, JSON.stringify(driveFolders, null, 2));
    console.log('\n✓ Ghi', driveFoldersPath);
    console.log('\nThêm vào n8n-workflows/.env:');
    console.log(`DRIVE_NOXH_TEMPLATES_FOLDER_ID=${folder.id}`);
    console.log(`DRIVE_NOXH_TEMPLATES_PUBLIC_URL=${publicUrl}`);
  }

  console.log('\nPublic folder:', publicUrl);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
