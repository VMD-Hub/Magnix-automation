/**
 * CRO Universe_Scan tab — Satellite tier + weekly ritual.
 */
import {
  getSheetsToken,
  rowsToObjects,
  sheetsApi,
  swingSheetId,
  todayGmt7,
} from './swing-sheet.mjs';
import { bucketForSymbol } from './swing-portfolio.mjs';

export const CORE_SYMBOLS = ['ACB', 'HPG', 'MWG'];
export const MAX_SATELLITE_ON_WATCHLIST = 2;
export const MAX_SCAN_ACTIVE = 12;

export const UNIVERSE_SCAN_HEADERS = [
  'rank',
  'symbol',
  'tier',
  'bucket',
  'verdict',
  'cro_score',
  'rr_planned',
  'trigger_status',
  'action',
  'scan_week',
  'last_scan',
  'entry_zone',
  'stop',
  'target',
  'notes',
  'source',
];

export const TIERS = new Set(['CORE', 'SATELLITE']);
export const TRIGGERS = new Set(['NOT_READY', 'WATCH', 'SAN_SANG']);
export const ACTIONS = new Set(['HOLD', 'PROMOTE', 'TREO', 'PASS', 'CORE']);

export function scanColEnd() {
  const n = UNIVERSE_SCAN_HEADERS.length;
  let col = '';
  let x = n;
  while (x > 0) {
    col = String.fromCharCode(65 + ((x - 1) % 26)) + col;
    x = Math.floor((x - 1) / 26);
  }
  return col;
}

export function isoWeekKey(dateStr = todayGmt7()) {
  const d = new Date(`${dateStr}T12:00:00+07:00`);
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const year = d.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const week =
    1 +
    Math.round(
      ((d.getTime() - jan4.getTime()) / 86400000 - ((jan4.getUTCDay() + 6) % 7) + 3) / 7
    );
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function tierForSymbol(symbol) {
  return CORE_SYMBOLS.includes(String(symbol || '').toUpperCase()) ? 'CORE' : 'SATELLITE';
}

export function num(v) {
  if (v == null || v === '') return NaN;
  const n = Number(String(v).replace(/,/g, '').replace('%', ''));
  return Number.isFinite(n) ? n : NaN;
}

/**
 * CRO composite score 0–100 (heuristic, không phải khuyến nghị đầu tư).
 */
export function computeCroScore(row, ctx = {}) {
  let s = 0;
  const verdict = String(row.verdict || '').toUpperCase();
  if (verdict.includes('VAO') || verdict.includes('MUA')) s += 38;
  else if (verdict.includes('CHO') || verdict.includes('CHỜ')) s += 22;
  else if (verdict.includes('PASS') || verdict.includes('TRANH')) s += 5;
  else s += 12;

  const rr = num(row.rr_planned);
  if (rr >= 1.8) s += 28;
  else if (rr >= 1.5) s += 22;
  else if (rr >= 1.2) s += 12;

  const trig = String(row.trigger_status || '').toUpperCase();
  if (trig === 'SAN_SANG' || trig.includes('SAN')) s += 24;
  else if (trig === 'WATCH') s += 12;

  const bucket = row.bucket || bucketForSymbol(row.symbol);
  const openBuckets = ctx.openBuckets || [];
  if (bucket && bucket !== 'other' && !openBuckets.includes(bucket)) s += 8;

  if (ctx.portfolioMode === 'BEHIND') s -= 8;
  if (ctx.portfolioMode === 'STOP') s -= 20;

  return Math.min(100, Math.max(0, Math.round(s)));
}

export function suggestAction(row, score) {
  if (row.tier === 'CORE') return 'CORE';
  const s = score ?? computeCroScore(row);
  const trig = String(row.trigger_status || '').toUpperCase();
  if (s < 35 || String(row.verdict || '').toUpperCase().includes('PASS')) return 'PASS';
  if (trig === 'SAN_SANG' && s >= 70) return 'TREO';
  if (s >= 55) return 'PROMOTE';
  return 'HOLD';
}

export async function resolveUniverseScanTab(token, spreadsheetId) {
  const meta = await sheetsApi(token, 'GET', spreadsheetId, '?fields=sheets.properties.title');
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  if (titles.includes('Universe_Scan')) return 'Universe_Scan';
  if (titles.includes('Swing_Universe_Scan')) return 'Swing_Universe_Scan';
  throw new Error('Không tìm thấy tab Universe_Scan — chạy: node scripts/swing-cro.mjs init-tab');
}

export async function ensureUniverseScanHeaders(spreadsheetId, token, tab) {
  const end = scanColEnd();
  const range = encodeURIComponent(`${tab}!A1:${end}1`);
  const cur = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const hdr = (cur.values?.[0] || []).map((h) => String(h ?? '').trim().toLowerCase());
  const ok =
    hdr.length >= UNIVERSE_SCAN_HEADERS.length &&
    UNIVERSE_SCAN_HEADERS.every((h, i) => hdr[i] === h.toLowerCase());
  if (!ok) {
    await sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=RAW`, {
      values: [UNIVERSE_SCAN_HEADERS],
    });
  }
}

export function objectToScanRow(obj) {
  return UNIVERSE_SCAN_HEADERS.map((h) => {
    const v = obj[h.toLowerCase()] ?? obj[h] ?? '';
    return v === null || v === undefined ? '' : v;
  });
}

export async function fetchUniverseScan(spreadsheetId, token) {
  const tab = await resolveUniverseScanTab(token, spreadsheetId);
  await ensureUniverseScanHeaders(spreadsheetId, token, tab);
  const end = scanColEnd();
  const range = encodeURIComponent(`${tab}!A:${end}`);
  const data = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const rows = rowsToObjects(data.values || [], UNIVERSE_SCAN_HEADERS).map((r) => ({
    ...r,
    symbol: String(r.symbol || '').toUpperCase(),
    tier: tierForSymbol(r.symbol) === 'CORE' ? 'CORE' : String(r.tier || 'SATELLITE').toUpperCase(),
  }));
  return { tab, rows };
}

export async function writeUniverseScanTable(spreadsheetId, token, tab, rows) {
  const end = scanColEnd();
  const values = [UNIVERSE_SCAN_HEADERS, ...rows.map((r) => objectToScanRow(r))];
  const range = encodeURIComponent(`${tab}!A1:${end}${values.length}`);
  await sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=USER_ENTERED`, {
    values,
  });
}

export function rankScanRows(rows, ctx = {}) {
  const enriched = rows.map((r) => {
    const score = computeCroScore(r, ctx);
    const action = r.action && r.tier === 'CORE' ? r.action : suggestAction(r, score);
    return { ...r, cro_score: score, action };
  });
  const core = enriched.filter((r) => r.tier === 'CORE');
  const sat = enriched
    .filter((r) => r.tier === 'SATELLITE' && r.action !== 'PASS')
    .sort((a, b) => num(b.cro_score) - num(a.cro_score) || a.symbol.localeCompare(b.symbol));
  const passed = enriched.filter((r) => r.tier === 'SATELLITE' && r.action === 'PASS');
  const ordered = [...core, ...sat, ...passed];
  return ordered.map((r, i) => ({ ...r, rank: i + 1 }));
}

export function defaultSeedRows(week = isoWeekKey()) {
  const today = todayGmt7();
  return [
    {
      rank: 1,
      symbol: 'ACB',
      tier: 'CORE',
      bucket: 'bank',
      verdict: 'VAO_DUOC',
      cro_score: 85,
      rr_planned: 1.9,
      trigger_status: 'SAN_SANG',
      action: 'CORE',
      scan_week: week,
      last_scan: today,
      entry_zone: '22.2-22.6',
      stop: '<21.850',
      target: '23.6-24.0',
      notes: 'OPEN T1 bootstrap',
      source: 'core',
    },
    {
      rank: 2,
      symbol: 'HPG',
      tier: 'CORE',
      bucket: 'cyclical',
      verdict: 'CHO_THEM',
      cro_score: 72,
      rr_planned: 1.6,
      trigger_status: 'WATCH',
      action: 'CORE',
      scan_week: week,
      last_scan: today,
      entry_zone: '23.0-23.5',
      stop: '<22.300',
      target: '25.5-26.5',
      notes: 'LIMIT_TREO 23200 T2',
      source: 'core',
    },
    {
      rank: 3,
      symbol: 'MWG',
      tier: 'CORE',
      bucket: 'retail',
      verdict: 'CHO_THEM',
      cro_score: 58,
      rr_planned: 1.4,
      trigger_status: 'NOT_READY',
      action: 'CORE',
      scan_week: week,
      last_scan: today,
      entry_zone: '76-77.5',
      stop: '<74.500',
      target: '82-85',
      notes: 'T3 probe size <=25%',
      source: 'core',
    },
    {
      rank: 4,
      symbol: 'FPT',
      tier: 'SATELLITE',
      bucket: 'other',
      verdict: 'CHO_THEM',
      cro_score: 52,
      rr_planned: 1.35,
      trigger_status: 'WATCH',
      action: 'HOLD',
      scan_week: week,
      last_scan: today,
      entry_zone: '',
      stop: '',
      target: '',
      notes: 'Defensive beta — scan /trade trước promote',
      source: 'scan_template',
    },
    {
      rank: 5,
      symbol: 'TCB',
      tier: 'SATELLITE',
      bucket: 'bank',
      verdict: 'PASS',
      cro_score: 28,
      rr_planned: 1.1,
      trigger_status: 'NOT_READY',
      action: 'PASS',
      scan_week: week,
      last_scan: today,
      entry_zone: '',
      stop: '',
      target: '',
      notes: 'Trùng bucket ACB OPEN — không ưu tiên',
      source: 'scan_template',
    },
  ];
}

export async function ensureUniverseScanTab(spreadsheetId, token) {
  const meta = await sheetsApi(token, 'GET', spreadsheetId, '?fields=sheets.properties');
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  if (!titles.includes('Universe_Scan') && !titles.includes('Swing_Universe_Scan')) {
    await sheetsApi(token, 'POST', spreadsheetId, ':batchUpdate', {
      requests: [{ addSheet: { properties: { title: 'Universe_Scan' } } }],
    });
  }
  const tab = await resolveUniverseScanTab(token, spreadsheetId);
  const week = isoWeekKey();
  const rows = rankScanRows(defaultSeedRows(week));
  await writeUniverseScanTable(spreadsheetId, token, tab, rows);
  return tab;
}
