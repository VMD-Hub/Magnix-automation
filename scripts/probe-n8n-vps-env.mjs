#!/usr/bin/env node
/**
 * Kiểm tra env n8n trên VPS qua execution gần nhất (không cần SSH).
 * Usage: node scripts/probe-n8n-vps-env.mjs
 */
import { loadEnv } from './lib/magnix-env.mjs';

const PROBES = [
  {
    label: 'Agent 7 (video render)',
    workflowId: 'fLOl48TY0PjMLqGZ',
    extract(json) {
      return json?.env_probe || null;
    },
  },
  {
    label: 'Agent 2 (classify)',
    workflowId: 'AiLMy8w4FCro7DAg',
    extract(json) {
      return { hint: json?.hint, stats: json?.stats };
    },
  },
];

async function lastExecution(base, key, workflowId) {
  const res = await fetch(
    `${base}/api/v1/executions?workflowId=${workflowId}&limit=1&includeData=true`,
    { headers: { 'X-N8N-API-KEY': key } }
  );
  const data = await res.json();
  return data.data?.[0] || null;
}

function summaryJson(ex) {
  const rd = ex?.data?.resultData?.runData || ex?.resultData?.runData || {};
  return rd['Build Summary']?.[0]?.data?.main?.[0]?.[0]?.json || null;
}

async function probeTtsHealth(url) {
  if (!url) return { ok: false, detail: 'MAGNIX_VIDEO_TTS_URL not set locally' };
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/health`, { signal: AbortSignal.timeout(10000) });
    const data = await res.json();
    return {
      ok: Boolean(data.ok),
      model_id: data.elevenlabs_config?.model_id,
      features: data.tts_features,
    };
  } catch (e) {
    return { ok: false, detail: e.message };
  }
}

async function main() {
  const env = loadEnv();
  const base = (env.N8N_PUBLIC_URL || '').replace(/\/$/, '');
  const key = env.N8N_API_KEY || '';
  if (!base || !key) throw new Error('Thiếu N8N_PUBLIC_URL hoặc N8N_API_KEY');

  console.log('=== Probe n8n VPS env ===\n');
  console.log('n8n:', base);

  const localChecks = [
    ['MAGNIX_VIDEO_TTS_URL', env.MAGNIX_VIDEO_TTS_URL],
    ['CONTENT_PAGE_COVER_ENABLED', env.CONTENT_PAGE_COVER_ENABLED ? '(set)' : 'false'],
    ['GEMINI_API_KEY', env.GEMINI_API_KEY || env.GOOGLE_GEMINI_API_KEY ? '(set)' : 'MISSING — Page Cover'],
    ['MAGNIX_WEBHOOK_TOKEN', env.MAGNIX_WEBHOOK_TOKEN ? '(set)' : ''],
    ['DEEPSEEK_API_KEY', env.DEEPSEEK_API_KEY ? '(set)' : 'MISSING — Agent 2 dùng Anthropic fallback'],
    ['ANTHROPIC_API_KEY', env.ANTHROPIC_API_KEY ? '(set)' : 'MISSING'],
    ['PEXELS_API_KEY', env.PEXELS_API_KEY ? '(set)' : 'MISSING'],
    ['CREATOMATE_API_KEY', env.CREATOMATE_API_KEY ? '(set)' : 'MISSING'],
  ];
  console.log('\nLocal .env (template cho VPS):');
  for (const [k, v] of localChecks) console.log(`  ${k}: ${v || 'MISSING'}`);

  const tts = await probeTtsHealth(env.MAGNIX_VIDEO_TTS_URL);
  console.log('\nvideo-tts health:', JSON.stringify(tts));

  console.log('\nLast executions on VPS:');
  let allOk = true;
  for (const p of PROBES) {
    const ex = await lastExecution(base, key, p.workflowId);
    const summary = ex ? summaryJson(ex) : null;
    const probe = summary ? p.extract(summary) : null;
    console.log(`\n${p.label} (${p.workflowId})`);
    console.log(`  last: ${ex?.status || 'none'} @ ${ex?.startedAt || '—'}`);
    if (probe) console.log(`  probe:`, JSON.stringify(probe, null, 2));
    else {
      console.log('  probe: (no Build Summary — chưa chạy hoặc execution cũ)');
      allOk = false;
    }
    if (p.label.startsWith('Agent 7') && probe) {
      if (!probe.has_tts_url || !probe.has_webhook_token) allOk = false;
      if (probe.env_blocked) allOk = false;
    }
  }

  console.log('\n' + (allOk ? '✓ Env VPS có vẻ OK (Agent 7 TTS + token)' : '⚠ Cần deploy env hoặc manual run Agent 7 trên n8n'));
  process.exit(allOk ? 0 : 1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
