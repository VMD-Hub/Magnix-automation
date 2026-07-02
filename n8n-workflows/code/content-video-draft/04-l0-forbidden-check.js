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
const isVideoScript = v.format_type === 'video_script';

const outboundText = isVideoScript
  ? [
    v.verbal_hook,
    v.on_screen_text,
    v.verbal_cta,
    v.caption_cta,
    ...(v.body_beats || []).map((b) => b.on_screen_text),
  ].join('\n')
  : [
    v.title,
    v.hook_3s,
    v.caption,
    v.cta_keyword,
    ...(v.on_screen_text || []),
  ].join('\n');

const scriptText = isVideoScript
  ? (v.body_beats || []).map((b) => b.spoken_line).join('\n')
  : String(v.spoken_script || '');

const hits = [];
for (const re of FORBIDDEN) {
  if (re.test(outboundText)) hits.push(re.source);
}
for (const re of FORBIDDEN) {
  if (re.test(scriptText)) hits.push(re.source + ':script');
}

const hookWords = isVideoScript
  ? String(v.verbal_hook || '').trim().split(/\s+/).filter(Boolean).length
  : String(v.hook_3s || '').trim().split(/\s+/).filter(Boolean).length;
if (hookWords > 18) {
  hits.push(isVideoScript ? 'verbal_hook_too_long' : 'hook_3s_too_long');
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
