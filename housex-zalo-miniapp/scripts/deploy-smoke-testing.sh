#!/usr/bin/env bash
# Smoke từ .zmp-dist — nền vàng SMOKE OK.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run build:smoke-zmp
node scripts/assert-www-ready.mjs
node scripts/prepare-zmp-dist.mjs

cd "$ROOT/.zmp-dist"
echo "→ cwd=$(pwd)"
ls -la assets/
if [[ -f mock-agent.html ]]; then
  echo "FAIL: mock-agent.html trong dist"
  exit 1
fi
echo "Khi hỏi Dist → ."
zmp deploy --existing --testing || zmp deploy --existing
echo "OK nếu QR mở nền vàng SMOKE OK (và log không nhắc mock-agent.html)"
