// n8n Code: parse lead magnet JSON

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

const res = $input.first().json;
const raw =
  res.choices?.[0]?.message?.content ??
  res.content?.[0]?.text ??
  res.message?.content ??
  res;

try {
  const parsed = JSON.parse(extractJsonString(raw));
  const required = ['title', 'hook_line', 'segment', 'artifact_markdown', 'cta_opt_in'];
  for (const k of required) {
    if (!parsed[k] || !String(parsed[k]).trim()) throw new Error(`MISSING_${k.toUpperCase()}`);
  }
  if (!Array.isArray(parsed.source_refs)) parsed.source_refs = [];
  const content_type = String(parsed.content_type || '').trim().toUpperCase();
  return [{
    json: {
      ok: true,
      draft: {
        title: String(parsed.title).slice(0, 500),
        hook_line: String(parsed.hook_line).slice(0, 500),
        segment: String(parsed.segment),
        content_type: content_type || null,
        artifact_markdown: String(parsed.artifact_markdown).slice(0, 45000),
        source_refs: parsed.source_refs.map(String).slice(0, 10),
        cta_opt_in: String(parsed.cta_opt_in).slice(0, 1000),
        disclaimer: String(parsed.disclaimer || '').slice(0, 2000),
        export_hint: String(parsed.export_hint || 'pdf'),
      },
      ...(res.title_qa ? { title_qa: res.title_qa } : {}),
      ...(res.title_duplicate_review ? { title_duplicate_review: res.title_duplicate_review } : {}),
    },
  }];
} catch (e) {
  return [{ json: { ok: false, parse_error: e.message, raw_preview: String(raw).slice(0, 200) } }];
}
