#!/usr/bin/env bash
# Independent download/verification hook for backup-postgres-vps.sh.
# Interface: <backup.sql.gz> <backup.sql.gz.sha256>

set -euo pipefail

TEMP_DIR=""
cleanup() {
  if [[ -n "$TEMP_DIR" && -d "$TEMP_DIR" ]]; then
    rm -rf -- "$TEMP_DIR"
  fi
}
trap cleanup EXIT INT TERM

die() {
  printf 'ERROR: off-site verify: %s\n' "$1" >&2
  exit 1
}

[[ "$#" -eq 2 ]] || die "expected backup and checksum paths"
LOCAL_BACKUP="$1"
LOCAL_CHECKSUM="$2"
REMOTE="${HOUSEX_BACKUP_RCLONE_REMOTE:-}"

for command_name in rclone mktemp gzip sha256sum awk; do
  command -v "$command_name" >/dev/null 2>&1 || die "required command not found: $command_name"
done

[[ -n "$REMOTE" && "$REMOTE" == *:* ]] ||
  die "HOUSEX_BACKUP_RCLONE_REMOTE must include remote and path"
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

BACKUP_BASE="$(basename -- "$LOCAL_BACKUP")"
CHECKSUM_BASE="$(basename -- "$LOCAL_CHECKSUM")"
[[ "$BACKUP_BASE" =~ ^housex-[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{6}\.sql\.gz$ ]] ||
  die "backup filename is not a unique House X timestamp name"
[[ "$CHECKSUM_BASE" == "${BACKUP_BASE}.sha256" ]] || die "checksum filename does not match backup"
[[ -f "$LOCAL_BACKUP" && -s "$LOCAL_BACKUP" ]] || die "trusted local backup is missing or empty"
[[ -f "$LOCAL_CHECKSUM" && -s "$LOCAL_CHECKSUM" ]] || die "trusted local checksum is missing or empty"
read -r TRUSTED_HASH TRUSTED_NAME TRUSTED_EXTRA < "$LOCAL_CHECKSUM" ||
  die "cannot read trusted local checksum"
TRUSTED_HASH="${TRUSTED_HASH,,}"
[[ "$TRUSTED_HASH" =~ ^[0-9a-f]{64}$ && "$TRUSTED_NAME" == "$BACKUP_BASE" && -z "${TRUSTED_EXTRA:-}" ]] ||
  die "trusted local checksum content is invalid"
LOCAL_HASH="$(sha256sum "$LOCAL_BACKUP" | awk '{print tolower($1)}')"
[[ "$LOCAL_HASH" == "$TRUSTED_HASH" ]] || die "trusted local backup SHA-256 validation failed"
gzip -t "$LOCAL_BACKUP" || die "trusted local backup gzip validation failed"

TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/housex-offsite-verify.XXXXXX")" ||
  die "cannot create temporary directory"
DOWNLOADED_BACKUP="$TEMP_DIR/$BACKUP_BASE"
DOWNLOADED_CHECKSUM="$TEMP_DIR/$CHECKSUM_BASE"
SOURCE="${REMOTE%/}"

rclone copyto "${SOURCE}/${BACKUP_BASE}" "$DOWNLOADED_BACKUP" ||
  die "backup download failed"
rclone copyto "${SOURCE}/${CHECKSUM_BASE}" "$DOWNLOADED_CHECKSUM" ||
  die "checksum download failed"

[[ -s "$DOWNLOADED_BACKUP" && -s "$DOWNLOADED_CHECKSUM" ]] ||
  die "downloaded object is empty"
read -r EXPECTED_HASH CHECKSUM_NAME EXTRA < "$DOWNLOADED_CHECKSUM" ||
  die "cannot read downloaded checksum"
EXPECTED_HASH="${EXPECTED_HASH,,}"
[[ "$EXPECTED_HASH" =~ ^[0-9a-f]{64}$ && "$CHECKSUM_NAME" == "$BACKUP_BASE" && -z "${EXTRA:-}" ]] ||
  die "downloaded checksum content is invalid"
[[ "$EXPECTED_HASH" == "$TRUSTED_HASH" && "$CHECKSUM_NAME" == "$TRUSTED_NAME" ]] ||
  die "downloaded checksum does not match trusted local checksum"
ACTUAL_HASH="$(sha256sum "$DOWNLOADED_BACKUP" | awk '{print tolower($1)}')"
[[ "$ACTUAL_HASH" == "$EXPECTED_HASH" ]] || die "downloaded SHA-256 validation failed"
gzip -t "$DOWNLOADED_BACKUP" || die "downloaded gzip validation failed"

printf 'OK off-site verify object=%s checksum=verified gzip=verified\n' "$BACKUP_BASE"
