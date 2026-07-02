// n8n Code: upload PNG cover → Drive + share anyone-with-link

function slugify(s) {
  return String(s || 'cover')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .toLowerCase() || 'cover';
}

function buildFileName(item) {
  const key = String(item.normalized_key || '').trim();
  const slug = slugify(item.title || item.hook_line);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const shortKey = key.includes(':') ? key.split(':').pop() : key.slice(0, 12);
  return `magnix-page-cover-${shortKey || slug}-${date}.${item.image_ext || 'png'}`;
}

const item = $input.first().json;
if (!item.generate_ok || !item.image_base64) {
  return [{ json: { ...item, drive_ok: false, drive_skip: true } }];
}

const folderId =
  $env.DRIVE_PAGE_COVERS_FOLDER_ID
  || '__DRIVE_PAGE_COVERS_FOLDER_ID__';

if (!folderId || String(folderId).startsWith('__')) {
  return [{
    json: {
      ...item,
      drive_ok: false,
      drive_error: 'MISSING_DRIVE_PAGE_COVERS_FOLDER_ID',
      hint: 'Chạy: node scripts/init-magnix-drive-page-covers.mjs',
    },
  }];
}

const fileName = buildFileName(item);
const buf = Buffer.from(item.image_base64, 'base64');
if (!buf.length) {
  return [{ json: { ...item, drive_ok: false, drive_error: 'EMPTY_IMAGE_BUFFER' } }];
}

const mime = item.image_mime || 'image/png';
const boundary = `magnix_cover_${Date.now()}`;
const metadata = JSON.stringify({
  name: fileName,
  parents: [folderId],
  mimeType: mime,
  description: [
    'Magnix Page Cover',
    item.normalized_key || '',
    item.gemini_model || '',
  ].filter(Boolean).join(' | ').slice(0, 500),
});

const multipartBody = Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Type: ${mime}\r\n\r\n`),
  buf,
  Buffer.from(`\r\n--${boundary}--`),
]);

try {
  const uploaded = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'POST',
    url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size&supportsAllDrives=true',
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
    json: true,
  });

  const fileId = uploaded.id;
  if (!fileId) {
    return [{ json: { ...item, drive_ok: false, drive_error: 'NO_FILE_ID' } }];
  }

  await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'POST',
    url: `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?supportsAllDrives=true`,
    headers: { 'Content-Type': 'application/json' },
    body: { role: 'reader', type: 'anyone' },
    json: true,
  });

  const publishUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return [{
    json: {
      ...item,
      drive_ok: true,
      drive_file_id: fileId,
      drive_file_name: uploaded.name || fileName,
      drive_view_url: uploaded.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
      publish_image_url: publishUrl,
      drive_folder_id: folderId,
      drive_size_bytes: uploaded.size ? Number(uploaded.size) : buf.length,
    },
  }];
} catch (e) {
  return [{
    json: {
      ...item,
      drive_ok: false,
      drive_error: 'DRIVE_UPLOAD_FAILED',
      drive_message: String(e.message || e),
      drive_file_name: fileName,
    },
  }];
}
