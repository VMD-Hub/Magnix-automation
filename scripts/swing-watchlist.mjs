#!/usr/bin/env node
/**
 * Watchlist — T2 limit treo (P0). Không ghi Trades_PAPER cho đến khi khớp + swing-log open.
 *
 * Usage:
 *   node scripts/swing-watchlist.mjs list
 *   node scripts/swing-watchlist.mjs treo --symbol HPG --limit 23200 --trigger "Retest ho tro" --exec passive
 *   node scripts/swing-watchlist.mjs filled --symbol HPG
 *   node scripts/swing-watchlist.mjs review --symbol HPG
 *   node scripts/swing-watchlist.mjs validate
 */
import { getSheetsToken, parseKvArgs, swingSheetId, todayGmt7 } from './lib/swing-sheet.mjs';
import {
  appendWatchlistRow,
  fetchWatchlist,
  formatWatchlistBlock,
  objectToWatchlistRow,
  updateWatchlistRow,
  validateWatchlistRow,
  WATCHLIST_HEADERS,
  watchlistColEnd,
} from './lib/swing-watchlist-sheet.mjs';
import { sheetsApi } from './lib/swing-sheet.mjs';

async function cmdList() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchWatchlist(spreadsheetId, token);
  console.log(`# Watchlist · ${tab} · ${rows.length} mã\n`);
  console.log('| Mã | Status | Limit treo | Exec | Trigger | Review |');
  console.log('|----|--------|------------|------|---------|--------|');
  for (const r of rows) {
    console.log(
      `| ${r.symbol} | ${r.status || ''} | ${r.limit_treo || '—'} | ${r.exec_du_kien || '—'} | ${String(r.trigger || '').slice(0, 24)} | ${r.last_review || ''} |`
    );
  }
  console.log('\nPlaybook: SWING-EXECUTION-PLAYBOOK.md § T2');
}

async function findRow(rows, symbol) {
  const sym = String(symbol || '').toUpperCase();
  const row = rows.find((r) => r.symbol === sym);
  if (!row) throw new Error(`Không có ${sym} trên Watchlist — dùng treo hoặc set`);
  return row;
}

async function cmdTreo(opts) {
  if (!opts.symbol) throw new Error('treo cần --symbol');
  if (!opts.limit) throw new Error('treo cần --limit (giá limit TCBS)');
  const sym = String(opts.symbol).toUpperCase();
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchWatchlist(spreadsheetId, token);
  const existing = rows.find((r) => r.symbol === sym);
  const record = {
    symbol: sym,
    status: 'LIMIT_TREO',
    entry_zone: opts.zone || opts['entry-zone'] || existing?.entry_zone || '',
    stop: opts.stop || existing?.stop || '',
    target: opts.target || existing?.target || '',
    trigger: opts.trigger || existing?.trigger || '',
    limit_treo: String(opts.limit).replace(/,/g, ''),
    exec_du_kien: opts.exec ? `T2 ${opts.exec}` : opts['exec-du-kien'] || existing?.exec_du_kien || 'T2 passive',
    last_review: todayGmt7(),
  };
  const check = validateWatchlistRow(record);
  if (!check.ok) {
    console.log(formatWatchlistBlock('Treo T2 (không ghi)', check));
    process.exit(2);
  }
  if (existing) {
    await updateWatchlistRow(spreadsheetId, token, tab, existing._sheet_row, objectToWatchlistRow({ ...existing, ...record }));
  } else {
    await appendWatchlistRow(spreadsheetId, token, tab, objectToWatchlistRow(record));
  }
  console.log(`✓ LIMIT_TREO ${sym} @ ${record.limit_treo}`);
  console.log('  → Chưa khớp: **không** swing-log open. Sau khớp: `filled` rồi `open --exec passive --filled true`');
}

async function cmdFilled(opts) {
  if (!opts.symbol) throw new Error('filled cần --symbol');
  const sym = String(opts.symbol).toUpperCase();
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchWatchlist(spreadsheetId, token);
  const row = await findRow(rows, sym);
  if (row.status !== 'LIMIT_TREO') {
    console.warn(`⚠ ${sym} status=${row.status} — không phải LIMIT_TREO`);
  }
  const updated = { ...row, status: 'FILLED', last_review: todayGmt7() };
  await updateWatchlistRow(spreadsheetId, token, tab, row._sheet_row, objectToWatchlistRow(updated));
  console.log(`✓ ${sym} FILLED — có thể swing-log open --exec passive --filled true`);
}

async function cmdReview(opts) {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchWatchlist(spreadsheetId, token);
  const targets = opts.symbol
    ? [await findRow(rows, opts.symbol)]
    : rows.filter((r) => r.symbol);
  const date = todayGmt7();
  for (const row of targets) {
    const updated = { ...row, last_review: date };
    await updateWatchlistRow(spreadsheetId, token, tab, row._sheet_row, objectToWatchlistRow(updated));
    console.log(`✓ review ${row.symbol} → ${date}`);
  }
}

async function cmdSet(opts) {
  if (!opts.symbol) throw new Error('set cần --symbol');
  const sym = String(opts.symbol).toUpperCase();
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchWatchlist(spreadsheetId, token);
  const row = rows.find((r) => r.symbol === sym);
  const base = row || { symbol: sym, status: 'CHỜ' };
  const updated = {
    ...base,
    status: opts.status || base.status,
    entry_zone: opts.zone || opts['entry-zone'] || base.entry_zone,
    stop: opts.stop || base.stop,
    target: opts.target || base.target,
    trigger: opts.trigger || base.trigger,
    limit_treo: opts.limit || base.limit_treo,
    exec_du_kien: opts['exec-du-kien'] || opts.exec || base.exec_du_kien,
    last_review: opts.review || base.last_review,
  };
  const check = validateWatchlistRow(updated);
  if (!check.ok) {
    console.log(formatWatchlistBlock('Set (không ghi)', check));
    process.exit(2);
  }
  if (row) {
    await updateWatchlistRow(spreadsheetId, token, tab, row._sheet_row, objectToWatchlistRow(updated));
  } else {
    await appendWatchlistRow(spreadsheetId, token, tab, objectToWatchlistRow(updated));
  }
  console.log(`✓ set ${sym} · ${updated.status}`);
}

async function cmdSeed(opts) {
  if (opts.force !== 'true' && opts.force !== true) {
    console.log('⚠ Ghi đè 3 dòng watchlist ACB/HPG/MWG. Thêm --force true để chạy.');
    process.exit(1);
  }
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab } = await fetchWatchlist(spreadsheetId, token);
  const month = todayGmt7().slice(0, 7);
  const values = [
    WATCHLIST_HEADERS,
    ['ACB', 'OPEN', '22.200-22.450', '<21.850', '23.600-23.800', 'T1 bootstrap @22.450', '', 'T1 aggressive', month],
    ['HPG', 'LIMIT_TREO', '23.000-23.500', '<22.300', '25.500-26.500', 'Retest hỗ trợ', '23200', 'T2 passive', ''],
    ['MWG', 'CHỜ', '76.000-77.500', '<74.500', '82.000-85.000', 'Size ≤25% · T3 probe', '', 'T2/T3', ''],
  ];
  const end = watchlistColEnd();
  const range = encodeURIComponent(`${tab}!A1:${end}${values.length}`);
  await sheetsApi(token, 'PUT', spreadsheetId, `values/${range}?valueInputOption=USER_ENTERED`, { values });
  console.log(`✓ seed Watchlist (${tab}) — ACB OPEN · HPG LIMIT_TREO @23200 · MWG CHỜ`);
}

async function cmdValidate() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows } = await fetchWatchlist(spreadsheetId, token);
  const issues = rows.map((r) => ({ row: r, check: validateWatchlistRow(r) })).filter((x) => !x.check.ok);
  if (!issues.length) {
    console.log('✅ Watchlist hợp lệ');
    return;
  }
  console.log(`❌ ${issues.length} dòng cần sửa:\n`);
  for (const { row, check } of issues) {
    console.log(`### ${row.symbol} · ${row.status}`);
    console.log(`  Thiếu: ${check.missing.join(', ')}`);
  }
  process.exit(2);
}

function printHelp() {
  console.log(`Usage:
  list                              — in Watchlist
  treo  --symbol --limit [--zone] [--stop] [--target] [--trigger] [--exec passive]
  filled --symbol                   — đánh dấu limit đã khớp (trước open passive)
  review [--symbol]                 — cập nhật last_review
  set   --symbol [--status] ...      — cập nhật tùy ý
  validate                          — quét thiếu limit_treo / exec
  seed --force true                 — đồng bộ 3 mã ACB/HPG/MWG (sửa schema lệch cột)

P0: T2 chưa khớp → treo only · không Trades_PAPER`);
}

async function main() {
  const { positional, opts } = parseKvArgs(process.argv.slice(2));
  const cmd = (positional[0] || '').toLowerCase();
  if (!cmd || cmd === 'help' || opts.help) {
    printHelp();
    process.exit(cmd ? 0 : 1);
  }
  if (cmd === 'list') await cmdList();
  else if (cmd === 'treo') await cmdTreo(opts);
  else if (cmd === 'filled') await cmdFilled(opts);
  else if (cmd === 'review') await cmdReview(opts);
  else if (cmd === 'set') await cmdSet(opts);
  else if (cmd === 'validate') await cmdValidate();
  else if (cmd === 'seed') await cmdSeed(opts);
  else throw new Error(`Lệnh không hỗ trợ: ${cmd}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
