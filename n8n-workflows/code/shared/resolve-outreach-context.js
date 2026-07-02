// Shared outreach context — inlined vào Agent 4 LLM node lúc build.
// Tests: tests/resolve-outreach-context.test.mjs

function parseOutreachMeta(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

const WARMTH_TO_CONTEXT = {
  cold: 'cold',
  commented: 'sau_comment',
  sau_comment: 'sau_comment',
  dm_inbound: 'sau_comment',
  dm: 'sau_comment',
  ads_optin: 'sau_comment',
  partner: 'cold',
  follow_up: 'follow_up',
};

function resolveOutreachContext(row) {
  const meta = parseOutreachMeta(row?.meta);
  const warmth = String(meta.outreach_warmth || meta.warmth || 'cold').trim().toLowerCase();
  const contextOverride = String(meta.outreach_context || '').trim().toLowerCase();

  if (contextOverride && ['cold', 'sau_comment', 'follow_up'].includes(contextOverride)) {
    return { warmth, context: contextOverride };
  }

  return { warmth, context: WARMTH_TO_CONTEXT[warmth] || 'cold' };
}

function primaryVariantForContext(context) {
  if (context === 'sau_comment') return 'variant_b_after_engagement';
  if (context === 'follow_up') return 'variant_c_follow_up';
  return 'variant_a_cold';
}
