/**
 * Kiểm tra env production trước deploy.
 * Usage: NODE_ENV=production node --import tsx scripts/check-go-live-env.ts
 * Hoặc load .env: dotenv không bắt buộc — set biến trên VPS/Vercel.
 */
import {
  checkGoLiveEnv,
  summarizeGoLiveEnv,
} from "../lib/deploy/go-live-env";

const checks = checkGoLiveEnv();
const summary = summarizeGoLiveEnv(checks);

for (const c of checks) {
  const icon = c.ok ? "✔" : c.level === "required" ? "✖" : "⚠";
  const tag =
    c.level === "required" ? "REQ" : c.level === "recommended" ? "REC" : "WRN";
  console.log(`${icon} [${tag}] ${c.key} — ${c.message}`);
}

console.log("");
if (summary.warnings.length) {
  console.log("Khuyến nghị:");
  for (const w of summary.warnings) console.log(`  • ${w}`);
  console.log("");
}

if (!summary.ok) {
  console.error("Thiếu biến bắt buộc:");
  for (const e of summary.requiredFailed) console.error(`  • ${e}`);
  console.error("\nChạy: npm run go-live:secrets — sinh AUTH/ADMIN/CRON secret mẫu.");
  process.exit(1);
}

console.log("Env go-live: đủ biến bắt buộc.");
