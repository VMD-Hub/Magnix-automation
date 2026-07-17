#!/usr/bin/env bash
# Read-only preflight. It never edits crontab or remote storage.

set -euo pipefail

die() {
  printf 'ERROR: backup install check: %s\n' "$1" >&2
  exit 1
}

check_parent_chain() {
  local path="$1"
  local parent owner mode
  parent="$(dirname -- "$path")"
  while :; do
    [[ -d "$parent" && ! -L "$parent" ]] || die "unsafe parent directory"
    owner="$(stat -c '%u' "$parent")"
    mode="$(stat -c '%a' "$parent")"
    [[ "$owner" == "0" && "$mode" =~ ^[0-7]{3,4}$ ]] ||
      die "parent directories must be root-owned"
    (( (8#$mode & 022) == 0 )) || die "parent directories must not be group/other writable"
    [[ "$parent" == "/" ]] && break
    parent="$(dirname -- "$parent")"
  done
}

check_executable() {
  local path="$1"
  local owner mode
  [[ "$path" == /* && -f "$path" && -x "$path" && ! -L "$path" ]] ||
    die "invalid executable path"
  owner="$(stat -c '%u' "$path")"
  mode="$(stat -c '%a' "$path")"
  [[ "$owner" == "0" && "$mode" =~ ^[0-7]{3,4}$ ]] || die "executable must be root-owned"
  (( (8#$mode & 022) == 0 )) || die "executable must not be group/other writable"
  check_parent_chain "$path"
}

ENV_FILE="${1:-/etc/housex/backup.env}"
[[ "$(id -u)" == "0" ]] || die "run as root so rclone uses the production config"
check_executable "$0"
[[ "$ENV_FILE" == /* && -f "$ENV_FILE" && ! -L "$ENV_FILE" ]] ||
  die "env file must be an absolute regular non-symlink file"
[[ "$(stat -c '%u' "$ENV_FILE")" == "0" ]] || die "env file must be owned by root"
MODE="$(stat -c '%a' "$ENV_FILE")"
[[ "$MODE" =~ ^[0-7]{3,4}$ ]] || die "invalid env file mode"
(( (8#$MODE & 077) == 0 )) || die "env file must have mode 0600 or stricter"
check_parent_chain "$ENV_FILE"

set -a
# shellcheck disable=SC1090 -- operator-selected root-owned file.
source "$ENV_FILE"
set +a

RCLONE_CONFIG_PATH="${RCLONE_CONFIG:-}"
[[ "$RCLONE_CONFIG_PATH" == /* && -f "$RCLONE_CONFIG_PATH" && ! -L "$RCLONE_CONFIG_PATH" ]] ||
  die "RCLONE_CONFIG must be an absolute regular non-symlink file"
[[ "$(stat -c '%u' "$RCLONE_CONFIG_PATH")" == "0" ]] ||
  die "rclone config must be root-owned"
RCLONE_MODE="$(stat -c '%a' "$RCLONE_CONFIG_PATH")"
[[ "$RCLONE_MODE" =~ ^[0-7]{3,4}$ ]] || die "invalid rclone config mode"
(( (8#$RCLONE_MODE & 077) == 0 )) || die "rclone config must have mode 0600 or stricter"
check_parent_chain "$RCLONE_CONFIG_PATH"

for command_name in rclone curl docker gzip sha256sum flock awk stat id python3; do
  command -v "$command_name" >/dev/null 2>&1 || die "required command not found: $command_name"
done

REMOTE="${HOUSEX_BACKUP_RCLONE_REMOTE:-}"
[[ "$REMOTE" == *:* && -n "${REMOTE#*:}" ]] || die "crypt remote/path is not configured"
REMOTE_NAME="${REMOTE%%:*}"
REMOTE_CONFIG="$(rclone config show "$REMOTE_NAME" 2>/dev/null)" ||
  die "configured crypt remote is unreadable"
if ! awk '/^[[:space:]]*type[[:space:]]*=[[:space:]]*crypt[[:space:]]*$/ { ok=1 } END { exit(ok ? 0 : 1) }' <<<"$REMOTE_CONFIG"; then
  die "configured rclone remote is not type crypt"
fi
CRYPT_TARGET="$(awk '
  /^[[:space:]]*remote[[:space:]]*=/ {
    sub(/^[^=]*=[[:space:]]*/, "", $0)
    print
    exit
  }
' <<<"$REMOTE_CONFIG")"
[[ "$CRYPT_TARGET" == *:* ]] || die "crypt underlying remote is missing"
BACKEND_NAME="${CRYPT_TARGET%%:*}"
[[ "$BACKEND_NAME" =~ ^[A-Za-z0-9._-]+$ && "$BACKEND_NAME" != "$REMOTE_NAME" ]] ||
  die "crypt underlying remote is invalid"
BACKEND_CONFIG="$(rclone config show "$BACKEND_NAME" 2>/dev/null)" ||
  die "crypt underlying remote is unreadable"
if ! awk '/^[[:space:]]*type[[:space:]]*=[[:space:]]*drive[[:space:]]*$/ { ok=1 } END { exit(ok ? 0 : 1) }' <<<"$BACKEND_CONFIG"; then
  die "crypt underlying backend must be Google Drive"
fi

EXPECTED_LIBEXEC="/usr/local/libexec/housex-backup"
[[ "${HOUSEX_BACKUP_SCRIPT:-}" == "$EXPECTED_LIBEXEC/backup-postgres-vps.sh" ]] ||
  die "HOUSEX_BACKUP_SCRIPT must use the root-owned installed path"
[[ "${HOUSEX_BACKUP_OFFSITE_HOOK:-}" == "$EXPECTED_LIBEXEC/housex-backup-offsite-upload.sh" ]] ||
  die "HOUSEX_BACKUP_OFFSITE_HOOK must use the root-owned installed path"
[[ "${HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK:-}" == "$EXPECTED_LIBEXEC/housex-backup-offsite-verify.sh" ]] ||
  die "HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK must use the root-owned installed path"
check_executable "${HOUSEX_BACKUP_SCRIPT:-}"
check_executable "${HOUSEX_BACKUP_OFFSITE_HOOK:-}"
check_executable "${HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK:-}"
[[ "${HOUSEX_BACKUP_REQUIRE_OFFSITE:-true}" == "true" ]] ||
  die "HOUSEX_BACKUP_REQUIRE_OFFSITE must remain true"
[[ -x "${HOUSEX_BACKUP_SCRIPT:-}" ]] || die "HOUSEX_BACKUP_SCRIPT must be executable"
[[ "${MAGNIX_TELEGRAM_NOTIFY_WEBHOOK_URL:-}" =~ ^https:// ]] ||
  die "HTTPS Telegram notify webhook URL is required"
TOKEN="${HOUSEX_BACKUP_ALERT_TOKEN:-}"
[[ "${#TOKEN}" -ge 16 && "${#TOKEN}" -le 512 && "$TOKEN" != *[!A-Za-z0-9._~-]* ]] ||
  die "backup alert token is missing or invalid"

printf 'OK House X backup install: crypt remote, permissions, hooks, alert config\n'
printf '%s\n' '# Review, then add this idempotent line with crontab -e:'
printf '%s\n' '15 2 * * * HOUSEX_BACKUP_ENV_FILE=/etc/housex/backup.env /usr/local/sbin/housex-backup-cron >> /var/log/housex-backup.log 2>&1'
