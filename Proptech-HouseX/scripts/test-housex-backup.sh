#!/usr/bin/env bash
# Hermetic tests for House X off-site backup hooks. No network or real Drive.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/housex-backup-tests.XXXXXX")"
trap 'rm -rf -- "$WORK_DIR"' EXIT INT TERM

BIN="$WORK_DIR/bin"
REMOTE_STORE="$WORK_DIR/remote"
mkdir -p "$BIN" "$REMOTE_STORE"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

expect_failure() {
  if "$@" >/dev/null 2>&1; then
    fail "command unexpectedly succeeded: $*"
  fi
}

cat > "$BIN/rclone" <<'FAKE_RCLONE'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "config" && "${2:-}" == "show" ]]; then
  remote_name="${3:-remote}"
  if [[ "$remote_name" == "${FAKE_CRYPT_NAME:-housex-crypt}" ]]; then
    printf '[%s]\ntype = %s\nremote = %s\n' \
      "$remote_name" "${FAKE_RCLONE_TYPE:-crypt}" "${FAKE_CRYPT_TARGET:-housex-drive:encrypted}"
  else
    printf '[%s]\ntype = %s\n' "$remote_name" "${FAKE_BACKEND_TYPE:-drive}"
  fi
  exit 0
fi
[[ "${1:-}" == "copyto" ]] || exit 90
shift
if [[ "${1:-}" == "--immutable" ]]; then
  immutable=true
  shift
else
  immutable=false
fi
source_path="$1"
destination_path="$2"
remote_file() {
  printf '%s/%s' "$FAKE_RCLONE_STORE" "${1##*/}"
}
if [[ "$destination_path" == *:*/* ]]; then
  [[ "${FAKE_RCLONE_FAIL_UPLOAD:-0}" != "1" ]] || exit 41
  target="$(remote_file "$destination_path")"
  [[ "$immutable" != true || ! -e "$target" ]] || exit 42
  cp -- "$source_path" "$target"
elif [[ "$source_path" == *:*/* ]]; then
  cp -- "$(remote_file "$source_path")" "$destination_path"
  if [[ "${FAKE_RCLONE_CORRUPT_DOWNLOAD:-0}" == "1" && "$destination_path" == *.sql.gz ]]; then
    printf 'corrupt' >> "$destination_path"
  fi
else
  exit 91
fi
FAKE_RCLONE

cat > "$BIN/docker" <<'FAKE_DOCKER'
#!/usr/bin/env bash
set -euo pipefail
if [[ "${1:-}" == "ps" ]]; then
  printf '%s\n' "${HOUSEX_PG_CONTAINER:-housex-postgres}"
elif [[ "${1:-}" == "exec" ]]; then
  printf '%s\n' '-- PostgreSQL database dump'
  printf '%s\n' 'CREATE TABLE backup_test(id integer);'
else
  exit 92
fi
FAKE_DOCKER

cat > "$BIN/curl" <<'FAKE_CURL'
#!/usr/bin/env bash
set -euo pipefail
payload=""
response_file=""
while [[ "$#" -gt 0 ]]; do
  if [[ "$1" == "--data-binary" ]]; then
    payload="${2#@}"
    shift 2
  elif [[ "$1" == "--output" ]]; then
    response_file="$2"
    shift 2
  else
    shift
  fi
done
[[ -n "$payload" ]] || exit 93
cp -- "$payload" "$FAKE_CURL_PAYLOAD"
[[ "${FAKE_CURL_FAIL:-0}" != "1" ]] || exit 22
[[ -n "$response_file" ]] || exit 94
response="${FAKE_CURL_RESPONSE:-}"
[[ -n "$response" ]] || response='{"telegram_sent":true}'
printf '%s\n' "$response" > "$response_file"
if [[ -n "${FAKE_CURL_RESPONSE_CAPTURE:-}" ]]; then
  cp -- "$response_file" "$FAKE_CURL_RESPONSE_CAPTURE"
fi
FAKE_CURL

cat > "$BIN/id" <<'FAKE_ID'
#!/usr/bin/env bash
[[ "${1:-}" == "-u" ]] && printf '0\n'
FAKE_ID

cat > "$BIN/flock" <<'FAKE_FLOCK'
#!/usr/bin/env bash
exit 0
FAKE_FLOCK

cat > "$BIN/stat" <<'FAKE_STAT'
#!/usr/bin/env bash
case "${2:-}" in
  %u) printf '%s\n' "${FAKE_STAT_UID:-0}" ;;
  %a) printf '%s\n' "${FAKE_STAT_MODE:-600}" ;;
  *) exit 94 ;;
esac
FAKE_STAT

cat > "$BIN/python3" <<'FAKE_PYTHON'
#!/usr/bin/env bash
set -euo pipefail
body="$(command cat)"
if [[ "$body" == *'"telegram_sent":true'* ]]; then
  exit 0
fi
if [[ "$body" == *'"ok":true'* &&
  "$body" == *'"duplicate":true'* &&
  "$body" == *'"skipped":true'* &&
  "$body" == *'"reason":"DUPLICATE_EVENT_ID"'* ]]; then
  exit 0
fi
exit 1
FAKE_PYTHON

chmod +x "$BIN"/* \
  "$SCRIPT_DIR/housex-backup-offsite-upload.sh" \
  "$SCRIPT_DIR/housex-backup-offsite-verify.sh" \
  "$SCRIPT_DIR/housex-backup-cron.sh"

export PATH="$BIN:$PATH"
export FAKE_RCLONE_STORE="$REMOTE_STORE"
export FAKE_RCLONE_TYPE=crypt
export FAKE_CRYPT_TARGET=housex-drive:encrypted
export FAKE_BACKEND_TYPE=drive
export HOUSEX_BACKUP_RCLONE_REMOTE=housex-crypt:postgres

LOCAL="$WORK_DIR/local"
mkdir -p "$LOCAL"
BACKUP="$LOCAL/housex-2026-07-17_020000.sql.gz"
printf '%s\n' '-- PostgreSQL database dump' 'CREATE TABLE t(id integer);' | gzip -c > "$BACKUP"
(cd "$LOCAL" && printf '%s  %s\n' \
  "$(sha256sum "$(basename "$BACKUP")" | awk '{print $1}')" \
  "$(basename "$BACKUP")" > "$(basename "$BACKUP").sha256")
CHECKSUM="${BACKUP}.sha256"

"$SCRIPT_DIR/housex-backup-offsite-upload.sh" "$BACKUP" "$CHECKSUM" >/dev/null
"$SCRIPT_DIR/housex-backup-offsite-verify.sh" "$BACKUP" "$CHECKSUM" >/dev/null
printf 'PASS upload and independent download verification\n'

FAKE_RCLONE_CORRUPT_DOWNLOAD=1 expect_failure \
  "$SCRIPT_DIR/housex-backup-offsite-verify.sh" "$BACKUP" "$CHECKSUM"
printf 'PASS remote corruption is rejected\n'

expect_failure env -u HOUSEX_BACKUP_RCLONE_REMOTE \
  "$SCRIPT_DIR/housex-backup-offsite-upload.sh" "$BACKUP" "$CHECKSUM"
FAKE_RCLONE_TYPE=drive expect_failure \
  "$SCRIPT_DIR/housex-backup-offsite-upload.sh" "$BACKUP" "$CHECKSUM"
export FAKE_RCLONE_TYPE=crypt
FAKE_BACKEND_TYPE=local expect_failure \
  "$SCRIPT_DIR/housex-backup-offsite-upload.sh" "$BACKUP" "$CHECKSUM"
FAKE_BACKEND_TYPE=sftp expect_failure \
  "$SCRIPT_DIR/housex-backup-offsite-upload.sh" "$BACKUP" "$CHECKSUM"
export FAKE_BACKEND_TYPE=drive
printf 'PASS missing, plain, local, and sftp remotes are rejected\n'

cp -- "$CHECKSUM" "$REMOTE_STORE/$(basename "$CHECKSUM")"
printf '%064d  %s\n' 0 "$(basename "$BACKUP")" > "$REMOTE_STORE/$(basename "$CHECKSUM")"
expect_failure "$SCRIPT_DIR/housex-backup-offsite-verify.sh" "$BACKUP" "$CHECKSUM"
cp -- "$CHECKSUM" "$REMOTE_STORE/$(basename "$CHECKSUM")"
printf 'PASS downloaded checksum must match trusted local checksum\n'

FAILING_BACKUP="$WORK_DIR/failing-backup"
cat > "$FAILING_BACKUP" <<'FAIL_BACKUP'
#!/usr/bin/env bash
printf 'DATABASE_URL=postgresql://should-not-appear token=should-not-appear\n' >&2
exit 42
FAIL_BACKUP
chmod +x "$FAILING_BACKUP"
ENV_FILE="$WORK_DIR/backup.env"
RCLONE_CONFIG_FILE="$WORK_DIR/rclone.conf"
printf '[housex-crypt]\ntype = crypt\n' > "$RCLONE_CONFIG_FILE"
cat > "$ENV_FILE" <<EOF_ENV
HOUSEX_BACKUP_SCRIPT=$FAILING_BACKUP
HOUSEX_BACKUP_OFFSITE_HOOK=$SCRIPT_DIR/housex-backup-offsite-upload.sh
HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK=$SCRIPT_DIR/housex-backup-offsite-verify.sh
RCLONE_CONFIG=$RCLONE_CONFIG_FILE
MAGNIX_TELEGRAM_NOTIFY_WEBHOOK_URL=https://n8n.invalid/webhook/magnix/telegram-notify
MAGNIX_WEBHOOK_TOKEN=unit-test-token-123456789
EOF_ENV
export FAKE_CURL_PAYLOAD="$WORK_DIR/alert.json"
set +e
WRAPPER_OUTPUT="$(HOUSEX_BACKUP_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/housex-backup-cron.sh" 2>&1)"
WRAPPER_EXIT=$?
set -e
[[ "$WRAPPER_EXIT" -eq 42 ]] || fail "wrapper did not preserve backup exit code"
[[ -s "$FAKE_CURL_PAYLOAD" ]] || fail "failure alert was not posted: $WRAPPER_OUTPUT"
grep -q '"event_type":"workflow_blocked"' "$FAKE_CURL_PAYLOAD" ||
  fail "workflow_blocked payload missing"
grep -q 'housex-backup:.*:workflow_blocked' "$FAKE_CURL_PAYLOAD" ||
  fail "deduplicated event id missing"
[[ "$WRAPPER_OUTPUT" != *"postgresql://"* && "$WRAPPER_OUTPUT" != *"should-not-appear"* ]] ||
  fail "sensitive subprocess output escaped sanitization"
export FAKE_CURL_FAIL=1
set +e
HOUSEX_BACKUP_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/housex-backup-cron.sh" >/dev/null 2>&1
ALERT_FAILURE_EXIT=$?
set -e
unset FAKE_CURL_FAIL
[[ "$ALERT_FAILURE_EXIT" -eq 42 ]] ||
  fail "alert delivery failure hid the authoritative backup exit code"
export FAKE_CURL_RESPONSE='{"ok":true,"telegram_sent":false}'
set +e
FALSE_ALERT_OUTPUT="$(HOUSEX_BACKUP_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/housex-backup-cron.sh" 2>&1)"
FALSE_ALERT_EXIT=$?
set -e
[[ "$FALSE_ALERT_EXIT" -eq 42 && "$FALSE_ALERT_OUTPUT" == *"did not confirm"* ]] ||
  fail "HTTP 200 telegram_sent:false was incorrectly accepted"
export FAKE_CURL_RESPONSE='{"ok":true,"telegram_sent":false,"duplicate":true,"skipped":true,"reason":"DUPLICATE_EVENT_ID"}'
export FAKE_CURL_RESPONSE_CAPTURE="$WORK_DIR/response-capture.json"
set +e
DUPLICATE_OUTPUT="$(HOUSEX_BACKUP_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/housex-backup-cron.sh" 2>&1)"
DUPLICATE_EXIT=$?
set -e
[[ "$DUPLICATE_EXIT" -eq 42 && "$DUPLICATE_OUTPUT" != *"did not confirm"* ]] ||
  fail "explicit duplicate alert response was not accepted safely: $(<"$FAKE_CURL_RESPONSE_CAPTURE") :: $DUPLICATE_OUTPUT"
unset FAKE_CURL_RESPONSE
unset FAKE_CURL_RESPONSE_CAPTURE
export FAKE_STAT_MODE=777
expect_failure env HOUSEX_BACKUP_ENV_FILE="$ENV_FILE" "$SCRIPT_DIR/housex-backup-cron.sh"
unset FAKE_STAT_MODE
printf 'PASS alerts require delivery proof and runtime rejects unsafe modes\n'

RETENTION_DIR="$WORK_DIR/retention"
mkdir -p "$RETENTION_DIR"
OLD_BACKUP="$RETENTION_DIR/housex-2026-01-01_000000.sql.gz"
printf '%s\n' '-- PostgreSQL database dump' 'CREATE TABLE old_ok(id integer);' | gzip -c > "$OLD_BACKUP"
printf '%s  %s\n' "$(sha256sum "$OLD_BACKUP" | awk '{print $1}')" \
  "$(basename "$OLD_BACKUP")" > "${OLD_BACKUP}.sha256"
touch -d '30 days ago' "$OLD_BACKUP" "${OLD_BACKUP}.sha256"
export HOUSEX_BACKUP_DIR="$RETENTION_DIR"
export HOUSEX_BACKUP_RETENTION_DAYS=0
export HOUSEX_BACKUP_OFFSITE_HOOK="$SCRIPT_DIR/housex-backup-offsite-upload.sh"
export HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK="$SCRIPT_DIR/housex-backup-offsite-verify.sh"
rm -f -- "$REMOTE_STORE"/*
"$SCRIPT_DIR/housex-backup-offsite-upload.sh" "$OLD_BACKUP" "${OLD_BACKUP}.sha256" >/dev/null
bash "$SCRIPT_DIR/backup-postgres-vps.sh" >/dev/null
[[ ! -e "$OLD_BACKUP" && ! -e "${OLD_BACKUP}.sha256" ]] ||
  fail "verified expired backup was not pruned"
printf 'PASS per-object verified backup is pruned\n'

rm -rf -- "$RETENTION_DIR" "$REMOTE_STORE"
mkdir -p "$RETENTION_DIR" "$REMOTE_STORE"
OLD_BACKUP="$RETENTION_DIR/housex-2026-01-02_000000.sql.gz"
printf '%s\n' '-- PostgreSQL database dump' 'CREATE TABLE old_blocked(id integer);' | gzip -c > "$OLD_BACKUP"
printf '%s  %s\n' "$(sha256sum "$OLD_BACKUP" | awk '{print $1}')" \
  "$(basename "$OLD_BACKUP")" > "${OLD_BACKUP}.sha256"
touch -d '30 days ago' "$OLD_BACKUP" "${OLD_BACKUP}.sha256"
MISSING_CHECKSUM_BACKUP="$RETENTION_DIR/housex-2026-01-03_000000.sql.gz"
printf '%s\n' '-- PostgreSQL database dump' 'CREATE TABLE old_no_checksum(id integer);' |
  gzip -c > "$MISSING_CHECKSUM_BACKUP"
touch -d '30 days ago' "$MISSING_CHECKSUM_BACKUP"
expect_failure bash "$SCRIPT_DIR/backup-postgres-vps.sh"
[[ -f "$OLD_BACKUP" && -f "${OLD_BACKUP}.sha256" ]] ||
  fail "unverifiable expired backup was pruned"
[[ -f "$MISSING_CHECKSUM_BACKUP" ]] ||
  fail "expired backup without trusted checksum was pruned"
printf 'PASS unverifiable prune candidate is preserved and fails run\n'

printf 'PASS all House X backup tests\n'
