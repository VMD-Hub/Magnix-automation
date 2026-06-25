// n8n Code: beats_json → Pexels per scene → Creatomate RenderScript (Agent 7 v2)

const row = $('Loop Render Candidates').item?.json || $input.first().json;

function prepareBeatsForRender(beats) {
  return beats.map((beat) => ({
    ...beat,
    spoken: normalizeVietnameseTtsText(beat?.spoken),
    spoken_motivate: beat?.spoken_motivate
      ? normalizeVietnameseTtsText(beat.spoken_motivate)
      : undefined,
    spoken_tagline: beat?.spoken_tagline
      ? normalizeVietnameseTtsText(beat.spoken_tagline)
      : undefined,
  }));
}

async function pexelsPortraitUrl(query) {
  const key = $env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const q = encodeURIComponent(query);
    const res = await this.helpers.httpRequest({
      method: 'GET',
      url: `https://api.pexels.com/videos/search?query=${q}&orientation=portrait&size=medium&per_page=8`,
      headers: { Authorization: key },
      json: true,
    });
    const videos = res.videos || [];
    for (const vid of videos) {
      const files = (vid.video_files || []).filter((f) => f.link && f.height);
      files.sort((a, b) => (b.height || 0) - (a.height || 0));
      const pick = files.find((f) => f.height >= 720) || files[0];
      if (pick?.link) return pick.link;
    }
  } catch (e) {
    return { pexels_error: String(e.message || e).slice(0, 200) };
  }
  return null;
}

async function fetchElevenLabsBatch(beats, jobId) {
  const base = ($env.MAGNIX_VIDEO_TTS_URL || '').replace(/\/$/, '');
  const token = $env.MAGNIX_WEBHOOK_TOKEN || '';
  if (!base || !token) return { skipped: true, reason: 'NO_TTS_URL_OR_TOKEN' };
  if (String($env.CREATOMATE_DISABLE_VOICE || '') === 'true') {
    return { skipped: true, reason: 'VOICE_DISABLED' };
  }

  try {
    const payload = {
      job_id: jobId,
      beats: beats
        .map((b, i) => ({
          beat_index: i,
          spoken: String(b.spoken || '').trim().slice(0, 800),
          role: b.role || null,
          spoken_motivate: b.spoken_motivate
            ? String(b.spoken_motivate).trim().slice(0, 400)
            : undefined,
          spoken_tagline: b.spoken_tagline
            ? String(b.spoken_tagline).trim().slice(0, 400)
            : undefined,
        }))
        .filter((b) => b.spoken.length > 0),
    };
    const res = await this.helpers.httpRequest({
      method: 'POST',
      url: `${base}/magnix/video-tts/batch`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: payload,
      json: true,
      timeout: 180000,
    });
    return {
      ...res,
      requested_text_preview: payload.beats.map((b) => ({
        beat_index: b.beat_index,
        spoken: b.spoken,
      })),
    };
  } catch (e) {
    return { ok: false, tts_error: String(e.message || e).slice(0, 300) };
  }
}

async function synthesizeDirectElevenLabs(text, beatOpts = {}) {
  const apiKey = $env.ELEVENLABS_API_KEY || '';
  const voiceId = $env.ELEVENLABS_VOICE_ID || '';
  const modelId = $env.ELEVENLABS_MODEL_ID || DEFAULT_VI_MODEL_ID;
  const resolved = resolveElevenLabsVoiceSettings({
    role: beatOpts.role,
    beat_index: beatOpts.beat_index,
    disable_hook_preset: beatOpts.disable_hook_preset,
  });
  const { preset, ...voice_settings } = resolved;

  let spoken = String(text || '').trim().slice(0, 800);
  if (!apiKey || !voiceId || !spoken) return null;

  async function synthOne(segmentText, settings) {
    const buf = await this.helpers.httpRequest({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: {
        text: String(segmentText || '').slice(0, 400),
        model_id: modelId,
        language_code: 'vi',
        apply_text_normalization: 'on',
        voice_settings: settings,
      },
      encoding: 'arraybuffer',
      json: false,
    });
    const mp3 = Buffer.isBuffer(buf) ? buf : Buffer.from(buf || []);
    return mp3.length >= 100 ? mp3 : null;
  }

  if (preset === 'hook') {
    const segments = prepareHookTtsSegments(spoken);
    if (segments.length > 1) {
      const parts = [];
      for (const seg of segments) {
        const part = await synthOne.call(this, seg, voice_settings);
        if (!part) return null;
        parts.push(part);
      }
      const mp3 = Buffer.concat(parts);
      return { mp3, modelId, bytes: mp3.length, preset, hook_delivery: 'split_pause_v3' };
    }
    spoken = segments[0].slice(0, 800);
  }

  if (preset === 'brand_outro') {
    const segments = prepareBrandOutroTtsSegments({
      spoken,
      spoken_motivate: beatOpts.spoken_motivate,
      spoken_tagline: beatOpts.spoken_tagline,
    });
    if (segments.length > 1) {
      const parts = [];
      for (let i = 0; i < segments.length; i += 1) {
        const part = await synthOne.call(this, segments[i], brandOutroSegmentVoiceSettings(i));
        if (!part) return null;
        parts.push(part);
      }
      const mp3 = Buffer.concat(parts);
      return { mp3, modelId, bytes: mp3.length, preset, hook_delivery: 'brand_split_v1' };
    }
  }

  const mp3 = await synthOne.call(this, spoken, voice_settings);
  if (!mp3) return null;
  return { mp3, modelId, bytes: mp3.length, preset };
}

async function uploadTtsMp3ToDrive(fileName, mp3Buffer, folderId) {
  const boundary = `magnix_tts_${Date.now()}`;
  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
    mimeType: 'audio/mpeg',
  });
  const buf = Buffer.isBuffer(mp3Buffer) ? mp3Buffer : Buffer.from(mp3Buffer);
  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: audio/mpeg\r\n\r\n`),
    buf,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const uploaded = await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'POST',
    url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id&supportsAllDrives=true',
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body: multipartBody,
    json: true,
  });

  if (!uploaded?.id) return null;

  await this.helpers.httpRequestWithAuthentication.call(this, 'googleApi', {
    method: 'POST',
    url: `https://www.googleapis.com/drive/v3/files/${uploaded.id}/permissions?supportsAllDrives=true`,
    headers: { 'Content-Type': 'application/json' },
    body: { type: 'anyone', role: 'reader' },
    json: true,
  });

  return `https://drive.google.com/uc?export=download&id=${uploaded.id}`;
}

async function fetchDirectElevenLabsToDrive(beats, jobId) {
  const folderId = $env.DRIVE_VIDEO_FOLDER_READY || $env.GOOGLE_DRIVE_FOLDER_ID || '';
  if (!$env.ELEVENLABS_API_KEY || !$env.ELEVENLABS_VOICE_ID || !folderId) {
    return { ok: false, reason: 'NO_DIRECT_ELEVENLABS_OR_DRIVE_FOLDER' };
  }

  const tracks = [];
  const errors = [];
  for (let i = 0; i < beats.length; i += 1) {
    const spoken = String(beats[i]?.spoken || '').trim();
    if (!spoken) continue;
    try {
      const synth = await synthesizeDirectElevenLabs.call(this, spoken, {
        role: beats[i]?.role,
        beat_index: i,
        spoken_motivate: beats[i]?.spoken_motivate,
        spoken_tagline: beats[i]?.spoken_tagline,
      });
      if (!synth) {
        errors.push({ beat_index: i, error: 'SYNTH_EMPTY' });
        continue;
      }
      const fileName = `magnix-tts-${jobId}-${i}.mp3`.slice(0, 120);
      const audioUrl = await uploadTtsMp3ToDrive.call(this, fileName, synth.mp3, folderId);
      if (!audioUrl) {
        errors.push({ beat_index: i, error: 'DRIVE_UPLOAD_FAIL' });
        continue;
      }
      tracks.push({
        beat_index: i,
        audio_url: audioUrl,
        bytes: synth.bytes,
        duration_sec: estimateMp3DurationSec(synth.bytes),
      });
    } catch (e) {
      errors.push({ beat_index: i, error: String(e.message || e).slice(0, 120) });
    }
  }

  return {
    ok: tracks.length > 0,
    provider: 'elevenlabs_direct',
    model_id: $env.ELEVENLABS_MODEL_ID || DEFAULT_VI_MODEL_ID,
    tracks,
    errors: errors.length ? errors : undefined,
  };
}

function applyTtsTracks(sceneMedia, ttsResult, jobId, ttsLog) {
  if (!ttsResult?.tracks || !Array.isArray(ttsResult.tracks)) return 0;
  ttsLog.provider = ttsResult.provider || 'elevenlabs';
  ttsLog.model_id = ttsResult.model_id || null;
  ttsLog.text_preview = ttsResult.requested_text_preview || null;
  let ok = 0;
  for (const tr of ttsResult.tracks) {
    const idx = Number(tr.beat_index);
    if (!Number.isFinite(idx) || !sceneMedia[idx] || !tr.audio_url) continue;
    const separator = String(tr.audio_url).includes('?') ? '&' : '?';
    sceneMedia[idx].audioUrl = `${tr.audio_url}${separator}v=${encodeURIComponent(jobId)}`;
    sceneMedia[idx].audioDurationSec = Number(tr.duration_sec) || estimateMp3DurationSec(tr.bytes);
    ok += 1;
  }
  if (ttsResult.errors) ttsLog.errors = ttsResult.errors;
  ttsLog.ok_count = ok;
  return ok;
}

const beats = parseBeatsJson(row.beats_json);
const durationSec = Number(row.duration_sec || 30) || 30;
const specCheck = validateBeatsRenderSpec(beats);

if (!specCheck.ok) {
  return [{
    json: {
      ok: false,
      error: 'INVALID_BEATS_RENDER_SPEC',
      hint: 'Re-run Agent 6 (production_brief_version: 3) — mỗi beat broll cần visual_spec.stock_query tiếng Anh',
      sheet_row: row.sheet_row,
      source_normalized_key: row.source_normalized_key,
      render_spec_errors: specCheck.errors.slice(0, 8),
      beat_count: specCheck.beat_count || beats.length,
    },
  }];
}

const renderBeats = prepareBeatsForRender(beats);
const sceneMedia = [];
const pexelsLog = [];
const segment = row.segment || 'general_inbound';
let pexelsHits = 0;

for (let i = 0; i < renderBeats.length; i += 1) {
  const beat = renderBeats[i];
  const query = resolvePexelsStockQuery(beat, segment);
  const entry = {
    beat_index: i,
    role: beat.role || null,
    stock_query: query,
    stock_query_source: 'visual_spec.stock_query',
    videoUrl: null,
    audioUrl: null,
  };

  if (query) {
    const pexelsResult = await pexelsPortraitUrl.call(this, query);
    if (typeof pexelsResult === 'string') {
      entry.videoUrl = pexelsResult;
      pexelsHits += 1;
    } else if (pexelsResult?.pexels_error) {
      entry.pexels_error = pexelsResult.pexels_error;
    }
  }

  pexelsLog.push({
    i,
    role: beat.role || null,
    query,
    ok: Boolean(entry.videoUrl),
  });
  sceneMedia.push(entry);
}

const minPexels = Math.min(2, renderBeats.length);
if ($env.PEXELS_API_KEY && pexelsHits < minPexels) {
  return [{
    json: {
      ok: false,
      error: 'PEXELS_LOW_HIT_RATE',
      hint: `Chỉ ${pexelsHits}/${renderBeats.length} scene có B-roll — kiểm tra stock_query EN cụ thể hơn`,
      sheet_row: row.sheet_row,
      pexels_scenes: pexelsLog,
    },
  }];
}

const baseJobId = String(row.source_normalized_key || `row-${row.sheet_row}`).slice(0, 60);
const jobId = `${baseJobId}-${Date.now()}`.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
const ttsLog = { provider: null, ok_count: 0, errors: null, model_id: null };

let ttsResult = await fetchElevenLabsBatch.call(this, renderBeats, jobId);
const vpsModelOk = ttsResult?.model_id ? isAcceptableTtsModel(ttsResult.model_id) : false;

if (ttsResult?.tracks?.length && !vpsModelOk) {
  ttsLog.vps_rejected = `model ${ttsResult.model_id} không hỗ trợ tiếng Việt — chuyển direct ElevenLabs`;
  ttsResult = { tracks: [] };
}

let okCount = applyTtsTracks(sceneMedia, ttsResult, jobId, ttsLog);

if (okCount === 0) {
  if (ttsResult?.tts_error) ttsLog.errors = ttsResult.tts_error;
  else if (ttsResult?.skipped) ttsLog.skipped = ttsResult.reason;

  const direct = await fetchDirectElevenLabsToDrive.call(this, renderBeats, jobId);
  if (direct.ok) {
    ttsLog.fallback = 'elevenlabs_direct_drive';
    okCount = applyTtsTracks(sceneMedia, direct, jobId, ttsLog);
  } else if (!ttsLog.errors) {
    ttsLog.direct_fail = direct.reason || direct.errors;
  }
}

if (okCount === 0) {
  return [{
    json: {
      ok: false,
      error: 'TTS_VIETNAMESE_FAILED',
      hint: 'Deploy webhooks/video-tts (eleven_flash_v2_5) HOẶC set ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID trên n8n env',
      sheet_row: row.sheet_row,
      tts: ttsLog,
    },
  }];
}

const hasElevenLabs = okCount > 0;

const renderSource = buildCreatomateSourceFromBeats({
  beats: renderBeats,
  duration_sec: durationSec,
  segment: row.segment,
  title: row.title,
  cta_keyword: row.cta_keyword,
  sceneMedia,
  useCreatomateVoice: !hasElevenLabs && String($env.CREATOMATE_DISABLE_VOICE || '') !== 'true',
  voiceProvider: $env.CREATOMATE_VOICE_PROVIDER || 'google',
  voiceId: $env.CREATOMATE_VOICE_ID || undefined,
});

const payload = {
  ...renderSource,
  output_format: 'mp4',
  metadata: String(row.source_normalized_key || row.sheet_row || '').slice(0, 200),
};

return [{
  json: {
    ok: true,
    sheet_row: row.sheet_row,
    source_normalized_key: row.source_normalized_key,
    platform: row.platform,
    title: row.title,
    beats_count: beats.length,
    duration_sec: durationSec,
    render_duration_sec: payload.duration,
    pexels_scenes: pexelsLog,
    pexels_hit_rate: `${pexelsHits}/${renderBeats.length}`,
    tts: ttsLog,
    tts_job_id: jobId,
    render_engine: 'creatomate_renderscript_v2',
    creatomate_payload: payload,
    existing_meta: row.meta || {},
  },
}];
