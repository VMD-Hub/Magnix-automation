#!/usr/bin/env node
/** Test Google Sheets PUT body — mô phỏng n8n jsonBody */
import { getAccessToken } from './lib/sheet-client.mjs';

const sheetId = '1fYB4h_BTiKXa9O3lBah-tQonWpQOQMG2aSkSfPs6yU4';
const token = await getAccessToken();
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/video_drafts!W7?valueInputOption=USER_ENTERED`;

const meta_body = { values: [['{"probe":"n8n_body_test"}']] };

async function put(label, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body,
  });
  const data = await res.json();
  console.log(label, res.status, data.updatedRange || data.error?.message);
}

// n8n specifyBody=json + jsonBody={{ JSON.stringify($json.meta_body) }}
await put('double-stringify (n8n current)', JSON.stringify(JSON.stringify(meta_body)));
await put('correct object', JSON.stringify(meta_body));

const read = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/video_drafts!W7`,
  { headers: { Authorization: `Bearer ${token}` } }
).then((r) => r.json());
console.log('W7 after tests:', read.values?.[0]?.[0]);
