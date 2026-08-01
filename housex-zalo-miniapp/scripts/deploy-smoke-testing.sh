#!/usr/bin/env bash
# Smoke Testing — nền vàng SMOKE OK. Deploy từ www.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run build:smoke-zmp
node scripts/assert-www-ready.mjs

cp -f "$ROOT/app-config.json" "$ROOT/www/app-config.json"
if [[ -f "$ROOT/.env" ]]; then
  cp -f "$ROOT/.env" "$ROOT/www/.env"
fi

cd "$ROOT/www"
echo "→ cwd=$(pwd)  (smoke — Dist phải là . )"
ls -la assets/
zmp deploy --existing --testing || zmp deploy --existing
