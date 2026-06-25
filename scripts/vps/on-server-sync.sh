#!/bin/bash
# Chạy TRÊN VPS — sync repo + rebuild + push workflows (không cần máy local)
# Cài 1 lần:
#   git clone <repo> /opt/magnix-automation
#   cp /root/n8n-secrets.env /opt/magnix-automation/n8n-workflows/.env
#   crontab -e → 0 3 * * * /opt/magnix-automation/scripts/vps/on-server-sync.sh >> /var/log/magnix-sync.log 2>&1

set -euo pipefail
REPO="${MAGNIX_REPO_DIR:-/opt/magnix-automation}"
cd "$REPO"

echo "[$(date -Iseconds)] magnix on-server sync start"

git fetch origin
git pull --ff-only origin main || git pull --ff-only

node scripts/rebuild-all-workflows.mjs

if [ -n "${N8N_API_KEY:-}" ]; then
  node scripts/push-n8n-workflows.mjs
else
  echo "SKIP push-n8n-workflows — set N8N_API_KEY in env"
fi

echo "[$(date -Iseconds)] magnix on-server sync done"
