import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_VI_MODEL_ID, estimateMp3DurationSec, resolveVoiceSettings, synthesizeMp3WithMeta } from './elevenlabs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data', 'audio');

type BeatInput = {
  beat_index: number;
  spoken: string;
  role?: string;
  spoken_motivate?: string;
  spoken_tagline?: string;
};

function loadEnv(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const key of [
    'PORT',
    'MAGNIX_WEBHOOK_TOKEN',
    'MAGNIX_VIDEO_TTS_PUBLIC_URL',
    'ELEVENLABS_API_KEY',
    'ELEVENLABS_VOICE_ID',
    'ELEVENLABS_MODEL_ID',
    'AUDIO_RETENTION_HOURS',
  ]) {
    if (process.env[key]) map[key] = process.env[key]!;
  }
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i > 0) map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
    }
  }
  return map;
}

function safeJobId(raw: string): string {
  return String(raw || 'job')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 80);
}

function authOk(req: http.IncomingMessage, token: string): boolean {
  if (!token) return false;
  const h = req.headers.authorization || '';
  return h === `Bearer ${token}`;
}

function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function json(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function maskId(raw: string): string {
  const value = String(raw || '');
  if (!value) return '';
  if (value.length <= 8) return 'set';
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function normalizeVietnameseTtsText(raw: string): string {
  return String(raw || '')
    .replace(/\bNOXH\b/gi, 'nhà ở xã hội')
    .replace(/\bCHECKLIST\b/gi, 'cheklist')
    .replace(/\bSĐT\b/gi, 'số điện thoại')
    .replace(/\bBĐS\b/gi, 'bất động sản')
    .replace(/\bDTI\b/gi, 'tỷ lệ trả nợ trên thu nhập')
    .replace(/\bSME\b/gi, 'doanh nghiệp vừa và nhỏ')
    .replace(/\bCTA\b/gi, 'lời kêu gọi hành động')
    .replace(/\bL3\b/gi, 'duyệt thủ công')
    .replace(/\bZalo\b/gi, 'Da-lo')
    .replace(/[—–]/g, ', ')
    .replace(/\s*→\s*/g, ', ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanupOldAudio(retentionHours: number) {
  if (!fs.existsSync(DATA_DIR)) return;
  const maxAge = retentionHours * 3600 * 1000;
  const now = Date.now();
  for (const job of fs.readdirSync(DATA_DIR)) {
    const jobDir = path.join(DATA_DIR, job);
    try {
      const st = fs.statSync(jobDir);
      if (now - st.mtimeMs > maxAge) {
        fs.rmSync(jobDir, { recursive: true, force: true });
      }
    } catch {
      /* ignore */
    }
  }
}

async function handleBatch(
  env: Record<string, string>,
  body: { job_id?: string; beats?: BeatInput[]; disable_hook_preset?: boolean }
) {
  const apiKey = env.ELEVENLABS_API_KEY || '';
  const voiceId = env.ELEVENLABS_VOICE_ID || '';
  const modelId = env.ELEVENLABS_MODEL_ID || DEFAULT_VI_MODEL_ID;
  const publicBase = (env.MAGNIX_VIDEO_TTS_PUBLIC_URL || '').replace(/\/$/, '');

  if (!apiKey || !voiceId) {
    return { ok: false, error: 'MISSING_ELEVENLABS_CONFIG' };
  }
  if (!publicBase) {
    return { ok: false, error: 'MISSING_MAGNIX_VIDEO_TTS_PUBLIC_URL' };
  }

  const disableHookPreset = body.disable_hook_preset === true;

  const jobId = safeJobId(body.job_id || `job-${Date.now()}`);
  const beats = Array.isArray(body.beats) ? body.beats.slice(0, 12) : [];
  if (!beats.length) {
    return { ok: false, error: 'EMPTY_BEATS' };
  }

  const jobDir = path.join(DATA_DIR, jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  const tracks: {
    beat_index: number;
    audio_url: string;
    bytes: number;
    duration_sec: number;
    tts_preset?: string;
    hook_delivery?: string;
    tts_segments?: string[];
  }[] = [];
  const errors: { beat_index: number; error: string }[] = [];

  for (const b of beats) {
    const idx = Number(b.beat_index);
    const spoken = normalizeVietnameseTtsText(String(b.spoken || '')).slice(0, 800);
    if (!spoken) continue;

    try {
      const synth = await synthesizeMp3WithMeta({
        apiKey,
        voiceId,
        modelId,
        text: spoken,
        languageCode: 'vi',
        role: b.role,
        beatIndex: idx,
        disableHookPreset,
        spokenMotivate: b.spoken_motivate ? normalizeVietnameseTtsText(String(b.spoken_motivate)) : undefined,
        spokenTagline: b.spoken_tagline ? normalizeVietnameseTtsText(String(b.spoken_tagline)) : undefined,
      });
      const mp3 = synth.buffer;
      const filename = `${idx}.mp3`;
      fs.writeFileSync(path.join(jobDir, filename), mp3);
      tracks.push({
        beat_index: idx,
        audio_url: `${publicBase}/magnix/video-tts/audio/${jobId}/${filename}`,
        bytes: mp3.length,
        duration_sec: Math.round(estimateMp3DurationSec(mp3) * 100) / 100,
        tts_preset: synth.preset,
        ...(synth.hookDelivery ? { hook_delivery: synth.hookDelivery } : {}),
        ...(synth.segments?.length ? { tts_segments: synth.segments } : {}),
      });
    } catch (e) {
      errors.push({
        beat_index: idx,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return {
    ok: tracks.length > 0,
    job_id: jobId,
    provider: 'elevenlabs',
    model_id: modelId,
    voice_id: maskId(voiceId),
    hook_preset_enabled: !disableHookPreset,
    tracks,
    errors: errors.length ? errors : undefined,
  };
}

function serveAudio(jobId: string, filename: string, req: http.IncomingMessage, res: http.ServerResponse) {
  const safeName = path.basename(filename);
  if (!/^\d+\.mp3$/.test(safeName)) {
    res.writeHead(400);
    res.end('Bad filename');
    return;
  }
  const fp = path.join(DATA_DIR, safeJobId(jobId), safeName);
  if (!fs.existsSync(fp)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const stat = fs.statSync(fp);
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'public, max-age=86400',
    'Content-Length': String(stat.size),
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(fp).pipe(res);
}

async function main() {
  const env = loadEnv();
  const port = Number(env.PORT || 8765);
  const token = env.MAGNIX_WEBHOOK_TOKEN || '';
  const retention = Number(env.AUDIO_RETENTION_HOURS || 24);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  cleanupOldAudio(retention);
  setInterval(() => cleanupOldAudio(retention), 6 * 3600 * 1000);

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;

      if (req.method === 'GET' && pathname === '/health') {
        json(res, 200, {
          ok: true,
          service: 'video-tts',
          tts_features: 'hook_v3+brand_outro_v1',
          elevenlabs_config: {
            has_api_key: Boolean(env.ELEVENLABS_API_KEY),
            voice_id: maskId(env.ELEVENLABS_VOICE_ID || ''),
            model_id: env.ELEVENLABS_MODEL_ID || DEFAULT_VI_MODEL_ID,
            has_public_url: Boolean(env.MAGNIX_VIDEO_TTS_PUBLIC_URL),
          },
        });
        return;
      }

      const audioMatch = pathname.match(/^\/magnix\/video-tts\/audio\/([^/]+)\/([^/]+)$/);
      if ((req.method === 'GET' || req.method === 'HEAD') && audioMatch) {
        serveAudio(audioMatch[1], audioMatch[2], req, res);
        return;
      }

      if (pathname === '/magnix/video-tts/batch' && req.method === 'POST') {
        if (!authOk(req, token)) {
          json(res, 401, { ok: false, error: 'UNAUTHORIZED' });
          return;
        }
        const body = (await readJsonBody(req)) as {
          job_id?: string;
          beats?: BeatInput[];
          disable_hook_preset?: boolean;
        };
        const result = await handleBatch(env, body);
        json(res, result.ok ? 200 : 422, result);
        return;
      }

      json(res, 404, { ok: false, error: 'NOT_FOUND' });
    } catch (e) {
      console.error('[video-tts] error', e instanceof Error ? e.message : e);
      json(res, 500, { ok: false, error: 'INTERNAL_ERROR' });
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`[video-tts] listening on :${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
