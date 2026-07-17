#!/usr/bin/env bash
# Root cron entrypoint: securely load config, run backup, alert on failure.

set -uo pipefail
umask 077

ENV_FILE="${HOUSEX_BACKUP_ENV_FILE:-/etc/housex/backup.env}"
TEMP_DIR=""

cleanup() {
  if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
    rm -rf -- "$TEMP_DIR"
  fi
}
trap cleanup EXIT INT TERM

fail_config() {
  printf 'ERROR: House X backup wrapper configuration invalid: %s\n' "$1" >&2
  exit 1
}

assert_secure_parent_chain() {
  local path="$1"
  local parent owner mode
  parent="$(dirname -- "$path")"
  while :; do
    [[ -d "$parent" && ! -L "$parent" ]] || fail_config "unsafe executable/config parent directory"
    owner="$(stat -c '%u' "$parent" 2>/dev/null)" || fail_config "cannot inspect parent owner"
    mode="$(stat -c '%a' "$parent" 2>/dev/null)" || fail_config "cannot inspect parent permissions"
    [[ "$owner" == "0" && "$mode" =~ ^[0-7]{3,4}$ ]] ||
      fail_config "parent directories must be root-owned"
    (( (8#$mode & 022) == 0 )) || fail_config "parent directories must not be group/other writable"
    [[ "$parent" == "/" ]] && break
    parent="$(dirname -- "$parent")"
  done
}

assert_secure_executable() {
  local path="$1"
  local owner mode
  [[ "$path" == /* && -f "$path" && -x "$path" && ! -L "$path" ]] ||
    fail_config "executable must be an absolute regular non-symlink file"
  owner="$(stat -c '%u' "$path" 2>/dev/null)" || fail_config "cannot inspect executable owner"
  mode="$(stat -c '%a' "$path" 2>/dev/null)" || fail_config "cannot inspect executable permissions"
  [[ "$owner" == "0" && "$mode" =~ ^[0-7]{3,4}$ ]] ||
    fail_config "executables must be root-owned"
  (( (8#$mode & 022) == 0 )) || fail_config "executables must not be group/other writable"
  assert_secure_parent_chain "$path"
}

[[ "$(id -u)" == "0" ]] || fail_config "must run as root"
assert_secure_executable "$0"
[[ "$ENV_FILE" == /* && -f "$ENV_FILE" && ! -L "$ENV_FILE" ]] ||
  fail_config "root env file must be an absolute regular non-symlink file"
ENV_OWNER="$(stat -c '%u' "$ENV_FILE" 2>/dev/null)" || fail_config "cannot inspect env owner"
ENV_MODE="$(stat -c '%a' "$ENV_FILE" 2>/dev/null)" || fail_config "cannot inspect env permissions"
[[ "$ENV_OWNER" == "0" ]] || fail_config "env file must be owned by root"
[[ "$ENV_MODE" =~ ^[0-7]{3,4}$ ]] || fail_config "env mode is invalid"
(( (8#$ENV_MODE & 077) == 0 )) || fail_config "env file must not grant group/other access"
assert_secure_parent_chain "$ENV_FILE"

set -a
# shellcheck disable=SC1090 -- fixed/explicit root-owned operations file.
source "$ENV_FILE"
set +a

RCLONE_CONFIG_PATH="${RCLONE_CONFIG:-}"
[[ "$RCLONE_CONFIG_PATH" == /* && -f "$RCLONE_CONFIG_PATH" && ! -L "$RCLONE_CONFIG_PATH" ]] ||
  fail_config "RCLONE_CONFIG must be an absolute regular non-symlink file"
RCLONE_OWNER="$(stat -c '%u' "$RCLONE_CONFIG_PATH" 2>/dev/null)" ||
  fail_config "cannot inspect rclone config owner"
RCLONE_MODE="$(stat -c '%a' "$RCLONE_CONFIG_PATH" 2>/dev/null)" ||
  fail_config "cannot inspect rclone config permissions"
[[ "$RCLONE_OWNER" == "0" && "$RCLONE_MODE" =~ ^[0-7]{3,4}$ ]] ||
  fail_config "rclone config must be root-owned"
(( (8#$RCLONE_MODE & 077) == 0 )) ||
  fail_config "rclone config must not grant group/other access"
assert_secure_parent_chain "$RCLONE_CONFIG_PATH"

BACKUP_SCRIPT="${HOUSEX_BACKUP_SCRIPT:-/usr/local/libexec/housex-backup/backup-postgres-vps.sh}"
assert_secure_executable "$BACKUP_SCRIPT"
assert_secure_executable "${HOUSEX_BACKUP_OFFSITE_HOOK:-}"
assert_secure_executable "${HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK:-}"
command -v mktemp >/dev/null 2>&1 || fail_config "mktemp is required"
command -v curl >/dev/null 2>&1 || fail_config "curl is required"
command -v python3 >/dev/null 2>&1 || fail_config "python3 is required"
command -v wc >/dev/null 2>&1 || fail_config "wc is required"

TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/housex-backup-cron.XXXXXX")" ||
  fail_config "cannot create temporary directory"

set +e
"$BACKUP_SCRIPT" >/dev/null 2>&1
BACKUP_EXIT=$?
set -e

if [[ "$BACKUP_EXIT" -eq 0 ]]; then
  printf 'OK House X daily backup completed\n'
  exit 0
fi

# Never replay subprocess output: docker/rclone errors can contain URLs or config.
# Keep status bounded and deterministic for logs and notification dedupe.
if [[ "$BACKUP_EXIT" -gt 125 ]]; then
  SAFE_EXIT=125
else
  SAFE_EXIT="$BACKUP_EXIT"
fi
printf 'ERROR: House X daily backup failed exit=%s; local retention remained fail-closed\n' "$SAFE_EXIT" >&2

WEBHOOK_URL="${MAGNIX_TELEGRAM_NOTIFY_WEBHOOK_URL:-}"
WEBHOOK_TOKEN="${HOUSEX_BACKUP_ALERT_TOKEN:-}"
if [[ ! "$WEBHOOK_URL" =~ ^https://[^[:space:]]+$ ]] ||
  [[ "$WEBHOOK_URL" == *\"* || "$WEBHOOK_URL" == *\\* ]] ||
  [[ "${#WEBHOOK_TOKEN}" -lt 16 || "${#WEBHOOK_TOKEN}" -gt 512 ]] ||
  [[ "$WEBHOOK_TOKEN" == *[!A-Za-z0-9._~-]* ]]; then
  printf 'ERROR: backup alert was not sent because webhook configuration is missing or invalid\n' >&2
  exit "$BACKUP_EXIT"
fi

EVENT_DATE="$(date -u +%F)"
EVENT_ID="housex-backup:${EVENT_DATE}:workflow_blocked"
PAYLOAD_FILE="$TEMP_DIR/payload.json"
CURL_CONFIG="$TEMP_DIR/curl.conf"
RESPONSE_FILE="$TEMP_DIR/response.json"
printf '{"event_id":"%s","event_type":"workflow_blocked","agent":"House X Backup","severity":"critical","product_type":"postgres_backup","title":"House X off-VPS backup blocked","message":"Daily backup failed (exit=%s). Local retention remained fail-closed. Run a controlled root-only diagnostic.","status":"pending"}\n' \
  "$EVENT_ID" "$SAFE_EXIT" > "$PAYLOAD_FILE"
printf 'silent\nshow-error\nfail\nmax-time = 15\nurl = "%s"\nheader = "Authorization: Bearer %s"\nheader = "Content-Type: application/json"\n' \
  "$WEBHOOK_URL" "$WEBHOOK_TOKEN" > "$CURL_CONFIG"

if ! curl --config "$CURL_CONFIG" --request POST --max-filesize 4096 \
  --output "$RESPONSE_FILE" --data-binary "@$PAYLOAD_FILE" >/dev/null 2>&1; then
  printf 'ERROR: backup alert delivery failed; backup failure remains authoritative\n' >&2
elif [[ ! -s "$RESPONSE_FILE" || "$(wc -c < "$RESPONSE_FILE")" -gt 4096 ]] ||
  ! python3 -c '
import json, sys
try:
    body = json.load(sys.stdin)
except (UnicodeError, json.JSONDecodeError):
    raise SystemExit(1)
delivered = body.get("telegram_sent") is True
duplicate = (
    body.get("ok") is True
    and body.get("duplicate") is True
    and body.get("skipped") is True
    and body.get("reason") == "DUPLICATE_EVENT_ID"
)
raise SystemExit(0 if delivered or duplicate else 1)
' < "$RESPONSE_FILE" >/dev/null 2>&1; then
  printf 'ERROR: backup alert response did not confirm Telegram delivery or an explicit duplicate\n' >&2
fi

exit "$BACKUP_EXIT"
