/**
 * ElevenLabs direct TTS (eleven_flash_v2_5 + language_code vi)
 */
import {
  resolveElevenLabsVoiceSettings,
  prepareHookTtsSegments,
  prepareBrandOutroTtsSegments,
  brandOutroSegmentVoiceSettings,
  isBrandOutroBeat,
} from './elevenlabs-voice-presets.mjs';

export const DEFAULT_VI_MODEL = 'eleven_flash_v2_5';

function concatMp3(buffers) {
  return Buffer.concat(buffers.filter((b) => b?.length));
}

async function callElevenLabs(text, env, voice_settings, modelId) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(env.ELEVENLABS_VOICE_ID)}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      language_code: 'vi',
      apply_text_normalization: 'on',
      voice_settings,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`ELEVENLABS_${res.status}: ${err.slice(0, 200)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) throw new Error('ELEVENLABS_EMPTY_AUDIO');
  return buf;
}

export async function synthesizeElevenLabsMp3(text, env, opts = {}) {
  const apiKey = env.ELEVENLABS_API_KEY || '';
  const voiceId = env.ELEVENLABS_VOICE_ID || '';
  const modelId = env.ELEVENLABS_MODEL_ID || DEFAULT_VI_MODEL;
  if (!apiKey || !voiceId) throw new Error('MISSING_ELEVENLABS_CONFIG');

  const resolved = resolveElevenLabsVoiceSettings({
    role: opts.role,
    beat_index: opts.beat_index,
    disable_hook_preset: opts.disable_hook_preset,
  });
  const { preset, ...voice_settings } = resolved;

  let spoken = String(text || '').trim().slice(0, 800);
  if (!spoken) throw new Error('EMPTY_TEXT');

  if (preset === 'hook') {
    const segments = prepareHookTtsSegments(spoken);
    if (segments.length > 1) {
      const parts = [];
      for (const seg of segments) {
        parts.push(await callElevenLabs(seg.slice(0, 400), env, voice_settings, modelId));
      }
      const buf = concatMp3(parts);
      return {
        buf,
        modelId,
        bytes: buf.length,
        preset,
        segments,
        hook_delivery: 'split_pause_v3',
      };
    }
    spoken = segments[0].slice(0, 800);
  }

  if (preset === 'brand_outro' || isBrandOutroBeat(opts.role)) {
    const beat = {
      spoken,
      spoken_motivate: opts.spoken_motivate,
      spoken_tagline: opts.spoken_tagline,
    };
    const segments = prepareBrandOutroTtsSegments(beat);
    if (segments.length > 1) {
      const parts = [];
      for (let i = 0; i < segments.length; i += 1) {
        parts.push(
          await callElevenLabs(
            segments[i].slice(0, 400),
            env,
            brandOutroSegmentVoiceSettings(i),
            modelId
          )
        );
      }
      const buf = concatMp3(parts);
      return {
        buf,
        modelId,
        bytes: buf.length,
        preset: 'brand_outro',
        segments,
        hook_delivery: 'brand_split_v1',
      };
    }
  }

  const buf = await callElevenLabs(spoken, env, voice_settings, modelId);
  return { buf, modelId, bytes: buf.length, preset };
}

export function estimateMp3DurationSec(bytes) {
  const n = Number(bytes) || 0;
  if (n < 200) return 0;
  return Math.max(0.3, (n - 256) / 16000);
}
