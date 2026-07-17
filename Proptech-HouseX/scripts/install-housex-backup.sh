#!/usr/bin/env bash
# Explicit root install. Copies reviewed scripts out of the mutable deploy tree.

set -euo pipefail

die() {
  printf 'ERROR: House X backup install: %s\n' "$1" >&2
  exit 1
}

[[ "$(id -u)" == "0" ]] || die "must run as root"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LIBEXEC_DIR="/usr/local/libexec/housex-backup"
SBIN_DIR="/usr/local/sbin"
ENV_DIR="/etc/housex"
ENV_FILE="$ENV_DIR/backup.env"

for source_name in \
  backup-postgres-vps.sh \
  housex-backup-offsite-upload.sh \
  housex-backup-offsite-verify.sh \
  housex-backup-cron.sh \
  check-housex-backup-install.sh \
  housex-backup.env.example; do
  source_path="$SOURCE_DIR/$source_name"
  [[ -f "$source_path" && ! -L "$source_path" ]] || die "invalid source: $source_name"
done

install -d -o root -g root -m 0755 "$LIBEXEC_DIR" "$SBIN_DIR"
install -d -o root -g root -m 0700 "$ENV_DIR"
install -o root -g root -m 0755 \
  "$SOURCE_DIR/backup-postgres-vps.sh" \
  "$SOURCE_DIR/housex-backup-offsite-upload.sh" \
  "$SOURCE_DIR/housex-backup-offsite-verify.sh" \
  "$LIBEXEC_DIR/"
install -o root -g root -m 0755 \
  "$SOURCE_DIR/housex-backup-cron.sh" \
  "$SBIN_DIR/housex-backup-cron"
install -o root -g root -m 0755 \
  "$SOURCE_DIR/check-housex-backup-install.sh" \
  "$SBIN_DIR/housex-backup-check"

if [[ -e "$ENV_FILE" ]]; then
  [[ -f "$ENV_FILE" && ! -L "$ENV_FILE" ]] || die "existing env is not a regular non-symlink file"
  chown root:root "$ENV_FILE"
  chmod 0600 "$ENV_FILE"
  printf 'PRESERVED existing %s\n' "$ENV_FILE"
else
  install -o root -g root -m 0600 "$SOURCE_DIR/housex-backup.env.example" "$ENV_FILE"
  printf 'CREATED %s from secret-free example; populate it before enabling cron\n' "$ENV_FILE"
fi

printf 'OK installed root-owned House X backup executables\n'
printf '%s\n' '# After editing /etc/housex/backup.env, review:'
printf '%s\n' '/usr/local/sbin/housex-backup-check /etc/housex/backup.env'
printf '%s\n' '# Then add manually with crontab -e (installer did not modify crontab):'
printf '%s\n' '15 2 * * * HOUSEX_BACKUP_ENV_FILE=/etc/housex/backup.env /usr/local/sbin/housex-backup-cron >> /var/log/housex-backup.log 2>&1'
