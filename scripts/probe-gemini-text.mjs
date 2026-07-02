#!/usr/bin/env node
import { loadEnv } from './lib/magnix-env.mjs';

async function main() {
  const env = loadEnv();
  const key = env.GEMINI_API_KEY || env.GOOGLE_GEMINI_API_KEY;
  console.log('gemini key', key ? `len ${key.length}` : 'missing');
  if (!key) return;

  const model = env.GEMINI_TEXT_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Reply JSON only: {"ok":true}' }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });
  const text = await res.text();
  console.log(model, res.status, text.slice(0, 500));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
