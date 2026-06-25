#!/usr/bin/env node
/**
 * Reset một dòng video_drafts để Agent 7 render lại (xóa meta, status=approved).
 * Usage: node scripts/reset-agent7-row.mjs 7
 */
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';

const rowNum = Number(process.argv[2]);
if (!Number.isFinite(rowNum) || rowNum < 2) {
  console.error('Usage: node scripts/reset-agent7-row.mjs <sheet_row>');
  process.exit(1);
}

async function main() {
  const values = await fetchTab('video_drafts', 'A:V');
  const { headers } = rowsToObjects(values);
  const row = values[rowNum - 1];
  if (!row) throw new Error(`Row ${rowNum} not found`);

  await updateCell('video_drafts', rowNum, 'status', 'approved', headers);
  await updateCell('video_drafts', rowNum, 'meta', '', headers);

  console.log(`Row ${rowNum} reset:`);
  console.log('  status → approved');
  console.log('  meta → (cleared)');
  console.log('\nChạy Agent 7 manual trên n8n (expect 3–6 phút).');
  console.log('Kết quả: cột meta (V) phải có render_url *.mp4 + tts_provider=elevenlabs');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
