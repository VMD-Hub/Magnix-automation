/**
 * Shadow & Theory schema — Phase 1 research layer (không ảnh hưởng PAPER KPI).
 * Docs: SWING-SHADOW-SCHEMA.md · SWING-THEORY-RESEARCH.md
 */

export const SHADOW_HEADERS = [
  'shadow_id',
  'paper_trade_id',
  'month',
  'symbol',
  'scenario_id',
  'hypothesis_ids',
  'leverage',
  'hedge_type',
  'hedge_ratio',
  'margin_call_pct',
  'entry_vnd',
  'exit_vnd',
  'stop_vnd',
  'target_vnd',
  'size_pct',
  'notional_vnd',
  'gross_pct',
  'fees_pct',
  'shadow_net_pct',
  'shadow_nav_impact_pct',
  'margin_called',
  'regime',
  'bucket',
  'vni_entry',
  'vni_exit',
  'context_json',
  'status',
  'notes',
];

export const THEORY_LOG_HEADERS = [
  'hypothesis_id',
  'month',
  'statement',
  'scenario_ids',
  'sample_min',
  'sample_n',
  'metric',
  'threshold',
  'result_value',
  'verdict',
  'lesson',
  'rule_next',
  'updated_at',
];

export const SHADOW_SCENARIO_IDS = [
  'spot_1x',
  'margin_1.25x_bull',
  'margin_1.5x_aggressive',
  'hedge_vn30f_20',
  'hedge_vn30f_40',
];

export const SHADOW_SCENARIOS = {
  spot_1x: { leverage: 1.0, hedge_type: 'none', hedge_ratio: 0, margin_call_pct: null },
  'margin_1.25x_bull': { leverage: 1.25, hedge_type: 'none', hedge_ratio: 0, margin_call_pct: -8 },
  'margin_1.5x_aggressive': { leverage: 1.5, hedge_type: 'none', hedge_ratio: 0, margin_call_pct: -6 },
  hedge_vn30f_20: { leverage: 1.0, hedge_type: 'vn30f_short', hedge_ratio: 0.2, margin_call_pct: null },
  hedge_vn30f_40: { leverage: 1.0, hedge_type: 'vn30f_short', hedge_ratio: 0.4, margin_call_pct: null },
};

export const HEDGE_TYPES = new Set(['none', 'vn30f_short', 'vn30f_long']);
export const REGIMES = new Set(['bull', 'neutral', 'defensive']);
export const BUCKETS = new Set(['bank', 'cyclical', 'retail', 'other']);
export const SHADOW_STATUSES = new Set(['open', 'closed', 'margin_called']);
export const THEORY_VERDICTS = new Set(['confirmed', 'rejected', 'inconclusive', 'pending']);

export const PHASE1_MAX_LEVERAGE = 1.5;

export const DEFAULT_HYPOTHESES = [
  { id: 'H-REG-01', statement: 'VNI trên MA50 → T1 aggressive có win rate cao hơn T2/passive' },
  { id: 'H-BKT-01', statement: '1 bank + 1 cyclical OPEN giảm DD tháng vs 2 cyclical' },
  { id: 'H-LEV-01', statement: 'Bull rõ: leverage 1.25× tăng lãi nhưng DD shadow ≤2× spot' },
  { id: 'H-HDG-01', statement: 'VN30F short 20% beta giảm DD khi VNI −3%/tuần' },
  { id: 'H-EXC-01', statement: 'T2 passive beat T1 trên vùng rộng (HPG/MWG)' },
];

export const SYMBOL_BUCKET = {
  ACB: 'bank',
  HPG: 'cyclical',
  MWG: 'retail',
};

function blank(v) {
  return v === null || v === undefined || String(v).trim() === '';
}

function parseDecimal(v) {
  if (blank(v)) return NaN;
  let s = String(v).trim().replace(/\s/g, '');
  if (/^\d+,\d+$/.test(s)) s = s.replace(',', '.');
  else s = s.replace(/,/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

function num(v) {
  return parseDecimal(v);
}

export function buildShadowId(paperTradeId, scenarioId) {
  return `SHAD-${paperTradeId}-${scenarioId}`;
}

export function parseScenario(scenarioId) {
  const s = SHADOW_SCENARIOS[scenarioId];
  if (!s) throw new Error(`scenario_id không hợp lệ: ${scenarioId}`);
  return { ...s };
}

export function calcHedgeAdjPct(hedgeType, hedgeRatio, vniEntry, vniExit, betaPortfolio = 1) {
  if (hedgeType === 'none' || !hedgeRatio) return 0;
  const v0 = num(vniEntry);
  const v1 = num(vniExit);
  if (Number.isNaN(v0) || Number.isNaN(v1) || v0 === 0) return 0;
  const vniMovePct = ((v1 - v0) / v0) * 100;
  if (hedgeType === 'vn30f_short') return -hedgeRatio * betaPortfolio * vniMovePct;
  if (hedgeType === 'vn30f_long') return hedgeRatio * betaPortfolio * vniMovePct;
  return 0;
}

export function unrealizedLossPct(entry, price) {
  const e = num(entry);
  const p = num(price);
  if (Number.isNaN(e) || Number.isNaN(p) || e === 0) return 0;
  return ((p - e) / e) * 100;
}

export function calcShadowMetrics(paper, scenarioId, opts = {}) {
  const sc = parseScenario(scenarioId);
  const lev = sc.leverage;
  const gross = num(paper.gross_pct);
  const fees = num(paper.fees_pct) || num(opts.defaultFees) || 0.7;
  const sizePaper = num(paper.size_pct);

  let grossShadow = Number.isNaN(gross) ? '' : Math.round(gross * lev * 100) / 100;
  const feesShadow = Math.round(fees * lev * 100) / 100;
  let netShadow = grossShadow !== '' ? Math.round((grossShadow - feesShadow) * 100) / 100 : '';

  const vniEntry = opts.vni_entry ?? paper.vni_entry;
  const vniExit = opts.vni_exit ?? paper.vni_exit;
  const hedgeAdj = calcHedgeAdjPct(sc.hedge_type, sc.hedge_ratio, vniEntry, vniExit, opts.beta_portfolio ?? 1);
  if (netShadow !== '') netShadow = Math.round((netShadow + hedgeAdj) * 100) / 100;

  const sizeShadow = Math.round(sizePaper * lev * 100) / 100;
  const notionalPaper = num(paper.notional_vnd);
  const notionalShadow = Number.isNaN(notionalPaper) ? '' : Math.round(notionalPaper * lev);

  let marginCalled = 'N';
  let status = paper.close_date || paper.exit_vnd ? 'closed' : 'open';
  if (sc.margin_call_pct != null && !blank(paper.stop_vnd)) {
    const lossAtStop = unrealizedLossPct(paper.entry_vnd, paper.stop_vnd);
    if (lossAtStop <= sc.margin_call_pct) {
      marginCalled = 'Y';
      status = 'margin_called';
    }
  }

  const navImpact =
    netShadow !== '' && !Number.isNaN(sizePaper)
      ? Math.round(((netShadow * sizePaper * lev) / 100) * 100) / 100
      : '';

  return {
    leverage: lev,
    hedge_type: sc.hedge_type,
    hedge_ratio: sc.hedge_ratio,
    margin_call_pct: sc.margin_call_pct ?? '',
    size_pct: sizeShadow,
    notional_vnd: notionalShadow,
    gross_pct: grossShadow,
    fees_pct: feesShadow,
    shadow_net_pct: netShadow,
    shadow_nav_impact_pct: navImpact,
    margin_called: marginCalled,
    status,
    hedge_adj_pct: Math.round(hedgeAdj * 100) / 100,
  };
}

export function buildShadowRowFromPaper(paper, scenarioId, extra = {}) {
  const sc = parseScenario(scenarioId);
  const lev = sc.leverage;
  const sizePaper = num(paper.size_pct);
  const notionalPaper = num(paper.notional_vnd);

  return {
    shadow_id: buildShadowId(paper.trade_id, scenarioId),
    paper_trade_id: paper.trade_id,
    month: paper.month,
    symbol: paper.symbol,
    scenario_id: scenarioId,
    hypothesis_ids: extra.hypothesis_ids || '',
    leverage: lev,
    hedge_type: sc.hedge_type,
    hedge_ratio: sc.hedge_ratio,
    margin_call_pct: sc.margin_call_pct ?? '',
    entry_vnd: paper.entry_vnd,
    exit_vnd: paper.exit_vnd || '',
    stop_vnd: paper.stop_vnd,
    target_vnd: paper.target_vnd,
    size_pct: Math.round(sizePaper * lev * 100) / 100,
    notional_vnd: Number.isNaN(notionalPaper) ? '' : Math.round(notionalPaper * lev),
    gross_pct: '',
    fees_pct: '',
    shadow_net_pct: '',
    shadow_nav_impact_pct: '',
    margin_called: 'N',
    regime: extra.regime || '',
    bucket: extra.bucket || SYMBOL_BUCKET[String(paper.symbol).toUpperCase()] || 'other',
    vni_entry: paper.vni_entry || extra.vni_entry || '',
    vni_exit: '',
    context_json: extra.context_json ? JSON.stringify(extra.context_json) : '',
    status: 'open',
    notes: extra.notes || '',
  };
}

export function validateShadowRow(row, { strict = true } = {}) {
  const missing = [];
  const warnings = [];

  for (const k of ['shadow_id', 'paper_trade_id', 'month', 'symbol', 'scenario_id', 'leverage', 'hedge_type', 'entry_vnd', 'stop_vnd', 'target_vnd', 'status']) {
    if (blank(row[k])) missing.push(k);
  }

  if (row.scenario_id && !SHADOW_SCENARIOS[row.scenario_id]) missing.push('scenario_id invalid');

  const lev = parseDecimal(row.leverage);
  if (!Number.isNaN(lev) && lev > PHASE1_MAX_LEVERAGE) {
    missing.push(`leverage > ${PHASE1_MAX_LEVERAGE} Phase 1`);
  }

  if (row.hedge_type && !HEDGE_TYPES.has(String(row.hedge_type))) missing.push('hedge_type invalid');
  if (row.regime && !REGIMES.has(String(row.regime))) warnings.push('regime non-standard');
  if (blank(row.hypothesis_ids)) warnings.push('hypothesis_ids');
  if (strict && row.status === 'closed' && blank(row.exit_vnd)) missing.push('exit_vnd when closed');

  return { ok: missing.length === 0, missing, warnings };
}

export function validateTheoryRow(row) {
  const missing = [];
  for (const k of ['hypothesis_id', 'month', 'statement', 'sample_min', 'metric', 'threshold', 'verdict']) {
    if (blank(row[k])) missing.push(k);
  }
  if (row.statement && String(row.statement).trim().length < 20) missing.push('statement min 20 chars');
  if (row.verdict && !THEORY_VERDICTS.has(String(row.verdict))) missing.push('verdict invalid');
  return { ok: missing.length === 0, missing, warnings: [] };
}

export function parseResearchTags(notes) {
  const s = String(notes || '');
  const hypothesis = s.match(/hypothesis:([^\|]+)/i)?.[1]?.trim() || '';
  const shadow = s.match(/shadow:([^\|]+)/i)?.[1]?.trim() || '';
  const regime = s.match(/regime:(bull|neutral|defensive)/i)?.[1]?.toLowerCase() || '';
  const bucket = s.match(/bucket:(bank|cyclical|retail|other)/i)?.[1]?.toLowerCase() || '';
  return {
    hypothesis_ids: hypothesis,
    scenario_ids: shadow ? shadow.split(',').map((x) => x.trim()) : [],
    regime,
    bucket,
  };
}

export function objectToShadowRow(obj) {
  return SHADOW_HEADERS.map((h) => obj[h] ?? '');
}

export function objectToTheoryRow(obj) {
  return THEORY_LOG_HEADERS.map((h) => obj[h] ?? '');
}
