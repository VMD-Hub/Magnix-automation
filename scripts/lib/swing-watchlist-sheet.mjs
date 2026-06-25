/**
 * Watchlist tab — T2 limit treo (P0). Không thay Trades_PAPER.
 */
import {
  getSheetsToken,
  monthKeyFromDate,
  rowsToObjects,
  sheetsApi,
  swingSheetId,
  todayGmt7,
} from './swing-sheet.mjs';

export const WATCHLIST_HEADERS = [
  'symbol',
  'status',
  'entry_zone',
  'stop',
  'target',
  'trigger',
  'limit_treo',
  'exec_du_kien',
  'last_review',
];

export const WATCHLIST_STATUSES = new Set(['OPEN', 'LIMIT_TREO', 'CHỜ', 'FILLED', 'WATCH']);

export function watchlistColEnd() {
  const n = WATCHLIST_HEADERS.length;
  return String.fromCharCode(64 + n);
}

export async function resolveWatchlistTab(token, spreadsheetId) {
  const meta = await sheetsApi(token, 'GET', spreadsheetId, '?fields=sheets.properties.title');
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  if (titles.includes('Watchlist')) return 'Watchlist';
  if (titles.includes('Swing_Watchlist')) return 'Swing_Watchlist';
  throw new Error('Không tìm thấy tab Watchlist — chạy init-swing-kpi.mjs');
}

export async function ensureWatchlistHeaders(spreadsheetId, token, tab) {
  const end = watchlistColEnd();
  const range = encodeURIComponent(`${tab}!A1:${end}1`);
  const cur = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const hdr = (cur.values?.[0] || []).map((h) => String(h ?? '').trim().toLowerCase());
  const ok =
    hdr.length >= WATCHLIST_HEADERS.length &&
    WATCHLIST_HEADERS.every((h, i) => hdr[i] === h.toLowerCase());
  if (!ok) {
    await sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=RAW`, {
      values: [WATCHLIST_HEADERS],
    });
  }
}

export function objectToWatchlistRow(obj) {
  return WATCHLIST_HEADERS.map((h) => {
    const v = obj[h.toLowerCase()] ?? obj[h] ?? '';
    return v === null || v === undefined ? '' : v;
  });
}

export async function fetchWatchlist(spreadsheetId, token) {
  const tab = await resolveWatchlistTab(token, spreadsheetId);
  await ensureWatchlistHeaders(spreadsheetId, token, tab);
  const end = watchlistColEnd();
  const range = encodeURIComponent(`${tab}!A:${end}`);
  const data = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const rows = rowsToObjects(data.values || [], WATCHLIST_HEADERS).map((r) => ({
    ...r,
    symbol: String(r.symbol || '').toUpperCase(),
  }));
  return { tab, rows };
}

export async function updateWatchlistRow(spreadsheetId, token, tab, sheetRow, rowValues) {
  const end = watchlistColEnd();
  const range = encodeURIComponent(`${tab}!A${sheetRow}:${end}${sheetRow}`);
  return sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=USER_ENTERED`, {
    values: [rowValues],
  });
}

export async function appendWatchlistRow(spreadsheetId, token, tab, rowValues) {
  const end = watchlistColEnd();
  const range = encodeURIComponent(`${tab}!A:${end}`);
  return sheetsApi(
    token,
    'POST',
    spreadsheetId,
    `values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { values: [rowValues] }
  );
}

export function validateWatchlistRow(row) {
  const missing = [];
  const warnings = [];
  const sym = String(row.symbol || '').trim();
  const status = String(row.status || '').trim();
  if (!sym) missing.push('symbol');
  if (!status) missing.push('status');
  if (status === 'LIMIT_TREO') {
    if (!String(row.limit_treo || '').trim()) missing.push('limit_treo');
    if (!String(row.exec_du_kien || '').trim()) missing.push('exec_du_kien');
    if (!String(row.trigger || '').trim()) warnings.push('trigger (khuyến nghị)');
  }
  if (status === 'FILLED' && !String(row.limit_treo || '').trim()) {
    warnings.push('limit_treo (giá đã khớp)');
  }
  return { ok: missing.length === 0, missing, warnings };
}

export function formatWatchlistBlock(title, result) {
  const lines = [`## ${title}`, result.ok ? '✅ Hợp lệ' : '❌ THIẾU'];
  if (result.missing?.length) lines.push(`**Cần bổ sung:** ${result.missing.join(', ')}`);
  if (result.warnings?.length) lines.push(`**Khuyến nghị:** ${result.warnings.join(', ')}`);
  return lines.join('\n');
}

/** Sau swing-log OPEN — đồng bộ Watchlist */
export async function syncWatchlistAfterOpen(symbol, { reviewDate = todayGmt7() } = {}) {
  const spreadsheetId = swingSheetId();
  if (!spreadsheetId) return;
  const token = await getSheetsToken();
  const { tab, rows } = await fetchWatchlist(spreadsheetId, token);
  const sym = String(symbol || '').toUpperCase();
  let row = rows.find((r) => r.symbol === sym);
  const patch = {
    symbol: sym,
    status: 'OPEN',
    last_review: reviewDate,
    limit_treo: '',
  };
  if (row) {
    const updated = { ...row, ...patch };
    await updateWatchlistRow(spreadsheetId, token, tab, row._sheet_row, objectToWatchlistRow(updated));
  } else {
    await appendWatchlistRow(
      spreadsheetId,
      token,
      tab,
      objectToWatchlistRow({ ...patch, entry_zone: '', stop: '', target: '', trigger: '', exec_du_kien: '' })
    );
  }
}

export async function assertPassiveFillAllowed(symbol, { filled = false, execStyle = '' } = {}) {
  const style = String(execStyle || '').toLowerCase();
  if (!['passive', 'probe'].includes(style)) return { ok: true };
  if (filled) return { ok: true };
  const spreadsheetId = swingSheetId();
  if (!spreadsheetId) return { ok: true };
  const token = await getSheetsToken();
  const { rows } = await fetchWatchlist(spreadsheetId, token);
  const row = rows.find((r) => r.symbol === String(symbol).toUpperCase());
  if (row?.status === 'LIMIT_TREO') {
    return {
      ok: false,
      missing: [
        'T2 chưa khớp — không OPEN passive/probe. Treo: swing-watchlist treo · Sau khớp: swing-watchlist filled · OPEN: --filled true',
      ],
      warnings: [],
    };
  }
  return { ok: true };
}

export { monthKeyFromDate, todayGmt7 };
