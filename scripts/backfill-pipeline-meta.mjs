#!/usr/bin/env node
/**
 * Backfill meta.intake_v1 stub cho dòng classified thiếu intake (archive / Agent 2 cũ).
 *
 * Usage:
 *   node scripts/backfill-pipeline-meta.mjs --dry-run
 *   node scripts/backfill-pipeline-meta.mjs --limit 50
 *   node scripts/backfill-pipeline-meta.mjs --limit 500 --min-score 70
 */

import { ensureIntakeV1 } from './lib/pipeline-intake-stub.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';
import { loadPublicConfig, parseMeta, parseArgs, hasFlag } from './lib/magnix-env.mjs';

const cfg = loadPublicConfig();
const TAB = cfg.content_queue_tab || 'content_queue';
const { flags, opts } = parseArgs();
const dryRun = hasFlag(flags, 'dry-run');
const limit = Number(opts.limit || 500);
const minScore = Number(opts['min-score'] || 70);

async function main() {
  const values = await fetchTab(TAB, 'A:O');
  const { headers, rows } = rowsToObjects(values);

  let scanned = 0;
  let needStub = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (updated >= limit) break;

    const status = String(row.status || '').trim().toLowerCase();
    const score = Number(row.score || 0);
    if (status !== 'classified' && row.claude_verdict !== 'qualified') continue;
    if (score < minScore) continue;

    scanned += 1;
    const meta = parseMeta(row.meta);
    if (meta.intake_v1 && typeof meta.intake_v1 === 'object') {
      skipped += 1;
      continue;
    }

    const text = String(row.text || '').trim();
    if (text.length < 20) continue;

    needStub += 1;
    const ensured = ensureIntakeV1(
      { ...row, intake_stub_source: 'backfill_script' },
      meta
    );
    if (!ensured.stubbed) {
      skipped += 1;
      continue;
    }

    const nextMeta = {
      ...ensured.meta,
      intake_v1_from: meta.intake_v1_from || 'stub_backfill',
      pipeline_backfill_at: new Date().toISOString(),
    };
    const metaStr = JSON.stringify(nextMeta).slice(0, 50000);

    if (dryRun) {
      console.log(`[dry-run] row ${row.sheet_row} score=${score} segment=${row.segment} stub=${ensured.stubbed}`);
      updated += 1;
      continue;
    }

    await updateCell(TAB, row.sheet_row, 'meta', metaStr, headers);
    console.log(`OK row ${row.sheet_row}`);
    updated += 1;
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log('\n=== backfill-pipeline-meta ===');
  console.log(`Tab: ${TAB} | min_score: ${minScore} | limit: ${limit} | dry_run: ${dryRun}`);
  console.log(`Classified scanned (score≥${minScore}): ${scanned}`);
  console.log(`Need intake stub: ${needStub}`);
  console.log(`${dryRun ? 'Would update' : 'Updated'}: ${updated}`);
  console.log(`Skipped (already has real intake): ${skipped}`);
  if (needStub > updated && !dryRun) {
    console.log(`\nCòn ~${needStub - updated} dòng — chạy lại với --limit cao hơn.`);
  }
  console.log('\nBước tiếp: chạy Layer B (editorial brief) rồi Agent 6.');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
