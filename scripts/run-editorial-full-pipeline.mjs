#!/usr/bin/env node
/**
 * Full editorial calendar (30 slots) — queue → Layer B → agents by format.
 *
 * Usage:
 *   node scripts/run-editorial-full-pipeline.mjs --skip-push
 *   node scripts/run-editorial-full-pipeline.mjs --dry-run
 *   node scripts/run-editorial-full-pipeline.mjs --only page|reels|carousel
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { parseMeta } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const FORMAT_IDS = {
  fb_page_post_image: ['02', '05', '08', '11', '14', '17', '20', '23', '26', '29'],
  fb_reels: ['01', '03', '06', '07', '10', '12', '15', '16', '18', '21', '22', '25', '27', '30'],
  carousel_image: ['04', '09', '13', '19', '24', '28'],
};

function parseArgs() {
  const args = process.argv.slice(2);
  let only = '';
  let skipPush = false;
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--only') only = args[++i];
    if (args[i] === '--skip-push') skipPush = true;
    if (args[i] === '--dry-run') dryRun = true;
  }
  return { only, skipPush, dryRun };
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status})`);
}

async function countBriefs() {
  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  let n = 0;
  for (const r of rows) {
    const nk = String(r.normalized_key || '');
    if (!nk.startsWith('editorial:queue:2026w27:')) continue;
    if (parseMeta(r.meta).editorial_brief_v1) n += 1;
  }
  return n;
}

async function main() {
  const { only, skipPush, dryRun } = parseArgs();
  const targetBriefs = 30;

  console.log('=== Editorial full pipeline (30 slots) ===\n');

  if (dryRun) {
    console.log('Formats:', FORMAT_IDS);
    console.log('Steps: context-enrichment → seed → Layer B → sync → agents');
    return;
  }

  console.log('0. Context enrichment (archive → context_summaries.json)...');
  try {
    runNode('scripts/run-context-enrichment.mjs');
  } catch (e) {
    console.warn('  ⚠ context enrichment skip:', e.message);
  }

  if (!skipPush) {
    console.log('\n1. Rebuild + push (context_summary baked)...');
    runNode('scripts/rebuild-all-workflows.mjs');
    runNode('scripts/push-n8n-workflows.mjs', ['--activate']);
  }

  console.log('\n2. Seed full editorial queue 01–30...');
  runNode('scripts/seed-editorial-queue-layer-b.mjs', ['--from', '01', '--to', '30']);

  let briefCount = await countBriefs();
  let runs = 0;
  while (briefCount < targetBriefs && runs < 8) {
    runs += 1;
    console.log(`\n3.${runs} Layer B (${briefCount}/${targetBriefs})...`);
    runNode('scripts/run-editorial-layer-b-batch.mjs', [
      '--from', '01', '--to', '30', '--skip-push', '--skip-seed',
    ]);
    briefCount = await countBriefs();
  }

  console.log('\n4. Sync brief → content_drafts...');
  runNode('scripts/sync-editorial-brief-to-drafts.mjs', ['--from', '01', '--to', '30']);

  const runPage = !only || only === 'page';
  const runCarousel = !only || only === 'carousel';
  const runReels = !only || only === 'reels';

  if (runPage) {
    console.log('\n5a. Agent 3 — fb_page_post_image...');
    for (const id of FORMAT_IDS.fb_page_post_image) {
      runNode('scripts/run-agent3-fb-page-post.mjs', ['--editorial', id]);
    }
  }

  if (runCarousel) {
    console.log('\n5b. Carousel — seed queue + trigger Agent 3b trên n8n UI');
    runNode('scripts/seed-editorial-queue-layer-b.mjs', [
      '--format', 'carousel_image', '--from', '01', '--to', '30',
    ]);
    console.log('   → Manual: Execute "Magnix Agent 3b — Carousel Draft" trên n8n');
  }

  if (runReels) {
    console.log('\n5c. Reels — Layer B đã sync; trigger Agent 6 trên n8n UI');
    console.log('   → Manual: Execute "Magnix Agent 6 — Short Video Script"');
    console.log('   Slots:', FORMAT_IDS.fb_reels.join(', '));
  }

  console.log('\n✓ Editorial full pipeline hoàn tất.');
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
