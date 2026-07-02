#!/usr/bin/env node
/**
 * Gắn outreach warmth lên content_drafts.meta trước Agent 4.
 *
 * Usage:
 *   node scripts/patch-draft-outreach-warmth.mjs --row 12 --warmth commented
 *   node scripts/patch-draft-outreach-warmth.mjs --key editorial:page:2026w27:05 --warmth partner
 *   node scripts/patch-draft-outreach-warmth.mjs --row 12 --warmth cold --dry-run
 */
import { parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';

const VALID_WARMTH = new Set([
  'cold',
  'commented',
  'sau_comment',
  'dm_inbound',
  'dm',
  'ads_optin',
  'partner',
  'follow_up',
]);

function parseArgs() {
  const args = process.argv.slice(2);
  let row = null;
  let key = null;
  let warmth = 'cold';
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--row') row = Number(args[++i]);
    if (args[i] === '--key') key = args[++i];
    if (args[i] === '--warmth') warmth = String(args[++i] || 'cold').trim().toLowerCase();
    if (args[i] === '--dry-run') dryRun = true;
  }
  if (!row && !key) {
    console.error('Cần --row N hoặc --key source_normalized_key');
    process.exit(1);
  }
  if (!VALID_WARMTH.has(warmth)) {
    console.error(`warmth không hợp lệ: ${warmth}. Hợp lệ: ${[...VALID_WARMTH].join(', ')}`);
    process.exit(1);
  }
  return { row, key, warmth, dryRun };
}

async function main() {
  const { row, key, warmth, dryRun } = parseArgs();
  const { rows, headers } = rowsToObjects(await fetchTab('content_drafts', 'A:N'));
  if (!headers.includes('meta')) throw new Error('Không tìm thấy cột meta');

  let target = null;
  if (row) target = rows.find((r) => r.sheet_row === row);
  if (key) target = rows.find((r) => String(r.source_normalized_key || '') === key);

  if (!target) {
    console.error('Không tìm thấy draft');
    process.exit(1);
  }

  const meta = parseMeta(target.meta);
  meta.outreach_warmth = warmth;
  delete meta.outreach_created;
  delete meta.outreach_status;
  delete meta.outreach_at;

  const metaJson = JSON.stringify(meta);

  console.log(`Draft row ${target.sheet_row}: warmth=${warmth}`);
  console.log(`meta → ${metaJson.slice(0, 200)}${metaJson.length > 200 ? '…' : ''}`);

  if (dryRun) {
    console.log('[dry-run] Không ghi Sheet');
    return;
  }

  await updateCell('content_drafts', target.sheet_row, 'meta', metaJson, headers);
  console.log('✓ Đã patch meta — chạy Agent 4 hoặc đợi cron 09:30');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
