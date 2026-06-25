#!/usr/bin/env node
/**
 * Diagnostic Agent 2 — content_queue pending classify
 * Usage: node scripts/diagnose-agent2-candidates.mjs
 */
import { loadEnv, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { printDiagnostic } from './lib/diagnose-print.mjs';

const BATCH = 200;

function isPending(row) {
  const segment = String(row.segment || '').toLowerCase();
  const status = String(row.status || '').toLowerCase();
  const meta = parseMeta(row.meta);
  if (meta.classify_method === 'llm') return { ok: false, reason: 'already_llm' };
  if (status === 'classified' && segment && segment !== 'unclassified') {
    return { ok: false, reason: 'already_classified' };
  }
  if (!String(row.text || '').trim()) return { ok: false, reason: 'empty_text' };
  if (!segment || segment === 'unclassified') return { ok: true };
  if (status === 'review') return { ok: true };
  if (meta.needs_llm === true) return { ok: true };
  return { ok: false, reason: 'not_pending' };
}

async function main() {
  const env = loadEnv();
  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  const reasons = {
    total: rows.length,
    already_llm: 0,
    already_classified: 0,
    empty_text: 0,
    not_pending: 0,
    eligible: 0,
  };
  const statusCounts = {};
  const segmentCounts = {};
  const samples = [];

  for (const row of rows) {
    const status = String(row.status || '').trim().toLowerCase() || '(blank)';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    const seg = String(row.segment || '').trim().toLowerCase() || '(blank)';
    segmentCounts[seg] = (segmentCounts[seg] || 0) + 1;

    const check = isPending(row);
    if (!check.ok) {
      reasons[check.reason] = (reasons[check.reason] || 0) + 1;
      continue;
    }
    reasons.eligible += 1;
    if (samples.length < 5) {
      samples.push({
        row: row.sheet_row,
        segment: row.segment,
        status: row.status,
        text_preview: String(row.text || '').slice(0, 80),
      });
    }
  }

  console.log('=== Agent 2 — Content Classify diagnostic ===');
  console.log(`Batch cron: max ${BATCH}/lần · 08:00 VN`);
  printDiagnostic('Pending classify', reasons, {
    'Top status': statusCounts,
    'Top segment': segmentCounts,
  });
  console.log('\n--- Env VPS ---');
  console.log(`  DEEPSEEK_API_KEY: ${env.DEEPSEEK_API_KEY ? '(set)' : 'MISSING'}`);
  console.log(`  ANTHROPIC_API_KEY: ${env.ANTHROPIC_API_KEY ? '(set)' : 'MISSING'}`);
  if (samples.length) {
    console.log('\n--- Sample eligible ---');
    for (const s of samples) console.log(JSON.stringify(s));
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
