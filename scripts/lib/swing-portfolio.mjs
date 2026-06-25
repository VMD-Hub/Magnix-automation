/**
 * Gate danh mục PAPER 500M — SWING-PORTFOLIO.md
 */
import { calcPositionSize, num, PAPER_NAV, STOP_MONTH_PCT } from './swing-sheet.mjs';

export const MAX_OPEN_POSITIONS = 2;
export const MAX_TOTAL_INVESTED_PCT = 60;
export const MAX_SIZE_PCT = 35;
export const MWG_MAX_SIZE_PCT = 25;
export const MIN_CASH_BUFFER_PCT = 40;
export const WARN_INVESTED_PCT = 50;
export const MAX_RISK_PCT_NAV = 1.25;
export const DEFENSIVE_MAX_SIZE_PCT = 20;

export const SYMBOL_BUCKET = {
  ACB: 'bank',
  HPG: 'cyclical',
  MWG: 'retail',
};

export function bucketForSymbol(symbol) {
  return SYMBOL_BUCKET[String(symbol || '').toUpperCase()] || 'other';
}

export function sumOpenNotional(openRows) {
  let total = 0;
  for (const r of openRows) {
    const n = num(r.notional_vnd);
    if (!Number.isNaN(n) && n > 0) total += n;
    else if (r.entry_vnd && r.qty) total += num(r.entry_vnd) * num(r.qty);
    else if (r.entry_vnd && r.size_pct) {
      total += calcPositionSize(r.entry_vnd, r.size_pct, PAPER_NAV, undefined, r.stop_vnd).notional_vnd;
    }
  }
  return Math.round(total);
}

export function openRowsFrom(allRows) {
  return allRows.filter(
    (r) =>
      String(r.mode || 'PAPER').toUpperCase() === 'PAPER' &&
      !String(r.close_date || '').trim()
  );
}

/**
 * @param {object} p
 * @param {object[]} p.openRows
 * @param {number} p.newNotionalVnd
 * @param {string} p.newSymbol
 * @param {number} p.newSizePct
 * @param {string} [p.portfolioStatus] ON TRACK | BEHIND | AT RISK | STOP
 * @param {number} [p.netMonthPct]
 * @param {number} [p.riskPctNav]
 * @param {string} [p.regime] bull | neutral | defensive
 * @param {string} [p.bucket]
 */
export function checkPortfolioGate({
  openRows,
  newNotionalVnd,
  newSymbol,
  newSizePct,
  portfolioStatus = 'ON TRACK',
  netMonthPct = 0,
  riskPctNav = null,
  regime = 'neutral',
  bucket = 'other',
  force = false,
}) {
  const fail = [];
  const warnings = [];
  void force;
  const sym = String(newSymbol || '').toUpperCase();
  const newBucket = bucket || bucketForSymbol(sym);
  const currentNotional = sumOpenNotional(openRows);
  const totalAfter = currentNotional + newNotionalVnd;
  const investedPct = Math.round((totalAfter / PAPER_NAV) * 10000) / 100;
  const cashPct = Math.round(((PAPER_NAV - totalAfter) / PAPER_NAV) * 10000) / 100;
  const openCount = openRows.length;

  if (portfolioStatus === 'STOP' || netMonthPct <= STOP_MONTH_PCT) {
    fail.push(`STOP MONTH (net ${netMonthPct}% ≤ ${STOP_MONTH_PCT}%) — không OPEN mới`);
  }
  if (openCount >= MAX_OPEN_POSITIONS) {
    fail.push(`Đã ${openCount} lệnh OPEN (max ${MAX_OPEN_POSITIONS})`);
  }
  if (newSizePct > MAX_SIZE_PCT) {
    fail.push(`size ${newSizePct}% > max ${MAX_SIZE_PCT}%`);
  }
  if (sym === 'MWG' && newSizePct > MWG_MAX_SIZE_PCT) {
    fail.push(`MWG size ${newSizePct}% > max ${MWG_MAX_SIZE_PCT}%`);
  }
  if (regime === 'defensive' && newSizePct > DEFENSIVE_MAX_SIZE_PCT) {
    fail.push(`DEFENSIVE: size ${newSizePct}% > max ${DEFENSIVE_MAX_SIZE_PCT}%`);
  }
  if (riskPctNav != null && Number(riskPctNav) > MAX_RISK_PCT_NAV) {
    fail.push(
      `Rủi ro tới stop ${riskPctNav}% NAV > max ${MAX_RISK_PCT_NAV}% — giảm size hoặc chỉnh stop`
    );
  }
  if (investedPct > MAX_TOTAL_INVESTED_PCT) {
    fail.push(
      `Tổng notional ${investedPct}% NAV > max ${MAX_TOTAL_INVESTED_PCT}% (${Math.round(totalAfter / 1e6)}M / 500M)`
    );
  }
  if (cashPct < MIN_CASH_BUFFER_PCT) {
    fail.push(`Cash buffer ${cashPct}% < min ${MIN_CASH_BUFFER_PCT}% sau OPEN`);
  }

  const dup = openRows.some((r) => String(r.symbol || '').toUpperCase() === sym);
  if (dup) {
    fail.push(`Đã có lệnh OPEN ${sym} — đóng hoặc dùng T3 patch leg`);
  }

  for (const r of openRows) {
    const openBucket = bucketForSymbol(r.symbol);
    if (openBucket !== 'other' && openBucket === newBucket) {
      fail.push(`Đã OPEN bucket ${newBucket} (${r.symbol}) — max 1 mã/bucket`);
      break;
    }
  }

  if (regime === 'defensive') {
    warnings.push('DEFENSIVE: VNI yếu — size max 20%, ưu tiên T2/T3');
  }

  if (investedPct > WARN_INVESTED_PCT && investedPct <= MAX_TOTAL_INVESTED_PCT) {
    warnings.push(`W1: Notional sau OPEN ${investedPct}% NAV — buffer cash thấp`);
  }
  if (openCount === 1 && openCount + 1 === 2) {
    warnings.push('W2: 2 mã OPEN — size lệnh 2 nên ≤ 30% nếu cùng beta VN');
  }
  if (newSizePct > 30 && sym !== 'ACB') {
    warnings.push(`W4: size ${newSizePct}% cao — cân nhắc giảm nếu tin cậy TB`);
  }

  const ok = fail.length === 0;
  return {
    ok,
    fail,
    warnings,
    currentNotional,
    totalAfter,
    investedPct,
    cashPct,
    openCount,
    portfolioStatus,
    riskPctNav,
    regime,
    bucket: newBucket,
  };
}

export function formatPortfolioBlock(title, gate) {
  const lines = [`## ${title}`, gate.ok ? '✅ PASS gate danh mục' : '❌ FAIL gate danh mục'];
  lines.push('');
  lines.push('| Chỉ số | Giá trị | Hạn mức |');
  lines.push('|--------|---------|---------|');
  lines.push(`| Mode | ${gate.portfolioStatus} | |`);
  lines.push(`| Notional OPEN | ${Math.round(gate.currentNotional / 1e6 * 10) / 10}M | |`);
  lines.push(`| Sau OPEN | ${Math.round(gate.totalAfter / 1e6 * 10) / 10}M (${gate.investedPct}%) | ≤ ${MAX_TOTAL_INVESTED_PCT}% |`);
  lines.push(`| Cash buffer | ${gate.cashPct}% | ≥ ${MIN_CASH_BUFFER_PCT}% |`);
  lines.push(`| Số OPEN | ${gate.openCount} → ${gate.openCount + 1} | ≤ ${MAX_OPEN_POSITIONS} |`);
  if (gate.riskPctNav != null) {
    lines.push(`| Rủi ro stop | ${gate.riskPctNav}% NAV | ≤ ${MAX_RISK_PCT_NAV}% |`);
  }
  if (gate.fail.length) {
    lines.push('', '**FAIL:**');
    for (const f of gate.fail) lines.push(`- ${f}`);
  }
  if (gate.warnings.length) {
    lines.push('', '**Cảnh báo:**');
    for (const w of gate.warnings) lines.push(`- ${w}`);
  }
  if (!gate.ok) {
    lines.push('', '_Xem SWING-PORTFOLIO.md · `--force` không bỏ qua FAIL cứng._');
  }
  return lines.join('\n');
}

export function portfolioSummary(openRows, kpi = {}) {
  const currentNotional = sumOpenNotional(openRows);
  const investedPct = Math.round((currentNotional / PAPER_NAV) * 10000) / 100;
  return {
    portfolioStatus: kpi.status || 'ON TRACK',
    netMonthPct: kpi.net_month_pct ?? 0,
    currentNotional,
    investedPct,
    cashPct: Math.round((100 - investedPct) * 100) / 100,
    openCount: openRows.length,
    openSymbols: openRows.map((r) => r.symbol),
  };
}
