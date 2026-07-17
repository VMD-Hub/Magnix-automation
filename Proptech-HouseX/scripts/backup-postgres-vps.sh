#!/usr/bin/env bash
# Postgres backup — chạy trên VPS House X (ADR-013).
# Usage:
#   chmod +x scripts/backup-postgres-vps.sh
#   ./scripts/backup-postgres-vps.sh
#
# Cron (xem npm run go-live:print-cron):
#   15 2 * * * /opt/housex/Proptech-HouseX/scripts/backup-postgres-vps.sh >> /var/log/housex-backup.log 2>&1

set -euo pipefail

CONTAINER="${HOUSEX_PG_CONTAINER:-housex-postgres}"
DB_USER="${HOUSEX_PG_USER:-housex}"
DB_NAME="${HOUSEX_PG_NAME:-housex}"
BACKUP_DIR="${HOUSEX_BACKUP_DIR:-$HOME/backup/housex}"
RETENTION_DAYS="${HOUSEX_BACKUP_RETENTION_DAYS:-14}"
LOCK_FILE="${HOUSEX_BACKUP_LOCK_FILE:-$BACKUP_DIR/.backup.lock}"
OFFSITE_HOOK="${HOUSEX_BACKUP_OFFSITE_HOOK:-}"
OFFSITE_VERIFY_HOOK="${HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK:-}"
ALLOW_LOCAL_ONLY_RETENTION="${HOUSEX_BACKUP_ALLOW_LOCAL_ONLY_RETENTION:-false}"

if ! [[ "$RETENTION_DAYS" =~ ^[0-9]+$ ]]; then
  echo "ERROR: HOUSEX_BACKUP_RETENTION_DAYS must be a non-negative integer" >&2
  exit 1
fi

for command_name in docker flock gzip sha256sum find awk; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "ERROR: required command not found: $command_name" >&2
    exit 1
  fi
done

mkdir -p "$BACKUP_DIR"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "SKIP: another House X backup is already running" >&2
  exit 0
fi

if ! docker ps --format '{{.Names}}' | grep -Fqx "$CONTAINER"; then
  echo "ERROR: container $CONTAINER not running" >&2
  exit 1
fi

STAMP="$(date +%F_%H%M%S)"
FILE="$BACKUP_DIR/housex-${STAMP}.sql.gz"
CHECKSUM_FILE="${FILE}.sha256"
TMP_FILE="${FILE}.tmp.$$"
TMP_CHECKSUM="${CHECKSUM_FILE}.tmp.$$"

cleanup() {
  rm -f -- "$TMP_FILE" "$TMP_CHECKSUM"
}
trap cleanup EXIT INT TERM

# Write to a temporary file so an interrupted pg_dump is never mistaken for a
# successful backup. pipefail propagates failures from either pg_dump or gzip.
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip -c > "$TMP_FILE"
gzip -t "$TMP_FILE"

UNCOMPRESSED_BYTES="$(gzip -dc "$TMP_FILE" | wc -c)"
if [[ "$UNCOMPRESSED_BYTES" -le 0 ]]; then
  echo "ERROR: backup decompresses to an empty SQL stream" >&2
  exit 1
fi
if ! gzip -dc "$TMP_FILE" | awk '
  /^-- PostgreSQL database dump/ { found = 1 }
  END { exit(found ? 0 : 1) }
'; then
  echo "ERROR: decompressed file does not contain the pg_dump header" >&2
  exit 1
fi

HASH="$(sha256sum "$TMP_FILE" | awk '{print $1}')"
printf '%s  %s\n' "$HASH" "$(basename "$FILE")" > "$TMP_CHECKSUM"

mv -- "$TMP_FILE" "$FILE"
mv -- "$TMP_CHECKSUM" "$CHECKSUM_FILE"
if ! (cd "$BACKUP_DIR" && sha256sum -c "$(basename "$CHECKSUM_FILE")" >/dev/null); then
  rm -f -- "$FILE" "$CHECKSUM_FILE"
  echo "ERROR: checksum verification failed; unpublished backup removed" >&2
  exit 1
fi

# Hooks receive: <backup.sql.gz> <backup.sql.gz.sha256>. Configure both hooks
# together: upload must finish first, then verification must independently
# confirm the remote object before local retention is allowed to prune.
OFFSITE_VERIFIED=false
if [[ -n "$OFFSITE_HOOK" || -n "$OFFSITE_VERIFY_HOOK" ]]; then
  if [[ -z "$OFFSITE_HOOK" || -z "$OFFSITE_VERIFY_HOOK" ]]; then
    echo "ERROR: configure both HOUSEX_BACKUP_OFFSITE_HOOK and HOUSEX_BACKUP_OFFSITE_VERIFY_HOOK; retention was not run" >&2
    exit 1
  fi
  if [[ ! -x "$OFFSITE_HOOK" || ! -x "$OFFSITE_VERIFY_HOOK" ]]; then
    echo "ERROR: off-site hooks must be executable files; retention was not run" >&2
    exit 1
  fi
  "$OFFSITE_HOOK" "$FILE" "$CHECKSUM_FILE"
  "$OFFSITE_VERIFY_HOOK" "$FILE" "$CHECKSUM_FILE"
  OFFSITE_VERIFIED=true
fi

# This run's atomically published file is the newest successful backup.
# Always exclude it, even when retention is zero or the system clock changes.
NEWEST_SUCCESSFUL="$FILE"
if [[ "$OFFSITE_VERIFIED" == true || "$ALLOW_LOCAL_ONLY_RETENTION" == true ]]; then
  while IFS= read -r -d '' OLD_FILE; do
    if [[ "$OLD_FILE" == "$NEWEST_SUCCESSFUL" ]]; then
      continue
    fi
    rm -f -- "$OLD_FILE" "${OLD_FILE}.sha256"
  done < <(
    find "$BACKUP_DIR" -maxdepth 1 -type f -name 'housex-*.sql.gz' \
      -mtime +"$RETENTION_DAYS" -print0
  )
else
  echo "WARN: local retention skipped until off-site verification is configured; set HOUSEX_BACKUP_ALLOW_LOCAL_ONLY_RETENTION=true only if explicitly accepted"
fi

SIZE="$(du -h "$FILE" | cut -f1)"
echo "OK backup $FILE ($SIZE, sql_bytes=$UNCOMPRESSED_BYTES) checksum=verified offsite_verified=$OFFSITE_VERIFIED retention=${RETENTION_DAYS}d"
