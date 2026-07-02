// n8n Code: L0 HouseX editorial voice + forbidden

const BANNED_PHRASES = __HOUSEX_BANNED_PATTERNS_JSON__;

const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /đảm bảo.*(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
  /chắc chắn.*(tăng giá|sinh lời)/i,
];

const item = $input.first().json;
if (!item.ok || !item.article) {
  return [{ json: { ...item, l0_pass: false, editorial_pass: false } }];
}

const text = [
  item.article.title,
  item.article.excerpt,
  item.article.body,
  item.article.seo_title,
  item.article.seo_desc,
].join('\n');

const editorialHits = [];
if (/\*\*/.test(text)) editorialHits.push('RAW_MARKDOWN_BOLD');
for (const phrase of BANNED_PHRASES) {
  if (text.toLowerCase().includes(String(phrase).toLowerCase())) {
    editorialHits.push(`BANNED:${phrase}`);
  }
}
if (/→\s*\[/.test(text)) editorialHits.push('ARROW_CTA');

const forbiddenHits = FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);

const pass = editorialHits.length === 0 && forbiddenHits.length === 0;

return [{
  json: {
    ...item,
    l0_pass: pass,
    editorial_pass: editorialHits.length === 0,
    editorial_hits: editorialHits,
    l0_hits: forbiddenHits,
    sheet_status: pass ? 'draft' : 'review',
    qa_tier: pass ? 'L0' : 'L0_FAIL',
  },
}];
