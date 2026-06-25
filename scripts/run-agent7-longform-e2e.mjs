#!/usr/bin/env node
/**
 * Local E2E — long-form NOXH podcast (~4 min, 12 beats)
 * Usage: node scripts/run-agent7-longform-e2e.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects, updateCell } from './lib/sheet-client.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const codeDir = path.join(root, 'n8n-workflows/code');
const TEST_KEY = 'agent7-test:noxh-podcast-v1';
const OUT_DIR = path.join(root, 'out', 'agent7-longform-noxh');

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

async function pollCreatomate(renderId, apiKey, max = 60, ms = 15000) {
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
  spawnSync(process.execPath, [path.join(root, 'scripts/seed-agent7-longform-noxh.mjs')], {
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

async function synthDirectBeats(renderBeats, ttsEnv, outDir, jobId) {
  const { synthesizeElevenLabsMp3, estimateMp3DurationSec: estDur } = await import('./lib/elevenlabs-tts.mjs');
  const { uploadMp3PublicUrl } = await import('./lib/drive-upload-audio.mjs');
  const env = loadEnv();
  const driveFolderId =
    env.DRIVE_VIDEO_FOLDER_READY ||
    env.GOOGLE_DRIVE_ARCHIVE_FOLDER_ID ||
    env.GOOGLE_DRIVE_FOLDER_ID;
  if (!driveFolderId) throw new Error('Thiếu GOOGLE_DRIVE_FOLDER_ID để upload MP3 public');

  const sceneMedia = renderBeats.map(() => ({ videoUrl: null, audioUrl: null, audioDurationSec: 0 }));
  let totalSec = 0;

  for (let i = 0; i < renderBeats.length; i += 1) {
    const beat = renderBeats[i];
    const synth = await synthesizeElevenLabsMp3(beat.spoken, ttsEnv, {
      role: beat.role,
      beat_index: i,
    });
    const localMp3 = path.join(outDir, `${jobId}-beat-${i}.mp3`);
    fs.writeFileSync(localMp3, synth.buf);
    const { audio_url: audioUrl } = await uploadMp3PublicUrl(`${jobId}-beat-${i}.mp3`, synth.buf, driveFolderId);
    const dur = estDur(synth.bytes);
    totalSec += dur;
    sceneMedia[i].audioUrl = audioUrl;
    sceneMedia[i].audioDurationSec = dur;
    const tag = synth.hook_delivery ? ` · ${synth.hook_delivery}` : '';
    console.log(
      `   [${i}] ${beat.role} · ${dur.toFixed(1)}s · ${synth.preset}${tag} · cumulative ${totalSec.toFixed(0)}s`
    );
  }

  return { sceneMedia, totalSec, ttsProvider: 'elevenlabs_direct_drive', ttsModel: 'eleven_flash_v2_5' };
}

async function main() {
  const env = loadEnv();
  const sb = loadSandbox();
  const cmKey = env.CREATOMATE_API_KEY || '';
  const pexelsKey = env.PEXELS_API_KEY || '';

  if (!cmKey) throw new Error('Thiếu CREATOMATE_API_KEY');
  if (!pexelsKey) throw new Error('Thiếu PEXELS_API_KEY');

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('=== Agent 7 Long-form NOXH Podcast E2E ===\n');

  console.log('1) Seed / refresh longform row...');
  runSeed();
  const { headers, row, beats } = await getTestRow();
  console.log(`   Sheet row ${row.sheet_row} · ${beats.length} beats · target ${row.duration_sec}s`);

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

  console.log('\n2) Pexels B-roll...');
  const sceneMedia = [];
  let hits = 0;
  for (let i = 0; i < renderBeats.length; i += 1) {
    const beat = renderBeats[i];
    const query = sb.resolvePexelsStockQuery(beat, row.segment);
    const videoUrl = query ? await pexelsPortraitUrl(query, pexelsKey) : null;
    if (videoUrl) hits += 1;
    console.log(`   [${i}] ${query?.slice(0, 50)} → ${videoUrl ? 'OK' : 'MISS'}`);
    sceneMedia.push({ videoUrl, audioUrl: null, audioDurationSec: 0 });
  }
  console.log(`   hit rate: ${hits}/${renderBeats.length}`);

  console.log('\n3) ElevenLabs TTS (12 beats — có thể mất 5–10 phút)...');
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
  const ttsBase = (env.MAGNIX_VIDEO_TTS_URL || 'http://103.57.221.93:8765').replace(/\/$/, '');
  const jobId = `longform-noxh-${Date.now()}`;
  let ttsProvider = 'elevenlabs_vps';
  let ttsModel = null;
  let audioTotalSec = 0;

  const batch = await fetch(`${ttsBase}/magnix/video-tts/batch`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.MAGNIX_WEBHOOK_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: jobId,
      beats: renderBeats.map((b, i) => ({
        beat_index: i,
        spoken: b.spoken,
        role: b.role || null,
      })),
    }),
  }).then((r) => r.json()).catch(() => ({}));

  ttsModel = batch.model_id || null;
  const vpsOk = batch.ok && ttsModel === 'eleven_flash_v2_5';
  const { estimateMp3DurationSec: estDur } = await import('./lib/elevenlabs-tts.mjs');

  if (vpsOk && batch.tracks?.length === renderBeats.length) {
    console.log(`   VPS TTS OK · model=${ttsModel} · tracks=${batch.tracks.length}`);
    for (const tr of batch.tracks.sort((a, b) => a.beat_index - b.beat_index)) {
      const idx = tr.beat_index;
      const dur = tr.duration_sec || estDur(tr.bytes);
      audioTotalSec += dur;
      sceneMedia[idx].audioUrl = `${tr.audio_url}?v=${jobId}`;
      sceneMedia[idx].audioDurationSec = dur;
      const presetTag = tr.tts_preset ? ` · ${tr.tts_preset}` : '';
      const hookTag = tr.hook_delivery ? ` · ${tr.hook_delivery}` : '';
      console.log(`   [${idx}] ${dur.toFixed(1)}s${presetTag}${hookTag}`);
    }
  } else {
    if (batch.error || batch.tts_error) {
      console.log(`   ⚠ VPS batch: ${batch.error || batch.tts_error}`);
    } else if (batch.tracks?.length !== renderBeats.length) {
      console.log(`   ⚠ VPS chỉ trả ${batch.tracks?.length || 0}/${renderBeats.length} tracks`);
    }
    console.log('   Fallback: ElevenLabs direct + Drive...');
    const direct = await synthDirectBeats(renderBeats, ttsEnv, OUT_DIR, jobId);
    for (let i = 0; i < direct.sceneMedia.length; i += 1) {
      sceneMedia[i] = { ...sceneMedia[i], ...direct.sceneMedia[i] };
    }
    audioTotalSec = direct.totalSec;
    ttsProvider = direct.ttsProvider;
    ttsModel = direct.ttsModel;
  }

  console.log(`   Tổng audio ước tính: ~${audioTotalSec.toFixed(0)}s (${(audioTotalSec / 60).toFixed(1)} phút)`);

  console.log('\n4) Creatomate RenderScript...');
  const payload = {
    ...sb.buildCreatomateSourceFromBeats({
      beats: renderBeats,
      duration_sec: Number(row.duration_sec) || 240,
      segment: row.segment,
      title: row.title,
      cta_keyword: row.cta_keyword || 'NOXH',
      sceneMedia,
      useCreatomateVoice: false,
    }),
    output_format: 'mp4',
  };
  console.log(`   payload duration: ${payload.duration}s · scenes: ${payload.elements.filter((e) => e.type === 'composition').length}`);

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

  console.log('\n5) Poll MP4 (có thể 10–15 phút cho video dài)...');
  const done = await pollCreatomate(first.id, cmKey);
  const mp4 = done.url;

  const manifest = {
    created_at: new Date().toISOString(),
    source_normalized_key: TEST_KEY,
    sheet_row: row.sheet_row,
    beats: renderBeats.length,
    audio_total_sec_est: Math.round(audioTotalSec),
    mp4,
    render_id: first.id,
    render_duration_sec: done.duration,
    tts_provider: ttsProvider,
    tts_model: ttsModel || 'eleven_flash_v2_5',
    pexels_hit_rate: `${hits}/${renderBeats.length}`,
  };
  const manifestPath = path.join(OUT_DIR, 'longform-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n=== LONG-FORM TEST HOÀN TẤT ===');
  console.log('MP4:', mp4);
  console.log('Duration:', done.duration, 's ·', done.width, 'x', done.height);
  console.log('Manifest:', manifestPath);

  const meta = {
    test_seed: true,
    format: 'longform_podcast',
    render_status: 'ready_for_review',
    render_url: mp4,
    render_id: first.id,
    render_provider: 'creatomate_renderscript_v2',
    tts_provider: ttsProvider,
    tts_model: ttsModel || 'eleven_flash_v2_5',
    audio_total_sec_est: Math.round(audioTotalSec),
    pexels_hit_rate: `${hits}/${renderBeats.length}`,
    local_e2e_at: new Date().toISOString(),
    agent: 'agent-7-longform-e2e',
  };

  try {
    await updateCell('video_drafts', row.sheet_row, 'status', 'ready_for_review', headers);
    await updateCell('video_drafts', row.sheet_row, 'meta', JSON.stringify(meta), headers);
    console.log(`\nSheet row ${row.sheet_row} updated → ready_for_review`);
  } catch (e) {
    console.log('\n(Ghi Sheet bỏ qua:', e.message, ')');
  }
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
