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

export const CORE_SYMBOLS = ['ACB', 'HPG', 'MWG']; /** Bootstrap paper — không phải universe cố định; xem SWING-RESEARCH-CONTRACT.md */
export const LIVE_SOURCES = new Set(['vnstock', 'tcbs']);
export const TEMPLATE_SOURCES = new Set(['scan_template', 'core', 'portfolio_snapshot', 'manual', '/trade']);
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

export function isLiveMarketSource(source) {
  const s = String(source || '').toLowerCase();
  for (const p of LIVE_SOURCES) {
    if (s.startsWith(`${p}:`)) return true;
  }
  return false;
}

export function parseLiveSource(source) {
  const m = String(source || '').match(/^(vnstock|tcbs):(\d{4}-\d{2}-\d{2})/i);
  if (!m) return null;
  return { provider: m[1].toLowerCase(), session_date: m[2] };
}

export function formatLiveSource(provider, sessionDate) {
  const p = String(provider || '').toLowerCase();
  if (!LIVE_SOURCES.has(p)) throw new Error('data-source phải là vnstock hoặc tcbs');
  const d = String(sessionDate || todayGmt7()).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error('session-date phải yyyy-mm-dd');
  return `${p}:${d}`;
}
export function tierForSymbol(symbol, watchlistSymbols = null) {
  const sym = String(symbol || '').toUpperCase();
  if (watchlistSymbols?.has(sym)) return 'CORE';
  return CORE_SYMBOLS.includes(sym) ? 'CORE' : 'SATELLITE';
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
  if (row.tier === 'SATELLITE' && !isLiveMarketSource(row.source)) return 'NEED_RESEARCH';
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
  const clearThrough = Math.max(values.length + 5, 20);
  while (values.length < clearThrough) {
    values.push(UNIVERSE_SCAN_HEADERS.map(() => ''));
  }
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
  /** Chỉ snapshot vị thế paper — KHÔNG phải ranking thuật toán. Satellite = trống cho đến scan live. */
  return [
    {
      rank: 1,
      symbol: 'ACB',
      tier: 'CORE',
      bucket: 'bank',
      verdict: 'VAO_DUOC',
      cro_score: '',
      rr_planned: '',
      trigger_status: 'SAN_SANG',
      action: 'CORE',
      scan_week: week,
      last_scan: today,
      entry_zone: '',
      stop: '',
      target: '',
      notes: 'portfolio_snapshot — sync từ Watchlist/OPEN',
      source: 'portfolio_snapshot',
    },
    {
      rank: 2,
      symbol: 'HPG',
      tier: 'CORE',
      bucket: 'cyclical',
      verdict: 'CHO_THEM',
      cro_score: '',
      rr_planned: '',
      trigger_status: 'WATCH',
      action: 'CORE',
      scan_week: week,
      last_scan: today,
      entry_zone: '',
      stop: '',
      target: '',
      notes: 'portfolio_snapshot — LIMIT_TREO trên Watchlist',
      source: 'portfolio_snapshot',
    },
    {
      rank: 3,
      symbol: 'MWG',
      tier: 'CORE',
      bucket: 'retail',
      verdict: 'CHO_THEM',
      cro_score: '',
      rr_planned: '',
      trigger_status: 'NOT_READY',
      action: 'CORE',
      scan_week: week,
      last_scan: today,
      entry_zone: '',
      stop: '',
      target: '',
      notes: 'portfolio_snapshot — theo dõi, chưa setup',
      source: 'portfolio_snapshot',
    },
  ];
}

/** Đồng bộ Core từ Watchlist — không invent Satellite */
export function buildCoreRowsFromWatchlist(watchlistRows, week = isoWeekKey()) {
  const today = todayGmt7();
  return watchlistRows.map((w) => ({
    symbol: String(w.symbol || '').toUpperCase(),
    tier: 'CORE',
    bucket: bucketForSymbol(w.symbol),
    verdict: String(w.status || '').toUpperCase() === 'OPEN' ? 'VAO_DUOC' : 'CHO_THEM',
    cro_score: '',
    rr_planned: '',
    trigger_status:
      String(w.status || '').toUpperCase() === 'OPEN'
        ? 'SAN_SANG'
        : String(w.status || '').toUpperCase() === 'LIMIT_TREO'
          ? 'WATCH'
          : 'NOT_READY',
    action: 'CORE',
    scan_week: week,
    last_scan: today,
    entry_zone: w.entry_zone || '',
    stop: w.stop || '',
    target: w.target || '',
    notes: `Watchlist · ${w.status || ''} · ${w.exec_du_kien || ''}`.trim(),
    source: 'portfolio_snapshot',
  }));
}

export function purgeNonLiveSatellites(rows) {
  return rows.filter((r) => r.tier !== 'SATELLITE' || isLiveMarketSource(r.source));
}

export function countLiveSatellites(rows) {
  return rows.filter((r) => r.tier === 'SATELLITE' && isLiveMarketSource(r.source)).length;
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
