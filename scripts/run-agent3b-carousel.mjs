#!/usr/bin/env node
/**
 * Agent 3b local — Carousel từ editorial brief → content_drafts.
 * Usage: node scripts/run-agent3b-carousel.mjs --editorial 04
 *        node scripts/run-agent3b-carousel.mjs --from 04 --to 28
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
const CONTEXT_STORE = JSON.parse(
  fs.readFileSync(path.join(root, 'n8n-workflows/context_summaries.json'), 'utf8'),
);
const CAROUSEL_CFG = JSON.parse(
  fs.readFileSync(path.join(root, 'n8n-workflows/carousel_templates.json'), 'utf8'),
);

const CAROUSEL_IDS = ['04', '09', '13', '19', '24', '28'];

const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /100%\s*(thành công|duyệt)/i,
];

function parseArgs() {
  const args = process.argv.slice(2);
  let editorial = null;
  let from = '04';
  let to = '28';
  let dryRun = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--dry-run') dryRun = true;
    if (args[i] === '--editorial') editorial = String(args[++i]).padStart(2, '0');
    if (args[i] === '--from') from = args[++i];
    if (args[i] === '--to') to = args[++i];
  }
  let ids = editorial ? [editorial] : CAROUSEL_IDS.filter((id) => id >= from && id <= to);
  return { ids, dryRun };
}

function loadLegalPack(segment) {
  const bundlePath = path.join(root, 'n8n-workflows/legal-pack-bundle.json');
  if (!fs.existsSync(bundlePath)) return null;
  const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  return bundle.packs_by_segment?.[segment] || bundle.packs_by_topic?.noxh_eligibility || null;
}

function contextForSegment(segment) {
  const map = {
    noxh_income: 'NOXH_LEGAL',
    sme_credit: 'LOAN_FINANCE',
    valuation: 'VALUATION',
    general_inbound: 'GENERAL_POLICY',
  };
  const ct = map[String(segment || '').toLowerCase()] || 'NOXH_LEGAL';
  const entry = CONTEXT_STORE.by_content_type?.[ct];
  return entry?.status === 'ready' ? entry.context_summary : null;
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

function slidesToMarkdown(slides, caption) {
  const parts = slides.map(
    (s) => `### Slide ${s.index}: ${s.headline}\n\n${s.body}\n\n*${s.visual_note || ''}*`,
  );
  if (caption) parts.push(`\n---\n\n${caption}`);
  return parts.join('\n\n').slice(0, 45000);
}

function normalizeSlide(s, i) {
  return {
    index: Number(s.index || s.slide || s.slide_number || i + 1),
    headline: String(s.headline || s.title || s.head || s.heading || s.hook || '').slice(0, 60),
    body: String(s.body || s.text || s.content || s.copy || s.bullet || '').slice(0, 120),
    visual_note: String(s.visual_note || s.visual || s.note || s.layout || '').slice(0, 200),
  };
}

async function callDeepSeekWithRetry(env, system, userPayload, editorial) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const extra = attempt > 1
        ? '\n\nLần trước thiếu field — mỗi slide PHẢI có headline + body (string không rỗng).'
        : '';
      const raw = await callDeepSeek(env, system + extra, userPayload);
      const parsed = extractJson(raw);
      const slides = Array.isArray(parsed.slides) ? parsed.slides : [];
      const minSlides = CAROUSEL_CFG.slide_count_min || 5;
      if (slides.length < minSlides) throw new Error(`Thiếu slides: ${slides.length}`);

      const normalizedSlides = slides.map(normalizeSlide);
      for (const s of normalizedSlides) {
        if (!s.headline.trim() || !s.body.trim()) {
          throw new Error(`Slide ${s.index} thiếu headline/body`);
        }
      }
      return { parsed, normalizedSlides };
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

async function callDeepSeek(env, system, userPayload) {
  const key = env.DEEPSEEK_API_KEY;
  if (!key || key.length < 12) throw new Error('Thiếu DEEPSEEK_API_KEY');
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

async function runOne(env, cfg, editorial, dryRun) {
  const key = `editorial:page:2026w27:${editorial}`;
  const tab = cfg.content_drafts_tab || 'content_drafts';
  const { headers, rows } = rowsToObjects(await fetchTab(tab, 'A:N'));
  const row = rows.find((r) => r.source_normalized_key === key);
  if (!row) throw new Error(`Không tìm thấy ${key}`);

  const meta = parseMeta(row.meta);
  const brief = meta.editorial_brief_v1;
  if (!brief) throw new Error(`#${editorial} thiếu editorial_brief_v1 — chạy sync-editorial-brief-to-drafts trước`);

  const segment = row.segment || 'noxh_income';
  const legalPack = meta.legal_retrieval_pack || loadLegalPack(segment);
  const contextSummary = contextForSegment(segment);

  const { body } = loadPromptMd('ai-agents-prompts/n8n__carousel-draft.md');
  const systemBase = extractSystemPrompt('ai-agents-prompts/n8n__carousel-draft.md');
  const outputSchema = extractSection(body, 'Output schema (JSON)');
  const system = `${systemBase}

topic_lock: Reel/carousel editorial #${editorial} — "${row.title}". Không lệch chủ đề.
Chỉ trả JSON:
${outputSchema || '{ title, caption, slides[] }'}`;

  const userPayload = {
    segment,
    editorial_brief_v1: brief,
    legal_retrieval_pack: legalPack,
    cta_keyword: meta.cta_keyword || brief.cta_keyword || 'CHECKLIST',
    slide_count_target: CAROUSEL_CFG.slide_count_max || 6,
    context_summary: contextSummary,
    topic_lock: `#${editorial}: ${row.title}`,
  };

  console.log(`Agent 3b carousel → ${key} (row ${row.sheet_row})`);
  if (dryRun) return;

  let parsed;
  let normalizedSlides;
  let lastL0;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const sys = attempt > 1 && lastL0
      ? `${system}\n\nL0 fail lần trước — KHÔNG ghi lãi suất % cụ thể, không cam kết duyệt.`
      : system;
    ({ parsed, normalizedSlides } = await callDeepSeekWithRetry(env, sys, userPayload, editorial));

    const titleProbe = String(parsed.title || row.title).slice(0, 500);
    const captionProbe = String(parsed.caption || '').slice(0, 300);
    const hookLineProbe = normalizedSlides[0].headline;
    const artifactProbe = slidesToMarkdown(normalizedSlides, captionProbe);
    const ctaKeywordProbe = meta.cta_keyword || 'CHECKLIST';
    const ctaProbe = `Comment **${ctaKeywordProbe}** nếu bạn muốn tài liệu — mình gửi qua tin nhắn.`;
    lastL0 = l0Check([hookLineProbe, artifactProbe, ctaProbe, titleProbe].join('\n'));
    if (lastL0.pass) break;
    if (attempt === 3) throw new Error(`L0 fail: ${lastL0.hits.join(', ')}`);
  }

  const title = String(parsed.title || row.title).slice(0, 500);
  const caption = String(parsed.caption || '').slice(0, 300);
  const hookLine = normalizedSlides[0].headline;
  const artifact = slidesToMarkdown(normalizedSlides, caption);
  const ctaKeyword = meta.cta_keyword || 'CHECKLIST';
  const ctaOptIn = `Comment **${ctaKeyword}** nếu bạn muốn tài liệu — mình gửi qua tin nhắn.`;

  const pageDisplay =
    String(env.MAGNIX_PAGE_DISPLAY_NAME || '').trim()
    || DISCLAIMER_CFG.default_page_display_name
    || 'Tim Nha O Xa Hoi';
  const contentType = resolveContentType({ segment }, DISCLAIMER_CFG).content_type;
  const injected = buildInjectedDisclaimer({
    cfg: DISCLAIMER_CFG,
    content_type: contentType,
    variant: resolveDisclaimerVariant(
      { format_type: 'carousel', content_format: 'carousel_image', channel: 'facebook_page' },
      DISCLAIMER_CFG,
    ),
    pageDisplayName: pageDisplay,
  });

  const mergedMeta = {
    ...meta,
    format_type: 'carousel',
    product_type: 'carousel_image',
    content_format: 'carousel_image',
    target_channel: 'facebook_page',
    carousel_slides: normalizedSlides,
    caption,
    agent: 'agent-3b-carousel',
    agent3b_carousel_at: new Date().toISOString(),
    agent3b_provider: 'deepseek',
    needs_editorial_brief: false,
    manual_assets: {
      mode: 'manual_canva_carousel',
      status: 'pending_carousel',
      slide_count: normalizedSlides.length,
    },
  };

  const fields = [
    ['title', title],
    ['hook_line', hookLine],
    ['artifact_markdown', artifact],
    ['cta_opt_in', ctaOptIn],
    ['disclaimer', injected.disclaimer],
    ['export_hint', 'carousel'],
    ['status', 'draft'],
    ['meta', JSON.stringify(mergedMeta).slice(0, 50000)],
  ];

  for (const [col, val] of fields) {
    await updateCell(tab, row.sheet_row, col, val, headers);
    console.log(`  ✓ ${col}`);
  }
  console.log(`  L0: PASS · ${normalizedSlides.length} slides`);
}

async function main() {
  const { ids, dryRun } = parseArgs();
  const env = loadEnv();
  const cfg = loadPublicConfig();
  let failed = 0;

  console.log(`=== Agent 3b carousel (${ids.join(', ')}) ===\n`);
  for (const id of ids) {
    try {
      await runOne(env, cfg, id, dryRun);
    } catch (e) {
      console.error(`  ✗ #${id}:`, e.message);
      failed += 1;
    }
    console.log('');
  }

  if (failed) process.exit(1);
  console.log('✓ Carousel batch hoàn tất.');
}

main().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
