#!/usr/bin/env node
/**
 * Gắn meta.manual_assets cho 30 row editorial:page:2026w27:*
 * Usage: node scripts/patch-editorial-manual-asset-plan.mjs
 */
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';
import { loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = 'editorial:page:2026w27:';

const DRIVE = {
  page_covers: '1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ',
  noxh_templates: '1MqPOPCwNp9ga1i2O0yqd7F8GP9_TJYKr',
  video_ready: '1Po-s54cgin2IgvJ8RYUyOxPidXQC3V_8',
};

function assetPlan(format) {
  if (format === 'fb_page_post_image') {
    return {
      mode: 'manual_canva',
      status: 'pending_cover',
      items: [
        {
          type: 'canva_cover_png',
          required: true,
          drive_folder_id: DRIVE.page_covers,
          sheet_field: 'meta.publish_image_url',
          doc: 'docs/CANVA_MAGNIX_PAGE_COVER.md',
        },
      ],
    };
  }
  if (format === 'fb_reels') {
    return {
      mode: 'manual_hybrid_video',
      status: 'pending_video',
      items: [
        { type: 'canva_slides_png', required: true, note: '5-7 slide mockup UI' },
        { type: 'presenter_footage', required: true, note: '9:16 teleprompter' },
        { type: 'final_mp4', required: true, drive_folder_id: DRIVE.video_ready, sheet_field: 'video_drafts.meta.render_url' },
      ],
    };
  }
  if (format === 'carousel_image') {
    return {
      mode: 'manual_canva_carousel',
      status: 'pending_carousel',
      items: [
        { type: 'canva_slides', required: true, count: '6-10', note: 'Upload PNG set hoặc PDF' },
      ],
    };
  }
  return { mode: 'unknown', status: 'pending' };
}

async function main() {
  const cfg = loadPublicConfig();
  const tab = cfg.content_drafts_tab || 'content_drafts';
  const foldersPath = path.join(root, 'n8n-workflows/magnix-drive-folders.json');
  if (fs.existsSync(foldersPath)) {
    try {
      const j = JSON.parse(fs.readFileSync(foldersPath, 'utf8'));
      if (j.page_covers?.folder_id) DRIVE.page_covers = j.page_covers.folder_id;
      if (j.noxh_templates?.folder_id) DRIVE.noxh_templates = j.noxh_templates.folder_id;
      if (j.folders?.ready_for_review?.id) DRIVE.video_ready = j.folders.ready_for_review.id;
    } catch {
      /* ignore */
    }
  }

  const { headers, rows } = rowsToObjects(await fetchTab(tab, 'A:N'));
  const editorial = rows.filter((r) => String(r.source_normalized_key || '').startsWith(PREFIX));
  if (!editorial.length) {
    console.log('Không có row editorial.');
    return;
  }

  let n = 0;
  for (const row of editorial) {
    const meta = parseMeta(row.meta);
    const fmt = meta.content_format || '';
    const plan = assetPlan(fmt);
    const hasCover = Boolean(meta.publish_image_url || meta.cover_image_url);
    const hasVideo = Boolean(meta.render_url || meta.manual_video_url);
    if (fmt === 'fb_page_post_image' && hasCover) plan.status = 'cover_ready';
    if (fmt === 'fb_reels' && hasVideo) plan.status = 'video_ready';
    plan.updated_at = new Date().toISOString();
    const next = { ...meta, manual_assets: plan, publish_image_pending: fmt === 'fb_page_post_image' && !hasCover };
    await updateCell(tab, row.sheet_row, 'meta', JSON.stringify(next), headers);
    n += 1;
    console.log(`  row ${row.sheet_row} ${row.source_normalized_key} → ${plan.status}`);
  }
  console.log(`\n✓ Patched ${n} rows`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
