#!/bin/bash
# Cài magnix-video-tts từ pack đã unzip (chạy TRÊN VPS)
# Ví dụ:
#   cd /root && unzip -o magnix-video-tts-*.zip -d /tmp/magnix-tts-pack
#   sed -i 's/\r$//' /tmp/magnix-tts-pack/install.sh
#   bash /tmp/magnix-tts-pack/install.sh

set -euo pipefail

TARGET="${MAGNIX_TTS_DIR:-/opt/magnix-video-tts}"
SRC="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "$SRC/package.json" ] || [ ! -d "$SRC/src" ]; then
  echo "Thiếu package.json hoặc src/ — chạy từ thư mục pack đã unzip"
  exit 1
fi

mkdir -p "$TARGET"
cp -f "$SRC/package.json" "$SRC/tsconfig.json" "$SRC/Dockerfile" "$TARGET/"
rm -rf "$TARGET/src"
cp -a "$SRC/src" "$TARGET/src"

# Sửa CRLF nếu pack tạo từ Windows
find "$TARGET" -type f \( -name '*.ts' -o -name '*.json' -o -name 'Dockerfile' \) -exec sed -i 's/\r$//' {} + 2>/dev/null || true

if [ ! -f "$TARGET/.env" ]; then
  echo "Chưa có $TARGET/.env — cần file .env với ELEVENLABS_* và MAGNIX_WEBHOOK_TOKEN"
  exit 1
fi

cd "$TARGET"
echo "[$(date -Iseconds)] build in $TARGET"
docker rm -f magnix-video-tts 2>/dev/null || true
docker build --no-cache -t magnix-video-tts:latest .
docker run -d \
  --name magnix-video-tts \
  --restart unless-stopped \
  -p 8765:8765 \
  --env-file .env \
  -v magnix_tts_data:/app/data \
  magnix-video-tts:latest

sleep 2
HEALTH="$(curl -sf http://127.0.0.1:8765/health || true)"
echo "health: ${HEALTH:-FAIL}"
docker ps --filter name=magnix-video-tts --format '{{.Names}} {{.Status}}'

echo ""
echo "Test preset (hook) tu VPS:"
TOKEN="$(grep -E '^MAGNIX_WEBHOOK_TOKEN=' .env | cut -d= -f2- | tr -d '\r')"
curl -sf -X POST http://127.0.0.1:8765/magnix/video-tts/batch \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"job_id":"install-test","beats":[{"beat_index":0,"spoken":"Thu nhập mười lăm triệu có đủ điều kiện mua nhà ở xã hội không?","role":"hook"}]}' \
  | head -c 500
echo ""
echo "[$(date -Iseconds)] done — tren Windows: node scripts/run-agent7-preflight.mjs"
