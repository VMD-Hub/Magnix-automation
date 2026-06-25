#!/usr/bin/env node
/**
 * Local E2E Agent 7 — seed v3 row + Pexels + TTS + Creatomate (không cần n8n trigger)
 * Usage: node scripts/run-agent7-local-e2e.mjs
 *        node scripts/run-agent7-local-e2e.mjs --skip-creatomate
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';

const skipCreatomate = process.argv.includes('--skip-creatomate');

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const codeDir = path.join(root, 'n8n-workflows/code');
const TEST_KEY = 'agent7-test:noxh-checklist-v1';

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

async function pollCreatomate(renderId, apiKey, max = 36, ms = 10000) {
  for (let i = 0; i < max; i += 1) {
    await new Promise((r) => setTimeout(r, ms));
    const poll = await fetch(`https://api.creatomate.com/v2/renders/${renderId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => r.json());
    const r = Array.isArray(poll) ? poll[0] : poll;
    process.stdout.write(`\r  Creatomate poll ${i + 1}/${max}: ${r?.status}   `);
    if (r?.status === 'succeeded') {
      console.log('');
      return r;
    }
    if (r?.status === 'failed') throw new Error(r.error_message || r.error || 'Creatomate failed');
  }
  throw new Error('Creatomate poll timeout');
}

function runSeed() {
  spawnSync(process.execPath, [path.join(root, 'scripts/seed-agent7-test-video.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
}

async function getTestRow() {
  const values = await fetchTab('video_drafts', 'A:V');
  const { headers, rows } = rowsToObjects(values);
  const row = rows.find((r) => r.source_normalized_key === TEST_KEY);
  if (!row) throw new Error(`Không tìm thấy row test ${TEST_KEY}`);
  return { headers, row, beats: JSON.parse(row.beats_json || '[]') };
}

async function main() {
  const env = loadEnv();
  const sb = loadSandbox();
  const cmKey = env.CREATOMATE_API_KEY || '';
  const pexelsKey = env.PEXELS_API_KEY || '';

  if (!skipCreatomate && !cmKey) throw new Error('Thiếu CREATOMATE_API_KEY');
  if (!pexelsKey) throw new Error('Thiếu PEXELS_API_KEY');

  console.log(`=== Agent 7 Local E2E${skipCreatomate ? ' (skip Creatomate)' : ''} ===\n`);

  console.log('1) Seed / refresh test row...');
  runSeed();
  const { headers, row, beats } = await getTestRow();
  console.log(`   Sheet row ${row.sheet_row} · ${beats.length} beats`);

  const spec = sb.validateBeatsRenderSpec(beats);
  if (!spec.ok) {
    console.error('beats v3 invalid:', spec.errors);
    process.exit(1);
  }
  console.log('   beats v3: OK');

  const renderBeats = beats.map((b) => ({
    ...b,
    spoken: sb.normalizeVietnameseTtsText(b.spoken),
  }));

  console.log('\n2) Pexels B-roll (EN queries)...');
  const sceneMedia = [];
  let hits = 0;
  for (let i = 0; i < renderBeats.length; i += 1) {
    const beat = renderBeats[i];
    const query = sb.resolvePexelsStockQuery(beat, row.segment);
    const videoUrl = query ? await pexelsPortraitUrl(query, pexelsKey) : null;
    if (videoUrl) hits += 1;
    console.log(`   [${i}] ${query?.slice(0, 55)} → ${videoUrl ? 'OK' : 'MISS'}`);
    sceneMedia.push({ videoUrl, audioUrl: null, audioDurationSec: 0 });
  }
  console.log(`   hit rate: ${hits}/${renderBeats.length}`);

  console.log('\n3) ElevenLabs TTS...');
  const ttsEnv = {
    ...env,
    ELEVENLABS_API_KEY: env.ELEVENLABS_API_KEY || fs.readFileSync(path.join(root, 'webhooks/video-tts/.env'), 'utf8').match(/ELEVENLABS_API_KEY=(.+)/)?.[1],
    ELEVENLABS_VOICE_ID: env.ELEVENLABS_VOICE_ID || fs.readFileSync(path.join(root, 'webhooks/video-tts/.env'), 'utf8').match(/ELEVENLABS_VOICE_ID=(.+)/)?.[1],
    ELEVENLABS_MODEL_ID: 'eleven_flash_v2_5',
  };
  const ttsBase = (env.MAGNIX_VIDEO_TTS_URL || 'http://103.57.221.93:8765').replace(/\/$/, '');
  const jobId = `local-e2e-${Date.now()}`;
  let ttsModel = null;

  const batch = await fetch(`${ttsBase}/magnix/video-tts/batch`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.MAGNIX_WEBHOOK_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: jobId,
      beats: renderBeats.map((b, i) => ({
        beat_index: i,
        spoken: b.spoken,
        role: b.role || null,
        spoken_motivate: b.spoken_motivate || null,
        spoken_tagline: b.spoken_tagline || null,
      })),
    }),
  }).then((r) => r.json()).catch(() => ({}));

  ttsModel = batch.model_id || null;
  const vpsOk = batch.ok && ttsModel === 'eleven_flash_v2_5';
  let ttsProvider = 'elevenlabs_vps';

  const { synthesizeElevenLabsMp3, estimateMp3DurationSec: estDur } = await import('./lib/elevenlabs-tts.mjs');
  const { uploadMp3PublicUrl } = await import('./lib/drive-upload-audio.mjs');
  const outDir = path.join(root, 'out', 'agent7-tts-sample');
  fs.mkdirSync(outDir, { recursive: true });

  if (vpsOk && batch.tracks?.length) {
    console.log(`   VPS TTS OK · model=${ttsModel}`);
    for (const tr of batch.tracks) {
      const idx = tr.beat_index;
      sceneMedia[idx].audioUrl = `${tr.audio_url}?v=${jobId}`;
      sceneMedia[idx].audioDurationSec = tr.duration_sec || estDur(tr.bytes);
      const presetTag = tr.tts_preset ? ` · ${tr.tts_preset}` : '';
      const deliveryTag = tr.hook_delivery ? ` · ${tr.hook_delivery}` : '';
      console.log(`   [${idx}] ${sceneMedia[idx].audioDurationSec?.toFixed?.(1) || '?'}s${presetTag}${deliveryTag}`);
    }
  } else if (batch.ok && batch.tracks?.length) {
    console.log(`   ⚠ VPS trả audio (model=${ttsModel}) — giọng VN có thể SAI, chỉ dùng test ghép MP4`);
    ttsProvider = 'elevenlabs_vps_legacy_model';
    for (const tr of batch.tracks) {
      const idx = tr.beat_index;
      sceneMedia[idx].audioUrl = `${tr.audio_url}?v=${jobId}`;
      sceneMedia[idx].audioDurationSec = tr.duration_sec || estDur(tr.bytes);
      console.log(`   [${idx}] ${sceneMedia[idx].audioDurationSec?.toFixed?.(1) || '?'}s · VPS URL`);
    }
  } else {
    if (ttsModel && ttsModel !== 'eleven_flash_v2_5') {
      console.log(`   ⚠ VPS model=${ttsModel} — KHÔNG hỗ trợ tiếng Việt`);
      console.log('   → Chạy: .\\scripts\\deploy-video-tts-vps.ps1 (từ PowerShell có SSH)');
    }
    console.log('   Fallback: ElevenLabs direct (eleven_flash_v2_5 + vi) + Drive public URL...');
    ttsProvider = 'elevenlabs_direct_drive';
    ttsModel = 'eleven_flash_v2_5';
    const driveFolderId =
      env.DRIVE_VIDEO_FOLDER_READY ||
      env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID ||
      env.GOOGLE_DRIVE_FOLDER_ID;
    if (!driveFolderId) throw new Error('Thiếu GOOGLE_DRIVE_FOLDER_ID để upload MP3 public');

    for (let i = 0; i < renderBeats.length; i += 1) {
      const { buf, modelId, bytes } = await synthesizeElevenLabsMp3(renderBeats[i].spoken, ttsEnv, {
        role: renderBeats[i].role,
        beat_index: i,
        spoken_motivate: renderBeats[i].spoken_motivate,
        spoken_tagline: renderBeats[i].spoken_tagline,
      });
      const localMp3 = path.join(outDir, `${jobId}-beat-${i}.mp3`);
      fs.writeFileSync(localMp3, buf);
      let audioUrl;
      try {
        ({ audio_url: audioUrl } = await uploadMp3PublicUrl(`${jobId}-beat-${i}.mp3`, buf, driveFolderId));
        console.log(`   [${i}] ${modelId} · ${estDur(bytes).toFixed(1)}s · Drive OK`);
      } catch (e) {
        throw new Error(
          `Drive upload failed (${String(e.message || e).slice(0, 80)}). `
          + 'Deploy VPS TTS: node scripts/deploy-video-tts-vps.mjs (cần SSH key)'
        );
      }
      sceneMedia[i].audioUrl = audioUrl;
      sceneMedia[i].audioDurationSec = estDur(bytes);
    }
    console.log(`   MP3 mẫu local: ${outDir}`);
  }

  console.log('\n4) Creatomate RenderScript...');
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
  console.log(`   duration: ${payload.duration}s · scenes: ${payload.elements.filter((e) => e.type === 'composition').length}`);

  if (skipCreatomate) {
    const outDir = path.join(root, 'out', 'agent7-preflight');
    fs.mkdirSync(outDir, { recursive: true });
    const manifestPath = path.join(outDir, `${jobId}-dry-run.json`);
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(
        {
          job_id: jobId,
          skipped: 'creatomate_render',
          tts_provider: ttsProvider,
          tts_model: ttsModel,
          pexels_hit_rate: `${hits}/${renderBeats.length}`,
          payload_duration: payload.duration,
        },
        null,
        2
      )
    );
    console.log('\n=== BỎ QUA CREATOMATE ===');
    console.log('Dry-run manifest:', manifestPath);
    console.log('Chạy preflight đầy đủ: node scripts/run-agent7-preflight.mjs');
    return;
  }

  const create = await fetch('https://api.creatomate.com/v2/renders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cmKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

  const first = Array.isArray(create) ? create[0] : create;
  if (!first?.id) {
    console.error('Creatomate create error:', JSON.stringify(create).slice(0, 400));
    process.exit(1);
  }
  console.log(`   render_id: ${first.id}`);

  console.log('\n5) Poll MP4 (3–8 phút)...');
  const done = await pollCreatomate(first.id, cmKey);
  const mp4 = done.url;

  console.log('\n=== SẢN PHẨM CUỐI ===');
  console.log('MP4:', mp4);
  console.log('Duration:', done.duration, 's ·', done.width, 'x', done.height);

  const meta = {
    test_seed: true,
    render_status: 'ready_for_review',
    render_url: mp4,
    render_id: first.id,
    render_provider: 'creatomate_renderscript_v2',
    tts_provider: ttsProvider,
    tts_model: ttsModel || 'eleven_flash_v2_5',
    pexels_hit_rate: `${hits}/${renderBeats.length}`,
    local_e2e_at: new Date().toISOString(),
    agent: 'agent-7-local-e2e',
  };

  try {
    await updateCell('video_drafts', row.sheet_row, 'status', 'ready_for_review', headers);
    await updateCell('video_drafts', row.sheet_row, 'meta', JSON.stringify(meta), headers);
    console.log(`\nSheet row ${row.sheet_row} updated → ready_for_review`);
  } catch (e) {
    console.log('\n(Ghi Sheet bỏ qua:', e.message, ')');
  }

  console.log('\nMở MP4 trong trình duyệt để đánh giá giọng + hình.');
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
