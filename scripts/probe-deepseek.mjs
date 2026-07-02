#!/usr/bin/env node
import { loadEnv } from './lib/magnix-env.mjs';

async function main() {
  const env = loadEnv();
  const key = env.DEEPSEEK_API_KEY || '';
  console.log('DEEPSEEK_API_KEY', key.length > 12 ? `set (len ${key.length})` : 'MISSING');
  if (key.length <= 12) process.exit(1);

  const url = env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
  const model = env.DEEPSEEK_MODEL || 'deepseek-chat';
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Reply JSON only: {"ok":true}' }],
      max_tokens: 20,
      response_format: { type: 'json_object' },
    }),
  });
  const text = await res.text();
  console.log('probe', res.status, text.slice(0, 250));
  if (!res.ok) process.exit(1);
  console.log('✓ DeepSeek OK');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
