#!/usr/bin/env bash
# Deploy đủ: web Proptech-HouseX + Mini App Testing.
# Chạy trên VPS: cd /opt/housex && bash housex-zalo-miniapp/scripts/deploy-full.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "══════════════════════════════════════════════════"
echo "  House X FULL DEPLOY — web + Mini App Testing"
echo "══════════════════════════════════════════════════"

git pull origin main

echo ""
echo "→ [1/2] Build + restart web (timnhaxahoi.com)"
cd "$ROOT/Proptech-HouseX"
npm run build
pm2 restart housex --update-env

echo ""
echo "→ [2/2] Mini App Testing"
cd "$ROOT/housex-zalo-miniapp"
bash scripts/deploy-testing.sh

echo ""
echo "OK — kiểm tra:"
echo "  https://timnhaxahoi.com/tai-chinh/bao-hiem-tai-san"
echo "  https://timnhaxahoi.com/tai-chinh/vay-mua-nha"
echo "  Mini App: force-stop Zalo → quét QR Testing mới"
echo "  Mục Dịch vụ phải hiện chữ nhỏ «bản dịch vụ 15c»"
