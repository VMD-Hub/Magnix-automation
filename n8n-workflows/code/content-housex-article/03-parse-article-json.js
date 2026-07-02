// n8n Code: parse HouseX article JSON

function extractJsonString(raw) {
  if (raw == null) throw new Error('EMPTY_LLM_OUTPUT');
  const s = typeof raw === 'string' ? raw : JSON.stringify(raw);
  const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : s).trim();
}

const item = $input.first().json;
if (item.error) {
  return [{ json: { ok: false, parse_error: item.llm_error || 'LLM_ERROR', request_id: item.request_id } }];
}

const raw =
  item.llm_raw?.content?.[0]?.text ??
  item.llm_raw?.choices?.[0]?.message?.content ??
  item.llm_raw;

try {
  const parsed = JSON.parse(extractJsonString(raw));
  const required = ['slug', 'title', 'excerpt', 'body'];
  for (const k of required) {
    if (!parsed[k] || !String(parsed[k]).trim()) throw new Error(`MISSING_${k.toUpperCase()}`);
  }
  if (!Array.isArray(parsed.tags)) parsed.tags = [];
  if (!Array.isArray(parsed.project_slugs)) {
    parsed.project_slugs = item.project_slug ? [item.project_slug] : [];
  }
  if (!Array.isArray(parsed.source_refs)) parsed.source_refs = item.source_refs || [];

  return [{
    json: {
      ok: true,
      request_id: item.request_id,
      topic: item.topic,
      segment: item.segment,
      project_slug: item.project_slug,
      run_devil: item.run_devil,
      article: {
        slug: String(parsed.slug).slice(0, 120),
        title: String(parsed.title).slice(0, 500),
        excerpt: String(parsed.excerpt).slice(0, 500),
        body: String(parsed.body).slice(0, 60000),
        seo_title: parsed.seo_title ? String(parsed.seo_title).slice(0, 500) : null,
        seo_desc: parsed.seo_desc ? String(parsed.seo_desc).slice(0, 500) : null,
        tags: parsed.tags.slice(0, 8),
        project_slugs: parsed.project_slugs.slice(0, 5),
        source_refs: parsed.source_refs.slice(0, 12),
      },
      llm_provider: item.llm_provider,
    },
  }];
} catch (e) {
  return [{
    json: {
      ok: false,
      request_id: item.request_id,
      parse_error: e.message,
      raw_preview: String(raw).slice(0, 300),
    },
  }];
}
