#!/usr/bin/env bash
# Safe VPS runtime measurement and housekeeping.
# Default is read-only. Use --apply only to prune old dangling images and run
# configured log rotation. This script never prunes volumes, pg_wal, uploads,
# or backups.

set -euo pipefail

MODE="dry-run"
if [[ "${1:-}" == "--apply" ]]; then
  MODE="apply"
elif [[ -n "${1:-}" && "${1:-}" != "--dry-run" ]]; then
  echo "Usage: $0 [--dry-run|--apply]" >&2
  exit 2
fi

N8N_CONTAINER="${N8N_CONTAINER:-n8n}"
IMAGE_PRUNE_UNTIL="${IMAGE_PRUNE_UNTIL:-168h}"

echo "=== Magnix VPS runtime retention (${MODE}) ==="
echo "timestamp=$(date -Iseconds)"
df -h /

echo
echo "--- Docker usage (measurement only) ---"
docker system df
docker ps --size --format 'table {{.Names}}\t{{.Image}}\t{{.Size}}\t{{.Status}}'

echo
echo "--- Container json-file logs ---"
docker ps -aq | while read -r id; do
  [[ -n "$id" ]] || continue
  name="$(docker inspect --format '{{.Name}}' "$id" | sed 's#^/##')"
  log_path="$(docker inspect --format '{{.LogPath}}' "$id")"
  if [[ -n "$log_path" && -e "$log_path" ]]; then
    size="$(du -h "$log_path" | cut -f1)"
  else
    size="n/a"
  fi
  echo "$name log=$size path=${log_path:-none}"
done

echo
echo "--- n8n version and retention ---"
if docker inspect "$N8N_CONTAINER" >/dev/null 2>&1; then
  echo "image_ref=$(docker inspect --format '{{.Config.Image}}' "$N8N_CONTAINER")"
  echo "image_id=$(docker inspect --format '{{.Image}}' "$N8N_CONTAINER")"
  echo "version=$(docker exec "$N8N_CONTAINER" n8n --version 2>/dev/null || echo unknown)"
  docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$N8N_CONTAINER" |
    grep -E '^EXECUTIONS_DATA_(PRUNE|MAX_AGE|PRUNE_MAX_COUNT|SAVE_ON_ERROR|SAVE_ON_SUCCESS)=' |
    sort || true
else
  echo "WARN: container '$N8N_CONTAINER' not found"
fi

echo
echo "--- Host log usage (measurement only) ---"
for path in /root/.pm2/logs /var/log /root/backup /opt/housex/Proptech-HouseX/public/uploads; do
  if [[ -e "$path" ]]; then
    du -sh "$path" 2>/dev/null || true
  fi
done

if [[ "$MODE" == "dry-run" ]]; then
  echo
  echo "DRY RUN: no files, images, containers, volumes, database data, uploads, or backups changed."
  echo "Would run: docker image prune --filter dangling=true --filter until=$IMAGE_PRUNE_UNTIL"
  echo "Would run: logrotate /etc/logrotate.conf (only configured log files)"
  exit 0
fi

echo
echo "--- Applying safe housekeeping ---"
docker image prune -f --filter dangling=true --filter "until=$IMAGE_PRUNE_UNTIL"
if command -v logrotate >/dev/null 2>&1; then
  logrotate /etc/logrotate.conf
else
  echo "WARN: logrotate is not installed; skipping host log rotation"
fi

echo
echo "OK: housekeeping complete. Volumes, pg_wal, uploads, and backups were not targeted."
docker system df
