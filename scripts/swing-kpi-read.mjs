#!/usr/bin/env node
/**
 * Đọc KPI PAPER từ Google Sheet (+ real-gate progress).
 *
 * Usage:
 *   node scripts/swing-kpi-read.mjs
 *   node scripts/swing-kpi-read.mjs --json
 *   node scripts/swing-kpi-read.mjs --real-gate
 *   node scripts/swing-kpi-read.mjs --month 2026-06
 */
import {
  computeKpiSummary,
  computeRealGate,
  fetchTradesPaper,
  getSheetsToken,
  monthKeyFromDate,
  parseKvArgs,
  PAPER_NAV,
  rowsToObjects,
  sheetsApi,
  swingSheetId,
  todayGmt7,
} from './lib/swing-sheet.mjs';

async function fetchMonthlyPaper(spreadsheetId, token) {
  const meta = await sheetsApi(token, 'GET', spreadsheetId, '?fields=sheets.properties.title');
  const titles = (meta.sheets || []).map((s) => s.properties.title);
  const tab = titles.includes('Monthly_PAPER') ? 'Monthly_PAPER' : titles.includes('Swing_Monthly_PAPER') ? 'Swing_Monthly_PAPER' : null;
  if (!tab) return [];
  const range = encodeURIComponent(`${tab}!A:M`);
  const data = await sheetsApi(token, 'GET', spreadsheetId, `values/${range}`);
  const raw = data.values || [];
  if (raw.length < 2) return [];
  const hdr = raw[0].map((h) => String(h).trim().toLowerCase());
  return raw.slice(1).map((cells) => {
    const o = {};
    hdr.forEach((k, i) => {
      if (k) o[k] = cells[i] ?? '';
    });
    return o;
  });
}

function printHuman(kpi, gate) {
  const navM = (kpi.nav_est / 1_000_000).toFixed(1);
  console.log(`# /swing PAPER — ${kpi.month} · 500M · Target ${kpi.target_pct}%`);
  console.log(`> Phase 1 · ${todayGmt7()} · **${kpi.status}**`);
  console.log('');
  console.log('## KPI paper');
  console.log('| Chỉ số | Giá trị | Ngưỡng |');
  console.log('|--------|---------|--------|');
  console.log(`| NAV ước | ${navM}M | ${PAPER_NAV / 1e6}M base |`);
  console.log(`| Lợi nhuận tháng | ${kpi.net_month_pct}% | target ${kpi.target_pct}% |`);
  console.log(`| Win rate | ${kpi.win_rate_pct ?? '—'}% | ≥ 50% |`);
  console.log(`| R:R TB | ${kpi.avg_rr ?? '—'} | ≥ 1,4 |`);
  console.log(`| Lệnh đóng (tháng/tổng) | ${kpi.trades_closed_month}/${kpi.trades_closed_total} | hướng ≥15 |`);
  console.log(`| Stop trước open | ${kpi.stop_compliance_pct}% | 100% |`);
  console.log(`| OPEN hiện tại | ${kpi.trades_open} | — |`);

  if (kpi.open_positions.length) {
    console.log('');
    console.log('## Lệnh OPEN');
    for (const p of kpi.open_positions) {
      console.log(`- ${p.trade_id} ${p.symbol} @ ${p.entry_vnd} stop ${p.stop_vnd} (từ ${p.open_date})`);
    }
  }

  if (gate) {
    console.log('');
    console.log(`## real-gate · ${gate.passCount}/${gate.scorable} pass · REAL **${gate.ready ? 'SẴN SÀNG REVIEW' : 'KHÓA'}**`);
    for (const [k, v] of Object.entries(gate.checks)) {
      const icon = v === true ? '✅' : v === false ? '❌' : '⏳';
      console.log(`${icon} ${k}`);
    }
  }
}

async function main() {
  const { opts } = parseKvArgs(process.argv.slice(2));
  const spreadsheetId = swingSheetId();
  if (!spreadsheetId) throw new Error('Thiếu GOOGLE_SHEET_SWING_KPI_ID');

  const token = await getSheetsToken();
  const { rows } = await fetchTradesPaper(spreadsheetId, token);
  const monthKey = opts.month || monthKeyFromDate(todayGmt7());
  const kpi = computeKpiSummary(rows, monthKey);

  let gate = null;
  if (opts['real-gate'] === 'true' || opts.realGate === 'true') {
    const monthly = await fetchMonthlyPaper(spreadsheetId, token);
    gate = computeRealGate(rows, monthly);
  }

  if (opts.json === 'true') {
    console.log(JSON.stringify({ kpi, gate }, null, 2));
    return;
  }

  printHuman(kpi, gate);
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
