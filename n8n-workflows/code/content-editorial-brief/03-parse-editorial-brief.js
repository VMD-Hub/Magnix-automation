// n8n Code: parse editorial brief JSON (Layer B)

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let t = (fenced ? fenced[1] : s).trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return t;
}

function parseJsonLoose(text) {
  const attempts = [
    text,
    text.replace(/[\u201C\u201D\u2018\u2019]/g, '"'),
    text.replace(/,\s*([}\]])/g, '$1'),
  ];
  let lastErr;
  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('JSON_PARSE_FAIL');
}

const row = $('Loop Brief Candidates').item?.json || {};
const res = $input.first().json;
const raw =
  res.choices?.[0]?.message?.content ??
  res.content?.[0]?.text ??
  res.message?.content ??
  res;

try {
  const parsed = parseJsonLoose(extractJsonString(raw));
  if (!parsed.editorial_title || !String(parsed.editorial_title).trim()) {
    throw new Error('MISSING_EDITORIAL_TITLE');
  }
  if (!Array.isArray(parsed.qa_backbone) || parsed.qa_backbone.length < 2) {
    throw new Error('INSUFFICIENT_QA_BACKBONE');
  }

  const qa = parsed.qa_backbone.slice(0, 5).map((q) => ({
    question: String(q.question || '').slice(0, 300),
    answer_angle: String(q.answer_angle || '').slice(0, 500),
    search_keyword: String(q.search_keyword || '').slice(0, 120),
    hook_line: String(q.hook_line || '').slice(0, 120),
  }));

  const brief = {
    brief_version: Number(parsed.brief_version || 1),
    editorial_title: String(parsed.editorial_title).slice(0, 80),
    one_line_insight: String(parsed.one_line_insight || '').slice(0, 500),
    qa_backbone: qa,
    recommended_formats: Array.isArray(parsed.recommended_formats)
      ? parsed.recommended_formats.slice(0, 4)
      : [],
    deconstruct_rules: Array.isArray(parsed.deconstruct_rules)
      ? parsed.deconstruct_rules.map(String).slice(0, 8)
      : [],
    cta_keyword: String(parsed.cta_keyword || 'CHECKLIST').slice(0, 40),
    compliance_notes: String(parsed.compliance_notes || '').slice(0, 1000),
    source_refs: Array.isArray(parsed.source_refs)
      ? parsed.source_refs.map(String).slice(0, 5)
      : [String(row.normalized_key || '')],
    interest_key: String(parsed.interest_key || row.interest_key || 'unknown')
      .slice(0, 80)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_'),
    created_at: new Date().toISOString(),
  };

  const legalPack = row.legal_retrieval_pack || null;
  if (legalPack) {
    brief.legal_retrieval_pack = legalPack;
    brief.legal_topic = row.legal_topic || null;
  }
  if (row.legal_gate?.needs_human_legal_source) {
    brief.compliance_notes = `${brief.compliance_notes || ''} [LEGAL_GATE: needs_human_legal_source]`.trim();
  }

  return [{
    json: {
      ok: true,
      sheet_row: row.sheet_row,
      normalized_key: row.normalized_key,
      editorial_brief_v1: brief,
      interest_key: brief.interest_key,
      existing_meta: row.meta_parsed || {},
      legal_retrieval_pack: legalPack,
      legal_gate: row.legal_gate || null,
    },
  }];
} catch (e) {
  return [{ json: { ok: false, parse_error: e.message, sheet_row: row.sheet_row } }];
}
