/**
 * PHASE 1 — Context Enrichment Layer
 * Rule-classify archive → content_type · cluster · context_summary
 */

import { CONTENT_TYPES } from './disclaimer-selector.mjs';

export const ENRICHMENT_STATUSES = new Set(['ready', 'waiting_for_context']);

/**
 * @param {object} row — { text, segment, score, source?, normalized_key? }
 * @param {object} rules — content_type_rules.json
 */
export function isArchiveRow(row, rules = {}) {
  const source = String(row.source || '').trim().toLowerCase();
  const nk = String(row.normalized_key || '').trim();
  if ((rules.archive_exclude_sources || []).includes(source)) return false;
  for (const prefix of rules.archive_exclude_key_prefixes || []) {
    if (nk.startsWith(prefix)) return false;
  }
  return true;
}

/**
 * @param {string} text
 * @param {object} rules
 */
export function scoreContentTypesByKeywords(text, rules) {
  const lower = String(text || '').normalize('NFC').toLowerCase();
  const scores = Object.fromEntries([...CONTENT_TYPES].map((t) => [t, 0]));

  for (const rule of rules.keyword_rules || []) {
    const type = rule.content_type;
    if (!CONTENT_TYPES.has(type)) continue;
    for (const pat of rule.patterns || []) {
      const p = String(pat).toLowerCase();
      if (lower.includes(p)) {
        scores[type] += Number(rule.weight || 1);
      }
    }
  }
  return scores;
}

/**
 * @param {object} params
 * @param {string} params.text
 * @param {string} params.segment
 * @param {number} params.score
 * @param {object} params.rules
 */
export function ruleClassifyContentType({ text, segment, score, rules }) {
  const segDefault = rules.segment_default?.[String(segment || '').toLowerCase()]
    || 'GENERAL_POLICY';
  const kwScores = scoreContentTypesByKeywords(text, rules);
  const ranked = [...CONTENT_TYPES]
    .map((t) => ({ type: t, score: kwScores[t] || 0 }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const second = ranked[1];
  const band = rules.llm_score_band || { min: 40, max: 59 };
  const segmentScore = Number(score || 0);

  let content_type = segDefault;
  let method = 'segment_default';

  if (top.score > 0 && top.score > (second?.score || 0)) {
    content_type = top.type;
    method = 'keyword_rules';
  } else if (top.score > 0 && top.score === second?.score) {
    content_type = segDefault;
    method = 'segment_tiebreak';
  }

  const ambiguousKeywordTie = top.score > 0 && top.score === second?.score;
  const needs_llm_content_type =
    (segmentScore >= band.min && segmentScore <= band.max)
    && (ambiguousKeywordTie || segment === 'general_inbound' || segment === 'unclassified');

  return {
    content_type,
    classify_method: method,
    keyword_scores: kwScores,
    needs_llm_content_type,
    segment_score: segmentScore,
  };
}

/**
 * @param {Array<object>} posts — rows with content_type assigned
 */
export function clusterByContentType(posts) {
  /** @type {Record<string, object[]>} */
  const clusters = {};
  for (const t of CONTENT_TYPES) clusters[t] = [];
  for (const p of posts) {
    const t = p.content_type;
    if (CONTENT_TYPES.has(t)) clusters[t].push(p);
  }
  return clusters;
}

/**
 * @param {number} count
 * @param {number} minSize
 */
export function clusterEnrichmentStatus(count, minSize = 8) {
  return count >= minSize ? 'ready' : 'waiting_for_context';
}

/**
 * @param {object} params
 * @param {string} params.content_type
 * @param {object[]} params.posts
 * @param {number} params.min_cluster_size
 */
export function buildClusterRecord({ content_type, posts, min_cluster_size = 8 }) {
  const count = posts.length;
  const status = clusterEnrichmentStatus(count, min_cluster_size);
  return {
    content_type,
    status,
    post_count: count,
    sample_post_ids: posts.slice(0, 20).map((p) => p.post_id || p.normalized_key).filter(Boolean),
    context_summary: status === 'ready' ? null : null,
  };
}

/**
 * @param {object} store — context_summaries.json shape
 * @param {string} contentType
 */
export function getContextSummaryForType(store, contentType) {
  const entry = store?.by_content_type?.[contentType];
  if (!entry || entry.status !== 'ready' || !entry.context_summary) return null;
  return entry.context_summary;
}

/**
 * @param {object} store
 * @param {string} contentType
 */
export function getEnrichmentStatus(store, contentType) {
  const entry = store?.by_content_type?.[contentType];
  return entry?.status || 'waiting_for_context';
}

/**
 * Resolve content_type for downstream inject (segment → type map).
 * @param {object} params
 * @param {string} params.segment
 * @param {string} [params.content_type]
 * @param {object} rules
 */
export function resolveEnrichmentContentType({ segment, content_type }, rules) {
  const raw = String(content_type || '').trim().toUpperCase();
  if (CONTENT_TYPES.has(raw)) return raw;
  return rules.segment_default?.[String(segment || '').toLowerCase()] || 'GENERAL_POLICY';
}

/**
 * Build inject payload for Layer B / Agent 3.
 * @param {object} params
 * @param {string} params.segment
 * @param {string} [params.content_type]
 * @param {object} store — context_summaries.json
 * @param {object} rules
 */
export function buildContextEnrichmentPayload({ segment, content_type }, store, rules) {
  const resolved = resolveEnrichmentContentType({ segment, content_type }, rules);
  const summary = getContextSummaryForType(store, resolved);
  const status = getEnrichmentStatus(store, resolved);
  return {
    content_type: resolved,
    context_enrichment_status: summary ? 'ready' : status,
    context_summary: summary,
  };
}

/**
 * @param {object} parsed — LLM JSON for cluster summary
 */
export function normalizeContextSummary(parsed) {
  const pickList = (v) => (Array.isArray(v) ? v : [])
    .map((x) => String(x || '').trim())
    .filter(Boolean)
    .slice(0, 8);
  const raw = parsed || {};
  const top_questions = pickList(
    raw.top_questions || raw.questions || raw.cau_hoi || raw.topQuestions,
  );
  const pains = pickList(raw.pains || raw.pain_points || raw.noi_lo);
  const hook_angles = pickList(raw.hook_angles || raw.hooks || raw.goc_hook).slice(0, 5);
  const audience_voice = String(
    raw.audience_voice || raw.voice || raw.giong_khach || raw.audience_tone || '',
  ).slice(0, 800);
  return { top_questions, pains, audience_voice, hook_angles };
}

export function isContextSummaryUsable(summary) {
  if (!summary) return false;
  const q = (summary.top_questions || []).length;
  const p = (summary.pains || []).length;
  const v = String(summary.audience_voice || '').trim().length;
  return q + p >= 2 || v >= 24;
}

/**
 * Merge cluster LLM results into store.
 * @param {object} store
 * @param {Record<string, object>} clusterRecords
 * @param {number} minSize
 */
export function assembleContextStore(store, clusterRecords, minSize = 5) {
  const next = {
    version: store?.version || 1,
    min_cluster_size: minSize,
    generated_at: new Date().toISOString(),
    generated_by: 'run-context-enrichment.mjs',
    by_content_type: {},
  };

  for (const type of CONTENT_TYPES) {
    const rec = clusterRecords[type] || { post_count: 0, status: 'waiting_for_context' };
    next.by_content_type[type] = {
      status: rec.status,
      post_count: rec.post_count,
      sample_post_ids: rec.sample_post_ids || [],
      context_summary: rec.context_summary || null,
      classify_method_stats: rec.classify_method_stats || null,
    };
  }
  return next;
}
