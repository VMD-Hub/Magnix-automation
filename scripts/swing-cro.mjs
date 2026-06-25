#!/usr/bin/env node
/**
 * CRO — bộ não quân sư: Universe_Scan (Satellite) + ritual scan hàng tuần.
 *
 * Usage:
 *   node scripts/swing-cro.mjs ritual          # thứ 2 — briefing tuần
 *   node scripts/swing-cro.mjs list [--tier SATELLITE]
 *   node scripts/swing-cro.mjs add --symbol FPT --verdict CHO_THEM --rr 1.4 --trigger WATCH --notes "..."
 *   node scripts/swing-cro.mjs rank            # tính lại cro_score + rank
 *   node scripts/swing-cro.mjs promote --symbol FPT
 *   node scripts/swing-cro.mjs pass --symbol TCB
 *   node scripts/swing-cro.mjs init-tab
 */
import {
  computeKpiSummary,
  fetchTradesPaper,
  getSheetsToken,
  parseKvArgs,
  swingSheetId,
  todayGmt7,
} from './lib/swing-sheet.mjs';
import { bucketForSymbol, openRowsFrom, portfolioSummary } from './lib/swing-portfolio.mjs';
import {
  buildCoreRowsFromWatchlist,
  computeCroScore,
  countLiveSatellites,
  defaultSeedRows,
  ensureUniverseScanTab,
  fetchUniverseScan,
  formatLiveSource,
  isoWeekKey,
  isLiveMarketSource,
  MAX_SATELLITE_ON_WATCHLIST,
  purgeNonLiveSatellites,
  rankScanRows,
  suggestAction,
  tierForSymbol,
  writeUniverseScanTable,
} from './lib/swing-cro-sheet.mjs';
import { fetchWatchlist, objectToWatchlistRow, updateWatchlistRow, appendWatchlistRow } from './lib/swing-watchlist-sheet.mjs';

function croCtx(openRows, kpi) {
  const openBuckets = openRows.map((r) => bucketForSymbol(r.symbol));
  return { openBuckets, portfolioMode: kpi.status };
}

async function cmdInitTab() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const tab = await ensureUniverseScanTab(spreadsheetId, token);
  console.log(`✓ Tab Universe_Scan (${tab}) + seed CORE/Satellite`);
}

async function cmdList(opts) {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchUniverseScan(spreadsheetId, token);
  const tierFilter = opts.tier ? String(opts.tier).toUpperCase() : null;
  const show = tierFilter ? rows.filter((r) => r.tier === tierFilter) : rows;
  console.log(`# Universe_Scan · ${tab} · tuần ${isoWeekKey()} · ${show.length} dòng\n`);
  console.log('| # | Mã | Tier | Bucket | Score | Verdict | Trigger | Action |');
  console.log('|---|-----|------|--------|-------|---------|---------|--------|');
  for (const r of show.sort((a, b) => num(a.rank) - num(b.rank))) {
    console.log(
      `| ${r.rank} | ${r.symbol} | ${r.tier} | ${r.bucket || '—'} | ${r.cro_score} | ${r.verdict} | ${r.trigger_status} | ${r.action} |`
    );
  }
  console.log('\nDoc: scripts/SWING-CRO.md');
}

function num(v) {
  const n = Number(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

async function loadPortfolio() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows } = await fetchTradesPaper(spreadsheetId, token);
  const open = openRowsFrom(rows);
  const kpi = computeKpiSummary(rows);
  return { open, kpi, summary: portfolioSummary(open, kpi), token, spreadsheetId };
}

async function cmdRitual() {
  const { open, kpi, summary } = await loadPortfolio();
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows: scan } = await fetchUniverseScan(spreadsheetId, token);
  const { rows: watch } = await fetchWatchlist(spreadsheetId, token);
  const week = isoWeekKey();
  const ctx = croCtx(open, kpi);
  const satellites = rankScanRows(scan, ctx)
    .filter((r) => r.tier === 'SATELLITE' && r.action !== 'PASS' && r.action !== 'NEED_RESEARCH');
  const liveN = countLiveSatellites(scan);

  console.log(`# CRO Ritual · ${todayGmt7()} · ${week}`);
  console.log('> **Chuẩn đo KPI ≠ danh sách mã** — xem SWING-RESEARCH-CONTRACT.md\n');
  console.log(`> Mode: **${kpi.status}** · Net ${kpi.net_month_pct}% · OPEN ${open.length}/2`);
  console.log(`> Satellite có nguồn live (vnstock/tcbs): **${liveN}** — ritual đủ khi ≥1 sau scan tuần\n`);

  console.log('## 1. Core (Watchlist)');
  for (const w of watch) {
    console.log(`- **${w.symbol}** ${w.status} · ${w.exec_du_kien || '—'} · ${w.limit_treo ? `limit ${w.limit_treo}` : w.trigger || ''}`);
  }

  console.log('\n## 2. Satellite (chỉ mã đã /trade + vnstock|tcbs)');
  if (liveN === 0) {
    console.log('- **Chưa có** — bắt buộc: quét VN100 trên TCBS/VNStock → `/trade` → `swing-cro add --data-source tcbs`');
  }
  for (const s of satellites.slice(0, 5)) {
    const live = isLiveMarketSource(s.source) ? s.source : 'THIẾU NGUỒN';
    console.log(`- **${s.symbol}** score ${s.cro_score} · ${live} → **${s.action}**`);
  }

  console.log('\n## 3. Mệnh lệnh tuần (theo mode)');
  if (kpi.status === 'BEHIND') {
    console.log('- Tối đa **1 OPEN/tuần** · size **−25%** · chỉ trigger SẴN SÀNG');
  } else if (kpi.status === 'STOP') {
    console.log('- **Không OPEN mới** — chỉ quản lý lệnh đang mở');
  } else {
    console.log('- Tối đa **2 OPEN/tuần** · ưu tiên Core trước Satellite');
  }
  console.log(`- Cash buffer: **${summary.cashPct}%** · Notional OPEN **${summary.investedPct}%**`);

  console.log('\n## 4. Checklist ritual (thứ 2) — **thị trường trước, mã sau**');
  console.log('1. Quét VN100 / ngành trên **TCBS hoặc VNStock** (không dùng bảng 5 mã seed)');
  console.log('2. `/trade MÃ` DATE_LOCK pass từng ứng viên');
  console.log('3. `swing-cro add --data-source tcbs|vnstock --session-date ...`');
  console.log('4. `swing-cro rank`');
  console.log('5. Promote tối đa 2 Satellite → `swing-cro promote`');
  console.log('6. `swing-watchlist review` · `swing-log portfolio` · `validate`');

  console.log('\n## 5. Lệnh');
  console.log('```');
  console.log('node scripts/swing-cro.mjs rank');
  console.log('node scripts/swing-cro.mjs list --tier SATELLITE');
  console.log('```');
}

async function cmdAdd(opts) {
  if (!opts.symbol) throw new Error('add cần --symbol');
  const sym = String(opts.symbol).toUpperCase();
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchUniverseScan(spreadsheetId, token);
  const { rows: wl } = await fetchWatchlist(spreadsheetId, token);
  const wlSet = new Set(wl.map((r) => r.symbol));
  const { open, kpi } = await loadPortfolio();
  const ctx = croCtx(open, kpi);
  const week = isoWeekKey();
  const today = todayGmt7();
  const tier = tierForSymbol(sym, wlSet);
  let source = opts.source || '';
  if (tier === 'SATELLITE') {
    const ds = opts['data-source'] || opts.dataSource;
    const session = opts['session-date'] || opts.date || today;
    if (!ds) {
      throw new Error(
        'Satellite bắt buộc --data-source vnstock|tcbs + --session-date (sau /trade live). Xem SWING-RESEARCH-CONTRACT.md'
      );
    }
    source = formatLiveSource(ds, session);
  } else if (!source) {
    source = 'portfolio_snapshot';
  }
  const base = {
    symbol: sym,
    tier,
    bucket: opts.bucket || bucketForSymbol(sym),
    verdict: opts.verdict || 'CHO_THEM',
    rr_planned: opts.rr || opts['rr-planned'] || '',
    trigger_status: opts.trigger || 'WATCH',
    scan_week: week,
    last_scan: today,
    entry_zone: opts.zone || opts['entry-zone'] || '',
    stop: opts.stop || '',
    target: opts.target || '',
    notes: opts.notes || '',
    source,
  };
  base.cro_score = computeCroScore(base, ctx);
  base.action = suggestAction(base, base.cro_score);

  const idx = rows.findIndex((r) => r.symbol === sym);
  let next = [...rows];
  if (idx >= 0) next[idx] = { ...rows[idx], ...base };
  else {
    if (base.tier === 'SATELLITE' && rows.filter((r) => r.tier === 'SATELLITE' && r.action !== 'PASS').length >= MAX_SCAN_ACTIVE) {
      throw new Error(`Quá ${MAX_SCAN_ACTIVE} Satellite active — pass mã yếu trước`);
    }
    next.push(base);
  }
  next = rankScanRows(next, ctx);
  await writeUniverseScanTable(spreadsheetId, token, tab, next);
  console.log(`✓ add ${sym} · tier ${base.tier} · score ${base.cro_score} · action ${base.action}`);
}

async function cmdRank() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchUniverseScan(spreadsheetId, token);
  const { open, kpi } = await loadPortfolio();
  const ranked = rankScanRows(
    rows.map((r) => ({ ...r, last_scan: todayGmt7(), scan_week: isoWeekKey() })),
    croCtx(open, kpi)
  );
  await writeUniverseScanTable(spreadsheetId, token, tab, ranked);
  console.log(`✓ rank ${ranked.length} mã · tuần ${isoWeekKey()}`);
  const top = ranked.filter((r) => r.tier === 'SATELLITE' && r.action !== 'PASS').slice(0, 3);
  for (const r of top) console.log(`  ${r.rank}. ${r.symbol} score=${r.cro_score} → ${r.action}`);
}

async function countSatelliteOnWatchlist(token, spreadsheetId) {
  const { rows } = await fetchWatchlist(spreadsheetId, token);
  const core = new Set(['ACB', 'HPG', 'MWG']);
  return rows.filter((r) => !core.has(r.symbol)).length;
}

async function cmdPromote(opts) {
  if (!opts.symbol) throw new Error('promote cần --symbol');
  const sym = String(opts.symbol).toUpperCase();
  if (tierForSymbol(sym) === 'CORE') {
    console.log(`ℹ ${sym} là CORE — đã trên Watchlist mặc định`);
    return;
  }
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows: scan } = await fetchUniverseScan(spreadsheetId, token);
  const row = scan.find((r) => r.symbol === sym);
  if (!row) throw new Error(`${sym} chưa có trong Universe_Scan — chạy add trước`);
  if (!isLiveMarketSource(row.source)) {
    throw new Error(`${sym} chưa có nguồn vnstock|tcbs — /trade live rồi add --data-source tcbs`);
  }
  if (row.action === 'PASS') throw new Error(`${sym} đang PASS — không promote`);

  const satOnWl = await countSatelliteOnWatchlist(token, spreadsheetId);
  if (satOnWl >= MAX_SATELLITE_ON_WATCHLIST) {
    throw new Error(`Watchlist đã có ${MAX_SATELLITE_ON_WATCHLIST} Satellite — pass hoặc remove trước`);
  }

  const { tab, rows: wl } = await fetchWatchlist(spreadsheetId, token);
  const existing = wl.find((r) => r.symbol === sym);
  const wlRow = {
    symbol: sym,
    status: 'CHỜ',
    entry_zone: row.entry_zone || '',
    stop: row.stop || '',
    target: row.target || '',
    trigger: row.notes || row.verdict || 'CRO promote',
    limit_treo: '',
    exec_du_kien: row.trigger_status === 'SAN_SANG' ? 'T1/T2' : 'T2 passive',
    last_review: todayGmt7(),
  };
  if (existing) {
    await updateWatchlistRow(spreadsheetId, token, tab, existing._sheet_row, objectToWatchlistRow({ ...existing, ...wlRow }));
  } else {
    await appendWatchlistRow(spreadsheetId, token, tab, objectToWatchlistRow(wlRow));
  }

  const { tab: scanTab, rows: allScan } = await fetchUniverseScan(spreadsheetId, token);
  const updated = allScan.map((r) =>
    r.symbol === sym ? { ...r, action: 'PROMOTE', last_scan: todayGmt7() } : r
  );
  const { open, kpi } = await loadPortfolio();
  await writeUniverseScanTable(spreadsheetId, token, scanTab, rankScanRows(updated, croCtx(open, kpi)));

  console.log(`✓ promote ${sym} → Watchlist CHỜ (Satellite ${satOnWl + 1}/${MAX_SATELLITE_ON_WATCHLIST})`);
  console.log('  Tiếp: /trade DATE_LOCK → treo hoặc open theo playbook · size Satellite ≤25% lần đầu');
}

async function cmdResearchReset() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchUniverseScan(spreadsheetId, token);
  const { rows: wl } = await fetchWatchlist(spreadsheetId, token);
  const { open, kpi } = await loadPortfolio();
  const core = buildCoreRowsFromWatchlist(wl);
  const keptSat = purgeNonLiveSatellites(rows).filter((r) => r.tier === 'SATELLITE');
  const merged = rankScanRows([...core, ...keptSat], croCtx(open, kpi));
  await writeUniverseScanTable(spreadsheetId, token, tab, merged);
  console.log(`✓ research-reset · Core ${core.length} từ Watchlist · Satellite live ${keptSat.length}`);
  console.log('  Đã xóa Satellite template / không có nguồn tcbs|vnstock');
}

async function cmdSyncCore() {
  await cmdResearchReset();
}

async function cmdPass(opts) {
  if (!opts.symbol) throw new Error('pass cần --symbol');
  const sym = String(opts.symbol).toUpperCase();
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchUniverseScan(spreadsheetId, token);
  const idx = rows.findIndex((r) => r.symbol === sym);
  if (idx < 0) throw new Error(`Không có ${sym} trong scan`);
  const next = [...rows];
  next[idx] = {
    ...next[idx],
    action: 'PASS',
    cro_score: Math.min(num(next[idx].cro_score), 30),
    last_scan: todayGmt7(),
    notes: opts.notes ? `${next[idx].notes} | ${opts.notes}` : next[idx].notes,
  };
  const { open, kpi } = await loadPortfolio();
  await writeUniverseScanTable(spreadsheetId, token, tab, rankScanRows(next, croCtx(open, kpi)));
  console.log(`✓ pass ${sym}`);
}

function printHelp() {
  console.log(`CRO — Universe_Scan + ritual hàng tuần

  ritual              Briefing tuần (Core + Satellite + mệnh lệnh)
  list [--tier CORE|SATELLITE]
  add --symbol ... --data-source vnstock|tcbs --session-date yyyy-mm-dd [--verdict] [--rr] ...
  research-reset        Core từ Watchlist · xóa Satellite không live
  rank                Tính lại cro_score + thứ hạng
  promote --symbol    Satellite → Watchlist CHỜ (max 2)
  pass --symbol       Loại khỏi ưu tiên tuần
  init-tab            Tạo tab Universe_Scan + seed

Doc: scripts/SWING-CRO.md`);
}

async function main() {
  const { positional, opts } = parseKvArgs(process.argv.slice(2));
  const cmd = (positional[0] || '').toLowerCase();
  if (!cmd || cmd === 'help' || opts.help) {
    printHelp();
    process.exit(cmd ? 0 : 1);
  }
  if (cmd === 'ritual' || cmd === 'weekly') await cmdRitual();
  else if (cmd === 'list') await cmdList(opts);
  else if (cmd === 'add') await cmdAdd(opts);
  else if (cmd === 'rank') await cmdRank();
  else if (cmd === 'promote') await cmdPromote(opts);
  else if (cmd === 'pass') await cmdPass(opts);
  else if (cmd === 'research-reset' || cmd === 'sync-core') await cmdResearchReset();
  else if (cmd === 'init-tab') await cmdInitTab();
  else throw new Error(`Lệnh không hỗ trợ: ${cmd}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
