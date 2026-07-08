#!/usr/bin/env bash
# Ghi service account JSON từ base64 (tránh paste nano làm hỏng private_key).
# Usage (trên VPS):
#   echo '<paste-base64-one-line>' | ./scripts/decode-google-sa.sh
# Hoặc:
#   ./scripts/decode-google-sa.sh /tmp/sa.b64

set -euo pipefail

OUT="${GOOGLE_SA_OUT:-/opt/housex/secrets/google-sa.json}"
mkdir -p "$(dirname "$OUT")"
chmod 700 "$(dirname "$OUT")"

if [[ -n "${1:-}" ]]; then
  base64 -d "$1" > "$OUT"
else
  base64 -d > "$OUT"
fi

chmod 600 "$OUT"

if command -v python3 >/dev/null 2>&1; then
  python3 -m json.tool "$OUT" >/dev/null
elif command -v node >/dev/null 2>&1; then
  node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$OUT"
else
  echo "WARN: cài python3 hoặc node để validate JSON"
fi

echo "OK → $OUT"
grep -o '"client_email"[[:space:]]*:[[:space:]]*"[^"]*"' "$OUT" | head -1
