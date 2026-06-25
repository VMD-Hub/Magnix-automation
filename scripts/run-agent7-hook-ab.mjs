#!/usr/bin/env node
/**
 * A/B hook TTS preset — so sánh body vs hook preset (MP3 hook + 2 MP4)
 * Usage: node scripts/run-agent7-hook-ab.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const codeDir = path.join(root, 'n8n-workflows/code');
const TEST_KEY = 'agent7-test:noxh-checklist-v1';
const abDir = path.join(root, 'out', 'agent7-hook-ab');

function readShared(name) {
  return fs.readFileSync(path.join(codeDir, 'shared', name), 'utf8');
}

function loadSandbox() {
  const code = [
    readShared('vietnamese-tts-text.js'),
    readShared('pexels-stock-query.js'),
    readShared('beats-to-creatomate-source.js'),
  ].join('\n\n');
  const sandbox = { $env: loadEnv() };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

async function pexelsPortraitUrl(query, apiKey) {
  const q = encodeURIComponent(query);
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${q}&orientation=portrait&size=medium&per_page=8`,
    { headers: { Authorization: apiKey } }
  );
  const data = await res.json();
  for (const vid of data.videos || []) {
    const files = (vid.video_files || []).filter((f) => f.link && f.height);
    files.sort((a, b) => (b.height || 0) - (a.height || 0));
    const pick = files.find((f) => f.height >= 720) || files[0];
    if (pick?.link) return pick.link;
  }
  return null;
}

async function pollCreatomate(renderId, apiKey, label, max = 36, ms = 10000) {
  for (let i = 0; i < max; i += 1) {
    await new Promise((r) => setTimeout(r, ms));
    const poll = await fetch(`https://api.creatomate.com/v2/renders/${renderId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => r.json());
    const r = Array.isArray(poll) ? poll[0] : poll;
    process.stdout.write(`\r  [${label}] poll ${i + 1}/${max}: ${r?.status}   `);
    if (r?.status === 'succeeded') {
      console.log('');
      return r;
    }
    if (r?.status === 'failed') throw new Error(`${label}: ${r.error_message || r.error || 'Creatomate failed'}`);
  }
  throw new Error(`${label}: Creatomate poll timeout`);
}

function runSeed() {
  spawnSync(process.execPath, [path.join(root, 'scripts/seed-agent7-test-video.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
}

async function fetchVpsTts(renderBeats, env, jobId, disableHookPreset) {
  const ttsBase = (env.MAGNIX_VIDEO_TTS_URL || 'http://103.57.221.93:8765').replace(/\/$/, '');
  const batch = await fetch(`${ttsBase}/magnix/video-tts/batch`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.MAGNIX_WEBHOOK_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: jobId,
      disable_hook_preset: disableHookPreset,
      beats: renderBeats.map((b, i) => ({
        beat_index: i,
        spoken: b.spoken,
        role: b.role || null,
      })),
    }),
  }).then((r) => r.json()).catch(() => ({}));

  return batch;
}

function applyVpsTracks(sceneMedia, batch, jobId, estDur) {
  if (!batch.ok || !batch.tracks?.length) {
    throw new Error(batch.error || batch.tts_error || 'VPS TTS batch failed');
  }
  if (batch.model_id && batch.model_id !== 'eleven_flash_v2_5') {
    throw new Error(`VPS model=${batch.model_id} — cần eleven_flash_v2_5`);
  }
  for (const tr of batch.tracks) {
    const idx = tr.beat_index;
    sceneMedia[idx].audioUrl = `${tr.audio_url}?v=${jobId}`;
    sceneMedia[idx].audioDurationSec = tr.duration_sec || estDur(tr.bytes);
  }
  return batch;
}

async function renderMp4(label, renderBeats, sceneMedia, row, sb, cmKey) {
  const payload = {
    ...sb.buildCreatomateSourceFromBeats({
      beats: renderBeats,
      duration_sec: Number(row.duration_sec) || 30,
      segment: row.segment,
      title: row.title,
      cta_keyword: row.cta_keyword || 'NOXH',
      sceneMedia,
      useCreatomateVoice: false,
    }),
    output_format: 'mp4',
  };

  const create = await fetch('https://api.creatomate.com/v2/renders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cmKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

  const first = Array.isArray(create) ? create[0] : create;
  if (!first?.id) throw new Error(`${label} Creatomate: ${JSON.stringify(create).slice(0, 200)}`);

  console.log(`   ${label} render_id: ${first.id}`);
  const done = await pollCreatomate(first.id, cmKey, label);
  return { render_id: first.id, mp4: done.url, duration: done.duration };
}

async function getTestRow() {
  const { fetchTab, rowsToObjects } = await import('./lib/sheet-client.mjs');
  const values = await fetchTab('video_drafts', 'A:V');
  const { rows } = rowsToObjects(values);
  const row = rows.find((r) => r.source_normalized_key === TEST_KEY);
  if (!row) throw new Error(`Không tìm thấy row test ${TEST_KEY}`);
  return { row, beats: JSON.parse(row.beats_json || '[]') };
}

async function main() {
  const env = loadEnv();
  const sb = loadSandbox();
  const cmKey = env.CREATOMATE_API_KEY || '';
  const pexelsKey = env.PEXELS_API_KEY || '';
  const ttsEnv = {
    ...env,
    ELEVENLABS_API_KEY:
      env.ELEVENLABS_API_KEY
      || fs.readFileSync(path.join(root, 'webhooks/video-tts/.env'), 'utf8').match(/ELEVENLABS_API_KEY=(.+)/)?.[1],
    ELEVENLABS_VOICE_ID:
      env.ELEVENLABS_VOICE_ID
      || fs.readFileSync(path.join(root, 'webhooks/video-tts/.env'), 'utf8').match(/ELEVENLABS_VOICE_ID=(.+)/)?.[1],
    ELEVENLABS_MODEL_ID: 'eleven_flash_v2_5',
  };

  if (!cmKey || !pexelsKey) throw new Error('Thiếu CREATOMATE_API_KEY hoặc PEXELS_API_KEY');
  if (!ttsEnv.ELEVENLABS_API_KEY || !ttsEnv.ELEVENLABS_VOICE_ID) throw new Error('Thiếu ElevenLabs config');

  fs.mkdirSync(abDir, { recursive: true });

  console.log('=== Agent 7 Hook TTS A/B ===\n');

  console.log('1) Seed test row...');
  runSeed();
  const { row, beats } = await getTestRow();
  const renderBeats = beats.map((b) => ({
    ...b,
    spoken: sb.normalizeVietnameseTtsText(b.spoken),
  }));
  const hookBeat = renderBeats.find((b) => b.role === 'hook') || renderBeats[0];
  const hookText = hookBeat.spoken;

  console.log('\n2) Hook MP3 trực tiếp (nghe nhanh)...');
  const { synthesizeElevenLabsMp3, estimateMp3DurationSec: estDur } = await import('./lib/elevenlabs-tts.mjs');

  const hookA = await synthesizeElevenLabsMp3(hookText, ttsEnv, {
    role: 'hook',
    beat_index: 0,
    disable_hook_preset: true,
  });
  const hookB = await synthesizeElevenLabsMp3(hookText, ttsEnv, {
    role: 'hook',
    beat_index: 0,
  });
  const { prepareHookTtsSegments } = await import('./lib/elevenlabs-voice-presets.mjs');
  const hookSegments = prepareHookTtsSegments(hookText);

  const hookAMp3 = path.join(abDir, 'hook-A-body-preset.mp3');
  const hookBMp3 = path.join(abDir, 'hook-B-hook-preset.mp3');
  fs.writeFileSync(hookAMp3, hookA.buf);
  fs.writeFileSync(hookBMp3, hookB.buf);
  console.log(`   A text: ${hookText}`);
  console.log(`   B segments: ${hookSegments.map((s, i) => `[${i + 1}] ${s}`).join('  |  ')}`);
  console.log(`   A (body):  ${hookAMp3} · ${estDur(hookA.bytes).toFixed(1)}s · ${hookA.bytes} bytes · preset=${hookA.preset}`);
  console.log(`   B (hook):  ${hookBMp3} · ${estDur(hookB.bytes).toFixed(1)}s · ${hookB.bytes} bytes · preset=${hookB.preset} · ${hookB.hook_delivery || 'single'}`);

  console.log('\n3) Pexels B-roll (dùng chung)...');
  const baseSceneMedia = [];
  for (let i = 0; i < renderBeats.length; i += 1) {
    const query = sb.resolvePexelsStockQuery(renderBeats[i], row.segment);
    const videoUrl = query ? await pexelsPortraitUrl(query, pexelsKey) : null;
    baseSceneMedia.push({ videoUrl, audioUrl: null, audioDurationSec: 0 });
    console.log(`   [${i}] ${videoUrl ? 'OK' : 'MISS'}`);
  }

  const ts = Date.now();

  console.log('\n4) VPS TTS + MP4 variant A (disable_hook_preset — baseline)...');
  const sceneA = baseSceneMedia.map((s) => ({ ...s }));
  const batchA = await fetchVpsTts(renderBeats, env, `ab-a-${ts}`, true);
  applyVpsTracks(sceneA, batchA, `ab-a-${ts}`, estDur);
  const hookTrackA = batchA.tracks.find((t) => t.beat_index === 0);
  console.log(`   beat0 tts_preset=${hookTrackA?.tts_preset || 'n/a'} hook_preset_enabled=${batchA.hook_preset_enabled}`);
  const resultA = await renderMp4('A', renderBeats, sceneA, row, sb, cmKey);

  console.log('\n5) VPS TTS + MP4 variant B (hook preset)...');
  const sceneB = baseSceneMedia.map((s) => ({ ...s }));
  const batchB = await fetchVpsTts(renderBeats, env, `ab-b-${ts}`, false);
  applyVpsTracks(sceneB, batchB, `ab-b-${ts}`, estDur);
  const hookTrackB = batchB.tracks.find((t) => t.beat_index === 0);
  console.log(`   beat0 tts_preset=${hookTrackB?.tts_preset || 'n/a'} hook_preset_enabled=${batchB.hook_preset_enabled}`);
  const resultB = await renderMp4('B', renderBeats, sceneB, row, sb, cmKey);

  const manifest = {
    created_at: new Date().toISOString(),
    hook_spoken: hookText,
    hook_mp3: {
      A_body_preset: hookAMp3,
      B_hook_preset: hookBMp3,
    },
    mp4: {
      A_baseline: resultA,
      B_hook_preset: resultB,
    },
    vps_beat0_preset: {
      A: hookTrackA?.tts_preset || null,
      B: hookTrackB?.tts_preset || null,
    },
    note: 'Nghe hook MP3 trước; MP4 B nên mạnh hơn A ở 3 giây đầu.',
  };
  const manifestPath = path.join(abDir, 'ab-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n=== A/B HOÀN TẤT ===');
  console.log('Hook MP3 A (baseline):', hookAMp3);
  console.log('Hook MP3 B (hook preset):', hookBMp3);
  console.log('MP4 A (baseline):', resultA.mp4);
  console.log('MP4 B (hook preset):', resultB.mp4);
  console.log('Manifest:', manifestPath);
  if (hookTrackB?.tts_preset !== 'hook') {
    console.log('\n⚠ VPS chưa có hook preset — redeploy: bash scripts/vps/deploy-video-tts-on-server.sh');
  }
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
