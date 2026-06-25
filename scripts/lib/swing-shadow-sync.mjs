/**
 * Core sync PAPER → Trades_SHADOW.
 */
import {
  DEFAULT_FEES_PCT,
  fetchTradesPaper,
  getSheetsToken,
  swingSheetId,
} from './swing-sheet.mjs';
import {
  SHADOW_SCENARIO_IDS,
  buildShadowRowFromPaper,
  calcShadowMetrics,
  parseResearchTags,
  validateShadowRow,
} from './swing-shadow-schema.mjs';
import {
  appendShadowRow,
  fetchTradesShadow,
  indexShadowRows,
  shadowKey,
  shadowObjectToRow,
  syncShadowCsv,
  updateShadowRow,
} from './swing-shadow-sheet.mjs';

export const DEFAULT_SYNC_SCENARIOS = ['spot_1x', 'margin_1.25x_bull'];

export function paperToShadowInput(paper) {
  return {
    trade_id: paper.trade_id,
    month: paper.month,
    symbol: paper.symbol,
    entry_vnd: paper.entry_vnd,
    exit_vnd: paper.exit_vnd,
    stop_vnd: paper.stop_vnd,
    target_vnd: paper.target_vnd,
    size_pct: paper.size_pct,
    notional_vnd: paper.notional_vnd,
    gross_pct: paper.gross_pct,
    fees_pct: paper.fees_pct,
    net_pct: paper.net_pct,
    vni_entry: paper.vni_entry,
    vni_exit: paper.vni_exit || paper.vni_entry,
    close_date: paper.close_date,
    notes: paper.notes,
  };
}

export function scenariosForPaper(paper, overrideList) {
  if (overrideList?.length) return overrideList.filter((s) => SHADOW_SCENARIO_IDS.includes(s));
  const tags = parseResearchTags(paper.notes);
  if (tags.scenario_ids.length) {
    return tags.scenario_ids.filter((s) => SHADOW_SCENARIO_IDS.includes(s));
  }
  return DEFAULT_SYNC_SCENARIOS;
}

function buildContextJson(paper, tags) {
  const riskMatch = String(paper.notes || '').match(/risk_pct_nav:([\d.]+)/i);
  return {
    paper_mode: 'PAPER',
    exec_style: String(paper.notes || '').match(/exec_style:(\w+)/i)?.[1] || '',
    vni_vs_ma50: tags.regime === 'bull' ? 'above' : tags.regime === 'defensive' ? 'below' : '',
    risk_pct_nav: riskMatch ? Number(riskMatch[1]) : '',
  };
}

export function mergeShadowRow(paper, scenarioId, existing) {
  const tags = parseResearchTags(paper.notes);
  const base = existing || buildShadowRowFromPaper(paperToShadowInput(paper), scenarioId, {
    hypothesis_ids: tags.hypothesis_ids || 'H-REG-01',
    regime: tags.regime || 'neutral',
    bucket: tags.bucket || '',
    context_json: buildContextJson(paper, tags),
    vni_entry: paper.vni_entry,
  });

  if (paper.close_date || paper.exit_vnd) {
    const metrics = calcShadowMetrics(paperToShadowInput(paper), scenarioId, {
      vni_entry: paper.vni_entry,
      vni_exit: paper.vni_exit || paper.vni_entry,
      defaultFees: paper.fees_pct || DEFAULT_FEES_PCT,
    });
    Object.assign(base, metrics, {
      exit_vnd: paper.exit_vnd,
      vni_exit: paper.vni_exit || paper.vni_entry || base.vni_exit,
    });
  }

  return base;
}

/**
 * @param {{ tradeId?: string, scenarios?: string[], quiet?: boolean }} opts
 */
export async function syncShadowTrades(opts = {}) {
  const spreadsheetId = swingSheetId();
  if (!spreadsheetId) throw new Error('Thiếu GOOGLE_SHEET_SWING_KPI_ID');
  const token = await getSheetsToken();

  const { rows: paperRows } = await fetchTradesPaper(spreadsheetId, token);
  let papers = paperRows.filter((r) => String(r.mode || 'PAPER').toUpperCase() === 'PAPER');
  if (opts.tradeId) papers = papers.filter((r) => r.trade_id === opts.tradeId);
  if (!papers.length) {
    if (opts.tradeId) throw new Error(`Không tìm paper ${opts.tradeId}`);
    return { created: 0, updated: 0, total: 0, csv: '' };
  }

  const overrideScenarios = opts.scenarios?.length ? opts.scenarios : null;
  const { tab, rows: shadowRows } = await fetchTradesShadow(spreadsheetId, token);
  const index = indexShadowRows(shadowRows);

  let created = 0;
  let updated = 0;
  const log = opts.quiet ? () => {} : console.log.bind(console);
  const warn = opts.quiet ? () => {} : console.warn.bind(console);

  for (const paper of papers) {
    const scenarios = scenariosForPaper(paper, overrideScenarios);
    for (const scenarioId of scenarios) {
      const key = shadowKey(paper.trade_id, scenarioId);
      const existing = index.get(key);
      const row = mergeShadowRow(paper, scenarioId, existing);

      const check = validateShadowRow(row, { strict: !!(paper.close_date || paper.exit_vnd) });
      if (!check.ok) warn(`⚠ ${key} thiếu: ${check.missing.join(', ')}`);

      if (existing) {
        await updateShadowRow(spreadsheetId, token, tab, existing._sheet_row, shadowObjectToRow(row));
        index.set(key, { ...row, _sheet_row: existing._sheet_row });
        updated++;
        log(`↻ shadow ${row.shadow_id} · ${row.status}`);
      } else {
        await appendShadowRow(spreadsheetId, token, tab, shadowObjectToRow(row));
        created++;
        log(`+ shadow ${row.shadow_id} · lev=${row.leverage}`);
      }
    }
  }

  const { rows: all } = await fetchTradesShadow(spreadsheetId, token);
  const csv = syncShadowCsv(all);
  return { created, updated, total: all.length, csv, tab };
}
