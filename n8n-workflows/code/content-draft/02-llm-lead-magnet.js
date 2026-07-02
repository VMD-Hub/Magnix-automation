// n8n Code: LLM lead magnet draft — Anthropic-first cho segment pháp lý L2
// Chỉ format_type=text_post (fb_page_post_image, …) — không viết Reels/carousel.

const CONTEXT_STORE = __CONTEXT_SUMMARIES_JSON__;
const CONTENT_TYPE_RULES = __CONTENT_TYPE_RULES_JSON__;

function resolveEnrichmentContentType(segment, contentType) {
  const types = new Set(['NOXH_LEGAL', 'LOAN_FINANCE', 'VALUATION', 'GENERAL_POLICY']);
  const raw = String(contentType || '').toUpperCase();
  if (types.has(raw)) return raw;
  const map = CONTENT_TYPE_RULES.segment_default || {};
  return map[String(segment || '').toLowerCase()] || 'GENERAL_POLICY';
}

function buildContextEnrichment(segment, contentType) {
  const ct = resolveEnrichmentContentType(segment, contentType);
  const entry = CONTEXT_STORE.by_content_type?.[ct] || {};
  const summary = entry.status === 'ready' ? entry.context_summary : null;
  return {
    content_type: ct,
    context_enrichment_status: summary ? 'ready' : (entry.status || 'waiting_for_context'),
    context_summary: summary,
  };
}

const row = $('Loop Draft Candidates').item?.json || $input.first().json;

const system = `Growth Copywriter Magnix — Value-First Hook.
[/matrix] [/artifacts] [/deconstruct]
Brand voice (bắt buộc):
__BRAND_VOICE_BLOCK__
Canonical facts (bắt buộc — không tự bịa số):
__CANONICAL_FACTS_BLOCK__
Format: __TEXT_POST_FORMAT_HINT__
Chỉ trả JSON hợp lệ, không markdown bọc ngoài:
{"title":"","hook_line":"","segment":"","content_type":"","artifact_markdown":"","source_refs":[],"cta_opt_in":"","disclaimer":"","export_hint":"pdf|excel|both"}
- format_type luôn là text_post — KHÔNG viết script video theo giây
- content_type: NOXH_LEGAL | LOAN_FINANCE | VALUATION | GENERAL_POLICY (theo segment/chủ đề)
- disclaimer: để trống — hệ thống inject template sau Parse
- cta_opt_in: để trống — hệ thống inject CTA theo content_type + channel sau Parse
- title: sentence case tiếng Việt — chỉ hoa chữ đầu câu + từ whitelist (NOXH, DTI, CĐT, TP.HCM…); KHÔNG Title Case từng từ, KHÔNG ALL CAPS; KHÔNG [TEST]/placeholder/CTA trong title
__TITLE_FORMULAS_BLOCK__
- hook_line ≤25 từ
- artifact_markdown: ≥1 bảng Markdown so sánh; H2/H3 là câu hỏi Q&A
- Không cam kết lãi suất cụ thể, không hứa duyệt vay
- Tránh lặp góc đã có trong content_coverage.avoid_recent_titles — chọn angle mới`;

const segment = String(row.segment || 'general_inbound');
const pain = String(row.text || '').slice(0, 2000);
const meta = row.meta_parsed || {};
const legalPack = row.legal_retrieval_pack || meta.legal_retrieval_pack || null;
const assetMap = {
  noxh_income: 'checklist_ho_so_noxh',
  valuation: 'checklist_tham_dinh',
  sme_credit: 'checklist_vay_dn',
  general_inbound: 'checklist_mua_nha',
};
const requiresLegal = ['noxh_income', 'valuation', 'sme_credit'].includes(segment);
const hintType = {
  noxh_income: 'NOXH_LEGAL',
  sme_credit: 'LOAN_FINANCE',
  valuation: 'VALUATION',
  general_inbound: 'GENERAL_POLICY',
}[segment] || 'GENERAL_POLICY';

const workflowData = $getWorkflowStaticData('global');
const coverage = workflowData.content_coverage || { byTopic: {}, recentTitles: [] };
const briefTitle = row.editorial_brief_v1?.editorial_title
  || row.editorial_brief_v1?.one_line_insight
  || pain.slice(0, 300);

const enrichment = buildContextEnrichment(segment, hintType);

const userPayload = JSON.stringify({
  format_type: 'text_post',
  product_format: row.product_type || meta.content_format || 'fb_page_post_image',
  segment,
  pain,
  asset_type: assetMap[segment] || 'checklist',
  angle: 'pain_from_social_listen',
  reference_url_or_text: String(row.post_url || '').slice(0, 500),
  requires_legal_qa: requiresLegal,
  legal_retrieval_pack: legalPack,
  editorial_brief_v1: row.editorial_brief_v1 || meta.editorial_brief_v1 || null,
  interest_key: row.interest_key || '',
  source_normalized_key: row.normalized_key,
  title_content_type_hint: hintType,
  content_type: enrichment.content_type,
  context_enrichment_status: enrichment.context_enrichment_status,
  context_summary: enrichment.context_summary,
  content_pillar: meta.content_pillar || meta.editorial_brief_v1?.content_pillar || null,
  content_coverage: {
    avoid_recent_titles: (coverage.recentTitles || []).slice(0, 10).map((t) => t.title),
    topic_counts: Object.fromEntries(
      Object.entries(coverage.byTopic || {}).map(([k, v]) => [k, v.length]),
    ),
    brief_title_hint: briefTitle,
  },
});

const taskId = requiresLegal ? 'content_draft' : 'content_draft_general';

try {
  const res = await invokeMagnixLlm(this, taskId, {
    system,
    userPayload,
    temperature: 0.4,
    maxTokens: 4096,
    jsonMode: true,
  });
  return [{ json: res }];
} catch (e) {
  return [{ json: { error: true, message: e.message } }];
}
