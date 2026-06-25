/** ElevenLabs voice_settings — hook / brand_outro / body */

export const BODY_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.78,
  style: 0.12,
  use_speaker_boost: true,
  speed: 1.02,
};

/** Hook: biểu cảm + speed vừa (ngắt câu quan trọng hơn tăng tốc) */
export const HOOK_VOICE_SETTINGS = {
  stability: 0.28,
  similarity_boost: 0.65,
  style: 0.45,
  use_speaker_boost: true,
  speed: 1.08,
};

/** Brand khích lệ — năng lượng vừa, kêu gọi hành động */
export const BRAND_MOTIVATE_VOICE_SETTINGS = {
  stability: 0.42,
  similarity_boost: 0.72,
  style: 0.38,
  use_speaker_boost: true,
  speed: 1.05,
};

/** Brand tagline — chậm, ấm, chốt cảm xúc */
export const BRAND_TAGLINE_VOICE_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.8,
  style: 0.3,
  use_speaker_boost: true,
  speed: 0.96,
};

export function isHookBeat(role, beatIndex) {
  const r = String(role || '').toLowerCase();
  if (r === 'hook') return true;
  if (r && r !== 'hook') return false;
  return Number(beatIndex) === 0;
}

export function isBrandOutroBeat(role) {
  return String(role || '').toLowerCase() === 'brand_outro';
}

/**
 * Hook 2 cụm + ngắt câu (TTS riêng từng cụm rồi ghép MP3):
 * 1) "Thu nhập … triệu!" — nhấn cuối cụm thu nhập
 * 2) "Liệu có đủ … xã hội, khooông?" — nhấn không cuối hook
 */
export function prepareHookTtsSegments(normalized) {
  const t = String(normalized || '').trim();
  const incomeMatch = t.match(/^Thu nhập\s+(.+?\btriệu\b)/i);

  if (incomeMatch) {
    const seg1 = `Thu nhập ${incomeMatch[1]}!`;
    let seg2 = t.slice(incomeMatch[0].length).trim();
    seg2 = seg2.replace(/^có đủ điều kiện\b/i, 'Liệu có đủ điều kiện');
    if (!/^Liệu\b/i.test(seg2)) {
      seg2 = seg2.replace(/^có\b/i, 'Liệu có');
    }
    seg2 = seg2.replace(/\s+không\s*\?$/i, ', khooông?');
    if (!/\?\s*$/.test(seg2)) seg2 = `${seg2}?`;
    return [seg1, seg2];
  }

  return [String(normalized || '').trim()];
}

export function prepareHookTtsSpoken(normalized) {
  return prepareHookTtsSegments(normalized).join(' … ');
}

/** Brand outro: khích lệ! + tagline ấm (2 cụm TTS) */
export function prepareBrandOutroTtsSegments(beat = {}) {
  const motivate = String(beat.spoken_motivate || '').trim();
  const tagline = String(beat.spoken_tagline || '').trim();
  if (motivate && tagline) {
    const seg1 = `${motivate.replace(/[.…!?]+$/g, '').trim()}!`;
    return [seg1, tagline];
  }

  const spoken = String(beat.spoken || '').trim();
  const tagIdx = spoken.indexOf('Hiện thực hóa');
  if (tagIdx > 0) {
    const seg1 = `${spoken.slice(0, tagIdx).trim().replace(/[.…!?]+$/g, '')}!`;
    return [seg1, spoken.slice(tagIdx).trim()];
  }
  return spoken ? [spoken] : [];
}

export function resolveElevenLabsVoiceSettings(opts = {}) {
  const { role, beat_index: beatIndex, disable_hook_preset: disableHook } = opts;
  if (!disableHook && isHookBeat(role, beatIndex)) {
    return { ...HOOK_VOICE_SETTINGS, preset: 'hook' };
  }
  if (isBrandOutroBeat(role)) {
    return { ...BRAND_MOTIVATE_VOICE_SETTINGS, preset: 'brand_outro' };
  }
  return { ...BODY_VOICE_SETTINGS, preset: 'body' };
}

export function brandOutroSegmentVoiceSettings(segmentIndex) {
  return segmentIndex === 1 ? BRAND_TAGLINE_VOICE_SETTINGS : BRAND_MOTIVATE_VOICE_SETTINGS;
}
