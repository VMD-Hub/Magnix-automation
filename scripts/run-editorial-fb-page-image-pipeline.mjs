#!/usr/bin/env node
/**
 * Re-seed editorial fb_page_post_image → Layer B → Agent 3 (không placeholder hook).
 *
 * Usage:
 *   node scripts/run-editorial-fb-page-image-pipeline.mjs
 *   node scripts/run-editorial-fb-page-image-pipeline.mjs --from 02 --to 29 --skip-push
 *   node scripts/run-editorial-fb-page-image-pipeline.mjs --dry-run
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const FB_PAGE_IMAGE_IDS = ['02', '05', '08', '11', '14', '17', '20', '23', '26', '29'];

function parseArgs() {
  const args = process.argv.slice(2);
  let from = '01';
  let to = '30';
  let skipPush = false;
  let skipAgent3 = false;
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--from') from = args[++i];
    if (args[i] === '--to') to = args[++i];
    if (args[i] === '--skip-push') skipPush = true;
    if (args[i] === '--skip-agent3') skipAgent3 = true;
    if (args[i] === '--dry-run') dryRun = true;
  }
  return { from, to, skipPush, skipAgent3, dryRun };
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(root, script), ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error(`${script} failed (exit ${r.status})`);
}

function idsInRange(from, to) {
  return FB_PAGE_IMAGE_IDS.filter((id) => id >= from && id <= to);
}

async function countBriefs(ids) {
  const { rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  let n = 0;
  for (const r of rows) {
    const nk = String(r.normalized_key || '');
    const id = nk.split(':').pop();
    if (!ids.includes(id)) continue;
    const meta = parseMeta(r.meta);
    if (meta.editorial_brief_v1) n += 1;
  }
  return n;
}

async function main() {
  const { from, to, skipPush, skipAgent3, dryRun } = parseArgs();
  const ids = idsInRange(from, to);
  if (!ids.length) {
    throw new Error(`Không có slot fb_page_post_image trong ${from}–${to}`);
  }

  console.log(`=== FB Page Post Image pipeline (${ids.join(', ')}) ===\n`);

  if (dryRun) {
    console.log('dry-run — sẽ chạy:');
    console.log('  1. rebuild-all + push (unless --skip-push)');
    console.log('  2. seed queue --format fb_page_post_image');
    console.log('  3. Layer B (loop until briefs ready)');
    console.log('  4. sync brief → content_drafts');
    console.log('  5. Agent 3 local cho từng slot');
    return;
  }

  if (!skipPush) {
    console.log('1. Rebuild workflows...');
    runNode('scripts/rebuild-all-workflows.mjs');
    console.log('\n2. Push lên VPS...');
    runNode('scripts/push-n8n-workflows.mjs', ['--activate']);
  } else {
    console.log('1–2. Skip push (--skip-push)');
  }

  console.log('\n3. Seed content_queue (fb_page_post_image only)...');
  runNode('scripts/seed-editorial-queue-layer-b.mjs', [
    '--format', 'fb_page_post_image', '--from', from, '--to', to,
  ]);

  const targetBriefs = ids.length;
  let briefCount = await countBriefs(ids);
  let layerRuns = 0;
  const maxLayerRuns = Math.ceil(targetBriefs / 5) + 3;

  while (briefCount < targetBriefs && layerRuns < maxLayerRuns) {
    layerRuns += 1;
    console.log(`\n4.${layerRuns} Layer B (${briefCount}/${targetBriefs} briefs)...`);
    runNode('scripts/run-editorial-layer-b-batch.mjs', [
      '--from', from, '--to', to, '--skip-push', '--skip-seed',
    ]);
    briefCount = await countBriefs(ids);
  }

  if (briefCount < targetBriefs) {
    throw new Error(`Chỉ có ${briefCount}/${targetBriefs} brief — kiểm tra Layer B trên n8n`);
  }

  console.log('\n5. Sync brief → content_drafts...');
  runNode('scripts/sync-editorial-brief-to-drafts.mjs', ['--from', from, '--to', to]);

  if (skipAgent3) {
    console.log('\n✓ Skip Agent 3 (--skip-agent3)');
    return;
  }

  console.log('\n6. Agent 3 (local) — thay placeholder hook...');
  for (const id of ids) {
    console.log(`\n--- editorial #${id} ---`);
    runNode('scripts/run-agent3-fb-page-post.mjs', ['--editorial', id]);
  }

  console.log(`\n✓ Pipeline hoàn tất — ${ids.length} slot fb_page_post_image.`);
  console.log('  Next: Canva cover → upload-manual-asset → export-canva-brief → L3 approve');
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
