/**
 * In crontab mẫu cho VPS — copy vào `crontab -e`.
 *
 * Usage: npm run go-live:print-cron
 */
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://timnhaxahoi.com")
  .trim()
  .replace(/\/$/, "");
const cronSecret = process.env.CRON_SECRET?.trim();

if (!cronSecret || cronSecret.length < 16) {
  console.error("Thiếu CRON_SECRET trong .env (≥16 ký tự) — chạy: npm run go-live:secrets");
  process.exit(1);
}

console.log(`# House X — cron VPS (${site})`);
console.log(`# Đặt CRON_SECRET trong .env trước khi dán — hiện: ${cronSecret.slice(0, 4)}…`);
console.log("");
console.log("# Hết hạn tin ACTIVE (mỗi giờ)");
console.log(
  `0 * * * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/expire-listings`,
);
console.log("");
console.log("# Outbox → n8n / handlers (mỗi phút — cần EVENTS_WEBHOOK_URL)");
console.log(
  `* * * * * curl -fsS -X POST -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/dispatch-events`,
);
console.log("");
console.log("# Recompute ranking (mỗi 6 giờ)");
console.log(
  `0 */6 * * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/recompute-ranking`,
);
console.log("");
console.log("# Hết hạn giữ suất F1 (mỗi giờ)");
console.log(
  `15 * * * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/expire-unit-bookings`,
);
console.log("");
console.log("# NOXH case — release lock 20 ngày LV + SLA (mỗi giờ)");
console.log(
  `30 * * * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/noxh-case-maintenance`,
);
console.log("");
console.log("# Chi hoa hồng PAYABLE — ngày 05 & 20 hàng tháng lúc 8:00");
console.log(
  `0 8 5,20 * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/commission-payouts`,
);
console.log("");
console.log("# Sheet ops_mirror — Postgres → Google Sheet (mỗi 6 giờ, bật MAGNIX_SHEET_MIRROR_ENABLED=true)");
console.log(
  `0 */6 * * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/sheet-mirror`,
);
console.log("");
console.log("# Postgres backup — hàng ngày 02:15 (ADR-013)");
console.log(
  `15 2 * * * /opt/housex/Proptech-HouseX/scripts/backup-postgres-vps.sh >> /var/log/housex-backup.log 2>&1`,
);
console.log("");
console.log("# Chi tiết: docs/OPS_BACKUP_MIRROR.md");
console.log("");
