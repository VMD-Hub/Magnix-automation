#!/usr/bin/env bash
# Deploy bản Testing — nhiều tài khoản Zalo quét QR được (không chỉ admin/dev).
# Chạy trên VPS: cd /opt/housex/housex-zalo-miniapp && bash scripts/deploy-testing.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "══════════════════════════════════════════════════"
echo "  House X Mini App — DEPLOY TESTING (khuyên dùng)"
echo "══════════════════════════════════════════════════"
echo "  Development = chỉ tài khoản Developer/Admin"
echo "  Testing     = mọi Zalo quét QR phiên bản này"
echo "══════════════════════════════════════════════════"
echo ""

npm run build:zmp

echo ""
echo "→ Đang gọi: zmp deploy --existing --testing"
echo "  (Nếu flag không hỗ trợ, CLI sẽ hỏi — chọn Testing)"
echo ""

if zmp deploy --existing --testing; then
  echo ""
  echo "OK — quét QR Testing, force-stop Zalo trước khi mở."
  exit 0
fi

echo ""
echo "Flag --testing không dùng được; chạy zmp deploy (chọn Testing bằng tay)."
exec zmp deploy
