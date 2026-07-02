#!/usr/bin/env node
/**
 * Editorial Reels (14) + Carousel (6) — sync brief → Agent 6 local → Agent 3b local.
 * Usage: node scripts/run-editorial-reels-carousel.mjs
 *        node scripts/run-editorial-reels-carousel.mjs --skip-sync
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const REEL_IDS = ['01', '03', '06', '07', '10', '12', '15', '16', '18', '21', '22', '25', '27', '30'];
const CAROUSEL_IDS = ['04', '09', '13', '19', '24', '28'];

function parseArgs() {
  const skipSync = process.argv.includes('--skip-sync');
  const onlyReels = process.argv.includes('--only-reels');
  const onlyCarousel = process.argv.includes('--only-carousel');
  return { skipSync, onlyReels, onlyCarousel };
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status})`);
}

async function countDraftsMissingBrief(ids) {
  const { rows } = rowsToObjects(await fetchTab('content_drafts', 'A:N'));
  let n = 0;
  for (const id of ids) {
    const key = `editorial:page:2026w27:${id}`;
    const row = rows.find((r) => r.source_normalized_key === key);
    if (!row) {
      n += 1;
      continue;
    }
    const meta = parseMeta(row.meta);
    if (!meta.editorial_brief_v1) n += 1;
  }
  return n;
}

async function main() {
  const { skipSync, onlyReels, onlyCarousel } = parseArgs();
  const allIds = [...REEL_IDS, ...CAROUSEL_IDS];

  console.log('=== Editorial Reels + Carousel pipeline ===\n');

  if (!skipSync) {
    const missing = await countDraftsMissingBrief(allIds);
    if (missing > 0) {
      console.log(`1. Sync brief (${missing} slot thiếu brief)...`);
      runNode('scripts/sync-editorial-brief-to-drafts.mjs', ['--from', '01', '--to', '30']);
    } else {
      console.log('1. Brief đã có trên drafts — skip sync');
    }
  }

  if (!onlyCarousel) {
    console.log('\n2. Agent 6 local — seed-editorial-reels (14 slots)...');
    runNode('scripts/seed-editorial-reels.mjs', ['--from', '01', '--to', '30']);
  }

  if (!onlyReels) {
    console.log('\n3. Agent 3b local — carousel (6 slots)...');
    runNode('scripts/run-agent3b-carousel.mjs');
  }

  console.log('\n✓ Reels + Carousel pipeline hoàn tất.');
  console.log('  Reels → video_drafts · Carousel → content_drafts (meta.carousel_slides)');
  console.log('  Next: Canva/manual assets → L3 approve');
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
