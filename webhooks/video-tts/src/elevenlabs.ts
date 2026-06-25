const API = 'https://api.elevenlabs.io/v1';

/** eleven_multilingual_v2 không hỗ trợ tiếng Việt — dùng flash v2.5 */
export const DEFAULT_VI_MODEL_ID = 'eleven_flash_v2_5';

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

function prepareHookTtsSpokenLegacy(normalized: string): string {
  return String(normalized || '')
    .replace(/^Thu nhập\s+/i, '')
    .replace(/^(mười lăm triệu)/i, 'Mười lăm triệu một tháng…')
    .replace(/^(mười\s*triệu)/i, 'Mười triệu một tháng…')
    .replace(/\bcó đủ điều kiện\b/gi, 'có thật sự đủ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function prepareHookTtsSegments(normalized: string): string[] {
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

export function prepareBrandOutroTtsSegments(beat: {
  spoken?: string;
  spoken_motivate?: string;
  spoken_tagline?: string;
}): string[] {
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

function brandOutroSegmentVoiceSettings(segmentIndex: number) {
  return segmentIndex === 1 ? BRAND_TAGLINE_VOICE_SETTINGS : BRAND_MOTIVATE_VOICE_SETTINGS;
}

function isHookBeat(role?: string, beatIndex?: number): boolean {
  const r = String(role || '').toLowerCase();
  if (r === 'hook') return true;
  if (r && r !== 'hook') return false;
  return Number(beatIndex) === 0;
}

function isBrandOutroBeat(role?: string): boolean {
  return String(role || '').toLowerCase() === 'brand_outro';
}

export function resolveVoiceSettings(opts: {
  role?: string;
  beatIndex?: number;
  disableHookPreset?: boolean;
}): typeof BODY_VOICE_SETTINGS & { preset: 'hook' | 'body' | 'brand_outro' } {
  if (!opts.disableHookPreset && isHookBeat(opts.role, opts.beatIndex)) {
    return { ...HOOK_VOICE_SETTINGS, preset: 'hook' };
  }
  if (isBrandOutroBeat(opts.role)) {
    return { ...BRAND_MOTIVATE_VOICE_SETTINGS, preset: 'brand_outro' };
  }
  return { ...BODY_VOICE_SETTINGS, preset: 'body' };
}

function concatMp3(buffers: Buffer[]): Buffer {
  return Buffer.concat(buffers.filter((b) => b?.length));
}

async function callElevenLabs(
  text: string,
  opts: SynthesizeOpts,
  voice_settings: Omit<ReturnType<typeof resolveVoiceSettings>, 'preset'>,
): Promise<Buffer> {
  const url = `${API}/text-to-speech/${encodeURIComponent(opts.voiceId)}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': opts.apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: opts.modelId || DEFAULT_VI_MODEL_ID,
      language_code: opts.languageCode || 'vi',
      apply_text_normalization: 'on',
      voice_settings,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`ELEVENLABS_${res.status}: ${errText.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) throw new Error('ELEVENLABS_EMPTY_AUDIO');
  return buf;
}

export type SynthesizeOpts = {
  apiKey: string;
  voiceId: string;
  modelId: string;
  text: string;
  languageCode?: string;
  role?: string;
  beatIndex?: number;
  disableHookPreset?: boolean;
  spokenMotivate?: string;
  spokenTagline?: string;
};

export type SynthesizeResult = {
  buffer: Buffer;
  preset: 'hook' | 'body' | 'brand_outro';
  segments?: string[];
  hookDelivery?: string;
};

export async function synthesizeMp3(opts: SynthesizeOpts): Promise<Buffer> {
  const result = await synthesizeMp3WithMeta(opts);
  return result.buffer;
}

export async function synthesizeMp3WithMeta(opts: SynthesizeOpts): Promise<SynthesizeResult> {
  const voiceSettings = resolveVoiceSettings({
    role: opts.role,
    beatIndex: opts.beatIndex,
    disableHookPreset: opts.disableHookPreset,
  });
  const { preset, ...voice_settings } = voiceSettings;

  const raw = opts.text.trim();
  if (!raw) throw new Error('EMPTY_TEXT');

  if (preset === 'hook') {
    const segments = prepareHookTtsSegments(raw);
    if (segments.length > 1) {
      const parts: Buffer[] = [];
      for (const seg of segments) {
        parts.push(await callElevenLabs(seg.slice(0, 400), opts, voice_settings));
      }
      return {
        buffer: concatMp3(parts),
        preset,
        segments,
        hookDelivery: 'split_pause_v3',
      };
    }
    const buffer = await callElevenLabs(segments[0].slice(0, 800), opts, voice_settings);
    return { buffer, preset, segments };
  }

  if (preset === 'brand_outro') {
    const segments = prepareBrandOutroTtsSegments({
      spoken: raw,
      spoken_motivate: opts.spokenMotivate,
      spoken_tagline: opts.spokenTagline,
    });
    if (segments.length > 1) {
      const parts: Buffer[] = [];
      for (let i = 0; i < segments.length; i += 1) {
        parts.push(await callElevenLabs(segments[i].slice(0, 400), opts, brandOutroSegmentVoiceSettings(i)));
      }
      return {
        buffer: concatMp3(parts),
        preset,
        segments,
        hookDelivery: 'brand_split_v1',
      };
    }
  }

  const buffer = await callElevenLabs(raw.slice(0, 800), opts, voice_settings);
  return { buffer, preset };
}

export function estimateMp3DurationSec(buf: Buffer): number {
  let offset = 0;
  if (buf.length >= 10 && buf.toString('ascii', 0, 3) === 'ID3') {
    const tagSize =
      ((buf[6] & 0x7f) << 21) |
      ((buf[7] & 0x7f) << 14) |
      ((buf[8] & 0x7f) << 7) |
      (buf[9] & 0x7f);
    offset = 10 + tagSize;
  }
  const audioBytes = Math.max(0, buf.length - offset);
  return Math.max(0.3, audioBytes / 16000);
}
