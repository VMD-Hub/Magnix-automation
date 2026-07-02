// n8n Code: merge carousel → content_drafts row + queue mark (Agent 3b)

const DISCLAIMER_CFG = __DISCLAIMER_CONFIG_JSON__;
const CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);
const SEGMENT_MAP = DISCLAIMER_CFG.segment_map || {};

function mapSegmentToContentType(segment) {
  const key = String(segment || '').trim().toLowerCase();
  const mapped = SEGMENT_MAP[key];
  return mapped && CONTENT_TYPES.has(mapped) ? mapped : 'GENERAL_POLICY';
}

function renderDisclaimerTemplate(template, pageName) {
  return String(template || '')
    .replace(/\{\{page\}\}/g, pageName)
    .replace(/\{\{brand\}\}/g, pageName)
    .trim();
}

function getPostDisclaimer(contentType) {
  const bucket = DISCLAIMER_CFG.templates?.post_long || {};
  const key = CONTENT_TYPES.has(contentType) ? contentType : 'GENERAL_POLICY';
  return bucket[key] || bucket._default || bucket.GENERAL_POLICY || '';
}

function slidesToMarkdown(slides, caption) {
  const parts = slides.map((s) => `### Slide ${s.index}: ${s.headline}\n\n${s.body}\n\n*${s.visual_note || ''}*`);
  if (caption) parts.push(`\n---\n\n${caption}`);
  return parts.join('\n\n').slice(0, 45000);
}

const source = $('Loop Carousel Candidates').item?.json || {};
const item = $input.first().json;

if (!item.ok || !item.carousel || !item.l0_pass) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', sheet_row: source.sheet_row } }];
}

const c = item.carousel;
const pageDisplay =
  String($env.MAGNIX_PAGE_DISPLAY_NAME || '').trim()
  || String(DISCLAIMER_CFG.default_page_display_name || '').trim()
  || 'Tim Nha O Xa Hoi';
const contentType = mapSegmentToContentType(c.segment || source.segment);
const disclaimer = renderDisclaimerTemplate(getPostDisclaimer(contentType), pageDisplay).slice(0, 2000);

const ctaKeyword = String(source.meta_parsed?.cta_keyword || 'CHECKLIST');
const ctaOptIn = `Comment **${ctaKeyword}** nếu bạn muốn tài liệu — mình gửi qua tin nhắn.`;

const pageKey = String(source.meta_parsed?.editorial_page_key || '')
  || String(source.normalized_key || '').replace('editorial:queue:', 'editorial:page:');
const hookLine = String(c.slides[0]?.headline || c.title).slice(0, 500);
const artifact = slidesToMarkdown(c.slides, c.caption);

const metaObj = {
  format_type: 'carousel',
  product_type: 'carousel_image',
  content_format: 'carousel_image',
  target_channel: 'facebook_page',
  carousel_slides: c.slides,
  caption: c.caption,
  source_refs: c.source_refs,
  agent: 'agent-3b-carousel',
  content_type: contentType,
  disclaimer_injection: { variant: 'post_long', content_type: contentType },
  l0_hits: item.l0_hits || [],
  created_at: new Date().toISOString(),
};

return [{
  json: {
    ok: true,
    source_normalized_key: pageKey,
    queue_sheet_row: source.sheet_row,
    sheet_status: 'draft',
    update_row: [
      pageKey,
      String(source.post_id || `cal_carousel_${pageKey.split(':').pop()}`),
      String(c.segment || source.segment || 'noxh_income'),
      c.title,
      hookLine,
      artifact,
      ctaOptIn,
      disclaimer,
      'carousel',
      'draft',
      'L0',
      new Date().toISOString(),
      'agent3b_carousel',
      JSON.stringify(metaObj).slice(0, 50000),
    ],
    queue_meta_patch: {
      carousel_draft_created: true,
      draft_created: true,
      draft_status: 'draft',
      draft_title: c.title,
      draft_at: new Date().toISOString(),
    },
  },
}];
