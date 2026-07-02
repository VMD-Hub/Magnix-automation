#!/usr/bin/env node
/**
 * Probe Gemini image API — không in API key.
 * Usage: node scripts/probe-gemini-image.mjs
 */
import { loadEnv } from './lib/magnix-env.mjs';
import { GEMINI_IMAGE_MODELS, resolveGeminiApiKey } from './lib/gemini-env.mjs';

async function tryModel(apiKey, model) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: 'Simple teal square social icon, no text, minimal' }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '1:1' },
      },
    }),
  });
  const data = await res.json().catch(() => ({}));
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const hasImage = parts.some((p) => p.inlineData?.data);
  return {
    model,
    ok: res.ok && hasImage,
    status: res.status,
    error: data?.error?.message || (hasImage ? null : data?.promptFeedback?.blockReason || 'NO_IMAGE'),
    bytes: hasImage ? Buffer.from(parts.find((p) => p.inlineData?.data).inlineData.data, 'base64').length : 0,
  };
}

async function main() {
  const env = loadEnv();
  const { key, source } = resolveGeminiApiKey(env);
  if (!key) {
    console.error('MISSING_GEMINI_API_KEY — chạy: node scripts/sync-gemini-env.mjs');
    process.exit(1);
  }

  console.log('Gemini key:', source, `(${key.length} chars)`);
  const preferred = String(env.GEMINI_IMAGE_MODEL || '').trim();
  const models = preferred ? [preferred, ...GEMINI_IMAGE_MODELS.filter((m) => m !== preferred)] : GEMINI_IMAGE_MODELS;

  let winner = null;
  for (const model of models) {
    process.stdout.write(`  try ${model} ... `);
    const r = await tryModel(key, model);
    console.log(r.ok ? `OK (${r.bytes} bytes)` : `FAIL — ${r.error}`);
    if (r.ok && !winner) winner = r;
  }

  if (!winner) {
    console.error('\nTất cả model fail — kiểm tra quota / billing AI Studio');
    process.exit(1);
  }

  console.log(`\n✓ Dùng model: ${winner.model}`);
  if (preferred && preferred !== winner.model) {
    console.log(`  Gợi ý: đổi GEMINI_IMAGE_MODEL=${winner.model} trong .env`);
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
