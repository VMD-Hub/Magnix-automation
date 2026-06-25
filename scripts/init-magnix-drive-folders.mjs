#!/usr/bin/env node
/**
 * Tạo cấu trúc folder video trên Google Drive (Magnix_Videos).
 *
 * Usage:
 *   node scripts/init-magnix-drive-folders.mjs
 *   node scripts/init-magnix-drive-folders.mjs --dry-run
 *
 * Output: n8n-workflows/magnix-drive-folders.json (folder IDs — không chứa secret)
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const VIDEO_SUBFOLDERS = [
  { key: 'ready_for_review', name: 'ready_for_review', description: 'MP4 sau Creatomate, chờ L3 xem' },
  { key: 'approved', name: 'approved', description: 'Đã duyệt, sẵn đăng' },
  { key: 'published', name: 'published', description: 'Đã đăng + có metrics' },
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
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(data.error?.message || text || `Drive ${res.status}`);
  }
  return data;
}

async function findChildFolder(token, parentId, name) {
  const q = encodeURIComponent(
    `'${parentId}' in parents and name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const data = await driveApi(
    token,
    'GET',
    `files?q=${q}&fields=files(id,name)&pageSize=5&supportsAllDrives=true&includeItemsFromAllDrives=true`
  );
  return data.files?.[0] || null;
}

async function createFolder(token, parentId, name) {
  return driveApi(token, 'POST', 'files?fields=id,name,webViewLink&supportsAllDrives=true', JSON.stringify({
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  }), { 'Content-Type': 'application/json' });
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const env = loadEnv();
  const publicConfig = JSON.parse(
    fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8')
  );

  const rootFolderId = env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID || env.GOOGLE_DRIVE_FOLDER_ID || publicConfig.drive_folder_id;
  const rootSubfolderName = publicConfig.drive_video_root_subfolder || 'Magnix_Videos';

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');

  if (!fs.existsSync(saPath)) {
    console.error('Service account not found:', saPath);
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
  const token = await getAccessToken(sa, ['https://www.googleapis.com/auth/drive']);

  console.log(`Drive root Magnix folder: ${rootFolderId}`);

  let videoRoot = await findChildFolder(token, rootFolderId, rootSubfolderName);
  if (!videoRoot) {
    if (dryRun) {
      console.log(`[dry-run] Sẽ tạo: ${rootSubfolderName}/`);
      videoRoot = { id: '(dry-run)', name: rootSubfolderName };
    } else {
      videoRoot = await createFolder(token, rootFolderId, rootSubfolderName);
      console.log(`✓ Tạo folder: ${rootSubfolderName} (${videoRoot.id})`);
    }
  } else {
    console.log(`· Đã có: ${rootSubfolderName} (${videoRoot.id})`);
  }

  const out = {
    drive_root_folder_id: rootFolderId,
    video_root_folder_id: videoRoot.id,
    video_root_folder_name: rootSubfolderName,
    folders: {},
    retention_days: {
      ready_for_review: publicConfig.video_drive_retention_days_ready ?? 30,
      published: publicConfig.video_drive_retention_days_published ?? 180,
    },
    naming_pattern: '{segment-slug}-{platform}-{topic-slug}-{YYYYMMDD}.mp4',
    updated_at: new Date().toISOString(),
  };

  for (const spec of VIDEO_SUBFOLDERS) {
    if (dryRun && videoRoot.id === '(dry-run)') {
      console.log(`[dry-run] Sẽ tạo: ${rootSubfolderName}/${spec.name}/`);
      out.folders[spec.key] = { id: '(dry-run)', name: spec.name, note: spec.description };
      continue;
    }

    let folder = await findChildFolder(token, videoRoot.id, spec.name);
    if (!folder) {
      if (dryRun) {
        console.log(`[dry-run] Sẽ tạo: ${rootSubfolderName}/${spec.name}/`);
        out.folders[spec.key] = { id: '(dry-run)', name: spec.name, note: spec.description };
        continue;
      }
      folder = await createFolder(token, videoRoot.id, spec.name);
      console.log(`✓ Tạo: ${spec.name}/ (${folder.id})`);
    } else {
      console.log(`· Đã có: ${spec.name}/ (${folder.id})`);
    }
    out.folders[spec.key] = {
      id: folder.id,
      name: folder.name,
      webViewLink: folder.webViewLink || null,
      note: spec.description,
    };
  }

  const outPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
  if (!dryRun) {
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    console.log('\n✓ Ghi', outPath);
    console.log('\nThêm vào VPS env:');
    console.log(`DRIVE_VIDEO_FOLDER_READY=${out.folders.ready_for_review?.id || ''}`);
    console.log(`DRIVE_VIDEO_FOLDER_APPROVED=${out.folders.approved?.id || ''}`);
    console.log(`DRIVE_VIDEO_FOLDER_PUBLISHED=${out.folders.published?.id || ''}`);
  } else {
    console.log('\nChế độ dry-run — không ghi file.');
  }
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
