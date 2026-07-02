// n8n Code: L2 /devil QA — prompt n8n__content-qa.md

const item = $input.first().json;
const source = $('Loop Draft Candidates').item?.json || {};
const d = item.draft;

const system = `Magnix L2 QA — cổng /devil (luật sư nghiêm). Không viết lại toàn bộ; chỉ verdict + issues.
[/devil]: Sai pháp lý, hứa lãi/giá/duyệt chắc, thiếu disclaimer NOXH/vay/định giá, claim không có trong brief/pack.
Verdict: pass | fail | human_review. Score: 100 − 25×critical − 10×major − 5×minor. score < 75 → fail.
Chỉ trả JSON hợp lệ:
{"verdict":"","score":0,"devil_findings":[],"issues":[{"severity":"critical|major|minor","location":"","fix_suggestion":""}]}`;

const draftContent = [
  d.title,
  d.hook_line,
  d.artifact_markdown,
  d.cta_opt_in,
  d.disclaimer,
].join('\n\n');

const brief = item.editorial_brief_v1 || source.editorial_brief_v1 || null;
const pack = item.l2_legal_pack || source.legal_retrieval_pack || null;

const userPayload = JSON.stringify({
  content_type: 'lead_magnet',
  segment: item.l2_segment || d.segment || source.segment,
  requires_legal_qa: true,
  draft_content: draftContent.slice(0, 12000),
  original_brief: brief,
  legal_retrieval_pack: pack,
  source_refs: d.source_refs || [],
});

try {
  const res = await invokeMagnixLlm(this, 'content_qa', {
    system,
    userPayload,
    temperature: 0.2,
    maxTokens: 2048,
    jsonMode: true,
    taskId: 'content_qa',
  });
  return [{ json: { ...item, l2_llm: res } }];
} catch (e) {
  return [{ json: { ...item, l2_error: true, message: e.message } }];
}
