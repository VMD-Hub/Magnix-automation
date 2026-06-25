#!/usr/bin/env node
/**
 * Diagnostic Agent 5 — content_metrics pending scorecard
 * Usage: node scripts/diagnose-agent5-candidates.mjs
 */
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { printDiagnostic } from './lib/diagnose-print.mjs';

const SKIP_STATUSES = new Set(['done', 'analyzed', 'skip']);

function isPending(row) {
  const status = String(row.scorecard_status || row.status || '').trim().toLowerCase();
  if (SKIP_STATUSES.has(status)) return { ok: false, reason: 'already_done' };
  const analyzed = String(row.analyzed_at || '').trim();
  if (analyzed && analyzed !== 'null' && analyzed !== 'undefined') {
    return { ok: false, reason: 'has_analyzed_at' };
  }
  const postId = String(row.post_id || '').trim();
  const platform = String(row.platform || '').trim();
  if (!postId || !platform) return { ok: false, reason: 'missing_post_or_platform' };
  return { ok: true };
}

async function main() {
  const env = loadEnv();
  const { rows } = rowsToObjects(await fetchTab('content_metrics', 'A:AG'));
  const reasons = {
    total: rows.length,
    already_done: 0,
    has_analyzed_at: 0,
    missing_post_or_platform: 0,
    eligible: 0,
  };
  const statusCounts = {};
  const samples = [];

  for (const row of rows) {
    const sc = String(row.scorecard_status || row.status || '').trim().toLowerCase() || '(blank)';
    statusCounts[sc] = (statusCounts[sc] || 0) + 1;
    const check = isPending(row);
    if (!check.ok) {
      reasons[check.reason] = (reasons[check.reason] || 0) + 1;
      continue;
    }
    reasons.eligible += 1;
    if (samples.length < 5) {
      samples.push({
        row: row.sheet_row,
        post_id: row.post_id,
        platform: row.platform,
        scorecard_status: row.scorecard_status,
      });
    }
  }

  console.log('=== Agent 5 — Content Scorecard diagnostic ===');
  console.log('Cron 10:00 VN · đọc content_metrics → verdict + IVI');
  printDiagnostic('Pending scorecard', reasons, { 'Top scorecard_status': statusCounts });
  console.log('\n--- Env VPS (Google Sheet/Drive) ---');
  console.log(`  GOOGLE_SHEET_CONTENT_METRICS_ID: ${env.GOOGLE_SHEET_CONTENT_METRICS_ID ? '(set)' : '(missing)'}`);
  if (samples.length) {
    console.log('\n--- Sample eligible ---');
    for (const s of samples) console.log(JSON.stringify(s));
  } else {
    console.log('\nThêm dòng metrics sau khi đăng video → Agent 5 chạy hàng ngày.');
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
