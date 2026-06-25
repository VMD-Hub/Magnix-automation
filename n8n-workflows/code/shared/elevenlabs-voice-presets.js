// Shared: ElevenLabs voice_settings theo beat role (hook / brand_outro / body)

const BODY_VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.78,
  style: 0.12,
  use_speaker_boost: true,
  speed: 1.02,
};

const HOOK_VOICE_SETTINGS = {
  stability: 0.28,
  similarity_boost: 0.65,
  style: 0.45,
  use_speaker_boost: true,
  speed: 1.08,
};

const BRAND_MOTIVATE_VOICE_SETTINGS = {
  stability: 0.42,
  similarity_boost: 0.72,
  style: 0.38,
  use_speaker_boost: true,
  speed: 1.05,
};

const BRAND_TAGLINE_VOICE_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.8,
  style: 0.3,
  use_speaker_boost: true,
  speed: 0.96,
};

function prepareHookTtsSpoken(normalized) {
  return prepareHookTtsSegments(normalized).join(' … ');
}

function prepareHookTtsSegments(normalized) {
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

  return [prepareHookTtsSpokenLegacy(t)];
}

function prepareHookTtsSpokenLegacy(normalized) {
  return String(normalized || '')
    .replace(/^Thu nhập\s+/i, '')
    .replace(/^(mười lăm triệu)/i, 'Mười lăm triệu một tháng…')
    .replace(/\bcó đủ điều kiện\b/gi, 'có thật sự đủ')
    .replace(/\s+/g, ' ')
    .trim();
}

function prepareBrandOutroTtsSegments(beat) {
  const b = beat && typeof beat === 'object' ? beat : { spoken: beat };
  const motivate = String(b.spoken_motivate || '').trim();
  const tagline = String(b.spoken_tagline || '').trim();
  if (motivate && tagline) {
    const seg1 = `${motivate.replace(/[.…!?]+$/g, '').trim()}!`;
    return [seg1, tagline];
  }

  const spoken = String(b.spoken || '').trim();
  const tagIdx = spoken.indexOf('Hiện thực hóa');
  if (tagIdx > 0) {
    const seg1 = `${spoken.slice(0, tagIdx).trim().replace(/[.…!?]+$/g, '')}!`;
    return [seg1, spoken.slice(tagIdx).trim()];
  }
  return spoken ? [spoken] : [];
}

function brandOutroSegmentVoiceSettings(segmentIndex) {
  return segmentIndex === 1 ? BRAND_TAGLINE_VOICE_SETTINGS : BRAND_MOTIVATE_VOICE_SETTINGS;
}

function isHookBeat(role, beatIndex) {
  const r = String(role || '').toLowerCase();
  if (r === 'hook') return true;
  if (r && r !== 'hook') return false;
  return Number(beatIndex) === 0;
}

function isBrandOutroBeat(role) {
  return String(role || '').toLowerCase() === 'brand_outro';
}

function resolveElevenLabsVoiceSettings(opts = {}) {
  const { role, beat_index: beatIndex, disable_hook_preset: disableHook } = opts;
  if (!disableHook && isHookBeat(role, beatIndex)) {
    return { ...HOOK_VOICE_SETTINGS, preset: 'hook' };
  }
  if (isBrandOutroBeat(role)) {
    return { ...BRAND_MOTIVATE_VOICE_SETTINGS, preset: 'brand_outro' };
  }
  return { ...BODY_VOICE_SETTINGS, preset: 'body' };
}

/* eslint-disable no-unused-vars -- stripped when inlined to n8n */
if (typeof globalThis !== 'undefined') {
  globalThis.BODY_VOICE_SETTINGS = BODY_VOICE_SETTINGS;
  globalThis.HOOK_VOICE_SETTINGS = HOOK_VOICE_SETTINGS;
  globalThis.BRAND_MOTIVATE_VOICE_SETTINGS = BRAND_MOTIVATE_VOICE_SETTINGS;
  globalThis.BRAND_TAGLINE_VOICE_SETTINGS = BRAND_TAGLINE_VOICE_SETTINGS;
  globalThis.isHookBeat = isHookBeat;
  globalThis.isBrandOutroBeat = isBrandOutroBeat;
  globalThis.resolveElevenLabsVoiceSettings = resolveElevenLabsVoiceSettings;
  globalThis.prepareHookTtsSpoken = prepareHookTtsSpoken;
  globalThis.prepareHookTtsSegments = prepareHookTtsSegments;
  globalThis.prepareBrandOutroTtsSegments = prepareBrandOutroTtsSegments;
  globalThis.brandOutroSegmentVoiceSettings = brandOutroSegmentVoiceSettings;
}
