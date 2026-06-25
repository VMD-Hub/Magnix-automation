// n8n Code: tải MP4 Creatomate → upload Drive (SEO filename) — Agent 7
// __VIDEO_DRIVE_NAME_INLINE__

const item = $input.first().json;
const row = $('Loop Render Candidates').item?.json || {};

if (!item.render_ok || !item.render_url) {
  return [{ json: { ...item, drive_ok: false, drive_skip: true } }];
}

const folderId =
  $env.DRIVE_VIDEO_FOLDER_READY ||
  '__DRIVE_VIDEO_FOLDER_READY__';

if (!folderId || folderId.startsWith('__')) {
  return [{
    json: {
      ...item,
      drive_ok: false,
      drive_error: 'MISSING_DRIVE_VIDEO_FOLDER_READY',
      hint: 'Chạy: node scripts/init-magnix-drive-folders.mjs',
    },
  }];
}

const fileName = buildVideoDriveFileName({
  segment: row.segment || item.segment,
  platform: row.platform || item.platform,
  title: row.title || item.title,
  hook_3s: row.hook_3s || item.hook_3s,
});

try {
  const mp4Buffer = await this.helpers.httpRequest({
    method: 'GET',
    url: item.render_url,
    encoding: 'arraybuffer',
    json: false,
  });

  const buf = Buffer.isBuffer(mp4Buffer) ? mp4Buffer : Buffer.from(mp4Buffer);
  if (!buf.length) {
    return [{ json: { ...item, drive_ok: false, drive_error: 'EMPTY_MP4' } }];
  }

  const boundary = `magnix_${Date.now()}`;
  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
    mimeType: 'video/mp4',
    description: [
      'Magnix Agent 7',
      row.source_normalized_key || item.source_normalized_key || '',
      row.hook_3s || '',
    ].filter(Boolean).join(' | ').slice(0, 500),
  });

  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`),
    buf,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const uploaded = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'POST',
    url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size,createdTime&supportsAllDrives=true',
    headers: {
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
    json: true,
  });

  return [{
    json: {
      ...item,
      drive_ok: true,
      drive_file_id: uploaded.id,
      drive_file_name: uploaded.name || fileName,
      drive_view_url: uploaded.webViewLink || null,
      drive_download_url: uploaded.webContentLink || null,
      drive_folder_id: folderId,
      drive_size_bytes: uploaded.size ? Number(uploaded.size) : buf.length,
      segment: row.segment || item.segment,
      hook_3s: row.hook_3s,
      title: row.title || item.title,
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
