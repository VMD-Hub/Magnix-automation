#!/usr/bin/env node
/**
 * Shadow P&L — sync what-if từ Trades_PAPER (không ảnh hưởng KPI).
 *
 * Usage:
 *   node scripts/swing-shadow.mjs sync [--id PAPER-...] [--scenarios spot_1x,margin_1.25x_bull]
 *   node scripts/swing-shadow.mjs list
 *   node scripts/swing-shadow.mjs validate
 *   node scripts/swing-shadow.mjs compare [--id PAPER-...]
 */
import {
  fetchTradesPaper,
  getSheetsToken,
  parseKvArgs,
  swingSheetId,
} from './lib/swing-sheet.mjs';
import { validateShadowRow } from './lib/swing-shadow-schema.mjs';
import { fetchTradesShadow } from './lib/swing-shadow-sheet.mjs';
import { syncShadowTrades } from './lib/swing-shadow-sync.mjs';

async function cmdSync(opts) {
  const scenarios = opts.scenarios
    ? String(opts.scenarios)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const result = await syncShadowTrades({
    tradeId: opts.id,
    scenarios,
    quiet: false,
  });

  console.log('');
  console.log(
    `✓ Shadow sync · created=${result.created} updated=${result.updated} total=${result.total}${result.csv ? ` · csv=${result.csv}` : ''}`
  );
}

async function cmdList(opts) {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { tab, rows } = await fetchTradesShadow(spreadsheetId, token);
  let list = rows;
  if (opts.id) list = list.filter((r) => r.paper_trade_id === opts.id);

  console.log(`Tab: ${tab} · Shadow rows: ${list.length}`);
  for (const r of list) {
    console.log(
      `  ${String(r.status || '?').padEnd(14)} ${r.shadow_id} net=${r.shadow_net_pct || '—'}% nav_impact=${r.shadow_nav_impact_pct || '—'}% margin_called=${r.margin_called || 'N'}`
    );
  }
}

async function cmdValidate() {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows } = await fetchTradesShadow(spreadsheetId, token);
  const issues = [];

  for (const r of rows) {
    const strict = String(r.status || '') === 'closed' || String(r.status || '') === 'margin_called';
    const v = validateShadowRow(r, { strict });
    if (!v.ok || v.warnings.length) {
      issues.push({ shadow_id: r.shadow_id, ...v });
    }
  }

  if (!issues.length) {
    console.log('✅ Tất cả shadow rows hợp lệ');
    return;
  }

  console.log(`❌ ${issues.length} shadow row cần xem:\n`);
  for (const i of issues) {
    console.log(`### ${i.shadow_id}`);
    if (i.missing?.length) console.log('  Thiếu:', i.missing.join(', '));
    if (i.warnings?.length) console.log('  Khuyến nghị:', i.warnings.join(', '));
    console.log('');
  }
  process.exitCode = 1;
}

async function cmdCompare(opts) {
  const spreadsheetId = swingSheetId();
  const token = await getSheetsToken();
  const { rows: paperRows } = await fetchTradesPaper(spreadsheetId, token);
  const { rows: shadowRows } = await fetchTradesShadow(spreadsheetId, token);

  let papers = paperRows.filter((r) => r.close_date || r.net_pct);
  if (opts.id) papers = papers.filter((r) => r.trade_id === opts.id);

  if (!papers.length) {
    console.log('Chưa có lệnh PAPER đóng để so sánh.');
    return;
  }

  console.log('# Spot vs Shadow (lệnh đóng)\n');
  console.log('| paper_id | scenario | spot net% | shadow net% | nav impact shadow | margin_called |');
  console.log('|----------|----------|-----------|-------------|-------------------|---------------|');

  for (const p of papers) {
    const shadows = shadowRows.filter((s) => s.paper_trade_id === p.trade_id);
    if (!shadows.length) {
      console.log(`| ${p.trade_id} | — | ${p.net_pct || '—'} | (chưa sync) | — | — |`);
      continue;
    }
    for (const s of shadows) {
      console.log(
        `| ${p.trade_id} | ${s.scenario_id} | ${p.net_pct || '—'} | ${s.shadow_net_pct || '—'} | ${s.shadow_nav_impact_pct || '—'} | ${s.margin_called || 'N'} |`
      );
    }
  }
}

function printHelp() {
  console.log(`Usage:
  sync     [--id PAPER-...] [--scenarios spot_1x,margin_1.25x_bull]
  list     [--id PAPER-...]
  validate
  compare  [--id PAPER-...]

Docs: scripts/SWING-THEORY-RESEARCH.md · SWING-SHADOW-SCHEMA.md

Mặc định sync: spot_1x + margin_1.25x_bull (hoặc tags shadow: trong notes paper).
Tự chạy sau swing-log open/close.`);
}

async function main() {
  const { positional, opts } = parseKvArgs(process.argv.slice(2));
  const cmd = (positional[0] || '').toLowerCase();
  if (!cmd || cmd === 'help' || opts.help) {
    printHelp();
    process.exit(cmd ? 0 : 1);
  }
  if (cmd === 'sync') await cmdSync(opts);
  else if (cmd === 'list') await cmdList(opts);
  else if (cmd === 'validate') await cmdValidate();
  else if (cmd === 'compare') await cmdCompare(opts);
  else throw new Error(`Lệnh không hỗ trợ: ${cmd}`);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
