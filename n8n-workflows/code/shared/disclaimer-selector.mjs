/**
 * Auto-Disclaimer Injection — shared logic (scripts + unit tests).
 * n8n runtime: build injects config vào 03b-disclaimer-selector.js
 */

export const CONTENT_TYPES = new Set([
  'NOXH_LEGAL',
  'LOAN_FINANCE',
  'VALUATION',
  'GENERAL_POLICY',
]);

export const LEGAL_CONTENT_TYPES = new Set([
  'NOXH_LEGAL',
  'LOAN_FINANCE',
  'VALUATION',
]);

/** @param {string} [isoOrDate] */
export function formatDisclaimerDate(isoOrDate = new Date()) {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) {
    return formatDisclaimerDate(new Date());
  }
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * @param {object} cfg — disclaimers.json
 * @param {string} segment
 */
export function mapSegmentToContentType(segment, cfg) {
  const key = String(segment || '').trim().toLowerCase();
  const mapped = cfg.segment_map?.[key];
  if (mapped && CONTENT_TYPES.has(mapped)) return mapped;
  return 'GENERAL_POLICY';
}

/**
 * @param {{ content_type?: string, segment?: string }} input
 * @param {object} cfg
 */
export function resolveContentType(input, cfg) {
  const raw = String(input.content_type || '').trim().toUpperCase();
  if (CONTENT_TYPES.has(raw)) {
    return { content_type: raw, content_type_source: 'llm', warn: null };
  }
  const fromSegment = mapSegmentToContentType(input.segment, cfg);
  const warn = raw && !CONTENT_TYPES.has(raw)
    ? `INVALID_CONTENT_TYPE:${raw}`
    : !input.content_type
      ? 'MISSING_CONTENT_TYPE'
      : null;
  return {
    content_type: fromSegment,
    content_type_source: warn ? 'segment_fallback' : 'segment',
    warn,
  };
}

/** @param {string[]} patternSources */
export function buildBoilerplateRegexes(patternSources) {
  return (patternSources || [])
    .map((p) => String(p || '').trim())
    .filter(Boolean)
    .map((p) => new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'));
}

/**
 * Gỡ disclaimer boilerplate cũ khỏi text.
 * @param {string} text
 * @param {RegExp[]} regexes
 */
export function stripBoilerplateDisclaimers(text, regexes) {
  let out = String(text || '');
  if (!out.trim()) return out;

  // Khối footer thường gặp sau dấu — hoặc dòng "Disclaimer:"
  out = out.replace(/\n*[-—]{1,2}\s*\n[\s\S]*$/m, '').trim();
  out = out.replace(/\n*(?:\*\*)?Disclaimer(?:\*\*)?:[\s\S]*$/im, '').trim();

  for (const re of regexes) {
    const parts = out.split(re);
    if (parts.length > 1) {
      // Giữ phần trước boilerplate đầu tiên match
      out = parts[0].trim();
    }
    out = out.replace(re, '').trim();
  }

  return out.replace(/\n{3,}/g, '\n\n').trim();
}

/** @param {string} template */
export function renderDisclaimerTemplate(template, { date, brand, page }) {
  const pageName = String(page || brand || '').trim();
  return String(template || '')
    .replace(/\{\{date\}\}/g, date)
    .replace(/\{\{page\}\}/g, pageName)
    .replace(/\{\{brand\}\}/g, pageName)
    .trim();
}

/**
 * reel_short vs post_long theo format/channel.
 * @param {object} input
 * @param {object} cfg disclaimers.json
 */
export function resolveDisclaimerVariant(input, cfg) {
  const formatType = String(input.format_type || '').trim().toLowerCase();
  const product = String(
    input.content_format || input.product_type || input.format || '',
  ).trim().toLowerCase();

  const reelFormats = new Set(cfg.disclaimer_format_map?.reel_short || []);
  if (formatType === 'video_script' || reelFormats.has(product)) {
    return 'reel_short';
  }
  return 'post_long';
}

/**
 * @param {object} cfg
 * @param {string} contentType
 * @param {string} variant
 */
export function getDisclaimerTemplate(cfg, contentType, variant) {
  const bucket = cfg.templates?.[variant] || cfg.templates?.post_long || {};
  const key = CONTENT_TYPES.has(contentType) ? contentType : 'GENERAL_POLICY';
  return bucket[key] || bucket._default || bucket.GENERAL_POLICY || '';
}

/**
 * @param {object} params
 */
export function buildInjectedDisclaimer({
  cfg,
  content_type,
  variant,
  pageDisplayName,
  brand,
  now = new Date(),
}) {
  const template = getDisclaimerTemplate(cfg, content_type, variant);
  const page = String(
    pageDisplayName || cfg.default_page_display_name || brand || cfg.default_brand || 'Magnix',
  ).trim();
  const disclaimer = renderDisclaimerTemplate(template, {
    date: formatDisclaimerDate(now),
    brand: page,
    page,
  });
  return { disclaimer, template, variant, page_display_name: page };
}

export function requiresLegalReview(contentType) {
  return LEGAL_CONTENT_TYPES.has(contentType);
}

/**
 * @param {object} params
 * @param {object} params.draft — { artifact_markdown, disclaimer, cta_opt_in, segment, content_type? }
 * @param {object} params.cfg — disclaimers.json
 * @param {string} params.brand
 * @param {string} [params.normalisedKey]
 * @param {Date|string} [params.now]
 */
export function applyDisclaimerInjection({
  draft,
  cfg,
  brand,
  normalized_key = '',
  now = new Date(),
}) {
  if (!draft) {
    return { ok: false, error: 'NO_DRAFT' };
  }

  const resolved = resolveContentType(
    { content_type: draft.content_type, segment: draft.segment },
    cfg,
  );
  const content_type = resolved.content_type;
  const variant = resolveDisclaimerVariant(
    {
      format_type: draft.format_type,
      product_type: draft.product_type,
      content_format: draft.content_format,
      format: draft.format,
      channel: draft.channel,
    },
    cfg,
  );
  const built = buildInjectedDisclaimer({
    cfg,
    content_type,
    variant,
    pageDisplayName: brand,
    brand,
    now,
  });
  const templateKey = `${variant}/${content_type}`;

  const regexes = buildBoilerplateRegexes(cfg.boilerplate_patterns || []);
  const cleanedBody = stripBoilerplateDisclaimers(draft.artifact_markdown || '', regexes);
  const cleanedLegacyDisclaimer = stripBoilerplateDisclaimers(draft.disclaimer || '', regexes);
  const injectedDisclaimer = built.disclaimer;

  const log = {
    normalized_key: String(normalized_key || '').slice(0, 120),
    content_type,
    content_type_source: resolved.content_type_source,
    disclaimer_variant: variant,
    page_display_name: built.page_display_name,
    template_key: templateKey,
    requires_legal_review: requiresLegalReview(content_type),
    disclaimer_warn: resolved.warn,
    stripped_legacy: Boolean(cleanedLegacyDisclaimer && cleanedLegacyDisclaimer !== draft.disclaimer),
  };

  return {
    ok: true,
    draft: {
      ...draft,
      content_type,
      artifact_markdown: cleanedBody,
      disclaimer: injectedDisclaimer,
    },
    disclaimer_injection: log,
  };
}
