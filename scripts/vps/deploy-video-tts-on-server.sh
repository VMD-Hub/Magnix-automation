#!/bin/bash
# Chạy TRÊN VPS — build + run magnix-video-tts (Docker)
# Yêu cầu: webhooks/video-tts/.env đã có ELEVENLABS_* + MAGNIX_WEBHOOK_TOKEN
#
# Cách 1 — từ repo đã clone:
#   cd /opt/magnix-automation && bash scripts/vps/deploy-video-tts-on-server.sh
#
# Cách 2 — thư mục deploy độc lập:
#   MAGNIX_TTS_DIR=/opt/magnix-video-tts bash scripts/vps/deploy-video-tts-on-server.sh

set -euo pipefail

REPO="${MAGNIX_REPO_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
TTS_DIR="${MAGNIX_TTS_DIR:-$REPO/webhooks/video-tts}"
ENV_FILE="$TTS_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE — copy from .env.example and fill secrets"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not found — install Docker trước"
  exit 1
fi

cd "$TTS_DIR"
echo "[$(date -Iseconds)] build magnix-video-tts in $TTS_DIR"

docker rm -f magnix-video-tts 2>/dev/null || true
docker build -t magnix-video-tts:latest .
docker run -d \
  --name magnix-video-tts \
  --restart unless-stopped \
  -p 8765:8765 \
  --env-file .env \
  -v magnix_tts_data:/app/data \
  magnix-video-tts:latest

# Mở firewall nếu có ufw
if command -v ufw >/dev/null 2>&1; then
  ufw allow 8765/tcp comment 'Magnix video-tts' 2>/dev/null || true
fi

docker ps --filter name=magnix-video-tts --format '{{.Names}} {{.Status}}'
sleep 2
curl -sf "http://127.0.0.1:8765/health" && echo || {
  echo "Health check failed — xem: docker logs magnix-video-tts --tail 40"
  exit 1
}

echo "[$(date -Iseconds)] magnix-video-tts deploy done"
