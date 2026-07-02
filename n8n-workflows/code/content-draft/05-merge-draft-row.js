// n8n Code: merge draft row + mark queue (L0 + L2 metadata)

const source = $('Loop Draft Candidates').item?.json || {};
const item = $input.first().json;

if (!item.draft && !item.ok) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', sheet_row: source.sheet_row } }];
}

const d = item.draft;
if (!d) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', sheet_row: source.sheet_row } }];
}

const l2 = item.l2_qa || null;
const l2Skipped = item.l2_skipped === true;

let sheetStatus = 'draft';
let qaTier = 'L0';

if (l2) {
  qaTier = 'L2';
  if (l2.verdict === 'fail' || l2.verdict === 'human_review') {
    sheetStatus = 'review';
  }
} else if (!l2Skipped) {
  qaTier = 'L0';
}

const metaObj = {
  source_refs: d.source_refs,
  l0_hits: item.l0_hits || [],
  agent: 'agent-3',
  source_post_url: source.post_url,
  created_at: new Date().toISOString(),
};

if (item.disclaimer_injection) {
  metaObj.disclaimer_injection = item.disclaimer_injection;
  metaObj.content_type = item.disclaimer_injection.content_type;
}
if (item.content_type_router) {
  metaObj.content_type_router = item.content_type_router;
  metaObj.channel = item.content_type_router.channel;
  metaObj.cta_keyword = item.content_type_router.cta_keyword;
  if (!metaObj.content_type) metaObj.content_type = item.content_type_router.content_type;
}
if (d.content_type) metaObj.content_type = d.content_type;
if (item.disclaimer_injection?.requires_legal_review) {
  metaObj.requires_legal_review = true;
}

if (item.title_qa) {
  metaObj.title_qa = item.title_qa;
}
if (item.title_duplicate_review) {
  sheetStatus = 'review';
  metaObj.title_duplicate_review = true;
  metaObj.qa_status = 'title_duplicate_review';
}
if (item.hook_qa) {
  metaObj.hook_qa = item.hook_qa;
  metaObj.format_type = d.format_type || 'text_post';
}
if (item.hook_needs_review || item.qa_status === 'hook_review') {
  sheetStatus = 'review';
  metaObj.qa_status = item.qa_status || 'hook_review';
}
if (item.sheet_status_override) {
  sheetStatus = item.sheet_status_override;
}
if (Array.isArray(d.hashtags) && d.hashtags.length) {
  metaObj.hashtags = d.hashtags;
}

const workflowData = $getWorkflowStaticData('global');
const coverage = workflowData.content_coverage || { byTopic: {} };
const titleTopics = [];
const topicRes = [
  { id: 'dti', re: /\b(dti|dòng\s+tiền|room\s+vay)\b/i },
  { id: 'noxh_income', re: /\b(lương|thu\s+nhập|triệu|đủ\s+điều\s+kiện)\b/i },
  { id: 'noxh_profile', re: /\b(hồ\s+sơ|mẫu\s*01|photo)\b/i },
];
for (const p of topicRes) {
  if (p.re.test(String(d.title || ''))) titleTopics.push(p.id);
}
const coverageOverlaps = titleTopics
  .filter((t) => (coverage.byTopic?.[t] || []).length >= 2)
  .map((t) => ({ topic: t, count: coverage.byTopic[t].length }));
if (coverageOverlaps.length) {
  sheetStatus = 'review';
  metaObj.content_coverage_review = true;
  metaObj.coverage_overlaps = coverageOverlaps;
  if (!metaObj.qa_status) metaObj.qa_status = 'content_coverage_review';
}

if (l2) {
  metaObj.l2_qa = l2;
  metaObj.l2_verdict = l2.verdict;
  metaObj.l2_score = l2.score;
  if (l2.verdict === 'fail') metaObj.l2_blocked = true;
  if (l2.verdict === 'human_review') metaObj.l2_human_review = true;
}

const meta = JSON.stringify(metaObj).slice(0, 50000);

return [{
  json: {
    ok: true,
    source_normalized_key: source.normalized_key,
    queue_sheet_row: source.sheet_row,
    sheet_status: sheetStatus,
    l2_verdict: l2?.verdict || null,
    append_row: [
      String(source.normalized_key || ''),
      String(source.post_id || ''),
      String(d.segment || source.segment || ''),
      d.title,
      d.hook_line,
      d.artifact_markdown,
      d.cta_opt_in,
      d.disclaimer,
      d.export_hint,
      sheetStatus,
      qaTier,
      new Date().toISOString(),
      'agent3_lead_magnet',
      meta,
    ],
    queue_meta_patch: {
      draft_created: true,
      draft_status: sheetStatus,
      draft_title: d.title,
      draft_at: new Date().toISOString(),
      ...(item.title_qa ? { title_qa: item.title_qa } : {}),
      ...(item.title_duplicate_review ? { qa_status: 'title_duplicate_review' } : {}),
      ...(item.hook_qa ? { hook_qa: item.hook_qa } : {}),
      ...(item.hook_needs_review ? { qa_status: 'hook_review' } : {}),
      ...(metaObj.content_coverage_review ? { qa_status: 'content_coverage_review' } : {}),
      ...(l2 ? { l2_verdict: l2.verdict, l2_score: l2.score } : {}),
    },
  },
}];
