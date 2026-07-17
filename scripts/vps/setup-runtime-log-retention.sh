#!/usr/bin/env bash
# Configure bounded PM2 and host-file logs on the VPS.
# Default is a dry run. Use --apply as root to install configuration.

set -euo pipefail

MODE="dry-run"
if [[ "${1:-}" == "--apply" ]]; then
  MODE="apply"
elif [[ -n "${1:-}" && "${1:-}" != "--dry-run" ]]; then
  echo "Usage: $0 [--dry-run|--apply]" >&2
  exit 2
fi

PM2_USER="${PM2_USER:-${SUDO_USER:-root}}"
if [[ "$PM2_USER" == "root" ]]; then
  PM2_HOME_DIR="/root/.pm2"
else
  PM2_HOME_DIR="$(getent passwd "$PM2_USER" | cut -d: -f6)/.pm2"
fi

run_pm2() {
  if [[ "$PM2_USER" == "$(id -un)" ]]; then
    PM2_HOME="$PM2_HOME_DIR" pm2 "$@"
  else
    sudo -u "$PM2_USER" env PM2_HOME="$PM2_HOME_DIR" pm2 "$@"
  fi
}

echo "=== Runtime log retention setup (${MODE}) ==="
echo "PM2 user=$PM2_USER home=$PM2_HOME_DIR"
echo "PM2 policy: 10 MB/file, retain 14, compress, daily rotation"
echo "Host policy: daily or 10 MB, retain 14, compress"

if [[ "$MODE" == "dry-run" ]]; then
  echo
  echo "DRY RUN: no packages, PM2 settings, or files changed."
  echo "Would install/configure pm2-logrotate when PM2 is available."
  echo "Would write /etc/logrotate.d/magnix-runtime for /var/log/{housex,magnix}-*.log."
  echo "Re-run as root with --apply."
  exit 0
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "ERROR: --apply must run as root" >&2
  exit 1
fi

if command -v pm2 >/dev/null 2>&1; then
  run_pm2 install pm2-logrotate
  run_pm2 set pm2-logrotate:max_size 10M
  run_pm2 set pm2-logrotate:retain 14
  run_pm2 set pm2-logrotate:compress true
  run_pm2 set pm2-logrotate:dateFormat 'YYYY-MM-DD_HH-mm-ss'
  run_pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
  run_pm2 set pm2-logrotate:workerInterval 30
  run_pm2 save
else
  echo "WARN: pm2 not installed; skipping pm2-logrotate"
fi

cat > /etc/logrotate.d/magnix-runtime <<'EOF'
/var/log/housex-*.log /var/log/magnix-*.log {
    daily
    size 10M
    rotate 14
    missingok
    notifempty
    compress
    delaycompress
    copytruncate
    su root root
}
EOF

echo
echo "--- Verification ---"
if command -v pm2 >/dev/null 2>&1; then
  run_pm2 conf | grep 'pm2-logrotate' || true
fi
logrotate -d /etc/logrotate.d/magnix-runtime 2>&1 || true
echo "OK: runtime log retention configured."
echo "No Docker volumes, pg_wal, uploads, or backups were changed."
