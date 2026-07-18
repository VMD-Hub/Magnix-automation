#!/usr/bin/env bash
# Disable local SMS smoke sink after Wave 3 PASS. Run from Proptech-HouseX.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

touch "$ENV_FILE"
if grep -q '^SMS_WEBHOOK_URL=' "$ENV_FILE"; then
  sed -i 's|^SMS_WEBHOOK_URL=.*|SMS_WEBHOOK_URL=|' "$ENV_FILE"
fi
if grep -q '^SMOKE_SMS_SINK_ENABLED=' "$ENV_FILE"; then
  sed -i 's|^SMOKE_SMS_SINK_ENABLED=.*|SMOKE_SMS_SINK_ENABLED=false|' "$ENV_FILE"
else
  echo 'SMOKE_SMS_SINK_ENABLED=false' >> "$ENV_FILE"
fi
if grep -q '^TELESALES_SERVER_SEND_ENABLED=' "$ENV_FILE"; then
  sed -i 's|^TELESALES_SERVER_SEND_ENABLED=.*|TELESALES_SERVER_SEND_ENABLED=false|' "$ENV_FILE"
fi

echo "OK — smoke sink + telesales server send disabled in .env"
echo "Next: pm2 restart housex"
