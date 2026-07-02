// n8n Code: L0 forbidden regex — carousel copy (Agent 3b)

const FORBIDDEN = [
  /(?<!không\s)(?<!\bko\s)cam kết[^.\n]{0,50}duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /100%\s*(thành công|duyệt)/i,
  /inbox ngay[^.\n]{0,40}(mua|đặt cọc)/i,
];

const item = $input.first().json;
if (!item.ok || !item.carousel) {
  return [{ json: { ...item, l0_pass: false } }];
}

const c = item.carousel;
const probe = [
  c.title,
  c.caption,
  ...(c.slides || []).map((s) => `${s.headline}\n${s.body}`),
].join('\n');

const hits = FORBIDDEN.filter((re) => re.test(probe)).map((re) => re.source);
if (hits.length) {
  return [{ json: { ok: false, l0_pass: false, l0_hits: hits, error: 'L0_FORBIDDEN' } }];
}

return [{ json: { ...item, l0_pass: true, l0_hits: [] } }];
