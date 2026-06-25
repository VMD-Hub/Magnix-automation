// Shared: ElevenLabs direct TTS (eleven_flash_v2_5 + vi) — bypass VPS TTS cũ

const DEFAULT_VI_MODEL_ID = 'eleven_flash_v2_5';
const ACCEPTABLE_MODELS = new Set(['eleven_flash_v2_5', 'eleven_turbo_v2_5']);

function isAcceptableTtsModel(modelId) {
  return ACCEPTABLE_MODELS.has(String(modelId || '').trim());
}

function buildElevenLabsProviderString(voiceId, modelId) {
  const m = modelId || DEFAULT_VI_MODEL_ID;
  const v = String(voiceId || '').trim();
  return `elevenlabs model_id=${m} voice_id=${v} stability=0.5`;
}

/* eslint-disable no-unused-vars -- stripped when inlined to n8n */
if (typeof globalThis !== 'undefined') {
  globalThis.DEFAULT_VI_MODEL_ID = DEFAULT_VI_MODEL_ID;
  globalThis.isAcceptableTtsModel = isAcceptableTtsModel;
  globalThis.buildElevenLabsProviderString = buildElevenLabsProviderString;
}
