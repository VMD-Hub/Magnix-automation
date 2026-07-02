// n8n Code: merge video_drafts row + mark content_queue (Agent 6)
// Config baked: __DISCLAIMER_CONFIG_JSON__

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

function getReelDisclaimer(contentType) {
  const bucket = DISCLAIMER_CFG.templates?.reel_short || {};
  const key = CONTENT_TYPES.has(contentType) ? contentType : 'GENERAL_POLICY';
  return bucket[key] || bucket._default || bucket.GENERAL_POLICY || '';
}

const source = $('Loop Video Candidates').item?.json || {};
const item = $input.first().json;

if (!item.ok || !item.video) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', sheet_row: source.sheet_row } }];
}

const v = item.video;
const isVideoScript = v.format_type === 'video_script';

const beatsJson = isVideoScript
  ? JSON.stringify(v.body_beats || []).slice(0, 45000)
  : JSON.stringify(v.beats || []).slice(0, 45000);
const onScreen = isVideoScript
  ? String(v.on_screen_text || '')
  : (v.on_screen_text || []).join(' | ');
const hashtags = (v.hashtags || []).join(', ');
const hookField = isVideoScript ? v.verbal_hook : v.hook_3s;
const titleField = isVideoScript
  ? String(v.on_screen_text || v.verbal_hook || 'Magnix short').slice(0, 80)
  : v.title;
const scriptField = isVideoScript
  ? (v.body_beats || []).map((b) => b.spoken_line).join(' ')
  : v.spoken_script;
const captionField = isVideoScript ? (v.caption_cta || '') : v.caption;
const ctaField = isVideoScript ? (v.verbal_cta || v.caption_cta || '') : v.cta_keyword;
const durationField = isVideoScript ? v.target_length_seconds : v.duration_sec;

const pageDisplay =
  String($env.MAGNIX_PAGE_DISPLAY_NAME || '').trim()
  || String(DISCLAIMER_CFG.default_page_display_name || '').trim()
  || String($env.MAGNIX_BRAND_NAME || '').trim()
  || String(DISCLAIMER_CFG.default_brand || '').trim()
  || 'Magnix';
const contentType = v.content_type && CONTENT_TYPES.has(v.content_type)
  ? v.content_type
  : mapSegmentToContentType(v.segment || source.segment);
const injectedDisclaimer = renderDisclaimerTemplate(getReelDisclaimer(contentType), pageDisplay).slice(0, 2000);

const sheetStatus = item.sheet_status_override || 'draft';

const meta = JSON.stringify({
  format_type: v.format_type || 'production_brief_v3',
  production_brief_version: v.production_brief_version || 1,
  render_engine: v.render_engine || 'creatomate_renderscript_v2',
  pattern_applied: v.pattern_applied || [],
  source_refs: v.source_refs,
  beats_count: isVideoScript ? (v.body_beats || []).length : (v.beats || []).length,
  l0_hits: item.l0_hits || [],
  video_script_qa: item.video_script_qa || null,
  agent: 'agent-6',
  layer: 'C',
  source_post_url: source.post_url,
  listen_score: Number(source.score || 0),
  created_at: new Date().toISOString(),
  ...(isVideoScript ? {
    visual_hook: v.visual_hook,
    verbal_hook: v.verbal_hook,
    verbal_cta: v.verbal_cta,
    caption_cta: v.caption_cta,
    content_type: contentType,
    disclaimer_variant: 'reel_short',
    page_display_name: pageDisplay,
  } : {
    content_type: contentType,
    disclaimer_variant: 'reel_short',
    page_display_name: pageDisplay,
  }),
}).slice(0, 50000);

return [{
  json: {
    ok: true,
    source_normalized_key: source.normalized_key,
    queue_sheet_row: source.sheet_row,
    append_row: [
      String(source.normalized_key || ''),
      String(source.post_id || ''),
      v.platform,
      String(v.segment || source.segment || ''),
      titleField,
      hookField,
      scriptField,
      beatsJson,
      onScreen,
      captionField,
      hashtags,
      ctaField,
      String(durationField),
      v.aspect_ratio,
      v.source_insight,
      injectedDisclaimer,
      sheetStatus,
      item.video_script_needs_review ? 'L2' : 'L0',
      'false',
      new Date().toISOString(),
      'agent6_short_video',
      meta,
    ],
    queue_meta_patch: {
      video_draft_created: true,
      video_draft_status: 'draft',
      video_draft_title: v.title,
      video_draft_platform: v.platform,
      video_draft_at: new Date().toISOString(),
    },
  },
}];
