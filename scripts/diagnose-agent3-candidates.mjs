#!/usr/bin/env node
/**
 * Diagnostic Agent 3 — content_queue → lead magnet candidates
 * Usage: node scripts/diagnose-agent3-candidates.mjs
 */
import { loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { printDiagnostic } from './lib/diagnose-print.mjs';

const cfg = loadPublicConfig();
const MIN_SCORE = cfg.draft_min_score ?? 70;
const BATCH = cfg.content_draft_batch_size ?? 5;
const ALLOW_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit', 'general_inbound']);

async function main() {
  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  const reasons = {
    total: rows.length,
    already_draft: 0,
    bad_segment: 0,
    low_score: 0,
    not_classified: 0,
    short_text: 0,
    eligible: 0,
  };
  const statusCounts = {};
  const samples = [];

  for (const row of rows) {
    const status = String(row.status || '').trim().toLowerCase() || '(blank)';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    const meta = parseMeta(row.meta);
    const segment = String(row.segment || '').trim().toLowerCase();
    const score = Number(row.score || 0);
    const text = String(row.text || '').trim();

    if (meta.draft_created === true) {
      reasons.already_draft += 1;
      continue;
    }
    if (!ALLOW_SEGMENTS.has(segment)) {
      reasons.bad_segment += 1;
      continue;
    }
    if (score < MIN_SCORE) {
      reasons.low_score += 1;
      continue;
    }
    if (status !== 'classified' && row.claude_verdict !== 'qualified') {
      reasons.not_classified += 1;
      continue;
    }
    if (text.length < 20) {
      reasons.short_text += 1;
      continue;
    }
    reasons.eligible += 1;
    if (samples.length < 5) {
      samples.push({ row: row.sheet_row, segment, score, status, text_preview: text.slice(0, 80) });
    }
  }

  console.log('=== Agent 3 — Lead Magnet diagnostic ===');
  console.log(`Min score: ${MIN_SCORE} · Batch: ${BATCH} · Cron 09:00 VN`);
  printDiagnostic('Draft candidates', reasons, { 'Top status': statusCounts });
  if (samples.length) {
    console.log('\n--- Sample eligible ---');
    for (const s of samples) console.log(JSON.stringify(s));
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
