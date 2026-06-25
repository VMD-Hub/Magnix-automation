#!/usr/bin/env node
/**
 * Backfill meta.intake_v1 cho content_queue (rows scrape cũ trước Layer A)
 *
 * Usage:
 *   node scripts/batch-pain-intake-backfill.mjs --dry-run
 *   node scripts/batch-pain-intake-backfill.mjs --limit 20
 *
 * Chạy trên VPS hoặc local — cần DEEPSEEK_API_KEY hoặc ANTHROPIC_API_KEY.
 */
import { extractSystemPrompt } from '../n8n-workflows/code/shared/extract-prompt.mjs';
import { loadEnv, parseArgs, parseMeta } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';
import { parsePainIntake } from './lib/pain-intake-parse.mjs';

const PROMPT_PATH = 'ai-agents-prompts/n8n__pain-intake.md';
const SYSTEM = extractSystemPrompt(PROMPT_PATH);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callLlm(env, row) {
  const userPayload = JSON.stringify({
    platform: row.platform || 'tiktok',
    post_url: row.post_url || '',
    text: String(row.text || '').slice(0, 4000),
    author_id: row.author_id || '',
    engagement: parseMeta(row.meta).engagement || {},
  });

  if (env.DEEPSEEK_API_KEY) {
    const res = await fetch(env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL || 'deepseek-chat',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: userPayload },
        ],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    return data.choices?.[0]?.message?.content;
  }

  if (env.ANTHROPIC_API_KEY) {
    const model = env.ANTHROPIC_MODEL || env.ANTHROPIC_DRAFT_MODEL || 'claude-sonnet-4-6';
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        temperature: 0.2,
        system: SYSTEM,
        messages: [{ role: 'user', content: userPayload }],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    return data.content?.[0]?.text;
  }

  throw new Error('Missing DEEPSEEK_API_KEY or ANTHROPIC_API_KEY');
}

async function main() {
  const env = loadEnv();
  const { flags, opts } = parseArgs();
  const dryRun = flags.has('dry-run');
  const limit = Number(opts.limit || 10);
  const delayMs = Number(opts.delay || 1200);

  const { headers, rows } = rowsToObjects(await fetchTab('content_queue', 'A:O'));
  const candidates = rows.filter((row) => {
    const meta = parseMeta(row.meta);
    if (meta.intake_v1) return false;
    return String(row.text || '').trim().length >= 20;
  });

  console.log(`=== Pain Intake backfill ===`);
  console.log(`Missing intake_v1: ${candidates.length} · limit ${limit} · dry-run=${dryRun}`);

  let ok = 0;
  let fail = 0;

  for (const row of candidates.slice(0, limit)) {
    try {
      const raw = await callLlm(env, row);
      const parsed = parsePainIntake(raw);
      const meta = parseMeta(row.meta);
      meta.intake_v1 = parsed.intake_v1;
      meta.intake_backfill_at = new Date().toISOString();
      meta.intake_backfill = true;

      console.log(`row ${row.sheet_row}: verdict=${parsed.verdict} score=${parsed.score}`);

      if (!dryRun) {
        await updateCell('content_queue', row.sheet_row, 'meta', JSON.stringify(meta), headers);
        await sleep(delayMs);
      }
      ok += 1;
    } catch (e) {
      fail += 1;
      console.error(`row ${row.sheet_row} FAIL: ${e.message}`);
    }
  }

  console.log(`\nDone: ok=${ok} fail=${fail}`);
  if (dryRun) console.log('Chạy lại không --dry-run để ghi Sheet.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
