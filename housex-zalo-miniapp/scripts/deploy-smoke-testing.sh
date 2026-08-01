#!/usr/bin/env bash
# Smoke — Dist=www trong .zmp-dist
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run build:smoke-zmp
node scripts/assert-www-ready.mjs
node scripts/prepare-zmp-dist.mjs

test -f "$ROOT/.zmp-dist/www/app-config.json"

cd "$ROOT/.zmp-dist"
echo "→ cwd=$(pwd)"
ls -la www/assets/
echo ""
echo "╔════════════════════════════════════╗"
echo "║  Dist folder → gõ:  www            ║"
echo "║  Version status → Testing          ║"
echo "╚════════════════════════════════════╝"
echo ""

zmp deploy --existing --testing || zmp deploy --existing
echo "OK nếu nền vàng SMOKE OK; log không có mock-agent.html"
