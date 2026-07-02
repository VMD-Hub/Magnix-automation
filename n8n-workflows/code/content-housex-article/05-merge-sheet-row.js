// n8n Code: merge row for housex_articles sheet

const item = $input.first().json;
if (!item.ok || !item.article) {
  return [{ json: { ok: false, error: 'MERGE_SKIP', request_id: item.request_id } }];
}

const a = item.article;
const meta = {
  topic: item.topic,
  segment: item.segment,
  project_slug: item.project_slug,
  editorial_hits: item.editorial_hits || [],
  l0_hits: item.l0_hits || [],
  llm_provider: item.llm_provider,
  created_at: new Date().toISOString(),
  pipeline: 'housex-website-article-pr',
  l3_required: true,
};

return [{
  json: {
    ok: true,
    request_id: item.request_id,
    sheet_status: item.sheet_status || 'draft',
    qa_tier: item.qa_tier || 'L0',
    append_row: [
      item.request_id,
      a.slug,
      a.title,
      a.excerpt,
      a.body,
      a.seo_title || '',
      a.seo_desc || '',
      JSON.stringify(a.tags),
      JSON.stringify(a.project_slugs),
      item.sheet_status || 'draft',
      item.qa_tier || 'L0',
      new Date().toISOString(),
      'n8n_housex_article',
      JSON.stringify(meta),
    ],
    article: a,
    meta,
  },
}];
