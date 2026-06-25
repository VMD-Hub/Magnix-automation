#!/usr/bin/env node
/**
 * Đối soát pipeline content_queue: classified → intake → brief → video_draft.
 * Usage: node scripts/reconcile-pipeline-readiness.mjs
 */

import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';

const MIN_SCORE = 70;
const ALLOW_SEGMENTS = new Set(['noxh_income', 'valuation', 'sme_credit', 'general_inbound']);

function intakeKind(meta) {
  if (!meta?.intake_v1 || typeof meta.intake_v1 !== 'object') return 'missing';
  if (meta.intake_v1._stub) return 'stub';
  return 'real';
}

async function main() {
  const cfg = loadPublicConfig();
  const TAB = cfg.content_queue_tab || 'content_queue';
  const values = await fetchTab(TAB, 'A:O');
  const { rows } = rowsToObjects(values);

  const stats = {
    total: rows.length,
    classified: 0,
    classified_score70: 0,
    intake_missing: 0,
    intake_stub: 0,
    intake_real: 0,
    brief_missing: 0,
    brief_ok: 0,
    video_draft_marked: 0,
    layer_b_ready: 0,
    agent6_ready: 0,
  };

  const gaps = [];

  for (const row of rows) {
    const status = String(row.status || '').trim().toLowerCase();
    const score = Number(row.score || 0);
    const segment = String(row.segment || '').trim().toLowerCase();
    const meta = parseMeta(row.meta);
    const intake = intakeKind(meta);
    const hasBrief = Boolean(meta.editorial_brief_v1);
    const classified =
      status === 'classified' || String(row.claude_verdict || '').trim().toLowerCase() === 'qualified';

    if (classified) stats.classified += 1;
    if (classified && score >= MIN_SCORE) stats.classified_score70 += 1;

    if (intake === 'missing') stats.intake_missing += 1;
    else if (intake === 'stub') stats.intake_stub += 1;
    else stats.intake_real += 1;

    if (hasBrief) stats.brief_ok += 1;
    else stats.brief_missing += 1;

    if (meta.video_draft_created === true) stats.video_draft_marked += 1;

    const segmentOk = ALLOW_SEGMENTS.has(segment);
    const textOk = String(row.text || '').trim().length >= 20;

    if (classified && score >= MIN_SCORE && segmentOk && textOk && !hasBrief) {
      stats.layer_b_ready += 1;
    }

    if (
      classified &&
      score >= MIN_SCORE &&
      segmentOk &&
      textOk &&
      hasBrief &&
      meta.video_draft_created !== true
    ) {
      stats.agent6_ready += 1;
    }

    if (classified && score >= MIN_SCORE && segmentOk && (!hasBrief || intake === 'missing')) {
      if (gaps.length < 8) {
        gaps.push({
          row: row.sheet_row,
          score,
          segment,
          intake,
          has_brief: hasBrief,
          status,
        });
      }
    }
  }

  console.log('=== Pipeline readiness (content_queue) ===\n');
  console.log(`Total rows: ${stats.total}`);
  console.log(`Classified: ${stats.classified}`);
  console.log(`Classified + score≥${MIN_SCORE}: ${stats.classified_score70}`);
  console.log('\n--- meta.intake_v1 ---');
  console.log(`  missing: ${stats.intake_missing}`);
  console.log(`  stub:    ${stats.intake_stub}`);
  console.log(`  real:    ${stats.intake_real}`);
  console.log('\n--- meta.editorial_brief_v1 ---');
  console.log(`  missing: ${stats.brief_missing}`);
  console.log(`  ok:      ${stats.brief_ok}`);
  console.log(`  video_draft_created: ${stats.video_draft_marked}`);
  console.log('\n--- Workflow gates ---');
  console.log(`  Layer B candidates (classified score≥70, chưa brief): ${stats.layer_b_ready}`);
  console.log(`  Agent 6 candidates (có brief, chưa video_draft): ${stats.agent6_ready}`);

  if (stats.layer_b_ready > 0 && stats.brief_ok === 0) {
    console.log('\n⚠ Nguyên nhân Agent 6 không tạo dòng: thiếu editorial_brief_v1 — chạy Layer B trước.');
  } else if (stats.agent6_ready === 0 && stats.brief_ok > 0) {
    console.log('\n⚠ Có brief nhưng Agent 6 = 0 — kiểm tra L0/LLM/credential append video_drafts.');
  } else if (stats.agent6_ready > 0) {
    console.log(`\n✓ ${stats.agent6_ready} dòng sẵn sàng cho Agent 6 (batch max 3/lần).`);
  }

  if (stats.intake_missing > 0 && stats.classified_score70 > 0) {
    console.log(`\n→ Backfill intake stub: node scripts/backfill-pipeline-meta.mjs --limit 500`);
  }

  if (gaps.length) {
    console.log('\n--- Sample gaps (classified score≥70) ---');
    for (const g of gaps) console.log(JSON.stringify(g));
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
