# Magnix — ElevenLabs TTS webhook (Agent 7)

Service: `webhooks/video-tts` · Port **8765** · Route prefix `/magnix/video-tts`

Agent 7 gọi webhook → ElevenLabs TTS tiếng Việt per beat → MP3 public URL → Creatomate `audio` element.

**Model bắt buộc:** `eleven_flash_v2_5` (hỗ trợ `vi`). `eleven_multilingual_v2` **không** đọc tiếng Việt đúng.

---

## 1. Cấu hình local / VPS

```powershell
copy webhooks\video-tts\.env.example webhooks\video-tts\.env
```

Điền:

```env
PORT=8765
MAGNIX_WEBHOOK_TOKEN=<cùng token n8n>
MAGNIX_VIDEO_TTS_PUBLIC_URL=http://103.57.221.93:8765
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=<voice multilingual VN từ dashboard>
ELEVENLABS_MODEL_ID=eleven_flash_v2_5
```

**Quan trọng:** `MAGNIX_VIDEO_TTS_PUBLIC_URL` phải là URL **Creatomate fetch được** (public IP hoặc domain + mở port 8765).

---

## 2. Deploy VPS

```powershell
node scripts/deploy-video-tts-vps.mjs
```

Hoặc thủ công:

```bash
cd /opt/magnix-video-tts
docker build -t magnix-video-tts .
docker run -d --name magnix-video-tts -p 8765:8765 --env-file .env \
  -v magnix_tts_data:/app/data --restart unless-stopped magnix-video-tts
```

Health: `curl http://103.57.221.93:8765/health`

---

## 3. Env n8n (`/root/n8n.env`)

Thêm:

```env
MAGNIX_VIDEO_TTS_URL=http://103.57.221.93:8765
MAGNIX_WEBHOOK_TOKEN=<cùng token>
PEXELS_API_KEY=
CREATOMATE_DISABLE_VOICE=false
```

Restart n8n container sau khi sửa.

---

## 4. API

### POST `/magnix/video-tts/batch`

Header: `Authorization: Bearer {MAGNIX_WEBHOOK_TOKEN}`

```json
{
  "job_id": "tiktok:abc123",
  "beats": [
    { "beat_index": 0, "spoken": "Thu nhập 15 triệu có vay NOXH được không?" },
    { "beat_index": 1, "spoken": "..." }
  ]
}
```

Response:

```json
{
  "ok": true,
  "job_id": "tiktok:abc123",
  "provider": "elevenlabs",
  "tracks": [
    { "beat_index": 0, "audio_url": "http://.../magnix/video-tts/audio/tiktok_abc123/0.mp3", "bytes": 45120 }
  ]
}
```

### GET `/magnix/video-tts/audio/{job_id}/{N}.mp3`

Public — Creatomate tải file khi render.

---

## 5. Luồng Agent 7

```
beats_json → Pexels (videoUrl) + video-tts batch (audioUrl)
         → buildCreatomateSourceFromBeats (ElevenLabs ưu tiên, fallback Creatomate voice)
         → Creatomate RenderScript → MP4
```

Sheet `meta`: `tts_provider: elevenlabs` khi thành công.

---

## 6. Dev local

```powershell
cd webhooks/video-tts
npm install
npm run dev
```

Test batch (PowerShell):

```powershell
$body = '{"job_id":"test-1","beats":[{"beat_index":0,"spoken":"Xin chao, day la test tieng Viet."}]}'
Invoke-RestMethod -Uri http://localhost:8765/magnix/video-tts/batch -Method POST `
  -Headers @{ Authorization = "Bearer YOUR_TOKEN" } -Body $body -ContentType application/json
```

---

## 7. Troubleshooting

| Lỗi | Fix |
|-----|-----|
| `NO_TTS_URL_OR_TOKEN` trên n8n | Set `MAGNIX_VIDEO_TTS_URL` + `MAGNIX_WEBHOOK_TOKEN` |
| `MISSING_MAGNIX_VIDEO_TTS_PUBLIC_URL` | URL public trong `.env` service |
| Creatomate không nghe voice | MP3 URL phải public — mở firewall port 8765 |
| `ELEVENLABS_401` | Kiểm tra API key / quota |
| Giọng đọc vô nghĩa / sai tiếng Việt | **Không dùng** `eleven_multilingual_v2` — model này không hỗ trợ `vi`. Set `ELEVENLABS_MODEL_ID=eleven_flash_v2_5` + redeploy `webhooks/video-tts` |
| Câu bị cắt giữa chừng | Workflow v2+ kéo dài scene theo `duration_sec` từ TTS — rebuild Agent 7 + redeploy TTS |
