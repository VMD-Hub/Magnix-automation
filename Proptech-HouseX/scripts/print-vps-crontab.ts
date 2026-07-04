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
  `* * * * * curl -fsS -H "Authorization: Bearer ${cronSecret}" ${site}/api/cron/dispatch-events`,
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
