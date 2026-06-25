// n8n Code: L0 + L1 outreach checks

const FORBIDDEN = [
  /trong kỷ nguyên số/i,
  /hơn nữa/i,
  /tóm lại/i,
  /cam kết/i,
  /đừng bỏ lỡ/i,
  /rất vui được/i,
];

const item = $input.first().json;
if (!item.ok || !item.outreach) {
  return [{ json: { ...item, l0_pass: false, l1_pass: false } }];
}

const o = item.outreach;
const text = [o.variant_a_cold, o.variant_b_after_engagement, o.variant_c_follow_up].join('\n');

const l0_hits = FORBIDDEN.filter((re) => re.test(text)).map((re) => re.source);
const coldLines = o.variant_a_cold.split(/\n/).filter((l) => l.trim()).length;
const l1_pass = coldLines <= 3 && o.variant_a_cold.length <= 320;

if (l0_hits.length) {
  return [{ json: { ok: false, l0_pass: false, l1_pass, l0_hits, error: 'L0_FORBIDDEN' } }];
}
if (!l1_pass) {
  return [{ json: { ok: false, l0_pass: true, l1_pass: false, error: 'L1_LENGTH' } }];
}

return [{ json: { ...item, l0_pass: true, l1_pass: true, l0_hits: [] } }];
