// n8n Code: L0 forbidden regex + video structure (Agent 6)
// Chỉ quét copy Magnix (hook/caption/on-screen) — không quét beats JSON (pain quote từ FB).

const FORBIDDEN = [
  /(?<!không\s)(?<!\bko\s)cam kết[^.\n]{0,50}duyệt/i,
  /lãi suất\s*\d+([.,]\d+)?\s*%/i,
  /(?<!không\s)(?<!\bko\s)đảm bảo[^.\n]{0,50}(vay|duyệt)/i,
  /100%\s*(thành công|duyệt)/i,
  /inbox ngay[^.\n]{0,40}(mua|đặt cọc)/i,
];

const item = $input.first().json;
if (!item.ok || !item.video) {
  return [{ json: { ...item, l0_pass: false } }];
}

const v = item.video;
// Outbound copy — Magnix chịu trách nhiệm compliance
const outboundText = [
  v.title,
  v.hook_3s,
  v.caption,
  v.cta_keyword,
  ...(v.on_screen_text || []),
].join('\n');

// Teleprompter — cho phép dẫn pain/FAQ, vẫn chặn hứa hẹn (không có "không" phía trước)
const scriptText = String(v.spoken_script || '');

const hits = [];
for (const re of FORBIDDEN) {
  if (re.test(outboundText)) hits.push(re.source);
}
for (const re of FORBIDDEN) {
  if (re.test(scriptText)) hits.push(re.source + ':script');
}

const hookWords = String(v.hook_3s || '').trim().split(/\s+/).filter(Boolean).length;
if (hookWords > 18) {
  hits.push('hook_3s_too_long');
}

if (hits.length) {
  return [{
    json: {
      ok: false,
      l0_pass: false,
      l0_hits: [...new Set(hits)],
      error: 'L0_FORBIDDEN',
    },
  }];
}

return [{ json: { ...item, l0_pass: true, l0_hits: [] } }];
