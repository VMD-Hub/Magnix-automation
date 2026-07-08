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

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "ERROR: container $CONTAINER not running" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%F_%H%M)"
FILE="$BACKUP_DIR/housex-${STAMP}.sql.gz"

docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$FILE"
gzip -t "$FILE"

find "$BACKUP_DIR" -name 'housex-*.sql.gz' -type f -mtime +"$RETENTION_DAYS" -delete

SIZE="$(du -h "$FILE" | cut -f1)"
echo "OK backup $FILE ($SIZE) retention=${RETENTION_DAYS}d"
