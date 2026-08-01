#!/usr/bin/env bash
# Deploy Testing từ .zmp-dist sạch (Dist=. không kéo mock-agent / src).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ""
echo "══════════════════════════════════════════════════"
echo "  House X Mini App — DEPLOY TESTING (.zmp-dist)"
echo "══════════════════════════════════════════════════"
echo ""

npm run build:zmp
node scripts/assert-www-ready.mjs
node scripts/prepare-zmp-dist.mjs

cd "$ROOT/.zmp-dist"
echo ""
echo "→ cwd=$(pwd)"
echo "→ ls:"
ls -la
echo "→ assets:"
ls -la assets/
echo ""
echo "Khi CLI hỏi Dist → gõ: .     (đang ở .zmp-dist)"
echo "Version status → Testing"
echo ""

# Không được có mock-agent
if [[ -f mock-agent.html ]]; then
  echo "FAIL: mock-agent.html vẫn còn trong .zmp-dist"
  exit 1
fi

if zmp deploy --existing --testing; then
  echo ""
  echo "OK — kiểm tra log: KHÔNG được còn dòng mock-agent.html"
  echo "Force-stop Zalo → quét QR Testing."
  exit 0
fi

exec zmp deploy --existing
