# Webhooks

Mini HTTP server TypeScript — dùng khi logic vượt quá Code node trên n8n.

## Khi nào thêm service mới

- Validate chữ ký phức tạp (HMAC, replay protection)
- Batch transform UID lớn
- Rate limit / queue trước khi ghi Sheet

## Scaffold

```text
webhooks/my-service/
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    └── server.ts
```

n8n gọi: `POST /magnix/my-service/{action}` với header `Authorization: Bearer $MAGNIX_WEBHOOK_TOKEN`.

## Services

| Service | Port | Route | Mô tả |
|---------|------|-------|--------|
| `video-tts` | 8765 | `/magnix/video-tts/batch` | ElevenLabs TTS per beat → MP3 URL (Agent 7) |

Setup: `n8n-workflows/VIDEO_TTS_SETUP.md` · Deploy: `node scripts/deploy-video-tts-vps.mjs`
