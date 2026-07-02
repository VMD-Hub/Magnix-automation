#!/usr/bin/env node
/**
 * Xuất brief Canva cho 1 bài editorial (đọc từ content_drafts).
 * Usage: node scripts/export-canva-brief.mjs --editorial 05
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs() {
  const i = process.argv.indexOf('--editorial');
  const editorial = i >= 0 ? process.argv[i + 1] : '05';
  return {
    editorial: String(editorial).padStart(2, '0'),
    key: `editorial:page:2026w27:${String(editorial).padStart(2, '0')}`,
  };
}

function headlineFromRow(row, meta) {
  const title = String(row.title || '').trim();
  if (title.length <= 60) return title.replace(/\s*[—–-]\s*.*$/, '').trim() || title;
  return title.slice(0, 57) + '…';
}

async function main() {
  const { editorial, key } = parseArgs();
  const cfg = loadPublicConfig();
  const tab = cfg.content_drafts_tab || 'content_drafts';
  const { rows } = rowsToObjects(await fetchTab(tab, 'A:N'));
  const row = rows.find((r) => r.source_normalized_key === key);
  if (!row) throw new Error(`Row not found: ${key}`);

  const meta = parseMeta(row.meta);
  const headline = headlineFromRow(row, meta);
  const sub = 'Folder Drive · checklist Mẫu 01 · tham khảo trước khi nộp';
  const canvaName = `Magnix Cover — 2026w27-${editorial} ${headline.slice(0, 24)}`;

  const outDir = path.join(root, 'docs', 'generated');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `canva-brief-2026w27-${editorial}.md`);

  const body = `# Canva brief — editorial #${editorial}

> Sheet row **${row.sheet_row}** · \`${key}\` · status **${row.status}**

## Template

- Duplicate: **Magnix Page Cover — MASTER**
- Kích thước: **1080 × 1080 px**
- File Canva: \`${canvaName}\`

## Text trên ảnh

| Lớp | Nội dung |
|-----|----------|
| **HEADLINE** | ${headline} |
| **SUB** (tuỳ chọn) | ${sub} |
| Logo | Magnix — góc dưới phải, nhỏ |

## Màu & icon

- Nền: \`#E8F4F4\` hoặc trắng · accent \`#0D7377\`
- Icon: folder + checklist (không logo CP)

## Cấm trên ảnh

- Lãi suất %, "cam kết duyệt", số liệu pháp lý cụ thể

## Sau export

\`\`\`powershell
node scripts/upload-manual-asset-to-drive.mjs --editorial ${editorial} --type cover --file "C:\\path\\cover.png"
\`\`\`

Folder Drive: [Magnix_Page_Covers](https://drive.google.com/drive/folders/1EVNn-4ASRhZwSnnapBkMzbHjdIjCNhBJ)

## Publish

- \`scheduled_at\`: ${meta.scheduled_at || '—'}
- \`pin_after_publish\`: ${meta.pin_after_publish ? 'yes' : 'no'}
- Cần \`meta.publish_image_url\` + \`status=approved\` trước cron Page Publish

## Hook (tham khảo — không copy hết lên ảnh)

${row.hook_line || '—'}
`;

  fs.writeFileSync(outPath, body, 'utf8');
  console.log('Written', outPath);
  console.log('\nHEADLINE:', headline);
  console.log('Canva name:', canvaName);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
