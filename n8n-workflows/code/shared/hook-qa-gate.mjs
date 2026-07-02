/**
 * Hook Completion Gate — text post (Facebook Page): truncation + comment-bait + placeholder block.
 */

import {
  buildHashtags,
  checkFacebookTruncation,
  countCommentUnlockFrequency,
  detectPureCommentBait,
  isHookPlaceholder,
} from './social-mechanics.mjs';

export { buildHashtags, detectPureCommentBait, checkFacebookTruncation };

/**
 * @param {object} params
 */
export function runHookCompletionGate({
  draft,
  channel = 'facebook',
  ctaCfg = {},
  commentUnlockIndex = [],
  now = new Date(),
}) {
  if (!draft) {
    return {
      hook_qa_pass: false,
      hook_qa_blocked: true,
      qa_status: 'hook_rejected',
      hook_qa_reason: 'NO_DRAFT',
      hook_qa: { pass: false, reasons: ['NO_DRAFT'] },
    };
  }

  const reasons = [];
  const flags = [];
  let blocked = false;

  const hook = String(draft.hook_line || '').trim();
  if (isHookPlaceholder(hook)) {
    blocked = true;
    reasons.push('hook_line is empty or placeholder — regenerate before publish');
  }

  if (blocked) {
    return {
      hook_qa_pass: false,
      hook_qa_blocked: true,
      qa_status: 'hook_rejected',
      hook_qa_reason: reasons.join('; '),
      hook_qa: {
        pass: false,
        blocked: true,
        reasons,
        hook_preview: hook.slice(0, 120),
      },
    };
  }

  if (channel === 'facebook') {
    const trunc = checkFacebookTruncation(hook, ctaCfg);
    if (trunc.hook_truncation_risk) {
      flags.push('hook_truncation_risk');
      reasons.push(...trunc.reasons);
    }
  }

  const bait = detectPureCommentBait(draft, ctaCfg);
  if (bait.risk_comment_bait_pure) {
    flags.push('risk_comment_bait_pure');
    reasons.push(...bait.reasons);
  }

  const freq = countCommentUnlockFrequency(commentUnlockIndex, now, ctaCfg);
  if (freq.risk_comment_unlock_frequency) {
    flags.push('risk_comment_unlock_frequency');
    reasons.push(...freq.frequency_flags);
  }

  const content_type = draft.content_type || 'GENERAL_POLICY';
  const hashtagBuilt = buildHashtags(content_type, ctaCfg);
  if (hashtagBuilt.hashtag_violations.length) {
    flags.push('hashtag_count_low');
  }

  const needsReview = flags.some((f) =>
    f === 'risk_comment_bait_pure'
    || f === 'risk_comment_unlock_frequency'
    || f === 'hook_truncation_risk',
  );

  const hook_qa = {
    pass: true,
    blocked: false,
    hook_preview: hook.slice(0, 120),
    channel,
    flags,
    reasons,
    risk_comment_bait_pure: bait.risk_comment_bait_pure,
    risk_comment_unlock_frequency: freq.risk_comment_unlock_frequency,
    hook_truncation_risk: flags.includes('hook_truncation_risk'),
    comment_unlock_day_count: freq.comment_unlock_day_count,
    comment_unlock_week_count: freq.comment_unlock_week_count,
    hashtags: hashtagBuilt.hashtags,
  };

  return {
    hook_qa_pass: true,
    hook_qa_blocked: false,
    hook_needs_review: needsReview,
    hook_qa,
    draft: {
      ...draft,
      hashtags: hashtagBuilt.hashtags,
      format_type: draft.format_type || 'text_post',
    },
    ...(needsReview ? { qa_status: 'hook_review', sheet_status_override: 'review' } : {}),
  };
}
