/**
 * Content Type Router — disclaimer + CTA injection (shared logic + tests).
 */

import {
  CONTENT_TYPES,
  LEGAL_CONTENT_TYPES,
  formatDisclaimerDate,
  resolveContentType,
  buildBoilerplateRegexes,
  stripBoilerplateDisclaimers,
  renderDisclaimerTemplate,
  requiresLegalReview,
  resolveDisclaimerVariant,
  getDisclaimerTemplate,
  buildInjectedDisclaimer,
} from './disclaimer-selector.mjs';
import { buildHashtags } from './social-mechanics.mjs';

export { CONTENT_TYPES, LEGAL_CONTENT_TYPES, requiresLegalReview };

export const CHANNELS = new Set(['facebook', 'blog_seo']);

/**
 * @param {{ channel?: string, target_channel?: string, product_type?: string, format?: string }} input
 * @param {object} ctaCfg — cta_templates.json
 */
export function resolveChannel(input, ctaCfg) {
  const raw = String(input.channel || '').trim().toLowerCase();
  if (CHANNELS.has(raw)) {
    return { channel: raw, channel_source: 'explicit', warn: null };
  }

  const candidates = [
    input.target_channel,
    input.product_type,
    input.format,
    input.editorial_format,
  ]
    .map((v) => String(v || '').trim().toLowerCase())
    .filter(Boolean);

  const map = ctaCfg.target_channel_map || {};
  for (const key of candidates) {
    const mapped = map[key];
    if (mapped && CHANNELS.has(mapped)) {
      return { channel: mapped, channel_source: 'target_channel_map', warn: null };
    }
  }

  const def = String(ctaCfg.default_channel || 'facebook').toLowerCase();
  return {
    channel: CHANNELS.has(def) ? def : 'facebook',
    channel_source: 'default',
    warn: candidates.length ? 'CHANNEL_UNMAPPED' : 'CHANNEL_DEFAULT',
  };
}

/** @param {string[]} keywords */
export function buildLegacyCtaRegexes(keywords) {
  return (keywords || [])
    .map((k) => String(k || '').trim())
    .filter(Boolean)
    .map((k) => new RegExp(
      `(?:^|\\n)[^\\n]*\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^\\n]*`,
      'gim',
    ));
}

/**
 * Gỡ CTA cũ (CHECKLIST/MAU01/…) khỏi body hoặc field cta.
 * @param {string} text
 * @param {string[]} legacyKeywords
 */
export function stripLegacyCta(text, legacyKeywords = []) {
  let out = String(text || '');
  if (!out.trim()) return out;

  const regexes = buildLegacyCtaRegexes(legacyKeywords);
  for (const re of regexes) {
    out = out.replace(re, '\n').trim();
  }

  out = out.replace(/\n*Comment\s+["']?[A-Z0-9_]+["']?[^\n]*/gi, '').trim();
  out = out.replace(/\n*Inbox\s+["']?[A-Z0-9_]+["']?[^\n]*/gi, '').trim();

  return out.replace(/\n{3,}/g, '\n\n').trim();
}

/** @param {string} text @param {string[]} forbidden */
export function stripForbiddenCtaPhrases(text, forbidden = []) {
  let out = String(text || '');
  for (const phrase of forbidden) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    out = out.replace(re, '').trim();
  }
  return out.replace(/\s{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * @param {string} body
 * @param {object} ctaCfg
 * @param {string} segment
 */
export function inferNearestOfferType(body, ctaCfg, segment, disclaimerCfg) {
  const fromSegment = resolveContentType({ segment, content_type: null }, disclaimerCfg);
  if (fromSegment.content_type !== 'GENERAL_POLICY') {
    return fromSegment.content_type;
  }

  const lower = String(body || '').toLowerCase();
  const hints = ctaCfg.context_hints || {};
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

/**
 * @param {string} template
 * @param {{ keyword?: string, document_name?: string, link?: string }} vars
 */
export function renderCtaTemplate(template, vars) {
  return String(template || '')
    .replace(/\{\{keyword\}\}/g, vars.keyword || '')
    .replace(/\{\{document_name\}\}/g, vars.document_name || '')
    .replace(/\{\{link\}\}/g, vars.link || '')
    .trim();
}

/**
 * @param {string} contentType
 * @param {object} ctaCfg
 * @param {(envKey: string) => string} [linkResolver]
 */
export function resolveOfferLink(contentType, ctaCfg, linkResolver) {
  const envKey = ctaCfg.offer_links_env?.[contentType];
  if (!envKey) return '';
  if (typeof linkResolver === 'function') {
    return String(linkResolver(envKey) || '').trim();
  }
  return '';
}

/**
 * @param {object} params
 */
export function buildCta({
  content_type,
  channel,
  body,
  segment,
  ctaCfg,
  disclaimerCfg,
  linkResolver,
  commentUnlockWeekCount = 0,
}) {
  const keyword = ctaCfg.keywords?.[content_type] || null;
  const offer = ctaCfg.offers?.[content_type] || null;
  let template = ctaCfg.templates?.[content_type]?.[channel] || '';
  let effectiveType = content_type;
  let cta_skipped = false;
  let cta_mode = 'primary';

  if (content_type === 'GENERAL_POLICY') {
    const nearest = inferNearestOfferType(body, ctaCfg, segment, disclaimerCfg);
    if (!nearest) {
      return { cta: '', cta_keyword: null, cta_skipped: true, cta_mode: 'none' };
    }
    effectiveType = nearest;
    template = ctaCfg.general_policy_soft?.[channel] || '';
    cta_mode = 'general_soft';
  }

  if (!template?.trim()) {
    return { cta: '', cta_keyword: keyword, cta_skipped: true, cta_mode: 'empty_template' };
  }

  const effKeyword = ctaCfg.keywords?.[effectiveType] || keyword;
  const effOffer = ctaCfg.offers?.[effectiveType] || offer;
  const link = resolveOfferLink(effectiveType, ctaCfg, linkResolver);

  const sm = ctaCfg.social_mechanics || {};
  const maxWeek = Number(sm.max_comment_unlock_per_week ?? 3);
  if (channel === 'facebook' && commentUnlockWeekCount >= maxWeek) {
    const modes = ctaCfg.cta_modes?.facebook || {};
    if (link && modes.link_direct) {
      template = modes.link_direct;
      cta_mode = 'link_direct_frequency_cap';
    } else if (modes.question_then_comment) {
      template = modes.question_then_comment;
      cta_mode = 'question_then_comment';
    }
  }

  if (channel === 'blog_seo' && !link) {
    return {
      cta: '',
      cta_keyword: effKeyword,
      cta_skipped: true,
      cta_mode: 'missing_link',
    };
  }

  let cta = renderCtaTemplate(template, {
    keyword: effKeyword,
    document_name: effOffer?.document_name || '',
    link,
  });

  cta = stripForbiddenCtaPhrases(cta, ctaCfg.forbidden_cta_phrases || []);

  if (!cta.trim()) {
    cta_skipped = true;
  }

  return {
    cta,
    cta_keyword: effKeyword,
    cta_skipped,
    cta_mode,
    cta_offer_type: effectiveType,
  };
}

/**
 * Unified router: disclaimer + CTA (content → CTA field → disclaimer field).
 */
export function applyContentTypeRouting({
  draft,
  disclaimerCfg,
  ctaCfg,
  brand,
  normalized_key = '',
  channel: channelInput,
  target_channel,
  product_type,
  format,
  content_format,
  format_type,
  page_display_name,
  linkResolver,
  now = new Date(),
  commentUnlockWeekCount = 0,
}) {
  if (!draft) {
    return { ok: false, error: 'NO_DRAFT' };
  }

  const resolved = resolveContentType(
    { content_type: draft.content_type, segment: draft.segment },
    disclaimerCfg,
  );
  const content_type = resolved.content_type;

  const channelResolved = resolveChannel(
    {
      channel: channelInput || draft.channel,
      target_channel: target_channel || draft.target_channel,
      product_type: product_type || draft.product_type,
      format: format || draft.format,
    },
    ctaCfg,
  );
  const channel = channelResolved.channel;

  const disclaimerRegexes = buildBoilerplateRegexes(disclaimerCfg.boilerplate_patterns || []);
  const legacyKeywords = ctaCfg.legacy_cta_keywords || [];

  let cleanedBody = stripBoilerplateDisclaimers(draft.artifact_markdown || '', disclaimerRegexes);
  cleanedBody = stripLegacyCta(cleanedBody, legacyKeywords);

  let cleanedCtaField = stripLegacyCta(draft.cta_opt_in || '', legacyKeywords);
  cleanedCtaField = stripForbiddenCtaPhrases(cleanedCtaField, ctaCfg.forbidden_cta_phrases || []);

  const ctaBuilt = buildCta({
    content_type,
    channel,
    body: cleanedBody,
    segment: draft.segment,
    ctaCfg,
    disclaimerCfg,
    linkResolver,
    commentUnlockWeekCount,
  });

  const injectedCta = ctaBuilt.cta_skipped ? '' : ctaBuilt.cta;

  const disclaimerVariant = resolveDisclaimerVariant(
    {
      format_type: draft.format_type || format_type,
      product_type: product_type || draft.product_type,
      content_format: content_format || draft.content_format,
      format: format || draft.format,
      channel,
    },
    disclaimerCfg,
  );
  const disclaimerBuilt = buildInjectedDisclaimer({
    cfg: disclaimerCfg,
    content_type,
    variant: disclaimerVariant,
    pageDisplayName: page_display_name || brand,
    brand,
    now,
  });
  const injectedDisclaimer = disclaimerBuilt.disclaimer;

  const hashtagBuilt = buildHashtags(content_type, ctaCfg);

  const log = {
    normalized_key: String(normalized_key || '').slice(0, 120),
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
    page_display_name: disclaimerBuilt.page_display_name,
    requires_legal_review: requiresLegalReview(content_type),
    disclaimer_warn: resolved.warn,
    channel_warn: channelResolved.warn,
    stripped_legacy_cta: Boolean(
      cleanedCtaField !== (draft.cta_opt_in || '')
      || stripLegacyCta(draft.artifact_markdown || '', legacyKeywords) !== (draft.artifact_markdown || ''),
    ),
    hashtags: hashtagBuilt.hashtags,
  };

  return {
    ok: true,
    draft: {
      ...draft,
      content_type,
      channel,
      artifact_markdown: cleanedBody,
      cta_opt_in: injectedCta.slice(0, 1000),
      disclaimer: injectedDisclaimer.slice(0, 2000),
      hashtags: hashtagBuilt.hashtags,
      format_type: draft.format_type || 'text_post',
    },
    content_type_router: log,
    disclaimer_injection: log,
    requires_legal_review: log.requires_legal_review,
  };
}

/** @deprecated use applyContentTypeRouting */
export function applyDisclaimerInjection(params) {
  const { cfg, ...rest } = params;
  return applyContentTypeRouting({
    ...rest,
    disclaimerCfg: cfg,
    ctaCfg: { default_channel: 'facebook', templates: {}, keywords: {}, offers: {} },
  });
}
