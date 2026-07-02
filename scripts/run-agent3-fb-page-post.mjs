#!/usr/bin/env node
/**
 * Agent 3 local — Facebook Page post từ editorial row (DeepSeek + fb-page-post prompt).
 * Usage: node scripts/run-agent3-fb-page-post.mjs --editorial 05
 *        node scripts/run-agent3-fb-page-post.mjs --editorial 05 --dry-run
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, loadPublicConfig, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';
import { extractSystemPrompt, loadPromptMd, extractSection } from '../n8n-workflows/code/shared/extract-prompt.mjs';
import {
  buildInjectedDisclaimer,
  resolveContentType,
  resolveDisclaimerVariant,
} from '../n8n-workflows/code/shared/disclaimer-selector.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DISCLAIMER_CFG = JSON.parse(
  fs.readFileSync(path.join(root, 'n8n-workflows/disclaimers.json'), 'utf8'),
);

const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /đảm bảo.*(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
];

function parseArgs() {
  const args = process.argv.slice(2);
  let editorial = '05';
  let dryRun = false;
  let status = 'draft';
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--editorial') editorial = args[++i];
    if (args[i] === '--status') status = args[++i];
  }
  return {
    editorial: String(editorial).padStart(2, '0'),
    dryRun,
    status,
    key: `editorial:page:2026w27:${String(editorial).padStart(2, '0')}`,
  };
}

function loadLegalPack(segment) {
  const bundlePath = path.join(root, 'n8n-workflows/legal-pack-bundle.json');
  if (!fs.existsSync(bundlePath)) return null;
  const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  const bySeg = bundle.packs_by_segment || {};
  return bySeg[segment] || bundle.packs_by_topic?.noxh_eligibility || null;
}

function extractJson(text) {
  const s = String(text || '');
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

function l0Check(text) {
  const hits = FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);
  return { pass: hits.length === 0, hits };
}

async function callDeepSeek(env, system, userPayload) {
  const key = env.DEEPSEEK_API_KEY;
  if (!key || key.length < 12) throw new Error('Thiếu DEEPSEEK_API_KEY trong n8n-workflows/.env');
  const res = await fetch(env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.4,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: JSON.stringify(userPayload) },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || res.statusText);
  return data.choices?.[0]?.message?.content;
}

async function main() {
  const { editorial, dryRun, status, key } = parseArgs();
  const env = loadEnv();
  const cfg = loadPublicConfig();
  const tab = cfg.content_drafts_tab || 'content_drafts';

  const { headers, rows } = rowsToObjects(await fetchTab(tab, 'A:N'));
  const row = rows.find((r) => r.source_normalized_key === key);
  if (!row) throw new Error(`Không tìm thấy ${key} trên ${tab}`);

  const meta = parseMeta(row.meta);
  const brief = meta.editorial_brief_v1;
  const legalPack = meta.legal_retrieval_pack || loadLegalPack(String(row.segment || 'noxh_income'));

  const { body } = loadPromptMd('ai-agents-prompts/n8n__fb-page-post-draft.md');
  const systemBase = extractSystemPrompt('ai-agents-prompts/n8n__fb-page-post-draft.md');
  const outputSchema = extractSection(body, 'Output schema (JSON)');
  const system = `${systemBase}

**topic_lock** trong user message là chủ đề bắt buộc — nếu lệch editorial_brief_v1 thì ưu tiên topic_lock.
Không echo lại input. Chỉ trả JSON output theo schema:

${outputSchema || '{ "title", "hook_line", "artifact_markdown", "cta_opt_in", "disclaimer", "hashtags", "publish_image_prompt", "source_refs", "meta_patch" }'}

Trả về **JSON hợp lệ** (không markdown bọc ngoài).`;
  const userPayload = {
    segment: row.segment || 'noxh_income',
    content_pillar: meta.content_pillar || 'B',
    cta_keyword: meta.cta_keyword || 'MAU01',
    drive_pack_url: meta.drive_pack_url || meta.publish_link || '',
    editorial_brief_v1: brief,
    legal_retrieval_pack: legalPack,
    topic_lock: `Bài editorial #${editorial}: "${row.title}" — kho mẫu NOXH trên Drive, CTA ${meta.cta_keyword || 'MAU01'}. Không viết về ngưỡng thu nhập nếu không khớp chủ đề.`,
    product_type: 'fb_page_post',
    target_channel: 'facebook_page',
    pin_after_publish: meta.pin_after_publish === true,
  };

  console.log(`Agent 3 fb_page_post → ${key} (row ${row.sheet_row})`);
  if (brief?.editorial_title && !String(row.title).includes(String(brief.editorial_title).slice(0, 15))) {
    console.warn('  ⚠ Layer B brief có thể lệch chủ đề — dùng topic_lock trong prompt');
  }

  if (dryRun) {
    console.log('dry-run userPayload keys:', Object.keys(userPayload));
    return;
  }

  const raw = await callDeepSeek(env, system, userPayload);
  const parsed = extractJson(raw);
  const required = ['title', 'hook_line', 'artifact_markdown', 'cta_opt_in'];
  for (const k of required) {
    if (!parsed[k] || !String(parsed[k]).trim()) throw new Error(`LLM thiếu field: ${k}`);
  }

  const pageDisplay =
    String(env.MAGNIX_PAGE_DISPLAY_NAME || '').trim()
    || String(DISCLAIMER_CFG.default_page_display_name || '').trim()
    || 'Tim Nha O Xa Hoi';
  const contentType = resolveContentType(
    { segment: row.segment, content_type: parsed.content_type },
    DISCLAIMER_CFG,
  ).content_type;
  const variant = resolveDisclaimerVariant(
    {
      format_type: 'text_post',
      product_type: 'fb_page_post',
      content_format: meta.content_format || 'fb_page_post_image',
      channel: 'facebook_page',
    },
    DISCLAIMER_CFG,
  );
  const injected = buildInjectedDisclaimer({
    cfg: DISCLAIMER_CFG,
    content_type: contentType,
    variant,
    pageDisplayName: pageDisplay,
  });
  parsed.disclaimer = injected.disclaimer;

  const probe = [parsed.hook_line, parsed.artifact_markdown, parsed.cta_opt_in, parsed.disclaimer].join('\n');
  const l0 = l0Check(probe);
  if (!l0.pass) throw new Error(`L0 fail: ${l0.hits.join(', ')}`);

  const mergedMeta = {
    ...meta,
    product_type: 'fb_page_post',
    target_channel: 'facebook_page',
    content_format: meta.content_format || 'fb_page_post_image',
    agent3_fb_page_at: new Date().toISOString(),
    agent3_provider: 'deepseek',
    publish_image_prompt: String(parsed.publish_image_prompt || meta.publish_image_prompt || '').slice(0, 500),
    publish_image_pending: !meta.publish_image_url,
    needs_editorial_brief: false,
  };
  if (legalPack && !mergedMeta.legal_retrieval_pack) mergedMeta.legal_retrieval_pack = legalPack;
  if (Array.isArray(parsed.hashtags)) mergedMeta.hashtags = parsed.hashtags;
  if (parsed.meta_patch && typeof parsed.meta_patch === 'object') {
    Object.assign(mergedMeta, parsed.meta_patch);
  }

  const fields = [
    ['title', String(parsed.title).slice(0, 500)],
    ['hook_line', String(parsed.hook_line).slice(0, 500)],
    ['artifact_markdown', String(parsed.artifact_markdown).slice(0, 45000)],
    ['cta_opt_in', String(parsed.cta_opt_in).slice(0, 1000)],
    ['disclaimer', String(parsed.disclaimer).slice(0, 2000)],
    ['status', status],
    ['meta', JSON.stringify(mergedMeta).slice(0, 50000)],
  ];

  for (const [col, val] of fields) {
    await updateCell(tab, row.sheet_row, col, val, headers);
    console.log(`  ✓ ${col}`);
  }

  console.log('\nL0: PASS');
  console.log('Next: Canva cover → node scripts/upload-manual-asset-to-drive.mjs --editorial', editorial, '--type cover --file ...');
  console.log('      node scripts/export-canva-brief.mjs --editorial', editorial);
  if (status !== 'approved') console.log('      Sau Canva: --status approved rồi chờ cron hoặc trigger Page Publish');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
