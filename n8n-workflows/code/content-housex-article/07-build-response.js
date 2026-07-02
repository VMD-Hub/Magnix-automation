// n8n Code: webhook response summary

const item = $input.first().json;
const article = item.article || $('Merge Sheet Row').first()?.json?.article;

return [{
  json: {
    ok: item.ok !== false,
    workflow: 'content-housex-article',
    request_id: item.request_id,
    slug: article?.slug || null,
    title: article?.title || null,
    sheet_status: item.sheet_status || null,
    qa_tier: item.qa_tier || null,
    editorial_hits: item.editorial_hits || [],
    l0_hits: item.l0_hits || [],
    hint:
      item.sheet_status === 'review'
        ? 'L0 fail — sửa prompt/voice hoặc chạy lại với factsheet rõ hơn'
        : 'Draft trên Sheet housex_articles — cần L3 approve trước publish HouseX',
    finished_at: new Date().toISOString(),
  },
}];
