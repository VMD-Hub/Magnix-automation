// n8n Code: Hook Completion Gate — sau Content Type Router, trước L0 (text_post / Facebook Page)
// Config baked: __CTA_CONFIG_JSON__

const CTA_CFG = __CTA_CONFIG_JSON__;

function isCommentKeywordCta(text) {
  const t = String(text || '').trim();
  if (!t) return false;
  return /^comment\s+["']?[A-Z0-9_]+["']?/i.test(t)
    || /\bcomment\s+["']?[A-Z0-9_]+["']?\s+(?:để|de)\s/i.test(t);
}

function detectPureCommentBait(draft) {
  const hook = String(draft.hook_line || '').trim();
  const body = String(draft.artifact_markdown || '').trim();
  const cta = String(draft.cta_opt_in || '').trim();
  const paragraphs = [hook, body, cta].join('\n\n').split(/\n+/).map((p) => p.trim()).filter(Boolean);
  if (!paragraphs.length) return { risk_comment_bait_pure: false, reasons: [] };

  const last = paragraphs[paragraphs.length - 1];
  const isClosing = isCommentKeywordCta(last) || (cta && last === cta && isCommentKeywordCta(cta));
  if (!isClosing) return { risk_comment_bait_pure: false, reasons: [] };

  const beforeLast = paragraphs.slice(0, -1).join('\n');
  const hasOpenQuestion = /\?\s*$/.test(beforeLast)
    || /\b(bạn|anh|chị|ai|gì|sao|nào|thế nào|bao nhiêu|liệu|có\s+\S+\s+không)\b/i.test(beforeLast);
  const valueWords = ['checklist', 'bảng excel', 'excel', 'giải pháp', 'tài liệu', 'hồ sơ', 'mẫu', 'file', 'điều kiện', 'thu nhập', 'vay', 'định giá'];
  const lowerBefore = beforeLast.toLowerCase();
  const hasValueContext = valueWords.some((w) => lowerBefore.includes(w));

  if (hasOpenQuestion || hasValueContext) return { risk_comment_bait_pure: false, reasons: [] };
  return {
    risk_comment_bait_pure: true,
    reasons: ['Closing line is comment-keyword CTA only — add open question or value context before CTA'],
  };
}

function checkFacebookTruncation(hookLine) {
  const hook = String(hookLine || '').trim();
  const limit = Number(CTA_CFG.social_mechanics?.facebook_truncation_chars ?? 125);
  if (!hook || hook.length <= limit) return { hook_truncation_risk: false, reasons: [] };

  const preview = hook.slice(0, limit);
  const signals = [/\?/, /\d/, /\b(có|đủ|vượt|mất|nhận|biết|tại\s+sao|vì\s+sao|lương|thu\s+nhập|triệu|tỷ|%|điều\s+kiện|hồ\s+sơ|vay|noxh)\b/i];
  if (signals.some((re) => re.test(preview))) {
    return { hook_truncation_risk: false, reasons: [] };
  }
  return {
    hook_truncation_risk: true,
    reasons: [`hook_line > ${limit} chars and first ${limit} chars lack question/number/key hook signal`],
  };
}

function countCommentUnlockFrequency(index, now) {
  const sm = CTA_CFG.social_mechanics || {};
  const maxWeek = Number(sm.max_comment_unlock_per_week ?? 3);
  const maxDay = Number(sm.max_comment_unlock_per_day ?? 1);
  const nowMs = now.getTime();
  const dayMs = 86400000;
  const weekMs = 7 * dayMs;
  let dayCount = 0;
  let weekCount = 0;

  for (const p of index || []) {
    const t = new Date(p.created_at || '').getTime();
    if (Number.isNaN(t)) continue;
    const age = nowMs - t;
    if (age >= 0 && age <= dayMs) dayCount += 1;
    if (age >= 0 && age <= weekMs) weekCount += 1;
  }

  const flags = [];
  if (weekCount >= maxWeek) flags.push(`COMMENT_UNLOCK_FREQUENCY_WEEK:${weekCount}>=${maxWeek}`);
  if (dayCount >= maxDay) flags.push(`COMMENT_UNLOCK_FREQUENCY_DAY:${dayCount}>=${maxDay}`);

  return {
    risk_comment_unlock_frequency: flags.length > 0,
    frequency_flags: flags,
    comment_unlock_day_count: dayCount,
    comment_unlock_week_count: weekCount,
  };
}

const PLACEHOLDER_HOOK_RE = /chờ\s+biên\s+tập|chờ\s+layer\s+b|placeholder|\{\{|\[TODO\]/i;

const item = $input.first().json;
const source = $('Loop Draft Candidates').item?.json || {};

if (!item.ok || !item.draft) {
  return [{ json: item }];
}

const d = item.draft;
const channel = d.channel || item.content_type_router?.channel || 'facebook';
const hook = String(d.hook_line || '').trim();
const reasons = [];
const flags = [];

if (!hook || PLACEHOLDER_HOOK_RE.test(hook)) {
  const data = $getWorkflowStaticData('global');
  if (!data.a3_stats) data.a3_stats = {};
  data.a3_stats.hook_rejected = (data.a3_stats.hook_rejected || 0) + 1;
  return [{
    json: {
      ...item,
      ok: false,
      hook_qa_pass: false,
      hook_qa_blocked: true,
      qa_status: 'hook_rejected',
      hook_qa_reason: 'hook_line empty or placeholder',
      hook_qa: { pass: false, blocked: true, reasons: ['hook_line empty or placeholder'] },
    },
  }];
}

if (channel === 'facebook') {
  const trunc = checkFacebookTruncation(hook);
  if (trunc.hook_truncation_risk) {
    flags.push('hook_truncation_risk');
    reasons.push(...trunc.reasons);
  }
}

const bait = detectPureCommentBait(d);
if (bait.risk_comment_bait_pure) {
  flags.push('risk_comment_bait_pure');
  reasons.push(...bait.reasons);
}

const data = $getWorkflowStaticData('global');
const freq = countCommentUnlockFrequency(data.comment_unlock_index || [], new Date());
if (freq.risk_comment_unlock_frequency) {
  flags.push('risk_comment_unlock_frequency');
  reasons.push(...freq.frequency_flags);
}

const needsReview = flags.length > 0;
if (needsReview) {
  if (!data.a3_stats) data.a3_stats = {};
  if (flags.includes('risk_comment_bait_pure')) {
    data.a3_stats.hook_comment_bait_review = (data.a3_stats.hook_comment_bait_review || 0) + 1;
  }
  if (flags.includes('hook_truncation_risk')) {
    data.a3_stats.hook_truncation_review = (data.a3_stats.hook_truncation_review || 0) + 1;
  }
  if (flags.includes('risk_comment_unlock_frequency')) {
    data.a3_stats.hook_frequency_review = (data.a3_stats.hook_frequency_review || 0) + 1;
  }
}

const hook_qa = {
  normalized_key: String(source.normalized_key || '').slice(0, 120),
  pass: true,
  blocked: false,
  channel,
  hook_preview: hook.slice(0, 125),
  flags,
  reasons,
  risk_comment_bait_pure: bait.risk_comment_bait_pure,
  risk_comment_unlock_frequency: freq.risk_comment_unlock_frequency,
  hook_truncation_risk: flags.includes('hook_truncation_risk'),
  comment_unlock_day_count: freq.comment_unlock_day_count,
  comment_unlock_week_count: freq.comment_unlock_week_count,
  hashtags: d.hashtags || [],
};

return [{
  json: {
    ...item,
    hook_qa_pass: true,
    hook_qa_blocked: false,
    hook_needs_review: needsReview,
    hook_qa,
    ...(needsReview ? { qa_status: 'hook_review', sheet_status_override: 'review' } : {}),
    draft: {
      ...d,
      format_type: d.format_type || 'text_post',
    },
  },
}];
