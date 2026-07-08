#!/usr/bin/env bash
# Ghi service account JSON từ base64 (tránh paste nano làm hỏng private_key).
# Usage (trên VPS):
#   ./scripts/decode-google-sa.sh /tmp/sa.b64
# Hoặc stdin:
#   cat /tmp/sa.b64 | ./scripts/decode-google-sa.sh

set -euo pipefail

OUT="${GOOGLE_SA_OUT:-/opt/housex/secrets/google-sa.json}"
mkdir -p "$(dirname "$OUT")"
chmod 700 "$(dirname "$OUT")"

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

if [[ -n "${1:-}" ]]; then
  # Bỏ whitespace / xuống dòng thừa (nano paste hay thêm)
  tr -d ' \t\r\n' <"$1" >"$TMP"
else
  tr -d ' \t\r\n' >"$TMP"
fi

B64_LEN=$(wc -c <"$TMP" | tr -d ' ')
if [[ "$B64_LEN" -lt 2000 ]]; then
  echo "FAIL: base64 quá ngắn ($B64_LEN bytes) — copy thiếu hoặc file rỗng" >&2
  exit 1
fi

B64_HEAD=$(head -c 3 "$TMP")
if [[ "$B64_HEAD" != eyJ ]]; then
  echo "FAIL: base64 phải bắt đầu bằng eyJ (hiện: $B64_HEAD)" >&2
  echo "  → Có thể bạn paste JSON thô vào .b64 thay vì dòng base64 từ Windows." >&2
  exit 1
fi

base64 -d <"$TMP" >"$OUT"
chmod 600 "$OUT"

OUT_LEN=$(wc -c <"$OUT" | tr -d ' ')
OUT_HEAD=$(head -c 1 "$OUT")
if [[ "$OUT_HEAD" != "{" ]]; then
  echo "FAIL: sau decode file không phải JSON (byte đầu: $(xxd -p -l 1 "$OUT" 2>/dev/null || echo '?'))" >&2
  echo "  → Làm lại: Windows .\\scripts\\export-google-sa-base64.ps1 → copy file .b64.txt" >&2
  rm -f "$OUT"
  exit 1
fi

if command -v python3 >/dev/null 2>&1; then
  python3 -m json.tool "$OUT" >/dev/null
elif command -v node >/dev/null 2>&1; then
  node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" "$OUT"
else
  echo "WARN: cài python3 hoặc node để validate JSON"
fi

echo "OK → $OUT ($OUT_LEN bytes)"
grep -o '"client_email"[[:space:]]*:[[:space:]]*"[^"]*"' "$OUT" | head -1
