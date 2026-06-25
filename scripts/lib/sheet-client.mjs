/**
 * Google Sheets client (Service Account JWT) for Magnix scripts.
 */
import crypto from 'node:crypto';
import { loadEnv, loadPublicConfig, loadServiceAccount, sheetId } from './magnix-env.mjs';

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function getAccessToken(scope = 'https://www.googleapis.com/auth/spreadsheets.readonly') {
  const sa = loadServiceAccount();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope,
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

export async function fetchTab(tabName, rangeSuffix = 'A:Z') {
  const env = loadEnv();
  const id = sheetId(env);
  const token = await getAccessToken();
  const range = encodeURIComponent(`${tabName}!${rangeSuffix}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.values || [];
}

export function rowsToObjects(values) {
  if (!values?.length) return { headers: [], rows: [] };
  const headers = values[0].map((x) => String(x ?? '').trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const cells = values[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    const row = { sheet_row: i + 1 };
    headers.forEach((key, j) => {
      if (key) row[key] = cells[j] ?? '';
    });
    rows.push(row);
  }
  return { headers, rows };
}

export function colLetter(n) {
  let s = '';
  let x = n + 1;
  while (x > 0) {
    s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

export async function updateCell(tabName, row, colName, value, headers) {
  const env = loadEnv();
  const id = sheetId(env);
  const token = await getAccessToken('https://www.googleapis.com/auth/spreadsheets');
  const colIdx = headers.indexOf(colName);
  if (colIdx < 0) throw new Error(`Column not found: ${colName}`);
  const cell = `${colLetter(colIdx)}${row}`;
  const range = encodeURIComponent(`${tabName}!${cell}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?valueInputOption=RAW`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [[value]] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}
