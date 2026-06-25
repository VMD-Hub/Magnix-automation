/**
 * Schema & validation — lệnh paper phải đủ trường để P&L, KPI, real-gate.
 */

export const OPEN_REQUIRED_CLI = [
  { key: 'symbol', flag: 'symbol', label: 'Mã CP (--symbol)' },
  { key: 'entry', flag: 'entry', label: 'Giá vào (--entry VND)' },
  { key: 'stop', flag: 'stop', label: 'Stop-loss (--stop VND)' },
  { key: 'target', flag: 'target', label: 'Target (--target VND)' },
  { key: 'size', flag: 'size', label: 'Size % NAV (--size, max 35)' },
  { key: 'notes', flag: 'notes', label: 'Setup 1 dòng (--notes)' },
  { key: 'emotion', flag: 'emotion', label: 'Cảm xúc (--emotion calm|fomo|fear|revenge)' },
  { key: 'rule', flag: 'rule', label: 'Tuân rule (--rule Y|N)' },
];

export const OPEN_RECOMMENDED_CLI = [
  { key: 'vni', flag: 'vni', label: 'VN-Index lúc vào (--vni)' },
];

export const CLOSE_REQUIRED_CLI = [
  { key: 'exit', flag: 'exit', label: 'Giá thoát (--exit VND)' },
  { key: 'notes', flag: 'notes', label: 'Bài học 1 dòng (--notes)' },
  { key: 'emotion', flag: 'emotion', label: 'Cảm xúc lúc thoát (--emotion)' },
  { key: 'rule', flag: 'rule', label: 'Tuân rule lúc thoát (--rule Y|N)' },
];

export const OPEN_RECORD_REQUIRED = [
  'trade_id',
  'month',
  'mode',
  'symbol',
  'open_date',
  'direction',
  'entry_vnd',
  'stop_vnd',
  'target_vnd',
  'size_pct',
  'qty',
  'notional_vnd',
  'rr_planned',
  'notes',
];

export const CLOSE_RECORD_REQUIRED = [
  'close_date',
  'exit_vnd',
  'gross_pct',
  'fees_pct',
  'net_pct',
  'rr_achieved',
  'result',
];

const EMOTIONS = new Set(['calm', 'fomo', 'fear', 'revenge']);
const RULES = new Set(['Y', 'N']);
export const EXEC_STYLES = new Set(['aggressive', 'passive', 'probe']);
export const FILL_MODES = new Set(['full', 'partial']);
export const SESSIONS = new Set(['ATO', 'ATC', 'continuous']);
export const EXIT_PLANS = new Set(['single', 'ladder']);

const EXEC_TAG_RES = [
  /\s*\|\s*exec_style:\S+/gi,
  /\s*\|\s*order_limit:\S+/gi,
  /\s*\|\s*fill_assumption:\S+/gi,
  /\s*\|\s*fill_price:\S+/gi,
  /\s*\|\s*session:\S+/gi,
  /\s*\|\s*exit_plan:\S+/gi,
  /\s*\|\s*exit_ladder:[^|]+/gi,
  /\s*\|\s*tactic:\S+/gi,
  /^exec_style:\S+\s*\|\s*/gi,
  /^order_limit:\S+\s*\|\s*/gi,
];

function blank(v) {
  return v === null || v === undefined || String(v).trim() === '';
}

function numOk(v) {
  if (blank(v)) return false;
  const n = Number(String(v).replace(/,/g, ''));
  return Number.isFinite(n) && n > 0;
}

export function normalizeNotes(notes, { emotion, rule, extra } = {}) {
  let s = String(notes || '').trim();
  if (extra) s = s ? `${s} | ${extra}` : extra;
  if (emotion && !/emotion:/i.test(s)) s += ` emotion:${emotion}`;
  if (rule && !/rule_followed:/i.test(s)) s += ` rule_followed:${rule}`;
  return s.trim();
}

export function hasEmotion(notes) {
  return /emotion:(calm|fomo|fear|revenge)/i.test(String(notes || ''));
}

export function hasRuleFollowed(notes) {
  return /rule_followed:(Y|N)/i.test(String(notes || ''));
}

export function appendPortfolioTags(notes, { risk_pct_nav, regime, bucket } = {}) {
  let s = String(notes || '').trim();
  const strip = (key) => {
    s = s.replace(new RegExp(`\\s*\\|\\s*${key}:[^|]+`, 'gi'), '');
    s = s.replace(new RegExp(`^${key}:[^|]+\\s*\\|\\s*`, 'gi'), '');
  };
  strip('risk_pct_nav');
  strip('regime');
  strip('bucket');
  s = s.replace(/\s*\|\s*$/, '').trim();
  const parts = [];
  if (risk_pct_nav != null && risk_pct_nav !== '') parts.push(`risk_pct_nav:${risk_pct_nav}`);
  if (regime) parts.push(`regime:${regime}`);
  if (bucket) parts.push(`bucket:${bucket}`);
  if (!parts.length) return s;
  const tagStr = parts.join(' | ');
  return s ? `${s} | ${tagStr}` : tagStr;
}

export function hasExecStyle(notes) {
  return /exec_style:(aggressive|passive|probe)/i.test(String(notes || ''));
}

export function hasExitPlan(notes) {
  return /exit_plan:(single|ladder)/i.test(String(notes || ''));
}

export function stripExecTags(notes) {
  let s = String(notes || '').trim();
  for (const re of EXEC_TAG_RES) s = s.replace(re, '');
  return s.replace(/\s*\|\s*$/, '').replace(/^\s*\|\s*/, '').trim();
}

export function execTacticCode(exec) {
  const m = { aggressive: 'T1', passive: 'T2', probe: 'T3' };
  return m[String(exec || '').toLowerCase()] || '';
}

/** Gắn tags execution vào notes (Phase 1) */
export function appendExecToNotes(notes, { exec, limit, fill, fillPrice, session, exitPlan, ladder } = {}) {
  const base = stripExecTags(notes);
  const parts = [];
  const style = String(exec || '').toLowerCase();
  if (style) {
    parts.push(`exec_style:${style}`);
    const tac = execTacticCode(style);
    if (tac) parts.push(`tactic:${tac}`);
  }
  if (limit != null && String(limit).trim()) parts.push(`order_limit:${limit}`);
  if (fill) parts.push(`fill_assumption:${fill}`);
  if (fillPrice != null && String(fillPrice).trim()) parts.push(`fill_price:${fillPrice}`);
  if (session) parts.push(`session:${session}`);
  if (exitPlan) parts.push(`exit_plan:${exitPlan}`);
  if (exitPlan === 'ladder' && ladder) parts.push(`exit_ladder:${ladder}`);
  const tagStr = parts.join(' | ');
  return base ? `${base} | ${tagStr}` : tagStr;
}

export function resolveExecOpts(opts, entryFallback) {
  const exec = String(opts.exec || '').toLowerCase();
  const exitPlan = String(opts['exit-plan'] || opts.exit_plan || 'single').toLowerCase();
  const fill = String(opts.fill || 'full').toLowerCase();
  const session = String(opts.session || 'continuous');
  const sessionNorm = SESSIONS.has(session.toUpperCase()) && session.toUpperCase() !== 'CONTINUOUS'
    ? session.toUpperCase()
    : session.toLowerCase() === 'continuous'
      ? 'continuous'
      : session;
  return {
    exec,
    limit: opts.limit ?? entryFallback,
    fill,
    fillPrice: opts['fill-price'] ?? opts.fill_price ?? opts.limit ?? entryFallback,
    session: sessionNorm,
    exitPlan,
    ladder: opts.ladder || '',
  };
}

export function validateExecCli(opts, entryFallback) {
  const missing = [];
  const warnings = [];
  const exec = String(opts.exec || '').toLowerCase();
  if (!EXEC_STYLES.has(exec)) {
    missing.push('Chiến thuật (--exec aggressive|passive|probe) — xem SWING-EXECUTION-PLAYBOOK.md');
  }
  const fill = String(opts.fill || 'full').toLowerCase();
  if (opts.fill && !FILL_MODES.has(fill)) missing.push('--fill phải là full|partial');
  const exitPlan = String(opts['exit-plan'] || opts.exit_plan || 'single').toLowerCase();
  if (!EXIT_PLANS.has(exitPlan)) missing.push('--exit-plan phải là single|ladder');
  if (exitPlan === 'ladder' && blank(opts.ladder)) {
    missing.push('--ladder "50%@23300,50%@23600" khi --exit-plan ladder');
  }
  const session = String(opts.session || 'continuous');
  const sessionOk =
    session.toLowerCase() === 'continuous' || SESSIONS.has(session.toUpperCase());
  if (opts.session && !sessionOk) missing.push('--session phải là ATO|ATC|continuous');
  if (exec === 'passive' && fill === 'full' && !opts.limit && !entryFallback) {
    warnings.push('passive: nên có --limit rõ; OPEN chỉ sau khi khớp');
  }
  if (exec === 'probe' && blank(opts.ladder) && exitPlan === 'ladder') {
    warnings.push('probe thường đi với exit_plan:single leg1');
  }
  return { ok: missing.length === 0, missing, warnings, resolved: resolveExecOpts(opts, entryFallback) };
}

export function validateOpenCli(opts) {
  const missing = [];
  const warnings = [];

  for (const f of OPEN_REQUIRED_CLI) {
    const v = opts[f.flag];
    if (f.key === 'notes') {
      if (blank(v) || String(v).trim().length < 8) missing.push(`${f.label} — tối thiểu 8 ký tự setup`);
      continue;
    }
    if (f.key === 'emotion') {
      if (blank(v) || !EMOTIONS.has(String(v).toLowerCase())) {
        missing.push(`${f.label}`);
      }
      continue;
    }
    if (f.key === 'rule') {
      const r = String(v || '').toUpperCase();
      if (!RULES.has(r)) missing.push(`${f.label}`);
      continue;
    }
    if (blank(v)) missing.push(f.label);
    else if (['entry', 'stop', 'target', 'size'].includes(f.key) && !numOk(v)) {
      missing.push(`${f.label} — phải là số > 0`);
    }
  }

  for (const f of OPEN_RECOMMENDED_CLI) {
    if (blank(opts[f.flag])) warnings.push(f.label);
  }

  if (numOk(opts.entry) && numOk(opts.stop) && numOk(opts.target)) {
    const entry = Number(opts.entry);
    const stop = Number(opts.stop);
    const target = Number(opts.target);
    if (stop >= entry) missing.push('Stop phải < entry (long)');
    if (target <= entry) missing.push('Target phải > entry (long)');
  }

  const execCheck = validateExecCli(opts, opts.entry);
  missing.push(...execCheck.missing);
  warnings.push(...execCheck.warnings);

  return { ok: missing.length === 0, missing, warnings, exec: execCheck.resolved };
}

export function validateCloseCli(opts, trade) {
  const missing = [];
  const warnings = [];

  if (!opts.id && !opts.symbol) {
    missing.push('trade_id (--id) hoặc mã (--symbol) lệnh OPEN');
  }
  if (blank(opts.exit) || !numOk(opts.exit)) {
    missing.push('Giá thoát (--exit VND)');
  }

  const notes = opts.notes || '';
  if (blank(notes) || String(notes).trim().length < 8) {
    missing.push('Bài học (--notes) — tối thiểu 8 ký tự');
  }

  const emotion = opts.emotion || (hasEmotion(trade?.notes) ? 'ok' : '');
  if (blank(opts.emotion) && !hasEmotion(trade?.notes)) {
    missing.push('Cảm xúc (--emotion) — thiếu cả trên OPEN');
  } else if (opts.emotion && !EMOTIONS.has(String(opts.emotion).toLowerCase())) {
    missing.push('--emotion phải là calm|fomo|fear|revenge');
  }

  const rule = opts.rule || (hasRuleFollowed(trade?.notes) ? 'ok' : '');
  if (blank(opts.rule) && !hasRuleFollowed(trade?.notes)) {
    missing.push('Tuân rule (--rule Y|N) — thiếu cả trên OPEN');
  } else if (opts.rule && !RULES.has(String(opts.rule).toUpperCase())) {
    missing.push('--rule phải là Y hoặc N');
  }

  if (trade) {
    const openMissing = validateOpenRecord(trade, { strict: false });
    if (openMissing.missing.length) {
      warnings.push(`OPEN thiếu trường: ${openMissing.missing.join(', ')} — nên patch trước khi phân tích`);
    }
  }

  return { ok: missing.length === 0, missing, warnings };
}

export function validateOpenRecord(row, { strict = true } = {}) {
  const missing = [];
  const warnings = [];

  for (const k of OPEN_RECORD_REQUIRED) {
    if (blank(row[k])) missing.push(k);
  }

  if (!blank(row.entry_vnd) && !numOk(row.entry_vnd)) missing.push('entry_vnd invalid');
  if (!hasEmotion(row.notes)) missing.push('notes.emotion');
  if (!hasRuleFollowed(row.notes)) missing.push('notes.rule_followed');
  if (!hasExecStyle(row.notes)) missing.push('notes.exec_style');
  if (!hasExitPlan(row.notes)) warnings.push('notes.exit_plan');
  if (blank(row.vni_entry)) warnings.push('vni_entry');

  if (strict && numOk(row.rr_planned) && Number(row.rr_planned) < 1.2) {
    warnings.push('rr_planned < 1.2');
  }

  return { ok: missing.length === 0, missing, warnings, status: row.close_date ? 'closed' : 'open' };
}

export function validateClosedRecord(row) {
  const openCheck = validateOpenRecord(row, { strict: false });
  const missing = [...openCheck.missing];

  for (const k of CLOSE_RECORD_REQUIRED) {
    if (blank(row[k])) missing.push(k);
  }

  if (!blank(row.notes) && String(row.notes).trim().length < 8) {
    missing.push('notes.lesson');
  }

  return {
    ok: missing.length === 0,
    missing,
    warnings: openCheck.warnings,
    status: 'closed',
  };
}

export function validateTradeRow(row) {
  if (String(row.close_date || '').trim()) return validateClosedRecord(row);
  return validateOpenRecord(row);
}

export function formatValidationBlock(title, result) {
  const lines = [`## ${title}`, result.ok ? '✅ Đủ trường' : '❌ THIẾU — không ghi / cần bổ sung'];
  if (result.missing?.length) {
    lines.push('', '**Cần bổ sung:**');
    for (const m of result.missing) lines.push(`- ${m}`);
  }
  if (result.warnings?.length) {
    lines.push('', '**Khuyến nghị:**');
    for (const w of result.warnings) lines.push(`- ${w}`);
  }
  if (!result.ok) {
    lines.push('', '_Agent: hỏi user các trường thiếu trước khi ghi Sheet._');
  }
  return lines.join('\n');
}

export function auditAllTrades(rows) {
  const issues = [];
  for (const r of rows) {
    const v = validateTradeRow(r);
    if (!v.ok || v.warnings?.length) {
      issues.push({
        trade_id: r.trade_id,
        symbol: r.symbol,
        status: r.close_date ? 'closed' : 'open',
        missing: v.missing,
        warnings: v.warnings,
      });
    }
  }
  return issues;
}
