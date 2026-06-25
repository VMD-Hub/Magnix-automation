#!/usr/bin/env node
/**
 * Preflight Agent 7 — seed + beats + Pexels + TTS (bỏ Creatomate)
 * Usage: node scripts/run-agent7-preflight.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/magnix-env.mjs';
import { fetchTab, rowsToObjects } from './lib/sheet-client.mjs';
import { hasBrandOutroBeat } from './lib/magnix-brand-outro.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const codeDir = path.join(root, 'n8n-workflows/code');
const TEST_KEY = 'agent7-test:noxh-checklist-v1';
const outRoot = path.join(root, 'out', 'agent7-preflight');

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

function runSeed() {
  spawnSync(process.execPath, [path.join(root, 'scripts/seed-agent7-test-video.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
}

async function getTestRow() {
  const values = await fetchTab('video_drafts', 'A:V');
  const { rows } = rowsToObjects(values);
  const row = rows.find((r) => r.source_normalized_key === TEST_KEY);
  if (!row) throw new Error(`Không tìm thấy row test ${TEST_KEY}`);
  return { row, beats: JSON.parse(row.beats_json || '[]') };
}

async function downloadMp3(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

function checkBeatsStructure(beats) {
  const issues = [];
  if (!beats.length) issues.push('EMPTY_BEATS');
  if (beats[0]?.role !== 'hook') issues.push('beat0 should be hook');
  if (!hasBrandOutroBeat(beats)) issues.push('missing brand_outro beat');
  const brand = beats.find((b) => b.role === 'brand_outro');
  if (brand) {
    if (!brand.spoken_motivate) issues.push('brand_outro thiếu spoken_motivate');
    if (!brand.spoken_tagline) issues.push('brand_outro thiếu spoken_tagline');
    if (!brand.visual_spec?.bell_sfx_url && !brand.visual_spec?.stock_query) {
      issues.push('brand_outro thiếu visual_spec');
    }
  }
  return issues;
}

async function main() {
  const env = loadEnv();
  const sb = loadSandbox();
  const pexelsKey = env.PEXELS_API_KEY || '';
  if (!pexelsKey) throw new Error('Thiếu PEXELS_API_KEY');
  if (!env.MAGNIX_WEBHOOK_TOKEN) throw new Error('Thiếu MAGNIX_WEBHOOK_TOKEN');

  const jobId = `preflight-${Date.now()}`;
  const jobDir = path.join(outRoot, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  console.log('=== Agent 7 Preflight (no Creatomate) ===\n');

  console.log('1) Seed / refresh test row...');
  runSeed();
  const { row, beats } = await getTestRow();
  console.log(`   Sheet row ${row.sheet_row} · ${beats.length} beats · target ${row.duration_sec}s`);

  const spec = sb.validateBeatsRenderSpec(beats);
  if (!spec.ok) {
    console.error('   beats v3 FAIL:', spec.errors);
    process.exit(1);
  }
  console.log('   beats v3: OK');

  const structureIssues = checkBeatsStructure(beats);
  if (structureIssues.length) {
    console.error('   structure FAIL:', structureIssues.join('; '));
    process.exit(1);
  }
  console.log('   structure: hook + brand_outro OK');

  const renderBeats = beats.map((b) => ({
    ...b,
    spoken: sb.normalizeVietnameseTtsText(b.spoken),
    spoken_motivate: b.spoken_motivate
      ? sb.normalizeVietnameseTtsText(b.spoken_motivate)
      : undefined,
    spoken_tagline: b.spoken_tagline
      ? sb.normalizeVietnameseTtsText(b.spoken_tagline)
      : undefined,
  }));

  console.log('\n2) Pexels B-roll...');
  const sceneMedia = [];
  const pexelsReport = [];
  let hits = 0;
  for (let i = 0; i < renderBeats.length; i += 1) {
    const beat = renderBeats[i];
    const query = sb.resolvePexelsStockQuery(beat, row.segment);
    const videoUrl = query ? await pexelsPortraitUrl(query, pexelsKey) : null;
    if (videoUrl) hits += 1;
    console.log(`   [${i}] ${beat.role} · ${query?.slice(0, 48) || '-'} → ${videoUrl ? 'OK' : 'MISS'}`);
    sceneMedia.push({ videoUrl, audioUrl: null, audioDurationSec: 0 });
    pexelsReport.push({ beat_index: i, role: beat.role, query, ok: !!videoUrl });
  }
  console.log(`   hit rate: ${hits}/${renderBeats.length}`);

  console.log('\n3) VPS TTS batch...');
  const ttsBase = (env.MAGNIX_VIDEO_TTS_URL || 'http://103.57.221.93:8765').replace(/\/$/, '');
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
  }).then((r) => r.json()).catch((e) => ({ ok: false, error: e.message }));

  const { estimateMp3DurationSec: estDur } = await import('./lib/elevenlabs-tts.mjs');
  const ttsReport = [];
  let audioTotal = 0;
  const ttsIssues = [];

  if (!batch.ok) {
    ttsIssues.push(batch.error || batch.tts_error || 'VPS batch failed');
    console.log(`   FAIL: ${ttsIssues[0]}`);
  } else if (batch.model_id !== 'eleven_flash_v2_5') {
    ttsIssues.push(`model=${batch.model_id} — cần eleven_flash_v2_5`);
    console.log(`   FAIL: ${ttsIssues[0]}`);
  } else {
    console.log(`   OK · model=${batch.model_id} · tracks=${batch.tracks?.length || 0}`);
    for (const tr of (batch.tracks || []).sort((a, b) => a.beat_index - b.beat_index)) {
      const idx = tr.beat_index;
      const beat = renderBeats[idx];
      const dur = tr.duration_sec || estDur(tr.bytes);
      audioTotal += dur;
      const localMp3 = path.join(jobDir, `${idx}-${beat?.role || 'beat'}.mp3`);
      const audioUrl = `${tr.audio_url}?v=${jobId}`;
      try {
        await downloadMp3(audioUrl, localMp3);
      } catch (e) {
        ttsIssues.push(`beat ${idx} download: ${e.message}`);
      }
      sceneMedia[idx].audioUrl = audioUrl;
      sceneMedia[idx].audioDurationSec = dur;
      const line = `[${idx}] ${beat?.role} · ${dur.toFixed(1)}s · preset=${tr.tts_preset || 'n/a'}${tr.hook_delivery ? ` · ${tr.hook_delivery}` : ''}`;
      console.log(`   ${line}`);
      ttsReport.push({
        beat_index: idx,
        role: beat?.role,
        duration_sec: dur,
        tts_preset: tr.tts_preset,
        hook_delivery: tr.hook_delivery,
        tts_segments: tr.tts_segments,
        local_mp3: localMp3,
        audio_url: audioUrl,
      });
    }
  }

  const hookTrack = ttsReport.find((t) => t.beat_index === 0);
  if (hookTrack && hookTrack.tts_preset !== 'hook') {
    ttsIssues.push('beat0 chưa dùng hook preset — redeploy VPS video-tts');
  }
  const brandTrack = ttsReport.find((t) => t.role === 'brand_outro');
  if (brandTrack && brandTrack.tts_preset !== 'brand_outro') {
    ttsIssues.push('brand_outro chưa dùng brand preset — redeploy VPS video-tts');
  }

  console.log('\n4) Creatomate payload dry-run (không gọi API)...');
  const payload = sb.buildCreatomateSourceFromBeats({
    beats: renderBeats,
    duration_sec: Number(row.duration_sec) || 38,
    segment: row.segment,
    title: row.title,
    cta_keyword: row.cta_keyword || 'NOXH',
    sceneMedia,
    useCreatomateVoice: false,
  });
  const scenes = payload.elements.filter((e) => e.type === 'composition');
  const brandScene = scenes.find((s) => String(s.name || '').includes('brand_outro'));
  const hasBellSfx = brandScene?.elements?.some(
    (el) => el.type === 'audio' && String(el.volume) === '36%'
  );
  console.log(`   duration: ${payload.duration.toFixed(1)}s · scenes: ${scenes.length}`);
  console.log(`   brand_outro scene: ${brandScene ? 'OK' : 'MISS'}`);
  console.log(`   bell SFX in payload: ${hasBellSfx ? 'OK' : 'MISS'}`);

  const manifest = {
    created_at: new Date().toISOString(),
    job_id: jobId,
    source_normalized_key: TEST_KEY,
    sheet_row: row.sheet_row,
    skipped: ['creatomate_render'],
    beats: renderBeats.length,
    pexels_hit_rate: `${hits}/${renderBeats.length}`,
    pexels: pexelsReport,
    tts: {
      provider: 'elevenlabs_vps',
      model_id: batch.model_id || null,
      ok: batch.ok && batch.model_id === 'eleven_flash_v2_5',
      audio_total_sec: Math.round(audioTotal * 10) / 10,
      tracks: ttsReport,
      issues: ttsIssues,
    },
    creatomate_dry_run: {
      duration_sec: payload.duration,
      scene_count: scenes.length,
      brand_outro_scene: !!brandScene,
      bell_sfx: hasBellSfx,
    },
    listen: ttsReport.map((t) => t.local_mp3),
  };

  const manifestPath = path.join(jobDir, 'preflight-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n=== PREFLIGHT KẾT QUẢ ===');
  console.log('Manifest:', manifestPath);
  console.log('MP3 local:', jobDir);
  if (hookTrack?.local_mp3) console.log('Hook [0]:', hookTrack.local_mp3);
  if (brandTrack?.local_mp3) console.log('Brand outro:', brandTrack.local_mp3);

  if (ttsIssues.length) {
    console.log('\n⚠ Cảnh báo:');
    for (const msg of ttsIssues) console.log(`   - ${msg}`);
  }

  const hardFail = !batch.ok || batch.model_id !== 'eleven_flash_v2_5' || hits < renderBeats.length;
  if (hardFail) {
    console.log('\nPreflight FAIL — xem manifest để chi tiết.');
    process.exit(1);
  }
  console.log('\nPreflight PASS (Creatomate bỏ qua). Nghe MP3 trong thư mục trên.');
}

main().catch((e) => {
  console.error('\nLỗi:', e.message);
  process.exit(1);
});
