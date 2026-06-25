#!/usr/bin/env node
/** Smoke test Agent 7 stack: TTS → audio URL → Creatomate MP4 payload */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadBuildSource() {
  const sharedPath = path.join(root, 'n8n-workflows/code/shared/beats-to-creatomate-source.js');
  const code = fs.readFileSync(sharedPath, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.buildCreatomateSourceFromBeats;
}

async function main() {
  const env = loadEnv();
  const tts = (env.MAGNIX_VIDEO_TTS_URL || 'http://103.57.221.93:8765').replace(/\/$/, '');
  const token = env.MAGNIX_WEBHOOK_TOKEN || '';
  const cmKey = env.CREATOMATE_API_KEY || '';

  console.log('=== Agent 7 smoke test ===\n');

  // 1) n8n workflow version
  const base = (env.N8N_PUBLIC_URL || '').replace(/\/$/, '');
  const wf = await fetch(`${base}/api/v1/workflows/fLOl48TY0PjMLqGZ`, {
    headers: { 'X-N8N-API-KEY': env.N8N_API_KEY },
  }).then((r) => r.json());
  const buildCode = wf.nodes?.find((n) => n.name === 'Build Creatomate Payload')?.parameters?.jsCode || '';
  const flatOk = buildCode.includes('...renderSource') && buildCode.includes("output_format: 'mp4'");
  const wrappedBad = buildCode.includes('source: renderSource');
  console.log('n8n flat MP4 payload:', flatOk ? 'OK' : 'FAIL');
  console.log('n8n wrapped source bug:', wrappedBad ? 'YES (bad)' : 'no');

  const execs = await fetch(`${base}/api/v1/executions?workflowId=fLOl48TY0PjMLqGZ&limit=3`, {
    headers: { 'X-N8N-API-KEY': env.N8N_API_KEY },
  }).then((r) => r.json());
  console.log('\nRecent n8n executions:');
  for (const e of execs.data || []) {
    console.log(`  ${e.id} ${e.status} ${e.startedAt}`);
  }

  // 2) TTS
  const health = await fetch(`${tts}/health`).then((r) => r.json()).catch((e) => ({ err: e.message }));
  console.log('\nTTS health:', health);

  const batch = await fetch(`${tts}/magnix/video-tts/batch`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: `smoke-${Date.now()}`,
      beats: [{ beat_index: 0, spoken: 'Xin chào, đây là test Agent 7 có âm thanh.' }],
    }),
  }).then((r) => r.json());
  console.log('TTS batch:', batch.ok ? 'OK' : 'FAIL', batch.errors || batch.error || '');
  const audioUrl = batch.tracks?.[0]?.audio_url;
  if (!audioUrl) {
    console.error('No audio URL — stop');
    process.exit(1);
  }
  console.log('Audio URL:', audioUrl);

  const audioHead = await fetch(audioUrl, { method: 'HEAD' })
    .then((r) => ({ status: r.status, type: r.headers.get('content-type') }))
    .catch((e) => ({ err: e.message }));
  console.log('Audio reachable:', audioHead);

  // 3) Creatomate minimal MP4 with audio
  if (!cmKey) {
    console.log('\nSkip Creatomate — no CREATOMATE_API_KEY');
    return;
  }

  const buildCreatomateSourceFromBeats = loadBuildSource();
  const beats = [
    {
      start_sec: 0,
      end_sec: 5,
      role: 'hook',
      spoken: 'Xin chào test Agent 7',
      on_screen: 'Test Agent 7',
      visual_spec: { fallback_color: '#0f172a' },
    },
  ];
  const renderSource = buildCreatomateSourceFromBeats({
    beats,
    duration_sec: 5,
    segment: 'noxh_income',
    title: 'Smoke test',
    cta_keyword: 'TEST',
    sceneMedia: [{ videoUrl: null, audioUrl }],
    useCreatomateVoice: false,
  });
  const payload = { ...renderSource, output_format: 'mp4' };

  console.log('\nCreatomate POST (minimal 5s + ElevenLabs audio)...');
  const create = await fetch('https://api.creatomate.com/v2/renders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cmKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

  const first = Array.isArray(create) ? create[0] : create;
  const renderId = first?.id;
  console.log('Render id:', renderId, 'status:', first?.status, 'format:', first?.output_format);

  if (!renderId) {
    console.log('Creatomate error:', JSON.stringify(create).slice(0, 500));
    process.exit(1);
  }

  for (let i = 0; i < 20; i += 1) {
    await new Promise((r) => setTimeout(r, 8000));
    const poll = await fetch(`https://api.creatomate.com/v2/renders/${renderId}`, {
      headers: { Authorization: `Bearer ${cmKey}` },
    }).then((r) => r.json());
    const r = Array.isArray(poll) ? poll[0] : poll;
    console.log(`  poll ${i + 1}: ${r?.status} format=${r?.output_format} url=${(r?.url || '').slice(-30)}`);
    if (r?.status === 'succeeded') {
      const ok = r.output_format === 'mp4' && String(r.url || '').includes('.mp4');
      console.log('\n=== RESULT ===');
      console.log('MP4 success:', ok ? 'YES' : 'NO');
      console.log('URL:', r.url);
      process.exit(ok ? 0 : 1);
    }
    if (r?.status === 'failed') {
      console.log('Render failed:', r.error_message || r.error);
      process.exit(1);
    }
  }
  console.log('Poll timeout');
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
