#!/usr/bin/env bash
# Upload hook for backup-postgres-vps.sh.
# Interface: <backup.sql.gz> <backup.sql.gz.sha256>

set -euo pipefail

die() {
  printf 'ERROR: off-site upload: %s\n' "$1" >&2
  exit 1
}

[[ "$#" -eq 2 ]] || die "expected backup and checksum paths"
BACKUP_FILE="$1"
CHECKSUM_FILE="$2"
REMOTE="${HOUSEX_BACKUP_RCLONE_REMOTE:-}"

for command_name in rclone gzip sha256sum awk; do
  command -v "$command_name" >/dev/null 2>&1 || die "required command not found: $command_name"
done

[[ -n "$REMOTE" ]] || die "HOUSEX_BACKUP_RCLONE_REMOTE is required"
[[ "$REMOTE" == *:* ]] || die "remote must include a configured rclone remote and path"
REMOTE_NAME="${REMOTE%%:*}"
REMOTE_PATH="${REMOTE#*:}"
[[ "$REMOTE_NAME" =~ ^[A-Za-z0-9._-]+$ ]] || die "invalid rclone remote name"
[[ -n "$REMOTE_PATH" && "$REMOTE_PATH" != /* && "$REMOTE_PATH" != *..* ]] ||
  die "remote path must be non-empty, relative, and contain no '..'"

REMOTE_CONFIG="$(rclone config show "$REMOTE_NAME" 2>/dev/null)" ||
  die "rclone remote is missing or unreadable"
if ! awk '
  /^[[:space:]]*type[[:space:]]*=[[:space:]]*crypt[[:space:]]*$/ { found = 1 }
  END { exit(found ? 0 : 1) }
' <<<"$REMOTE_CONFIG"; then
  die "configured rclone remote must be type crypt"
fi
CRYPT_TARGET="$(awk -F= '
  /^[[:space:]]*remote[[:space:]]*=/ {
    sub(/^[^=]*=[[:space:]]*/, "", $0)
    print
    exit
  }
' <<<"$REMOTE_CONFIG")"
[[ "$CRYPT_TARGET" == *:* ]] || die "crypt remote must declare an underlying remote"
BACKEND_NAME="${CRYPT_TARGET%%:*}"
[[ "$BACKEND_NAME" =~ ^[A-Za-z0-9._-]+$ && "$BACKEND_NAME" != "$REMOTE_NAME" ]] ||
  die "crypt underlying remote is invalid"
BACKEND_CONFIG="$(rclone config show "$BACKEND_NAME" 2>/dev/null)" ||
  die "crypt underlying remote is missing or unreadable"
if ! awk '
  /^[[:space:]]*type[[:space:]]*=[[:space:]]*drive[[:space:]]*$/ { found = 1 }
  END { exit(found ? 0 : 1) }
' <<<"$BACKEND_CONFIG"; then
  die "crypt underlying backend must be Google Drive"
fi
unset REMOTE_CONFIG
unset BACKEND_CONFIG

[[ -f "$BACKUP_FILE" && -s "$BACKUP_FILE" ]] || die "backup file is missing or empty"
[[ -f "$CHECKSUM_FILE" && -s "$CHECKSUM_FILE" ]] || die "checksum file is missing or empty"
BACKUP_BASE="$(basename -- "$BACKUP_FILE")"
CHECKSUM_BASE="$(basename -- "$CHECKSUM_FILE")"
[[ "$BACKUP_BASE" =~ ^housex-[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{6}\.sql\.gz$ ]] ||
  die "backup filename is not a unique House X timestamp name"
[[ "$CHECKSUM_BASE" == "${BACKUP_BASE}.sha256" ]] || die "checksum filename does not match backup"

read -r EXPECTED_HASH CHECKSUM_NAME EXTRA < "$CHECKSUM_FILE" || die "cannot read checksum"
EXPECTED_HASH="${EXPECTED_HASH,,}"
[[ "$EXPECTED_HASH" =~ ^[0-9a-f]{64}$ && "$CHECKSUM_NAME" == "$BACKUP_BASE" && -z "${EXTRA:-}" ]] ||
  die "checksum content is invalid"
ACTUAL_HASH="$(sha256sum "$BACKUP_FILE" | awk '{print tolower($1)}')"
[[ "$ACTUAL_HASH" == "$EXPECTED_HASH" ]] || die "local SHA-256 validation failed"
gzip -t "$BACKUP_FILE" || die "local gzip validation failed"

DESTINATION="${REMOTE%/}"
rclone copyto --immutable "$BACKUP_FILE" "${DESTINATION}/${BACKUP_BASE}" ||
  die "backup upload failed"
rclone copyto --immutable "$CHECKSUM_FILE" "${DESTINATION}/${CHECKSUM_BASE}" ||
  die "checksum upload failed"

printf 'OK off-site upload object=%s checksum=uploaded encryption=crypt\n' "$BACKUP_BASE"
