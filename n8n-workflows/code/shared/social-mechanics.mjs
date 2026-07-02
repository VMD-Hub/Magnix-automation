/**
 * Social Mechanics — comment-bait risk, FB truncation, hashtags (text post / Facebook Page).
 */

export const CONTENT_TYPES = new Set([
  'NOXH_LEGAL',
  'LOAN_FINANCE',
  'VALUATION',
  'GENERAL_POLICY',
]);

const PLACEHOLDER_HOOK_RE = /chờ\s+biên\s+tập|chờ\s+layer\s+b|placeholder|\{\{|\[TODO\]/i;

/** @param {string} tag */
export function normalizeHashtag(tag) {
  const t = String(tag || '').trim();
  if (!t) return '';
  return t.startsWith('#') ? t : `#${t.replace(/^#+/, '')}`;
}

/**
 * Gợi ý 2–3 hashtag theo content_type; loại forbidden viral tags.
 * @param {string} contentType
 * @param {object} ctaCfg
 */
export function buildHashtags(contentType, ctaCfg) {
  const cfg = ctaCfg.hashtags || {};
  const min = Number(cfg.count_min ?? 2);
  const max = Number(cfg.count_max ?? 3);
  const forbidden = new Set(
    (cfg.forbidden || []).map((t) => normalizeHashtag(t).toLowerCase()),
  );
  const key = CONTENT_TYPES.has(contentType) ? contentType : 'GENERAL_POLICY';
  const pool = (cfg[key] || cfg.GENERAL_POLICY || [])
    .map(normalizeHashtag)
    .filter((t) => t && !forbidden.has(t.toLowerCase()));

  const picked = pool.slice(0, max);
  const violations = [];
  if (picked.length < min) {
    violations.push(`HASHTAG_COUNT_LOW:${picked.length}<${min}`);
  }

  return {
    hashtags: picked,
    hashtag_violations: violations,
  };
}

/** @param {string} text */
export function isCommentKeywordCta(text) {
  const t = String(text || '').trim();
  if (!t) return false;
  return /^comment\s+["']?[A-Z0-9_]+["']?/i.test(t)
    || /\bcomment\s+["']?[A-Z0-9_]+["']?\s+(?:để|de)\s/i.test(t);
}

/**
 * Pure comment-bait: câu cuối chỉ là Comment [keyword] để nhận X, không có câu hỏi mở / ngữ cảnh giá trị trước đó.
 * @param {{ hook_line?: string, artifact_markdown?: string, cta_opt_in?: string }} draft
 */
export function detectPureCommentBait(draft, ctaCfg = {}) {
  const hook = String(draft.hook_line || '').trim();
  const body = String(draft.artifact_markdown || '').trim();
  const cta = String(draft.cta_opt_in || '').trim();

  const blocks = [hook, body, cta].filter(Boolean);
  const fullText = blocks.join('\n\n');
  const paragraphs = fullText.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  if (!paragraphs.length) {
    return { risk_comment_bait_pure: false, reasons: [] };
  }

  const last = paragraphs[paragraphs.length - 1];
  const isClosingCommentCta = isCommentKeywordCta(last)
    || (cta && last === cta && isCommentKeywordCta(cta));

  if (!isClosingCommentCta) {
    return { risk_comment_bait_pure: false, reasons: [] };
  }

  const beforeLast = paragraphs.slice(0, -1).join('\n');
  const hasOpenQuestion = /\?\s*$/.test(beforeLast)
    || /\b(bạn|anh|chị|ai|gì|sao|nào|thế nào|bao nhiêu|liệu|có\s+\S+\s+không)\b/i.test(beforeLast);

  const offerNames = Object.values(ctaCfg.offers || {})
    .map((o) => String(o?.document_name || '').toLowerCase())
    .filter(Boolean);
  const valueWords = [
    'checklist', 'bảng excel', 'excel', 'giải pháp', 'tài liệu', 'hồ sơ',
    'mẫu', 'file', 'quy trình', 'điều kiện', 'thu nhập', 'vay', 'định giá',
  ];
  const lowerBefore = beforeLast.toLowerCase();
  const hasValueContext = valueWords.some((w) => lowerBefore.includes(w))
    || offerNames.some((name) => name.length > 8 && lowerBefore.includes(name.slice(0, 20)));

  if (hasOpenQuestion || hasValueContext) {
    return { risk_comment_bait_pure: false, reasons: [] };
  }

  return {
    risk_comment_bait_pure: true,
    reasons: [
      'Closing line is comment-keyword CTA only — add open question or value context before CTA',
    ],
  };
}

/**
 * Facebook mobile feed truncation — hook phải mang giá trị/tò mò trong N ký tự đầu.
 * @param {string} hookLine
 * @param {object} ctaCfg
 */
export function checkFacebookTruncation(hookLine, ctaCfg = {}) {
  const hook = String(hookLine || '').trim();
  const limit = Number(ctaCfg.social_mechanics?.facebook_truncation_chars ?? 125);
  const reasons = [];

  if (!hook) {
    return { hook_truncation_risk: false, reasons: [] };
  }

  if (hook.length <= limit) {
    return { hook_truncation_risk: false, hook_preview_chars: hook.length, reasons: [] };
  }

  const preview = hook.slice(0, limit);
  const valueSignals = [
    /\?/,
    /\d/,
    /\b(có|đủ|vượt|mất|nhận|biết|tại\s+sao|vì\s+sao|lương|thu\s+nhập|triệu|tỷ|%|điều\s+kiện|hồ\s+sơ|vay|noxh)\b/i,
  ];
  const hasSignal = valueSignals.some((re) => re.test(preview));

  if (!hasSignal) {
    reasons.push(
      `hook_line > ${limit} chars and first ${limit} chars lack question/number/key hook signal — move main point earlier`,
    );
    return {
      hook_truncation_risk: true,
      hook_preview_chars: limit,
      hook_total_chars: hook.length,
      reasons,
    };
  }

  return {
    hook_truncation_risk: false,
    hook_preview_chars: limit,
    hook_total_chars: hook.length,
    reasons: [],
  };
}

/**
 * Index rows có comment-to-unlock CTA để đếm tần suất.
 * @param {string[][]} rows — content_drafts sheet
 * @param {object} ctaCfg
 */
export function indexCommentUnlockPosts(rows, ctaCfg = {}) {
  const out = [];
  if (!Array.isArray(rows) || rows.length < 2) return out;

  const sm = ctaCfg.social_mechanics || {};
  const allowedStatuses = new Set(
    (sm.count_statuses || ['draft', 'review', 'approved', 'published']).map((s) => s.toLowerCase()),
  );

  const headers = rows[0].map((x) => String(x ?? '').trim().toLowerCase());
  const idx = {
    cta: headers.indexOf('cta_opt_in'),
    status: headers.indexOf('status'),
    created: headers.indexOf('created_at'),
    key: headers.indexOf('source_normalized_key'),
    meta: headers.indexOf('meta'),
  };

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (!cells?.some((c) => String(c ?? '').trim())) continue;

    const status = String(cells[idx.status] ?? '').trim().toLowerCase();
    if (!allowedStatuses.has(status)) continue;

    const cta = String(cells[idx.cta] ?? '').trim();
    if (!isCommentKeywordCta(cta)) continue;

    let createdAt = String(cells[idx.created] ?? '').trim();
    if (!createdAt && idx.meta >= 0) {
      try {
        const meta = JSON.parse(String(cells[idx.meta] ?? ''));
        createdAt = meta?.created_at || meta?.content_type_router?.created_at || '';
      } catch {
        createdAt = '';
      }
    }

    out.push({
      normalized_key: String(cells[idx.key] ?? '').slice(0, 120),
      created_at: createdAt || null,
      status,
    });
  }

  return out;
}

/**
 * @param {Array<{ created_at?: string|null }>} posts
 * @param {Date} now
 * @param {object} ctaCfg
 */
export function countCommentUnlockFrequency(posts, now = new Date(), ctaCfg = {}) {
  const sm = ctaCfg.social_mechanics || {};
  const maxWeek = Number(sm.max_comment_unlock_per_week ?? 3);
  const maxDay = Number(sm.max_comment_unlock_per_day ?? 1);
  const nowMs = now.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;

  let dayCount = 0;
  let weekCount = 0;

  for (const p of posts || []) {
    const raw = p.created_at;
    if (!raw) continue;
    const t = new Date(raw).getTime();
    if (Number.isNaN(t)) continue;
    const age = nowMs - t;
    if (age >= 0 && age <= dayMs) dayCount += 1;
    if (age >= 0 && age <= weekMs) weekCount += 1;
  }

  const flags = [];
  if (weekCount >= maxWeek) {
    flags.push(`COMMENT_UNLOCK_FREQUENCY_WEEK:${weekCount}>=${maxWeek}`);
  }
  if (dayCount >= maxDay) {
    flags.push(`COMMENT_UNLOCK_FREQUENCY_DAY:${dayCount}>=${maxDay}`);
  }

  return {
    comment_unlock_day_count: dayCount,
    comment_unlock_week_count: weekCount,
    risk_comment_unlock_frequency: flags.length > 0,
    frequency_flags: flags,
    thresholds: { max_per_week: maxWeek, max_per_day: maxDay },
  };
}

/** @param {string} text */
export function isHookPlaceholder(text) {
  const t = String(text || '').trim();
  if (!t) return true;
  return PLACEHOLDER_HOOK_RE.test(t);
}
