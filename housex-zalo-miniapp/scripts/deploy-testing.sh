#!/usr/bin/env bash
# Deploy Testing — .zmp-dist + Dist=www (đúng path ZMP tìm app-config).
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
node scripts/prepare-zmp-dist.mjs

test -f "$ROOT/.zmp-dist/www/app-config.json"
test ! -f "$ROOT/.zmp-dist/www/mock-agent.html"
test ! -f "$ROOT/.zmp-dist/mock-agent.html"

cd "$ROOT/.zmp-dist"
echo ""
echo "→ cwd=$(pwd)"
echo "→ www/app-config.json OK"
ls -la www/assets/ | head -20
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  Khi hỏi Dist folder → gõ đúng:  www         ║"
echo "║  (KHÔNG gõ . và KHÔNG gõ đường dẫn tuyệt đối)║"
echo "║  Version status → Testing                    ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

if zmp deploy --existing --testing; then
  echo ""
  echo "OK — log KHÔNG được còn mock-agent.html"
  echo "Force-stop Zalo → quét QR Testing."
  exit 0
fi

exec zmp deploy --existing
