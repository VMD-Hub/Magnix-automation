#!/usr/bin/env node
/**
 * Swing KPI — setup Sheet tabs + CSV backup + shortcut trong Trade_Project.
 *
 * Service Account có Drive quota = 0 → không tạo file mới được.
 * - Sheet: tab Swing_* trên workbook có sẵn (hoặc Sheet user tạo trong Trade_Project)
 * - CSV: upload thử; fail → tab Swing_Backup_*
 * - Link: shortcut + swing-kpi-index (local + tab Swing_Links)
 *
 * Usage:
 *   node scripts/init-swing-kpi.mjs
 *   node scripts/init-swing-kpi.mjs --dry-run
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { DEFAULT_HYPOTHESES, SHADOW_HEADERS, THEORY_LOG_HEADERS } from './lib/swing-shadow-schema.mjs';
import {
  UNIVERSE_SCAN_HEADERS,
  defaultSeedRows as croSeedRows,
  objectToScanRow,
} from './lib/swing-cro-sheet.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SHORTCUT_NAME = 'Swing KPI — HOSE (REAL + PAPER)';
const LOCAL_KPI_DIR = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents', 'swing-kpi');

/** Tab names cho workbook riêng (user tạo trong Trade_Project) */
const DEDICATED_TABS = [
  'Dashboard',
  '_Config',
  'Trades_PAPER',
  'Trades_REAL',
  'Monthly_PAPER',
  'Monthly_REAL',
  'Watchlist',
  'Universe_Scan',
  'README',
  'Links',
  'Backup_kpi_tracker',
  'Backup_monthly_summary',
  'Trades_SHADOW',
  'Theory_Log',
];

/** Tab names khi nhúng vào workbook Magnix (tránh trùng) */
const MAGNIX_TABS = [
  'Swing_Dashboard',
  'Swing_Config',
  'Swing_Trades_PAPER',
  'Swing_Trades_REAL',
  'Swing_Monthly_PAPER',
  'Swing_Monthly_REAL',
  'Swing_Watchlist',
  'Swing_Universe_Scan',
  'Swing_README',
  'Swing_Links',
  'Swing_Backup_kpi_tracker',
  'Swing_Backup_monthly_summary',
  'Swing_Trades_SHADOW',
  'Swing_Theory_Log',
];

function parseArgs() {
  const out = { sheetId: '', dryRun: false };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--dry-run') out.dryRun = true;
    else if (arg.startsWith('--sheet-id=')) out.sheetId = arg.slice('--sheet-id='.length).trim();
    else if (arg.startsWith('--sheet-id') && process.argv.includes(arg)) {
      const i = process.argv.indexOf(arg);
      if (process.argv[i + 1]) out.sheetId = process.argv[i + 1].trim();
    }
  }
  return out;
}

function sheetIdFromUrl(input) {
  const m = String(input || '').match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : String(input || '').trim();
}

function loadEnv() {
  const envPath = path.join(root, 'n8n-workflows/.env');
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

function saveEnvKey(key, value) {
  const envPath = path.join(root, 'n8n-workflows/.env');
  let text = fs.readFileSync(envPath, 'utf8');
  const re = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}=${value}`;
  text = re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`;
  fs.writeFileSync(envPath, text);
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(sa, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: scopes.join(' '),
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
  if (!data.access_token) throw new Error(`Token failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function driveApi(token, method, urlPath, body, headers = {}) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/${urlPath}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...headers },
    body,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) throw new Error(data.error?.message || text || `Drive ${res.status}`);
  return data;
}

async function sheetsApi(token, method, urlPath, body) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${urlPath}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

async function listFolderFiles(token, folderId) {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const data = await driveApi(
    token,
    'GET',
    `files?q=${q}&fields=files(id,name,mimeType,shortcutDetails)&pageSize=50&supportsAllDrives=true&includeItemsFromAllDrives=true`
  );
  return data.files || [];
}

async function findFileByName(token, folderId, name, mimeType) {
  const mimeQ = mimeType ? ` and mimeType='${mimeType}'` : '';
  const q = encodeURIComponent(
    `'${folderId}' in parents and name='${name.replace(/'/g, "\\'")}'${mimeQ} and trashed=false`
  );
  const data = await driveApi(
    token,
    'GET',
    `files?q=${q}&fields=files(id,name,mimeType,webViewLink,shortcutDetails)&pageSize=5&supportsAllDrives=true&includeItemsFromAllDrives=true`
  );
  return data.files?.[0] || null;
}

async function findSpreadsheetInFolder(token, folderId) {
  const files = await listFolderFiles(token, folderId);
  for (const f of files) {
    if (f.mimeType === 'application/vnd.google-apps.spreadsheet') return f;
  }
  return null;
}

async function ensureShortcut(token, folderId, targetSpreadsheetId, name) {
  const existing = await findFileByName(token, folderId, name, 'application/vnd.google-apps.shortcut');
  if (existing?.shortcutDetails?.targetId === targetSpreadsheetId) {
    return existing;
  }
  if (existing) {
    await driveApi(token, 'DELETE', `files/${existing.id}?supportsAllDrives=true`);
  }
  return driveApi(
    token,
    'POST',
    'files?fields=id,name,webViewLink&supportsAllDrives=true',
    JSON.stringify({
      name,
      mimeType: 'application/vnd.google-apps.shortcut',
      parents: [folderId],
      shortcutDetails: { targetId: targetSpreadsheetId },
    }),
    { 'Content-Type': 'application/json' }
  );
}

async function uploadOrSkip(token, folderId, fileName, content, mimeType) {
  try {
    const boundary = `magnix_${Date.now()}`;
    const meta = JSON.stringify({ name: fileName, parents: [folderId] });
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`),
      Buffer.from(content, 'utf8'),
      Buffer.from(`\r\n--${boundary}--`),
    ]);
    const existing = await findFileByName(token, folderId, fileName);
    if (existing) {
      await driveApi(
        token,
        'PATCH',
        `files/${existing.id}?uploadType=multipart&fields=id,webViewLink&supportsAllDrives=true`,
        body,
        { 'Content-Type': `multipart/related; boundary=${boundary}` }
      );
      return { ok: true, id: existing.id, method: 'updated' };
    }
    const created = await driveApi(
      token,
      'POST',
      'files?uploadType=multipart&fields=id,webViewLink&supportsAllDrives=true',
      body,
      { 'Content-Type': `multipart/related; boundary=${boundary}` }
    );
    return { ok: true, id: created.id, method: 'created', webViewLink: created.webViewLink };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function parseCsvFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8').trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = [];
    let cur = '';
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === ',' && !inQ) {
        cells.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    cells.push(cur.trim());
    rows.push(cells);
  }
  return rows;
}

function monthKeyGmt7() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
  }).format(new Date());
}

async function ensureTabs(token, spreadsheetId, tabNames, existingTitles, defaultSheetId, dedicated) {
  const requests = tabNames
    .filter((t) => !existingTitles.has(t))
    .map((title) => ({ addSheet: { properties: { title } } }));

  if (dedicated && defaultSheetId != null && tabNames.some((t) => t === 'Dashboard' || existingTitles.has('Dashboard'))) {
    requests.push({ deleteSheet: { sheetId: defaultSheetId } });
  }

  if (!requests.length) return;
  await sheetsApi(token, 'POST', `${spreadsheetId}:batchUpdate`, { requests });
}

function buildTabData(sheetUrl, month, monthlyRows, kpiRows, dedicated) {
  const cfg = dedicated ? '_Config' : 'Swing_Config';
  const tradesPaper = dedicated ? 'Trades_PAPER' : 'Swing_Trades_PAPER';
  const configRows = [
    ['key', 'value', 'notes'],
    ['phase', 'PAPER_ONLY', 'Phase 1 — REAL khóa'],
    ['paper_nav_start_vnd', 500000000, 'Vốn ảo paper'],
    ['real_nav_start_vnd', '', 'Phase 2'],
    ['target_pct_month', 3, 'Target %/tháng'],
    ['target_stretch_pct', 5, 'Stretch'],
    ['watchlist', 'ACB,HPG,MWG', 'Core Watchlist'],
    ['cro_satellite_max', 2, 'Max Satellite trên Watchlist'],
    ['fees_pct_default', 0.7, 'Phí round-trip'],
    ['max_size_pct', 35, 'Size max %'],
    ['stop_month_pct', -3, 'Stop tháng'],
    ['sheet_url', sheetUrl, 'Link workbook'],
    ['updated_at', new Date().toISOString(), ''],
  ];

  const tradesHeaders = [
    [
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
      'gross_pct',
      'fees_pct',
      'net_pct',
      'rr_planned',
      'rr_achieved',
      'result',
      'vni_entry',
      'notes',
    ],
  ];

  const monthlyHeaders = [
    [
      'month',
      'mode',
      'nav_start_vnd',
      'nav_end_vnd',
      'net_pct_broker',
      'target_pct',
      'trades_closed',
      'win_rate_pct',
      'avg_rr',
      'max_dd_pct',
      'status',
      'lesson_1',
      'rule_next',
    ],
  ];
  const monthlyPaper =
    monthlyRows.length > 1 ? monthlyRows : [...monthlyHeaders, [month, 'PAPER', 500000000, '', '', 3, 0, '', '', '', 'ON TRACK', '', '']];

  const watchlistRows = [
    [
      'symbol',
      'status',
      'entry_zone',
      'stop',
      'target',
      'trigger',
      'limit_treo',
      'exec_du_kien',
      'last_review',
    ],
    ['ACB', 'OPEN', '22.200-22.450', '<21.850', '23.600-23.800', 'T1 bootstrap @22.450', '', 'T1 aggressive', month],
    ['HPG', 'LIMIT_TREO', '23.000-23.500', '<22.300', '25.500-26.500', 'Retest hỗ trợ', '23200', 'T2 passive', ''],
    ['MWG', 'CHỜ', '76.000-77.500', '<74.500', '82.000-85.000', 'Size ≤25% · T3 probe', '', 'T2/T3', ''],
  ];

  const universeScanRows = [
    UNIVERSE_SCAN_HEADERS,
    ...croSeedRows().map((r) => objectToScanRow(r)),
  ];

  const dashboardRows = [
    ['Swing KPI — Phase 1 PAPER ONLY', ''],
    [
      'NAV paper ước',
      `=IFERROR(${cfg}!B3*(1+SUMPRODUCT((${tradesPaper}!F2:F<>"")*(${tradesPaper}!O2:O)*(${tradesPaper}!L2:L)/100)/100),${cfg}!B3)`,
    ],
    ['Lệnh PAPER đóng', `=COUNTA(FILTER(${tradesPaper}!A2:A,${tradesPaper}!F2:F<>""))`],
    [
      'Win rate PAPER',
      `=IFERROR(COUNTIF(FILTER(${tradesPaper}!R2:R,${tradesPaper}!F2:F<>""),"W")/COUNTA(FILTER(${tradesPaper}!R2:R,${tradesPaper}!F2:F<>"")),"")`,
    ],
    ['REAL', 'KHÓA — pass real-gate trước'],
  ];

  const readmeRows = [
    ['Swing KPI README', ''],
    ['Sheet URL', sheetUrl],
    ['Phase', 'PAPER_ONLY · 500M'],
    ['/trade', 'Nhận định mã'],
    ['/swing', 'Review KPI tuần'],
    ['/swing month', 'Chốt tháng + bài học'],
    ['/swing log', 'Ghi OPEN/CLOSE paper'],
    ['Shadow/Theory', 'Trades_SHADOW · Theory_Log — SWING-THEORY-RESEARCH.md'],
  ];

  const shadowTab = dedicated ? 'Trades_SHADOW' : 'Swing_Trades_SHADOW';
  const theoryTab = dedicated ? 'Theory_Log' : 'Swing_Theory_Log';
  const theorySeed = [
    THEORY_LOG_HEADERS,
    ...DEFAULT_HYPOTHESES.map((h) => [
      h.id,
      month,
      h.statement,
      '',
      5,
      0,
      '',
      '',
      '',
      'pending',
      '',
      '',
      '',
    ]),
  ];

  const backupKpi = dedicated ? 'Backup_kpi_tracker' : 'Swing_Backup_kpi_tracker';
  const backupMo = dedicated ? 'Backup_monthly_summary' : 'Swing_Backup_monthly_summary';

  return {
    [`${cfg}!A1`]: configRows,
    [`${tradesPaper}!A1`]: kpiRows.length > 1 ? kpiRows : tradesHeaders,
    [`${dedicated ? 'Trades_REAL' : 'Swing_Trades_REAL'}!A1`]: tradesHeaders,
    [`${dedicated ? 'Monthly_PAPER' : 'Swing_Monthly_PAPER'}!A1`]: monthlyPaper,
    [`${dedicated ? 'Monthly_REAL' : 'Swing_Monthly_REAL'}!A1`]: monthlyHeaders,
    [`${dedicated ? 'Watchlist' : 'Swing_Watchlist'}!A1`]: watchlistRows,
    [`${dedicated ? 'Universe_Scan' : 'Swing_Universe_Scan'}!A1`]: universeScanRows,
    [`${dedicated ? 'Dashboard' : 'Swing_Dashboard'}!A1`]: dashboardRows,
    [`${dedicated ? 'README' : 'Swing_README'}!A1`]: readmeRows,
    [`${backupKpi}!A1`]: kpiRows.length ? kpiRows : parseCsvFile(path.join(LOCAL_KPI_DIR, 'kpi-tracker.csv')),
    [`${backupMo}!A1`]: monthlyRows.length ? monthlyRows : parseCsvFile(path.join(LOCAL_KPI_DIR, 'monthly-summary.csv')),
    [`${shadowTab}!A1`]: [SHADOW_HEADERS],
    [`${theoryTab}!A1`]: theorySeed,
  };
}

async function removeBrokenShortcut(token, folderId) {
  const sc = await findFileByName(token, folderId, SHORTCUT_NAME, 'application/vnd.google-apps.shortcut');
  if (sc) {
    await driveApi(token, 'DELETE', `files/${sc.id}?supportsAllDrives=true`);
    console.log('· Đã xóa shortcut cũ (tránh lỗi mở trên Drive)');
  }
}

async function main() {
  const args = parseArgs();
  const dryRun = args.dryRun;
  const env = loadEnv();
  const publicConfig = JSON.parse(
    fs.readFileSync(path.join(root, 'n8n-workflows/magnix-public-config.json'), 'utf8')
  );

  const folderId =
    env.GOOGLE_DRIVE_TRADE_PROJECT_FOLDER_ID || publicConfig.drive_trade_project_folder_id;
  const fallbackSheetId =
    env.GOOGLE_SHEET_SWING_KPI_ID ||
    publicConfig.google_sheet_swing_kpi_id ||
    env.GOOGLE_SHEET_DATABASE_ID ||
    publicConfig.google_sheet_id;

  if (!folderId) throw new Error('Thiếu GOOGLE_DRIVE_TRADE_PROJECT_FOLDER_ID');

  const saPath =
    env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    path.join(root, 'n8n-workflows/credentials/google-service-account.json');
  const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));

  const token = await getAccessToken(sa, [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  console.log(`Trade_Project: ${folderId}`);

  const forcedId = sheetIdFromUrl(args.sheetId || env.GOOGLE_SHEET_SWING_KPI_ID_FORCE || '');
  let spreadsheetId = forcedId || fallbackSheetId;
  let dedicatedMode = Boolean(forcedId);
  let sheetSource = dedicatedMode ? 'user_workbook' : 'magnix_workbook';

  if (!forcedId) {
    const inFolder = await findSpreadsheetInFolder(token, folderId);
    if (inFolder) {
      spreadsheetId = inFolder.id;
      dedicatedMode = true;
      sheetSource = 'trade_project_workbook';
      console.log(`· Sheet trong Trade_Project: ${inFolder.name} (${spreadsheetId})`);
    } else {
      console.log(`· Fallback workbook Magnix (tab Swing_*): ${spreadsheetId}`);
    }
  } else {
    console.log(`· Sheet chỉ định: ${spreadsheetId}`);
  }

  const tabNames = dedicatedMode ? DEDICATED_TABS : MAGNIX_TABS;

  const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  const month = monthKeyGmt7();
  const kpiRows = parseCsvFile(path.join(LOCAL_KPI_DIR, 'kpi-tracker.csv'));
  const monthlyRows = parseCsvFile(path.join(LOCAL_KPI_DIR, 'monthly-summary.csv'));

  if (dryRun) {
    console.log('[dry-run] Sẽ tạo tab Swing_* và shortcut');
    return;
  }

  const meta = await sheetsApi(token, 'GET', `${spreadsheetId}?fields=properties.title,sheets.properties(sheetId,title)`);
  const existing = new Set((meta.sheets || []).map((s) => s.properties.title));
  const defaultSheet = (meta.sheets || []).find((s) => s.properties.title === 'Sheet1' || s.properties.title === 'Trang tính1');
  await ensureTabs(token, spreadsheetId, tabNames, existing, defaultSheet?.properties?.sheetId, dedicatedMode);

  const tabData = buildTabData(sheetUrl, month, monthlyRows, kpiRows, dedicatedMode);
  const linksTab = dedicatedMode ? 'Links!A1' : 'Swing_Links!A1';
  tabData[linksTab] = [
    ['key', 'url', 'notes'],
    ['google_sheet', sheetUrl, `source=${sheetSource}`],
    ['drive_folder', `https://drive.google.com/drive/folders/${folderId}`, 'Trade_Project'],
    ['local_kpi_tracker', path.join(LOCAL_KPI_DIR, 'kpi-tracker.csv'), 'Backup local'],
    ['local_monthly', path.join(LOCAL_KPI_DIR, 'monthly-summary.csv'), 'Backup local'],
    ['updated_at', new Date().toISOString(), ''],
  ];

  await sheetsApi(token, 'POST', `${spreadsheetId}/values:batchUpdate`, {
    valueInputOption: 'USER_ENTERED',
    data: Object.entries(tabData).map(([range, values]) => ({ range, values })),
  });
  console.log(`✓ Tabs + seed (${dedicatedMode ? 'workbook riêng' : 'Swing_* trên Magnix'})`);

  const uploads = {};
  for (const [name, file] of [
    ['kpi-tracker.csv', path.join(LOCAL_KPI_DIR, 'kpi-tracker.csv')],
    ['monthly-summary.csv', path.join(LOCAL_KPI_DIR, 'monthly-summary.csv')],
  ]) {
    if (!fs.existsSync(file)) continue;
    const res = await uploadOrSkip(token, folderId, name, fs.readFileSync(file, 'utf8'), 'text/csv');
    if (res.ok) {
      uploads[name] = res.webViewLink || `https://drive.google.com/file/d/${res.id}/view`;
      console.log(`✓ CSV Drive: ${name} (${res.method})`);
    } else {
      const backupTab = dedicatedMode
        ? `tab:Backup_${name.replace('.csv', '').replace('-', '_')}`
        : `tab:Swing_Backup_${name.replace('.csv', '').replace('-', '_')}`;
      uploads[name] = backupTab;
      console.log(`· CSV ${name} → tab backup (Drive quota SA: ${res.error})`);
    }
  }

  await removeBrokenShortcut(token, folderId);
  if (dedicatedMode) {
    console.log('· Bỏ shortcut — dùng Sheet thật trong Trade_Project');
  } else {
    const shortcut = await ensureShortcut(token, folderId, spreadsheetId, SHORTCUT_NAME);
    console.log(`✓ Shortcut: ${SHORTCUT_NAME} (${shortcut.id})`);
  }

  const index = {
    project: 'Swing KPI — Phase 1 PAPER',
    updated_at: new Date().toISOString(),
    sheet_source: sheetSource,
    drive_folder_url: `https://drive.google.com/drive/folders/${folderId}`,
    google_sheet: { id: spreadsheetId, url: sheetUrl },
    backups: uploads,
    tabs: tabNames,
  };

  const indexJson = JSON.stringify(index, null, 2);
  const indexTxt = [
    'Swing KPI — Trade_Project',
    `Updated: ${index.updated_at}`,
    '',
    `Google Sheet: ${sheetUrl}`,
    dedicatedMode ? 'Shortcut: (none — Sheet trực tiếp trong Trade_Project)' : `Shortcut: ${SHORTCUT_NAME}`,
    `Drive folder: ${index.drive_folder_url}`,
    '',
    'Backups:',
    ...Object.entries(uploads).map(([k, v]) => `  ${k}: ${v}`),
  ].join('\n');

  const indexUpload = await uploadOrSkip(
    token,
    folderId,
    'swing-kpi-index.json',
    indexJson,
    'application/json'
  );
  if (indexUpload.ok) {
    console.log('✓ swing-kpi-index.json trên Drive');
  } else {
    console.log('· swing-kpi-index.json → local + tab Swing_Links (Drive quota SA)');
  }
  await uploadOrSkip(token, folderId, 'swing-kpi-links.txt', indexTxt, 'text/plain');

  saveEnvKey('GOOGLE_SHEET_SWING_KPI_ID', spreadsheetId);
  publicConfig.google_sheet_swing_kpi_id = spreadsheetId;
  fs.writeFileSync(
    path.join(root, 'n8n-workflows/magnix-public-config.json'),
    JSON.stringify(publicConfig, null, 2)
  );

  const dfPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
  const df = JSON.parse(fs.readFileSync(dfPath, 'utf8'));
  df.swing_kpi_sheet_id = spreadsheetId;
  df.swing_kpi_sheet_url = sheetUrl;
  delete df.swing_kpi_shortcut_id;
  df.updated_at = index.updated_at;
  fs.writeFileSync(dfPath, JSON.stringify(df, null, 2));

  if (fs.existsSync(LOCAL_KPI_DIR)) {
    fs.writeFileSync(path.join(LOCAL_KPI_DIR, 'swing-kpi-index.json'), indexJson);
    fs.writeFileSync(path.join(LOCAL_KPI_DIR, 'swing-kpi-links.txt'), indexTxt);
  }

  console.log('\n--- Hoàn tất ---');
  console.log('Sheet:', sheetUrl);
  console.log(
    dedicatedMode
      ? 'Tab chính: Dashboard · Trades_PAPER · Monthly_PAPER'
      : 'Tab chính: Swing_Dashboard · Swing_Trades_PAPER · Swing_Monthly_PAPER'
  );
  console.log('Trade_Project:', index.drive_folder_url);
  console.log('Env: GOOGLE_SHEET_SWING_KPI_ID=' + spreadsheetId);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
