#!/usr/bin/env bash
# Enable local SMS smoke sink on VPS (Round 2 Wave 3). Run from Proptech-HouseX.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"
SINK_URL="http://127.0.0.1:3000/api/admin/smoke/sms-webhook-sink"

touch "$ENV_FILE"
if grep -q '^SMS_WEBHOOK_URL=' "$ENV_FILE"; then
  sed -i "s|^SMS_WEBHOOK_URL=.*|SMS_WEBHOOK_URL=${SINK_URL}|" "$ENV_FILE"
else
  echo "SMS_WEBHOOK_URL=${SINK_URL}" >> "$ENV_FILE"
fi
if grep -q '^SMOKE_SMS_SINK_ENABLED=' "$ENV_FILE"; then
  sed -i 's|^SMOKE_SMS_SINK_ENABLED=.*|SMOKE_SMS_SINK_ENABLED=true|' "$ENV_FILE"
else
  echo 'SMOKE_SMS_SINK_ENABLED=true' >> "$ENV_FILE"
fi

echo "OK — .env wired for SMS smoke sink"
echo "Next: npm run build && pm2 restart housex"
echo "Then: TELESALES_SERVER_SEND_ENABLED=true SMOKE_NURTURE_REAL_CHANNEL=1 npm run go-live:smoke-nurture-real"
echo "After PASS: bash scripts/disable-smoke-sms-sink.sh"
