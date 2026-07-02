/**
 * Title QA Gate — validate + topic duplication (no auto-fix).
 */

export const CONTENT_TYPES = new Set([
  'NOXH_LEGAL',
  'LOAN_FINANCE',
  'VALUATION',
  'GENERAL_POLICY',
]);

const DRAFT_TAG_RE = /\[(TEST|DRAFT|WIP)\]/i;
const TEMPLATE_VAR_RE = /\{\{[^}]+\}\}/;
const PLACEHOLDER_PATTERNS = [
  { id: 'TEMPLATE_VAR', re: TEMPLATE_VAR_RE, reason: 'Unrendered template variable {{...}} in title' },
  { id: 'X_TRIEU', re: /\bX\s+tri[eệ]u\b/i, reason: 'Unfilled placeholder "X triệu" in title' },
  { id: 'SO_BRACKET', re: /\[số\]/i, reason: 'Unfilled placeholder "[số]" in title' },
  { id: 'UNDERSCORES', re: /_{3,}/, reason: 'Unfilled placeholder "___" in title' },
];

const CTA_PATTERNS = [
  { id: 'COMMENT', re: /\bcomment\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
  { id: 'TAI_NGAY', re: /\btải\s+ngay\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
  { id: 'LINK_DRIVE', re: /\blink\s+drive\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
  { id: 'MAU01', re: /\bMAU0?1\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
  { id: 'CHECKLIST_KW', re: /\bCHECKLIST\b/i, reason: 'CTA content found in title field — move to cta_templates.json' },
  { id: 'EMOJI_CTA', re: /^[\s📂📥]+/u, reason: 'CTA content found in title field — move to cta_templates.json' },
];

/** @param {string[]} whitelist */
export function buildWhitelistLookup(whitelist) {
  const set = new Set();
  for (const term of whitelist || []) {
    const t = String(term || '').trim();
    if (t) set.add(t.toUpperCase());
  }
  return set;
}

/** @param {string} word */
export function stripEdgePunctuation(word) {
  return String(word || '').replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

/** @param {string} title */
export function splitTitleWords(title) {
  return String(title || '').trim().split(/\s+/).filter(Boolean);
}

/** @param {string} title @param {number} wordIndex */
export function isSentenceStart(title, wordIndex) {
  if (wordIndex === 0) return true;
  const before = splitTitleWords(title).slice(0, wordIndex).join(' ');
  return /[.?!]["')\]]?\s*$/.test(before);
}

/** @param {string} core */
export function uppercaseLetters(core) {
  return [...String(core || '')].filter((c) => /\p{Lu}/u.test(c));
}

/**
 * Sentence case (tiếng Việt) — không Title Case / ALL CAPS ngoài whitelist.
 * @param {string} title
 * @param {string[]} whitelist
 */
export function validateTitleCapitalization(title, whitelist = []) {
  const t = String(title || '').trim();
  const reasons = [];
  if (!t) return { pass: true, reasons: [] };

  const lookup = buildWhitelistLookup(whitelist);
  const words = splitTitleWords(t);

  for (let i = 0; i < words.length; i++) {
    const core = stripEdgePunctuation(words[i]);
    if (!core || /^[\d\W]+$/.test(core)) continue;

    if (lookup.has(core.toUpperCase())) continue;

    const uppers = uppercaseLetters(core);
    const atStart = isSentenceStart(t, i);

    if (atStart) {
      if (uppers.length > 1) {
        reasons.push(
          `Word "${core}": ALL CAPS or multiple uppercase at sentence start — use sentence case`,
        );
      } else if (uppers.length === 1 && core[0] !== uppers[0]) {
        reasons.push(`Word "${core}": invalid capitalization at sentence start`);
      }
      continue;
    }

    if (uppers.length >= 2) {
      reasons.push(
        `Word "${core}": English Title Case or ALL CAPS not allowed mid-sentence (use sentence case)`,
      );
    } else if (uppers.length === 1) {
      reasons.push(
        `Word "${core}": unexpected capitalization mid-sentence — only sentence-start or whitelist terms may be uppercase`,
      );
    }
  }

  return { pass: reasons.length === 0, reasons };
}

/** @param {unknown} raw */
export function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return t;
}

/** @param {unknown} llmJson */
export function extractTitleFieldsFromLlm(llmJson) {
  const raw =
    llmJson?.choices?.[0]?.message?.content
    ?? llmJson?.content?.[0]?.text
    ?? llmJson?.message?.content
    ?? llmJson;

  try {
    const parsed = JSON.parse(extractJsonString(raw));
    const title = String(parsed.title || '').trim();
    if (!title) return { ok: false, error: 'MISSING_TITLE' };
    const content_type = String(parsed.content_type || '').trim().toUpperCase() || null;
    const segment = String(parsed.segment || '').trim().toLowerCase() || null;
    return { ok: true, title, content_type, segment, parsed };
  } catch {
    return { ok: false, error: 'TITLE_JSON_EXTRACT_FAIL' };
  }
}

/**
 * @param {string} title
 * @param {{ whitelist?: string[] }} [options]
 * @returns {{ pass: boolean, reasons: string[], capitalization_error?: boolean }}
 */
export function validateTitle(title, options = {}) {
  const t = String(title || '').trim();
  const reasons = [];
  const whitelist = options.whitelist || [];

  if (!t) {
    return { pass: false, reasons: ['EMPTY_TITLE'] };
  }

  if (DRAFT_TAG_RE.test(t)) {
    reasons.push('Draft tag [TEST]/[DRAFT]/[WIP] found in title');
  }

  for (const p of PLACEHOLDER_PATTERNS) {
    if (p.re.test(t)) reasons.push(p.reason);
  }

  for (const p of CTA_PATTERNS) {
    if (p.re.test(t)) reasons.push(p.reason);
  }

  if (reasons.length > 0) {
    return { pass: false, reasons };
  }

  const cap = validateTitleCapitalization(t, whitelist);
  if (!cap.pass) {
    return { pass: false, reasons: cap.reasons, capitalization_error: true };
  }

  return { pass: true, reasons: [] };
}

/** @param {string} contentType @param {object} rulesCfg */
export function getTitleFormulaInstruction(contentType, rulesCfg) {
  const key = CONTENT_TYPES.has(contentType) ? contentType : 'GENERAL_POLICY';
  return rulesCfg.title_formulas?.[key] || rulesCfg.title_formulas?.GENERAL_POLICY || '';
}

/** @param {string} segment @param {object} rulesCfg */
export function segmentToContentType(segment, rulesCfg) {
  const key = String(segment || '').trim().toLowerCase();
  const mapped = rulesCfg.segment_to_content_type?.[key];
  return CONTENT_TYPES.has(mapped) ? mapped : 'GENERAL_POLICY';
}

/** @param {string} text */
export function tokenizeTitle(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 1);
}

/** @param {string} a @param {string} b */
export function jaccardSimilarity(a, b) {
  const A = new Set(tokenizeTitle(a));
  const B = new Set(tokenizeTitle(b));
  if (!A.size && !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter += 1;
  return inter / (A.size + B.size - inter);
}

/**
 * @param {string} title
 * @param {string} contentType
 * @param {Array<{ title: string, normalized_key?: string }>} published
 * @param {number} threshold
 */
export function findTopicDuplicate(title, contentType, published, threshold = 0.7) {
  let best = null;
  let bestScore = 0;

  for (const row of published || []) {
    const score = jaccardSimilarity(title, row.title);
    if (score > bestScore) {
      bestScore = score;
      best = row;
    }
  }

  if (bestScore > threshold && best) {
    return {
      duplicate: true,
      similarity: Number(bestScore.toFixed(3)),
      matched_title: best.title,
      matched_normalized_key: best.normalized_key || null,
      message: `Có thể trùng chủ đề với bài "${best.title}" (similarity=${bestScore.toFixed(2)})`,
    };
  }

  return { duplicate: false, similarity: bestScore ? Number(bestScore.toFixed(3)) : 0 };
}

/**
 * @param {object} params
 */
export function runTitleQaGate({
  llmJson,
  normalized_key = '',
  segment = '',
  publishedByType = {},
  rulesCfg = {},
  whitelist = [],
}) {
  const extracted = extractTitleFieldsFromLlm(llmJson);
  if (!extracted.ok) {
    return {
      title_qa_pass: false,
      qa_status: 'title_rejected',
      title_qa_reason: extracted.error,
      title_qa: {
        normalized_key: String(normalized_key || '').slice(0, 120),
        pass: false,
        reasons: [extracted.error],
      },
    };
  }

  const content_type = CONTENT_TYPES.has(extracted.content_type)
    ? extracted.content_type
    : segmentToContentType(extracted.segment || segment, rulesCfg);

  const validation = validateTitle(extracted.title, {
    whitelist: whitelist.length ? whitelist : rulesCfg.whitelist || [],
  });
  if (!validation.pass) {
    const qa_status = validation.capitalization_error
      ? 'title_capitalization_error'
      : 'title_rejected';
    return {
      title_qa_pass: false,
      qa_status,
      title_qa_reason: validation.reasons.join('; '),
      title_qa: {
        normalized_key: String(normalized_key || '').slice(0, 120),
        title_preview: extracted.title.slice(0, 120),
        content_type,
        pass: false,
        reasons: validation.reasons,
        capitalization_error: Boolean(validation.capitalization_error),
      },
    };
  }

  const threshold = Number(rulesCfg.similarity_threshold ?? 0.7);
  const published = publishedByType[content_type] || [];
  const dup = findTopicDuplicate(extracted.title, content_type, published, threshold);

  const title_qa = {
    normalized_key: String(normalized_key || '').slice(0, 120),
    title_preview: extracted.title.slice(0, 120),
    content_type,
    pass: true,
    reasons: [],
    duplicate_review: dup.duplicate,
    ...(dup.duplicate
      ? {
        similarity: dup.similarity,
        matched_title: dup.matched_title,
        matched_normalized_key: dup.matched_normalized_key,
        duplicate_message: dup.message,
      }
      : { similarity: dup.similarity }),
  };

  return {
    title_qa_pass: true,
    title_qa,
    title_duplicate_review: dup.duplicate,
    extracted_title: extracted.title,
    extracted_content_type: content_type,
  };
}

/**
 * Index content_drafts sheet rows for similarity check.
 * @param {string[][]} rows
 * @param {object} rulesCfg
 */
export function indexPublishedTitles(rows, rulesCfg) {
  const byType = {
    NOXH_LEGAL: [],
    LOAN_FINANCE: [],
    VALUATION: [],
    GENERAL_POLICY: [],
  };

  if (!Array.isArray(rows) || rows.length < 2) return byType;

  const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const idx = {
    title: headers.indexOf('title'),
    status: headers.indexOf('status'),
    meta: headers.indexOf('meta'),
    key: headers.indexOf('source_normalized_key'),
    segment: headers.indexOf('segment'),
  };

  const publishedStatuses = new Set(
    (rulesCfg.published_statuses || ['approved', 'published']).map((s) => s.toLowerCase()),
  );

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;

    const status = String(cells[idx.status] ?? '').trim().toLowerCase();
    if (!publishedStatuses.has(status)) continue;

    const title = String(cells[idx.title] ?? '').trim();
    if (!title) continue;

    let content_type = null;
    try {
      const metaRaw = cells[idx.meta];
      const meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : metaRaw;
      content_type = meta?.content_type || meta?.content_type_router?.content_type || null;
    } catch {
      content_type = null;
    }

    if (!CONTENT_TYPES.has(content_type)) {
      const seg = String(cells[idx.segment] ?? '').trim().toLowerCase();
      content_type = segmentToContentType(seg, rulesCfg);
    }

    byType[content_type].push({
      title,
      normalized_key: String(cells[idx.key] ?? '').slice(0, 120),
    });
  }

  return byType;
}
