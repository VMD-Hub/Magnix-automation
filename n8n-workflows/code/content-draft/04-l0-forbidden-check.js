// n8n Code: L0 forbidden regex (lead magnet)

const FORBIDDEN = [
  /cam kết.*duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /đảm bảo.*(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
];

const item = $input.first().json;
if (!item.ok || !item.draft) {
  return [{ json: { ...item, l0_pass: false } }];
}

const text = [
  item.draft.title,
  item.draft.hook_line,
  item.draft.artifact_markdown,
  item.draft.cta_opt_in,
  item.draft.disclaimer,
].join('\n');

const hits = FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);
if (hits.length) {
  return [{
    json: {
      ok: false,
      l0_pass: false,
      l0_hits: hits,
      error: 'L0_FORBIDDEN',
    },
  }];
}

return [{ json: { ...item, l0_pass: true, l0_hits: [] } }];
