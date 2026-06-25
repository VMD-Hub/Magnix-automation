/**
 * Google Sheet helpers — Trades_SHADOW tab.
 */
import fs from 'node:fs';
import path from 'node:path';
import { SHADOW_HEADERS, objectToShadowRow } from './swing-shadow-schema.mjs';
import { LOCAL_KPI_DIR, sheetsApi, swingSheetId } from './swing-sheet.mjs';

export { swingSheetId };
export { getSheetsToken } from './swing-sheet.mjs';

export function shadowColRange() {
  const n = SHADOW_HEADERS.length;
  let col = '';
  let x = n;
  while (x > 0) {
    col = String.fromCharCode(65 + ((x - 1) % 26)) + col;
    x = Math.floor((x - 1) / 26);
  }
  return `A:${col}`;
}

export async function resolveShadowTab(token, spreadsheetId) {
  const meta = await sheetsApi(token, 'GET', spreadsheetId, '?fields=sheets.properties.title');
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  if (titles.includes('Trades_SHADOW')) return 'Trades_SHADOW';
  if (titles.includes('Swing_Trades_SHADOW')) return 'Swing_Trades_SHADOW';
  return null;
}

export async function ensureShadowTab(token, spreadsheetId) {
  let tab = await resolveShadowTab(token, spreadsheetId);
  if (tab) return tab;
  await sheetsApi(token, 'POST', spreadsheetId, ':batchUpdate', {
    requests: [{ addSheet: { properties: { title: 'Trades_SHADOW' } } }],
  });
  tab = 'Trades_SHADOW';
  const range = encodeURIComponent(`${tab}!A1`);
  await sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=RAW`, {
    values: [SHADOW_HEADERS],
  });
  return tab;
}

export function shadowRowsToObjects(values) {
  if (!values?.length) return [];
  const hdr = values[0].map((h) => String(h ?? '').trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const cells = values[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;
    const obj = { _sheet_row: i + 1 };
    hdr.forEach((key, j) => {
      if (key) obj[key] = cells[j] ?? '';
    });
    rows.push(obj);
  }
  return rows;
}

export async function fetchTradesShadow(spreadsheetId, token) {
  const tab = await ensureShadowTab(token, spreadsheetId);
  const range = encodeURIComponent(`${tab}!${shadowColRange()}`);
  const data = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  return { tab, rows: shadowRowsToObjects(data.values || []) };
}

export async function appendShadowRow(spreadsheetId, token, tab, rowValues) {
  const range = encodeURIComponent(`${tab}!${shadowColRange()}`);
  return sheetsApi(
    token,
    'POST',
    spreadsheetId,
    `values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { values: [rowValues] }
  );
}

export async function updateShadowRow(spreadsheetId, token, tab, sheetRow, rowValues) {
  const endCol = shadowColRange().split(':')[1];
  const range = encodeURIComponent(`${tab}!A${sheetRow}:${endCol}${sheetRow}`);
  return sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=USER_ENTERED`, {
    values: [rowValues],
  });
}

export function shadowObjectToRow(obj) {
  return objectToShadowRow(obj);
}

export function syncShadowCsv(rows) {
  const csvPath = path.join(LOCAL_KPI_DIR, 'shadow-tracker.csv');
  try {
    fs.mkdirSync(LOCAL_KPI_DIR, { recursive: true });
    const lines = [SHADOW_HEADERS.join(',')];
    for (const r of rows) {
      lines.push(
        SHADOW_HEADERS.map((h) => {
          const v = String(r[h] ?? r[h.toLowerCase()] ?? '');
          return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
        }).join(',')
      );
    }
    fs.writeFileSync(csvPath, lines.join('\n') + '\n', 'utf8');
    return csvPath;
  } catch (e) {
    console.warn('⚠ shadow CSV local:', e.message);
    return '';
  }
}

export function shadowKey(paperTradeId, scenarioId) {
  return `${paperTradeId}::${scenarioId}`;
}

export function indexShadowRows(rows) {
  const map = new Map();
  for (const r of rows) {
    map.set(shadowKey(r.paper_trade_id, r.scenario_id), r);
  }
  return map;
}
