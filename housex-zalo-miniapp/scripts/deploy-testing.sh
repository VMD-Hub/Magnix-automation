#!/usr/bin/env bash
# Deploy Testing — LUÔN deploy từ thư mục www (tránh Dist=. → trắng màn).
# VPS: cd /opt/housex/housex-zalo-miniapp && bash scripts/deploy-testing.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ""
echo "══════════════════════════════════════════════════"
echo "  House X Mini App — DEPLOY TESTING"
echo "══════════════════════════════════════════════════"
echo ""

npm run build:zmp
node scripts/assert-www-ready.mjs

# zmp đọc .env / login state cạnh cwd — copy vào www rồi deploy tại đó
# để Dist mặc định "." = đúng bundle (assets/ khớp app-config).
cp -f "$ROOT/app-config.json" "$ROOT/www/app-config.json"
if [[ -f "$ROOT/.env" ]]; then
  cp -f "$ROOT/.env" "$ROOT/www/.env"
fi

cd "$ROOT/www"
echo ""
echo "→ cwd=$(pwd)"
echo "→ zmp deploy (Dist = .  tức thư mục www — KHÔNG chọn .. hay project root)"
echo ""

if zmp deploy --existing --testing; then
  echo ""
  echo "OK — force-stop Zalo → quét QR Testing."
  exit 0
fi

echo "Flag --testing không dùng được; chạy zmp deploy tay (Dist = .)."
exec zmp deploy --existing
