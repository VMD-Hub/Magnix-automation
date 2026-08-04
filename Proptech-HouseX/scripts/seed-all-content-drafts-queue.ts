/**
 * Nạp TOÀN BỘ draft markdown (00–13) vào content_queue để Super Admin duyệt L2/L3.
 *
 * Gọi lần lượt:
 *   1) CCTM cluster 00–06 (pack JSON)
 *   2) Legal / policy pack 07–13
 *
 * Usage:
 *   npm run db:seed:content-queue-all
 *   npm run db:seed:content-queue-all:dry
 *   node --env-file=.env --import tsx scripts/seed-all-content-drafts-queue.ts
 *   node --import tsx scripts/seed-all-content-drafts-queue.ts --dry-run
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const dryRun = process.argv.includes("--dry-run");
const root = resolve(__dirname, "..");

function run(scriptRel: string) {
  const script = resolve(root, scriptRel);
  const args = ["--import", "tsx", script];
  if (dryRun) args.push("--dry-run");
  else args.unshift("--env-file=.env");

  console.log(`\n── ${scriptRel}${dryRun ? " (dry-run)" : ""} ──`);
  const r = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

console.log(
  dryRun
    ? "Dry-run: kiểm tra toàn bộ draft → content_queue (không ghi DB)."
    : "Seed toàn bộ draft → /admin/content-queue (INTAKE / cập nhật body).",
);

run("scripts/seed-cctm-luat-nha-o-queue.ts");
run("scripts/seed-legal-review-queue-pack.ts");

console.log(
  dryRun
    ? "\nDry-run ALL OK. Chạy npm run db:seed:content-queue-all trên VPS/Postgres để nạp admin."
    : "\nXong ALL. Duyệt tại /admin/content-queue (Super Admin).",
);
