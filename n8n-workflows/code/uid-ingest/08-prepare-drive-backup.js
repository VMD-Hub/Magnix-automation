// n8n Code node: Prepare Google Drive JSONL archive (1 file per normalized_key)
// Không block luồng chính — node Drive Upload đặt onError: continue

const item = $input.first().json;
const record = item.data && typeof item.data === 'object' ? item.data : item;

if (!record.normalized_key) {
  return [{ json: { drive_skip: true, reason: 'no normalized_key' } }];
}

const folderId = $env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID || '';
if (!folderId || $env.MAGNIX_DRIVE_BACKUP === 'false') {
  return [{ json: { drive_skip: true, reason: 'backup disabled or no folder id' } }];
}

const safeName = String(record.normalized_key).replace(/[^a-zA-Z0-9._-]/g, '_');
const fileName = `${safeName}.jsonl`;
const content = `${JSON.stringify(record)}\n`;
const binaryData = Buffer.from(content, 'utf8').toString('base64');

return [{
  json: {
    fileName,
    normalized_key: record.normalized_key,
    drive_folder_id: folderId,
  },
  binary: {
    data: {
      data: binaryData,
      mimeType: 'application/x-ndjson',
      fileName,
    },
  },
}];
