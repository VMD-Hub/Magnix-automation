/**
 * Swing KPI — Google Sheet + CSV helpers (Phase 1 PAPER).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.join(__dirname, '..', '..');
export const LOCAL_KPI_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME || '',
  'Documents',
  'swing-kpi'
);

export const TRADES_HEADERS = [
  'trade_id',
  'month',
  'mode',
  'symbol',
  'open_date',
  'close_date',
  'direction',
  'entry_vnd',
  'exit_vnd',
  'stop_vnd',
  'target_vnd',
  'size_pct',
  'qty',
  'notional_vnd',
  'gross_pct',
  'fees_pct',
  'net_pct',
  'rr_planned',
  'rr_achieved',
  'result',
  'vni_entry',
  'notes',
];

export const DEFAULT_FEES_PCT = 0.7;
export const PAPER_NAV = 500_000_000;
export const TARGET_MONTH_PCT = 3;
export const STOP_MONTH_PCT = -3;
export const HOSE_LOT_SIZE = 100;

/** Khối lượng CP từ % vốn — làm tròn xuống lô 100 HOSE */
export function calcPositionSize(entryVnd, sizePct, nav = PAPER_NAV, lotSize = HOSE_LOT_SIZE, stopVnd = null) {
  const entry = num(entryVnd);
  const pct = num(sizePct);
  if (!entry || !pct) throw new Error('calcPositionSize cần entry và size_pct');
  const notionalTarget = Math.round(nav * (pct / 100));
  let qty = Math.floor(notionalTarget / entry / lotSize) * lotSize;
  if (qty < lotSize) qty = lotSize;
  const notional = qty * entry;
  const sizePctActual = Math.round((notional / nav) * 10000) / 100;
  const stop = stopVnd != null ? num(stopVnd) : NaN;
  const riskVnd = !Number.isNaN(stop) ? Math.abs(entry - stop) * qty : null;
  const riskPctNav = riskVnd != null ? Math.round((riskVnd / nav) * 10000) / 100 : null;
  return {
    qty,
    notional_vnd: notional,
    notional_target_vnd: notionalTarget,
    size_pct_actual: sizePctActual,
    risk_vnd: riskVnd,
    risk_pct_nav: riskPctNav,
  };
}

export function tradesColRange() {
  const n = TRADES_HEADERS.length;
  let col = '';
  let x = n;
  while (x > 0) {
    col = String.fromCharCode(65 + ((x - 1) % 26)) + col;
    x = Math.floor((x - 1) / 26);
  }
  return `A:${col}`;
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function loadEnv() {
  const envPath = path.join(REPO_ROOT, 'n8n-workflows/.env');
  const map = {};
  if (!fs.existsSync(envPath)) return map;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

export function loadPublicConfig() {
  const p = path.join(REPO_ROOT, 'n8n-workflows/magnix-public-config.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function loadServiceAccount(env = loadEnv()) {
  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(REPO_ROOT, 'n8n-workflows/credentials/google-service-account.json');
  if (!fs.existsSync(saPath)) throw new Error(`Missing Service Account: ${saPath}`);
  return JSON.parse(fs.readFileSync(saPath, 'utf8'));
}

export function swingSheetId(env = loadEnv(), cfg = loadPublicConfig()) {
  return env.GOOGLE_SHEET_SWING_KPI_ID || cfg.google_sheet_swing_kpi_id || '';
}

export async function getSheetsToken(scope = 'https://www.googleapis.com/auth/spreadsheets') {
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

export async function sheetsApi(token, method, spreadsheetId, pathPart, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/${pathPart}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

export async function resolveTradesTab(token, spreadsheetId) {
  const meta = await sheetsApi(token, 'GET', spreadsheetId, '?fields=sheets.properties.title');
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  if (titles.includes('Trades_PAPER')) return 'Trades_PAPER';
  if (titles.includes('Swing_Trades_PAPER')) return 'Swing_Trades_PAPER';
  throw new Error('Không tìm thấy tab Trades_PAPER');
}

export function rowsToObjects(values, headers = TRADES_HEADERS) {
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

export function objectToRow(obj) {
  return TRADES_HEADERS.map((h) => {
    const v = obj[h.toLowerCase()] ?? obj[h] ?? '';
    return v === null || v === undefined ? '' : v;
  });
}

export async function ensureTradesHeaders(spreadsheetId, token, tab) {
  const range = encodeURIComponent(`${tab}!A1:${tradesColRange().split(':')[1]}1`);
  const cur = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const hdr = (cur.values?.[0] || []).map((h) => String(h ?? '').trim().toLowerCase());
  const ok =
    hdr.length >= TRADES_HEADERS.length &&
    TRADES_HEADERS.every((h, i) => hdr[i] === h.toLowerCase());
  if (!ok) {
    await sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=RAW`, {
      values: [TRADES_HEADERS],
    });
  }
}

export async function fetchTradesPaper(spreadsheetId, token) {
  const tab = await resolveTradesTab(token, spreadsheetId);
  await ensureTradesHeaders(spreadsheetId, token, tab);
  const range = encodeURIComponent(`${tab}!${tradesColRange()}`);
  const data = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const rows = rowsToObjects(data.values || []);
  for (const r of rows) {
    if (!r.qty && r.entry_vnd && r.size_pct) {
      const pos = calcPositionSize(r.entry_vnd, r.size_pct, PAPER_NAV, HOSE_LOT_SIZE, r.stop_vnd);
      r.qty = pos.qty;
      r.notional_vnd = pos.notional_vnd;
    }
  }
  return { tab, rows };
}

export async function appendTradeRow(spreadsheetId, token, tab, rowValues) {
  await ensureTradesHeaders(spreadsheetId, token, tab);
  const range = encodeURIComponent(`${tab}!${tradesColRange()}`);
  return sheetsApi(
    token,
    'POST',
    spreadsheetId,
    `values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    { values: [rowValues] }
  );
}

export async function updateTradeRow(spreadsheetId, token, tab, sheetRow, rowValues) {
  const endCol = tradesColRange().split(':')[1];
  const range = encodeURIComponent(`${tab}!A${sheetRow}:${endCol}${sheetRow}`);
  return sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=USER_ENTERED`, {
    values: [rowValues],
  });
}

export function todayGmt7() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function monthKeyFromDate(dateStr) {
  const s = String(dateStr || '').trim();
  if (/^\d{4}-\d{2}/.test(s)) return s.slice(0, 7);
  const m = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}`;
  return todayGmt7().slice(0, 7);
}

export function nextTradeId(rows, openDate = todayGmt7()) {
  const compact = openDate.replace(/-/g, '');
  const prefix = `PAPER-${compact}-`;
  const nums = rows
    .map((r) => String(r.trade_id || ''))
    .filter((id) => id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)) || 0);
  const seq = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(seq).padStart(2, '0')}`;
}

export function num(v) {
  if (v === '' || v === null || v === undefined) return NaN;
  return Number(String(v).replace(/,/g, ''));
}

export function calcRrPlanned(entry, stop, target, direction = 'LONG') {
  const e = num(entry);
  const s = num(stop);
  const t = num(target);
  if (!e || !s || !t) return '';
  const risk = direction.toUpperCase() === 'SHORT' ? Math.abs(s - e) : Math.abs(e - s);
  const reward = direction.toUpperCase() === 'SHORT' ? Math.abs(e - t) : Math.abs(t - e);
  if (!risk) return '';
  return Math.round((reward / risk) * 100) / 100;
}

export function calcCloseMetrics(entry, exit, stop, direction = 'LONG', feesPct = DEFAULT_FEES_PCT) {
  const e = num(entry);
  const x = num(exit);
  const s = num(stop);
  if (!e || !x) throw new Error('entry và exit phải là số');
  const isLong = direction.toUpperCase() !== 'SHORT';
  const grossPct = isLong ? ((x - e) / e) * 100 : ((e - x) / e) * 100;
  const netPct = grossPct - num(feesPct);
  const risk = isLong ? Math.abs(e - s) : Math.abs(s - e);
  const reward = isLong ? Math.abs(x - e) : Math.abs(e - x);
  const rrAchieved = risk ? Math.round((reward / risk) * 100) / 100 : '';
  const result = netPct >= 0 ? 'W' : 'L';
  return {
    gross_pct: Math.round(grossPct * 100) / 100,
    fees_pct: num(feesPct),
    net_pct: Math.round(netPct * 100) / 100,
    rr_achieved: rrAchieved,
    result,
  };
}

export function syncCsv(rows) {
  const csvPath = path.join(LOCAL_KPI_DIR, 'kpi-tracker.csv');
  if (!fs.existsSync(path.dirname(csvPath))) fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  const lines = [TRADES_HEADERS.join(',')];
  for (const r of rows) {
    lines.push(
      objectToRow(r)
        .map((c) => {
          const s = String(c ?? '');
          return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(',')
    );
  }
  fs.writeFileSync(csvPath, `${lines.join('\n')}\n`);
  return csvPath;
}

export function parseKvArgs(argv) {
  const positional = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > 0) {
        opts[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const key = a.slice(2);
        const next = argv[i + 1];
        if (next && !next.startsWith('--')) {
          opts[key] = next;
          i++;
        } else {
          opts[key] = 'true';
        }
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, opts };
}

export function findOpenTrade(rows, { tradeId, symbol }) {
  const open = rows.filter((r) => String(r.mode || '').toUpperCase() === 'PAPER' && !String(r.close_date || '').trim());
  if (tradeId) {
    const hit = open.find((r) => String(r.trade_id) === tradeId);
    if (hit) return hit;
    throw new Error(`Không tìm OPEN trade_id=${tradeId}`);
  }
  if (symbol) {
    const sym = symbol.toUpperCase();
    const hits = open.filter((r) => String(r.symbol || '').toUpperCase() === sym);
    if (hits.length === 1) return hits[0];
    if (hits.length > 1) throw new Error(`Nhiều lệnh OPEN cho ${sym} — dùng --id`);
    throw new Error(`Không có lệnh OPEN cho ${sym}`);
  }
  throw new Error('Cần --id hoặc --symbol');
}

export function computeKpiSummary(rows, monthKey = monthKeyFromDate(todayGmt7())) {
  const paper = rows.filter((r) => String(r.mode || '').toUpperCase() === 'PAPER');
  const closed = paper.filter((r) => String(r.close_date || '').trim());
  const closedMonth = closed.filter((r) => String(r.month || monthKeyFromDate(r.open_date)) === monthKey);
  const open = paper.filter((r) => !String(r.close_date || '').trim());

  const wins = closed.filter((r) => String(r.result || '').toUpperCase() === 'W').length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 1000) / 10 : null;

  const rrVals = closed.map((r) => num(r.rr_achieved)).filter((n) => !Number.isNaN(n));
  const avgRr = rrVals.length ? Math.round((rrVals.reduce((a, b) => a + b, 0) / rrVals.length) * 100) / 100 : null;

  let netMonthPct = 0;
  for (const r of closedMonth) {
    const net = num(r.net_pct);
    const size = num(r.size_pct);
    if (!Number.isNaN(net) && !Number.isNaN(size)) netMonthPct += (net * size) / 100;
  }
  netMonthPct = Math.round(netMonthPct * 100) / 100;

  const withStop = paper.filter((r) => num(r.stop_vnd) > 0);
  const stopCompliance = paper.length ? Math.round((withStop.length / paper.length) * 1000) / 10 : 100;

  const ruleTagged = paper.filter((r) => /rule_followed:/i.test(String(r.notes || '')));
  const ruleYes = ruleTagged.filter((r) => /rule_followed:Y/i.test(String(r.notes || '')));
  const ruleCompliance = ruleTagged.length
    ? Math.round((ruleYes.length / ruleTagged.length) * 1000) / 10
    : null;

  const months = [...new Set(paper.map((r) => String(r.month || monthKeyFromDate(r.open_date)).slice(0, 7)))].filter(Boolean);

  let status = 'ON TRACK';
  if (netMonthPct <= STOP_MONTH_PCT) status = 'STOP';
  else if (closedMonth.length === 0) status = 'ON TRACK';
  else if (netMonthPct < TARGET_MONTH_PCT * 0.5) status = 'BEHIND';
  else if (netMonthPct < TARGET_MONTH_PCT) status = 'AT RISK';

  return {
    month: monthKey,
    nav_base: PAPER_NAV,
    nav_est: Math.round(PAPER_NAV * (1 + netMonthPct / 100)),
    net_month_pct: netMonthPct,
    target_pct: TARGET_MONTH_PCT,
    trades_closed_total: closed.length,
    trades_closed_month: closedMonth.length,
    trades_open: open.length,
    win_rate_pct: winRate,
    avg_rr: avgRr,
    stop_compliance_pct: stopCompliance,
    rule_compliance_pct: ruleCompliance,
    paper_months: months.length,
    status,
    open_positions: open.map((r) => ({
      trade_id: r.trade_id,
      symbol: r.symbol,
      open_date: r.open_date,
      entry_vnd: r.entry_vnd,
      stop_vnd: r.stop_vnd,
      target_vnd: r.target_vnd,
    })),
  };
}

export function computeRealGate(rows, monthlyRows = []) {
  const paper = rows.filter((r) => String(r.mode || '').toUpperCase() === 'PAPER');
  const closed = paper.filter((r) => String(r.close_date || '').trim());
  const withStop = paper.filter((r) => num(r.stop_vnd) > 0);
  const ruleTagged = paper.filter((r) => /rule_followed:/i.test(String(r.notes || '')));
  const ruleYes = ruleTagged.filter((r) => /rule_followed:Y/i.test(String(r.notes || '')));

  const wins = closed.filter((r) => String(r.result || '').toUpperCase() === 'W').length;
  const winRate = closed.length ? wins / closed.length : 0;
  const rrVals = closed.map((r) => num(r.rr_achieved)).filter((n) => !Number.isNaN(n));
  const avgRr = rrVals.length ? rrVals.reduce((a, b) => a + b, 0) / rrVals.length : 0;

  const months = [...new Set(paper.map((r) => String(r.month || monthKeyFromDate(r.open_date))))].filter(Boolean);
  const lessonCount = monthlyRows.filter((r) => String(r.lesson_1 || r.rule_next || '').trim()).length;

  const checks = {
    A1_trades_closed_gte_15: closed.length >= 15,
    A2_months_gte_2: months.length >= 2,
    A3_stop_100pct: paper.length > 0 && withStop.length === paper.length,
    A4_rule_gte_80: ruleTagged.length === 0 ? false : ruleYes.length / ruleTagged.length >= 0.8,
    B1_win_rate_gte_50: closed.length >= 5 && winRate >= 0.5,
    B2_avg_rr_gte_1_4: rrVals.length >= 5 && avgRr >= 1.4,
    B3_max_dd_lte_4: null,
    B4_net_2_months_gte_0: null,
    C1_lessons_gte_5: lessonCount >= 5,
    C2_user_top3_errors: false,
    C3_no_fomo_4w: null,
    D1_real_nav_filled: false,
    D2_accept_pilot_size: false,
    D3_commit_real_log: false,
  };

  const passCount = Object.values(checks).filter((v) => v === true).length;
  const scorable = Object.values(checks).filter((v) => v !== null).length;

  return { checks, passCount, scorable, ready: passCount === scorable && scorable > 0 };
}
