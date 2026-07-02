// n8n Code: Content Type Router — disclaimer + CTA sau Parse, trước L0
// Config baked lúc build: __DISCLAIMER_CONFIG_JSON__ + __CTA_CONFIG_JSON__

const DISCLAIMER_CFG = __DISCLAIMER_CONFIG_JSON__;
const CTA_CFG = __CTA_CONFIG_JSON__;
const CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);
const LEGAL_CONTENT_TYPES = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION']);
const CHANNELS = new Set(['facebook', 'blog_seo']);

function formatDisclaimerDate(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate || Date.now());
  if (Number.isNaN(d.getTime())) return formatDisclaimerDate(new Date());
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

function mapSegmentToContentType(segment) {
  const key = String(segment || '').trim().toLowerCase();
  const mapped = DISCLAIMER_CFG.segment_map?.[key];
  return mapped && CONTENT_TYPES.has(mapped) ? mapped : 'GENERAL_POLICY';
}

function resolveContentType(content_type, segment) {
  const raw = String(content_type || '').trim().toUpperCase();
  if (CONTENT_TYPES.has(raw)) {
    return { content_type: raw, content_type_source: 'llm', warn: null };
  }
  const fromSegment = mapSegmentToContentType(segment);
  let warn = null;
  if (raw && !CONTENT_TYPES.has(raw)) warn = `INVALID_CONTENT_TYPE:${raw}`;
  else if (!content_type) warn = 'MISSING_CONTENT_TYPE';
  return { content_type: fromSegment, content_type_source: warn ? 'segment_fallback' : 'segment', warn };
}

function resolveChannel(input) {
  const raw = String(input.channel || '').trim().toLowerCase();
  if (CHANNELS.has(raw)) return { channel: raw, channel_source: 'explicit', warn: null };

  const candidates = [input.target_channel, input.product_type, input.format]
    .map((v) => String(v || '').trim().toLowerCase())
    .filter(Boolean);
  const map = CTA_CFG.target_channel_map || {};
  for (const key of candidates) {
    const mapped = map[key];
    if (mapped && CHANNELS.has(mapped)) {
      return { channel: mapped, channel_source: 'target_channel_map', warn: null };
    }
  }
  const def = String(CTA_CFG.default_channel || 'facebook').toLowerCase();
  return {
    channel: CHANNELS.has(def) ? def : 'facebook',
    channel_source: 'default',
    warn: candidates.length ? 'CHANNEL_UNMAPPED' : 'CHANNEL_DEFAULT',
  };
}

function buildBoilerplateRegexes(patterns) {
  return (patterns || [])
    .map((p) => String(p || '').trim())
    .filter(Boolean)
    .map((p) => new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'));
}

function stripBoilerplateDisclaimers(text, regexes) {
  let out = String(text || '');
  if (!out.trim()) return out;
  out = out.replace(/\n*[-—]{1,2}\s*\n[\s\S]*$/m, '').trim();
  out = out.replace(/\n*(?:\*\*)?Disclaimer(?:\*\*)?:[\s\S]*$/im, '').trim();
  for (const re of regexes) {
    const parts = out.split(re);
    if (parts.length > 1) out = parts[0].trim();
    out = out.replace(re, '').trim();
  }
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function stripLegacyCta(text) {
  let out = String(text || '');
  if (!out.trim()) return out;
  for (const k of CTA_CFG.legacy_cta_keywords || []) {
    const esc = String(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|\\n)[^\\n]*\\b${esc}\\b[^\\n]*`, 'gim');
    out = out.replace(re, '\n').trim();
  }
  out = out.replace(/\n*Comment\s+["']?[A-Z0-9_]+["']?[^\n]*/gi, '').trim();
  return out.replace(/\n{3,}/g, '\n\n').trim();
}

function stripForbiddenCtaPhrases(text) {
  let out = String(text || '');
  for (const phrase of CTA_CFG.forbidden_cta_phrases || []) {
    const re = new RegExp(String(phrase).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, '').trim();
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

function inferNearestOfferType(body, segment) {
  const fromSegment = mapSegmentToContentType(segment);
  if (fromSegment !== 'GENERAL_POLICY') return fromSegment;
  const lower = String(body || '').toLowerCase();
  const hints = CTA_CFG.context_hints || {};
  let best = null;
  let bestScore = 0;
  for (const [type, words] of Object.entries(hints)) {
    let score = 0;
    for (const w of words) {
      if (lower.includes(String(w).toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = type;
    }
  }
  return bestScore > 0 ? best : null;
}

function resolveOfferLink(contentType) {
  const envKey = CTA_CFG.offer_links_env?.[contentType];
  if (!envKey) return '';
  return String($env[envKey] || '').trim();
}

function renderCta(template, vars) {
  return String(template || '')
    .replace(/\{\{keyword\}\}/g, vars.keyword || '')
    .replace(/\{\{document_name\}\}/g, vars.document_name || '')
    .replace(/\{\{link\}\}/g, vars.link || '')
    .trim();
}

function buildCta(content_type, channel, body, segment, commentUnlockWeekCount) {
  let effectiveType = content_type;
  let template = CTA_CFG.templates?.[content_type]?.[channel] || '';
  let cta_mode = 'primary';

  if (content_type === 'GENERAL_POLICY') {
    const nearest = inferNearestOfferType(body, segment);
    if (!nearest) {
      return { cta: '', cta_keyword: null, cta_skipped: true, cta_mode: 'none' };
    }
    effectiveType = nearest;
    template = CTA_CFG.general_policy_soft?.[channel] || '';
    cta_mode = 'general_soft';
  }

  if (!template.trim()) {
    return { cta: '', cta_keyword: null, cta_skipped: true, cta_mode: 'empty_template' };
  }

  const keyword = CTA_CFG.keywords?.[effectiveType] || null;
  const document_name = CTA_CFG.offers?.[effectiveType]?.document_name || '';
  const link = resolveOfferLink(effectiveType);

  const maxWeek = Number(CTA_CFG.social_mechanics?.max_comment_unlock_per_week ?? 3);
  if (channel === 'facebook' && commentUnlockWeekCount >= maxWeek) {
    const modes = CTA_CFG.cta_modes?.facebook || {};
    if (link && modes.link_direct) {
      template = modes.link_direct;
      cta_mode = 'link_direct_frequency_cap';
    } else if (modes.question_then_comment) {
      template = modes.question_then_comment;
      cta_mode = 'question_then_comment';
    }
  }

  if (channel === 'blog_seo' && !link) {
    return { cta: '', cta_keyword: keyword, cta_skipped: true, cta_mode: 'missing_link' };
  }

  let cta = renderCta(template, { keyword, document_name, link });
  cta = stripForbiddenCtaPhrases(cta);

  return {
    cta,
    cta_keyword: keyword,
    cta_skipped: !cta.trim(),
    cta_mode,
    cta_offer_type: effectiveType,
  };
}

function renderDisclaimerTemplate(template, pageName) {
  return String(template || '')
    .replace(/\{\{page\}\}/g, pageName)
    .replace(/\{\{brand\}\}/g, pageName)
    .trim();
}

function resolveDisclaimerVariant(input) {
  const formatType = String(input.format_type || '').trim().toLowerCase();
  const product = String(input.content_format || input.product_type || input.format || '').trim().toLowerCase();
  const reelFormats = new Set(DISCLAIMER_CFG.disclaimer_format_map?.reel_short || []);
  if (formatType === 'video_script' || reelFormats.has(product)) return 'reel_short';
  return 'post_long';
}

function getDisclaimerTemplate(contentType, variant) {
  const bucket = DISCLAIMER_CFG.templates?.[variant] || DISCLAIMER_CFG.templates?.post_long || {};
  const key = CONTENT_TYPES.has(contentType) ? contentType : 'GENERAL_POLICY';
  return bucket[key] || bucket._default || bucket.GENERAL_POLICY || '';
}

const item = $input.first().json;
const source = $('Loop Draft Candidates').item?.json || {};
const meta = source.meta_parsed || {};
const brief = source.editorial_brief_v1 || meta.editorial_brief_v1 || {};

if (!item.ok || !item.draft) {
  return [{ json: item }];
}

const pageDisplay =
  String($env.MAGNIX_PAGE_DISPLAY_NAME || '').trim()
  || String(DISCLAIMER_CFG.default_page_display_name || '').trim()
  || String($env.MAGNIX_BRAND_NAME || '').trim()
  || String(DISCLAIMER_CFG.default_brand || '').trim()
  || 'Magnix';

const d = item.draft;
const resolved = resolveContentType(d.content_type, d.segment || source.segment);
const content_type = resolved.content_type;

const channelResolved = resolveChannel({
  channel: meta.channel || brief.channel || d.channel,
  target_channel: meta.target_channel || brief.target_channel || meta.product_type,
  product_type: meta.product_type || brief.product_type,
  format: brief.format || meta.format,
});
const channel = channelResolved.channel;

const disclaimerRegexes = buildBoilerplateRegexes(DISCLAIMER_CFG.boilerplate_patterns || []);
const cleanedBody = stripLegacyCta(
  stripBoilerplateDisclaimers(d.artifact_markdown || '', disclaimerRegexes),
);

const workflowData = $getWorkflowStaticData('global');
let commentUnlockWeekCount = 0;
const weekMs = 7 * 86400000;
const nowMs = Date.now();
for (const p of workflowData.comment_unlock_index || []) {
  const t = new Date(p.created_at || '').getTime();
  if (!Number.isNaN(t) && nowMs - t >= 0 && nowMs - t <= weekMs) commentUnlockWeekCount += 1;
}

const ctaBuilt = buildCta(
  content_type,
  channel,
  cleanedBody,
  d.segment || source.segment,
  commentUnlockWeekCount,
);
const injectedCta = ctaBuilt.cta_skipped ? '' : ctaBuilt.cta;

const productFormat = String(
  meta.content_format || meta.product_type || d.product_type || brief.content_format || 'fb_page_post_image',
).trim().toLowerCase();
const disclaimerVariant = resolveDisclaimerVariant({
  format_type: d.format_type || 'text_post',
  content_format: productFormat,
  product_type: productFormat,
  format: brief.format || meta.format,
  channel,
});
const disclaimerTpl = getDisclaimerTemplate(content_type, disclaimerVariant);
const injectedDisclaimer = renderDisclaimerTemplate(disclaimerTpl, pageDisplay);

const hashtagCfg = CTA_CFG.hashtags || {};
const forbiddenTags = new Set((hashtagCfg.forbidden || []).map((t) => t.toLowerCase()));
const tagPool = (hashtagCfg[content_type] || hashtagCfg.GENERAL_POLICY || [])
  .map((t) => (String(t).startsWith('#') ? String(t) : `#${t}`))
  .filter((t) => t && !forbiddenTags.has(t.toLowerCase()));
const hashtags = tagPool.slice(0, Number(hashtagCfg.count_max ?? 3));

const content_type_router = {
  normalized_key: String(source.normalized_key || '').slice(0, 120),
  content_type,
  content_type_source: resolved.content_type_source,
  channel,
  channel_source: channelResolved.channel_source,
  cta_keyword: ctaBuilt.cta_keyword,
  cta_skipped: ctaBuilt.cta_skipped,
  cta_mode: ctaBuilt.cta_mode,
  cta_offer_type: ctaBuilt.cta_offer_type || content_type,
  disclaimer_variant: disclaimerVariant,
  disclaimer_template_key: `${disclaimerVariant}/${content_type}`,
  page_display_name: pageDisplay,
  requires_legal_review: LEGAL_CONTENT_TYPES.has(content_type),
  disclaimer_warn: resolved.warn,
  channel_warn: channelResolved.warn,
  hashtags,
};

if (resolved.warn || channelResolved.warn) {
  const data = $getWorkflowStaticData('global');
  if (!data.a3_stats) data.a3_stats = {};
  if (resolved.warn) data.a3_stats.disclaimer_warn = (data.a3_stats.disclaimer_warn || 0) + 1;
  if (channelResolved.warn) data.a3_stats.channel_warn = (data.a3_stats.channel_warn || 0) + 1;
}

return [{
  json: {
    ...item,
    draft: {
      ...d,
      content_type,
      channel,
      artifact_markdown: cleanedBody,
      cta_opt_in: injectedCta.slice(0, 1000),
      disclaimer: injectedDisclaimer.slice(0, 2000),
      hashtags,
      format_type: d.format_type || 'text_post',
    },
    content_type_router,
    disclaimer_injection: content_type_router,
    requires_legal_review: content_type_router.requires_legal_review,
  },
}];
