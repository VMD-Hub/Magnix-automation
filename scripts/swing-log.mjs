#!/usr/bin/env node
/**
 * Ghi lệnh PAPER — validation bắt buộc; thiếu trường → từ chối ghi + liệt kê cần bổ sung.
 *
 * Usage:
 *   node scripts/swing-log.mjs open --symbol ACB --entry 22450 --stop 21850 --target 23600 --size 25 \
 *     --notes "pullback vùng 22.2" --emotion calm --rule Y [--vni 1878]
 *   node scripts/swing-log.mjs close --id PAPER-... --exit 23600 --notes "bài học" --emotion calm --rule Y
 *   node scripts/swing-log.mjs patch --id PAPER-... --vni 1878
 *   node scripts/swing-log.mjs validate
 *   node scripts/swing-log.mjs list
 */
import {
  appendTradeRow,
  calcCloseMetrics,
  calcPositionSize,
  calcRrPlanned,
  computeKpiSummary,
  fetchTradesPaper,
  findOpenTrade,
  getSheetsToken,
  monthKeyFromDate,
  nextTradeId,
  num,
  objectToRow,
  parseKvArgs,
  PAPER_NAV,
  swingSheetId,
  syncCsv,
  todayGmt7,
  updateTradeRow,
  DEFAULT_FEES_PCT,
} from './lib/swing-sheet.mjs';
import {
  auditAllTrades,
  appendExecToNotes,
  appendPortfolioTags,
  formatValidationBlock,
  hasExecStyle,
  normalizeNotes,
  resolveExecOpts,
  stripExecTags,
  validateCloseCli,
  validateOpenCli,
  validateTradeRow,
} from './lib/swing-trade-schema.mjs';
import {
  bucketForSymbol,
  checkPortfolioGate,
  formatPortfolioBlock,
  openRowsFrom,
  portfolioSummary,
} from './lib/swing-portfolio.mjs';
import { REGIMES } from './lib/swing-shadow-schema.mjs';
import { syncShadowTrades } from './lib/swing-shadow-sync.mjs';
import {
  assertPassiveFillAllowed,
  syncWatchlistAfterOpen,
} from './lib/swing-watchlist-sheet.mjs';

async function autoShadowSync(tradeId) {
  try {
    const r = await syncShadowTrades({ tradeId, quiet: true });
    if (r.created || r.updated) {
      console.log(`↻ Shadow sync · +${r.created} ~${r.updated} (total ${r.total})`);
    }
  } catch (e) {
    console.warn('⚠ Shadow sync skip:', e.message);
  }
}

class ValidationError extends Error {
  constructor(title, result) {
    super(formatValidationBlock(title, result));
    this.name = 'ValidationError';
    this.validation = result;
  }
}

function printPositionAdvice(symbol, entry, stop, target, sizePct, pos) {
  const targetM = Math.round((PAPER_NAV * sizePct) / 100 / 1e6);
  console.log('');
  console.log('## Khối lượng đề nghị (PAPER 500M)');
  console.log(`  Size kế hoạch:     ${sizePct}% (~${targetM}M VND)`);
  console.log(`  Số CP (lô 100):    ${pos.qty.toLocaleString('vi-VN')} CP`);
  console.log(`  Giá trị vị thế:   ${pos.notional_vnd.toLocaleString('vi-VN')} VND (${pos.size_pct_actual}% NAV)`);
  console.log(`  Rủi ro tới stop:   ${pos.risk_vnd?.toLocaleString('vi-VN')} VND (${pos.risk_pct_nav}% NAV)`);
  console.log(`  Entry/Stop/Target: ${entry} / ${stop} / ${target}`);
  console.log(`  TCBS tham chiếu:   MUA ${pos.qty} ${symbol} @ ${entry} · stop ${stop}`);
}

function printWarnings(warnings) {
  if (!warnings?.length) return;
  console.warn('\n⚠ Khuyến nghị bổ sung:');
  for (const w of warnings) console.warn(`  - ${w}`);
}

async function cmdOpen(opts) {
  const check = validateOpenCli(opts);
  if (!check.ok) throw new ValidationError('OPEN — thiếu thông số', check);
  printWarnings(check.warnings);

  const symbol = String(opts.symbol).toUpperCase();
  const entry = num(opts.entry);
  const stop = num(opts.stop);
  const target = num(opts.target);
  const size = num(opts.size);
  const execStyle = String(check.exec?.exec || opts.exec || '').toLowerCase();
  const t2Check = await assertPassiveFillAllowed(symbol, {
    filled: opts.filled === 'true' || opts.filled === true,
    execStyle,
  });
  if (!t2Check.ok) throw new ValidationError('OPEN — T2 chưa khớp', t2Check);
  if (size > 35) throw new Error('size_pct max 35% (paper-phase)');
  if (String(opts.symbol || '').toUpperCase() === 'MWG' && size > 25) {
    throw new Error('MWG size_pct max 25% (SWING-PORTFOLIO.md)');
  }

  const direction = String(opts.direction || 'LONG').toUpperCase();
  const openDate = opts.date || todayGmt7();
  const spreadsheetId = swingSheetId();
  if (!spreadsheetId) throw new Error('Thiếu GOOGLE_SHEET_SWING_KPI_ID trong .env');

  const token = await getSheetsToken();
  const { tab, rows } = await fetchTradesPaper(spreadsheetId, token);
  const tradeId = opts.id || nextTradeId(rows, openDate);
  const rrPlanned = calcRrPlanned(entry, stop, target, direction);
  if (rrPlanned !== '' && rrPlanned < 1.2) {
    console.warn(`⚠ rr_planned=${rrPlanned} < 1.2 — cân nhắc CHỜ thêm`);
  }

  const pos = calcPositionSize(entry, size, PAPER_NAV, undefined, stop);
  if (pos.size_pct_actual > 35) {
    throw new Error(`notional ${pos.size_pct_actual}% vượt max 35% — giảm size`);
  }

  const notesBase = normalizeNotes(opts.notes, { emotion: opts.emotion, rule: opts.rule });
  let notes = appendExecToNotes(notesBase, check.exec || resolveExecOpts(opts, entry));
  const regimeRaw = String(opts.regime || 'neutral').toLowerCase();
  const regime = REGIMES.has(regimeRaw) ? regimeRaw : 'neutral';
  const bucket = bucketForSymbol(symbol);
  notes = appendPortfolioTags(notes, {
    risk_pct_nav: pos.risk_pct_nav,
    regime,
    bucket,
  });

  const record = {
    trade_id: tradeId,
    month: monthKeyFromDate(openDate),
    mode: 'PAPER',
    symbol,
    open_date: openDate,
    close_date: '',
    direction,
    entry_vnd: entry,
    exit_vnd: '',
    stop_vnd: stop,
    target_vnd: target,
    size_pct: size,
    qty: pos.qty,
    notional_vnd: pos.notional_vnd,
    gross_pct: '',
    fees_pct: '',
    net_pct: '',
    rr_planned: rrPlanned,
    rr_achieved: '',
    result: '',
    vni_entry: opts.vni || '',
    notes,
  };

  const recordCheck = validateTradeRow(record);
  if (!recordCheck.ok) throw new ValidationError('OPEN — record không đủ', recordCheck);

  const openRows = openRowsFrom(rows);
  const kpi = computeKpiSummary(rows, monthKeyFromDate(openDate));
  const gate = checkPortfolioGate({
    openRows,
    newNotionalVnd: pos.notional_vnd,
    newSymbol: symbol,
    newSizePct: pos.size_pct_actual,
    portfolioStatus: kpi.status,
    netMonthPct: kpi.net_month_pct,
    riskPctNav: pos.risk_pct_nav,
    regime,
    bucket,
    force: opts.force === 'true' || opts.force === true,
  });
  console.log(formatPortfolioBlock('Gate danh mục', gate));
  if (!gate.ok) {
    throw new ValidationError('OPEN — gate danh mục', {
      ok: false,
      missing: gate.fail,
      warnings: gate.warnings,
    });
  }
  printWarnings(gate.warnings);

  await appendTradeRow(spreadsheetId, token, tab, objectToRow(record));
  try {
    await syncWatchlistAfterOpen(symbol);
  } catch (e) {
    console.warn('⚠ Watchlist sync skip:', e.message);
  }
  const { rows: all } = await fetchTradesPaper(spreadsheetId, token);
  const csvPath = syncCsv(all);

  console.log('✓ OPEN PAPER');
  printPositionAdvice(symbol, entry, stop, target, size, pos);
  console.log(JSON.stringify({ ...record, position: pos, tab, csv: csvPath }, null, 2));
  await autoShadowSync(tradeId);
}

async function cmdClose(opts) {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchTradesPaper(spreadsheetId, token);
  let trade;
  try {
    trade = findOpenTrade(rows, { tradeId: opts.id, symbol: opts.symbol });
  } catch (e) {
    throw new ValidationError('CLOSE — không tìm lệnh OPEN', { ok: false, missing: [e.message], warnings: [] });
  }

  const check = validateCloseCli(opts, trade);
  if (!check.ok) throw new ValidationError('CLOSE — thiếu thông số', check);
  printWarnings(check.warnings);

  const exit = num(opts.exit);
  const metrics = calcCloseMetrics(
    trade.entry_vnd,
    exit,
    trade.stop_vnd,
    trade.direction || 'LONG',
    opts.fees ?? DEFAULT_FEES_PCT
  );

  const closeDate = opts.date || todayGmt7();
  const notes = normalizeNotes(
    opts.notes || trade.notes,
    { emotion: opts.emotion, rule: opts.rule, extra: trade.notes && opts.notes ? undefined : undefined }
  );
  // merge lesson: if close notes provided, append to open notes
  let mergedNotes = String(trade.notes || '');
  if (opts.notes) mergedNotes = mergedNotes ? `${mergedNotes} | lesson:${opts.notes}` : opts.notes;
  mergedNotes = normalizeNotes(mergedNotes, { emotion: opts.emotion, rule: opts.rule });

  const updated = {
    ...trade,
    close_date: closeDate,
    exit_vnd: exit,
    gross_pct: metrics.gross_pct,
    fees_pct: metrics.fees_pct,
    net_pct: metrics.net_pct,
    rr_achieved: metrics.rr_achieved,
    result: metrics.result,
    notes: mergedNotes.trim(),
  };

  const recordCheck = validateTradeRow(updated);
  if (!recordCheck.ok) throw new ValidationError('CLOSE — record không đủ sau tính', recordCheck);

  await updateTradeRow(spreadsheetId, token, tab, trade._sheet_row, objectToRow(updated));
  const { rows: all } = await fetchTradesPaper(spreadsheetId, token);
  const csvPath = syncCsv(all);

  console.log(`✓ CLOSE PAPER · ${metrics.result} · net ${metrics.net_pct}%`);
  console.log(JSON.stringify({ trade_id: updated.trade_id, symbol: updated.symbol, ...metrics, csv: csvPath }, null, 2));
  await autoShadowSync(updated.trade_id);
}

async function cmdPatch(opts) {
  if (!opts.id && !opts.symbol) throw new Error('patch cần --id hoặc --symbol');

  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchTradesPaper(spreadsheetId, token);
  const trade = rows.find((r) => opts.id && r.trade_id === opts.id) ||
    rows.find((r) => opts.symbol && String(r.symbol).toUpperCase() === String(opts.symbol).toUpperCase() && !r.close_date);
  if (!trade) throw new Error('Không tìm thấy lệnh để patch');

  const updated = { ...trade };
  if (opts.vni) updated.vni_entry = opts.vni;
  if (opts.entry) updated.entry_vnd = num(opts.entry);
  if (opts.stop) updated.stop_vnd = num(opts.stop);
  if (opts.target) updated.target_vnd = num(opts.target);
  if (opts.size) updated.size_pct = num(opts.size);
  if (opts.entry || opts.size) {
    const pos = calcPositionSize(updated.entry_vnd, updated.size_pct, PAPER_NAV, undefined, updated.stop_vnd);
    updated.qty = pos.qty;
    updated.notional_vnd = pos.notional_vnd;
  }
  if (opts.entry && opts.stop && opts.target) {
    updated.rr_planned = calcRrPlanned(updated.entry_vnd, updated.stop_vnd, updated.target_vnd, updated.direction || 'LONG');
  } else if (!String(updated.rr_planned ?? '').trim() && updated.entry_vnd && updated.stop_vnd && updated.target_vnd) {
    updated.rr_planned = calcRrPlanned(updated.entry_vnd, updated.stop_vnd, updated.target_vnd, updated.direction || 'LONG');
  }
  const priorEmotion = String(trade.notes || '').match(/emotion:(calm|fomo|fear|revenge)/i)?.[1];
  const priorRule = String(trade.notes || '').match(/rule_followed:(Y|N)/i)?.[1];
  const priorExec = String(trade.notes || '').match(/exec_style:(aggressive|passive|probe)/i)?.[1];
  const priorExitPlan = String(trade.notes || '').match(/exit_plan:(single|ladder)/i)?.[1];
  const priorFill = String(trade.notes || '').match(/fill_assumption:(full|partial)/i)?.[1];
  const priorSession = String(trade.notes || '').match(/session:(ATO|ATC|continuous)/i)?.[1];
  const priorRegime = String(trade.notes || '').match(/regime:(bull|neutral|defensive)/i)?.[1];
  const priorBucket = String(trade.notes || '').match(/bucket:(\w+)/i)?.[1];
  const baseText = opts.notes != null ? opts.notes : stripExecTags(trade.notes);
  updated.notes = normalizeNotes(baseText, {
    emotion: opts.emotion || priorEmotion,
    rule: opts.rule || priorRule,
  });
  updated.notes = appendExecToNotes(
    stripExecTags(updated.notes),
    resolveExecOpts(
      {
        exec: opts.exec || priorExec,
        limit: opts.limit,
        fill: opts.fill || priorFill,
        'fill-price': opts['fill-price'],
        session: opts.session || priorSession,
        'exit-plan': opts['exit-plan'] || priorExitPlan,
        ladder: opts.ladder,
      },
      updated.entry_vnd
    )
  );
  const regimeRaw = String(opts.regime || priorRegime || 'neutral').toLowerCase();
  const regime = REGIMES.has(regimeRaw) ? regimeRaw : 'neutral';
  const bucket = priorBucket || bucketForSymbol(updated.symbol);
  const pos = calcPositionSize(
    updated.entry_vnd,
    updated.size_pct,
    PAPER_NAV,
    updated.qty,
    updated.stop_vnd
  );
  updated.notes = appendPortfolioTags(updated.notes, {
    risk_pct_nav: pos.risk_pct_nav,
    regime,
    bucket,
  });

  const before = validateTradeRow(trade);
  const after = validateTradeRow(updated);
  if (!after.ok) {
    console.log(formatValidationBlock('Trước patch', before));
    console.log('');
    console.log(formatValidationBlock('Sau patch (không ghi)', after));
    throw new ValidationError('PATCH — record không đủ', after);
  }

  await updateTradeRow(spreadsheetId, token, tab, trade._sheet_row, objectToRow(updated));
  const { rows: all } = await fetchTradesPaper(spreadsheetId, token);
  syncCsv(all);

  console.log('✓ PATCH', updated.trade_id);
  console.log(formatValidationBlock('Trước patch', before));
  console.log('');
  console.log(formatValidationBlock('Sau patch', after));
  await autoShadowSync(updated.trade_id);
}

async function cmdValidate() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows } = await fetchTradesPaper(spreadsheetId, token);
  const issues = auditAllTrades(rows);

  if (!issues.length) {
    console.log('✅ Tất cả lệnh đủ trường phân tích P&L/KPI');
    return;
  }

  console.log(`❌ ${issues.length} lệnh cần bổ sung:\n`);
  for (const i of issues) {
    console.log(`### ${i.trade_id} · ${i.symbol} · ${i.status}`);
    if (i.missing.length) console.log('  Thiếu:', i.missing.join(', '));
    if (i.warnings.length) console.log('  Khuyến nghị:', i.warnings.join(', '));
    console.log(`  → node scripts/swing-log.mjs patch --id ${i.trade_id} --vni ... --emotion ... --rule ...`);
    console.log('');
  }
  process.exitCode = 1;
}

async function cmdPortfolio() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows } = await fetchTradesPaper(spreadsheetId, token);
  const openRows = openRowsFrom(rows);
  const kpi = computeKpiSummary(rows);
  const s = portfolioSummary(openRows, kpi);
  console.log(`# Gate danh mục PAPER · ${kpi.status} · ${todayGmt7()}`);
  console.log('');
  console.log('| Chỉ số | Giá trị | Hạn mức |');
  console.log('|--------|---------|---------|');
  console.log(`| NAV paper | ${PAPER_NAV / 1e6}M | |`);
  console.log(`| Net tháng | ${kpi.net_month_pct}% | STOP ≤ −3% |`);
  console.log(`| Notional OPEN | ${Math.round(s.currentNotional / 1e6 * 10) / 10}M (${s.investedPct}%) | ≤ 60% |`);
  console.log(`| Cash buffer | ${s.cashPct}% | ≥ 40% |`);
  console.log(`| Lệnh OPEN | ${s.openCount} | ≤ 2 |`);
  if (s.openSymbols.length) console.log(`| Mã OPEN | ${s.openSymbols.join(', ')} | |`);
  console.log('');
  console.log('Playbook: SWING-PORTFOLIO.md · SWING-EXECUTION-PLAYBOOK.md');
}

async function cmdList() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchTradesPaper(spreadsheetId, token);
  const open = openRowsFrom(rows);
  const kpi = computeKpiSummary(rows);
  const s = portfolioSummary(open, kpi);
  console.log(`Tab: ${tab} · Tổng: ${rows.length} · OPEN: ${open.length} · Notional ${s.investedPct}% NAV · ${kpi.status}`);
  for (const r of open) {
    const qty = r.qty || (r.entry_vnd && r.size_pct ? calcPositionSize(r.entry_vnd, r.size_pct, PAPER_NAV, undefined, r.stop_vnd).qty : '?');
    const v = validateTradeRow(r);
    const flag = v.ok ? '✅' : '⚠ THIẾU';
    console.log(
      `  ${flag} ${r.trade_id} ${r.symbol} entry=${r.entry_vnd} qty=${qty} notional=${r.notional_vnd || ''} stop=${r.stop_vnd} target=${r.target_vnd}`
    );
    if (!v.ok) console.log(`       thiếu: ${v.missing.join(', ')}`);
  }
}

function printHelp() {
  console.log(`Usage:
  open  — symbol entry stop target size notes emotion rule
          --exec aggressive|passive|probe [--limit] [--fill full|partial]
          [--session continuous|ATO|ATC] [--exit-plan single|ladder] [--ladder "..."]
          [--regime bull|neutral|defensive] [vni]
  close — id|symbol exit notes emotion rule [fees]
  patch — id|symbol + trường thiếu (vni, emotion, rule, notes, exec, limit, ...)
  validate — quét Sheet, báo lệnh thiếu trường
  portfolio — gate danh mục (exposure, mode, hạn mức)
  list

Chiến thuật: scripts/SWING-EXECUTION-PLAYBOOK.md (T1 aggressive · T2 passive · T3 probe · T4 exit)

Ví dụ OPEN T1 (ACB bootstrap):
  node scripts/swing-log.mjs open --symbol ACB --entry 22450 --stop 21850 --target 23600 --size 25 \\
    --notes "pullback 22.4" --emotion calm --rule Y --vni 1870 \\
    --exec aggressive --limit 22450 --fill full --session continuous --exit-plan single

Thiếu bất kỳ trường bắt buộc → script TỪ CHỐI ghi và liệt kê cần bổ sung.`);
}

async function main() {
  const { positional, opts } = parseKvArgs(process.argv.slice(2));
  const cmd = (positional[0] || '').toLowerCase();
  if (!cmd || cmd === 'help' || opts.help) {
    printHelp();
    process.exit(cmd ? 0 : 1);
  }
  if (cmd === 'open') await cmdOpen(opts);
  else if (cmd === 'close') await cmdClose(opts);
  else if (cmd === 'patch') await cmdPatch(opts);
  else if (cmd === 'validate') await cmdValidate();
  else if (cmd === 'list') await cmdList();
  else if (cmd === 'portfolio') await cmdPortfolio();
  else throw new Error(`Lệnh không hỗ trợ: ${cmd}`);
}

main().catch((e) => {
  if (e.name === 'ValidationError') {
    console.error('\n' + e.message);
    process.exit(2);
  }
  console.error('Lỗi:', e.message);
  process.exit(1);
});
