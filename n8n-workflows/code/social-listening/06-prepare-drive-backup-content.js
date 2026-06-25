// n8n Code: Drive backup content_queue record → apify_raw/{normalized_key}.json

const item = $input.first().json;
const record = item.record || item.json?.record;

if (!record?.normalized_key) {
  return [{ json: { drive_skip: true, reason: 'no record' } }];
}

const folderId = '__MAGNIX_DRIVE_FOLDER_ID__';
if (!folderId) {
  return [{ json: { drive_skip: true, reason: 'backup disabled' } }];
}

const safeName = String(record.normalized_key).replace(/[^a-zA-Z0-9._-]/g, '_');
const fileName = `apify_raw/${safeName}.json`;
const content = JSON.stringify(record, null, 2);
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
      mimeType: 'application/json',
      fileName: `${safeName}.json`,
    },
  },
}];
