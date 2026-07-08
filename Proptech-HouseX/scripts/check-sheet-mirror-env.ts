/**
 * Kiểm tra env Sheet mirror (ADR-013 P2) — không gọi Google API.
 * Usage: npm run go-live:check-sheet-mirror
 */
import fs from "node:fs";

function main() {
  const enabled = process.env.MAGNIX_SHEET_MIRROR_ENABLED === "true";
  const sheetId = process.env.GOOGLE_SHEET_MIRROR_ID?.trim() ?? "";
  const tab = process.env.GOOGLE_SHEET_MIRROR_TAB?.trim() || "ops_mirror";
  const saRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ?? "";

  console.log("Sheet mirror env (ADR-013 P2):\n");
  console.log(`  MAGNIX_SHEET_MIRROR_ENABLED: ${enabled}`);
  console.log(`  GOOGLE_SHEET_MIRROR_ID: ${sheetId || "(trống)"}`);
  console.log(`  GOOGLE_SHEET_MIRROR_TAB: ${tab}`);
  console.log(
    `  GOOGLE_SERVICE_ACCOUNT_JSON: ${saRaw ? (saRaw.startsWith("{") ? "(inline JSON)" : saRaw) : "(trống)"}`,
  );

  if (!enabled) {
    console.log("\n✔ Mirror tắt — bật MAGNIX_SHEET_MIRROR_ENABLED=true khi cần.");
    return;
  }

  let failed = 0;

  if (!sheetId) {
    failed += 1;
    console.error("\n✖ Thiếu GOOGLE_SHEET_MIRROR_ID");
  }

  if (!saRaw) {
    failed += 1;
    console.error("✖ Thiếu GOOGLE_SERVICE_ACCOUNT_JSON");
  } else if (!saRaw.startsWith("{")) {
    if (!fs.existsSync(saRaw)) {
      failed += 1;
      console.error(`✖ File service account không tồn tại: ${saRaw}`);
    } else {
      try {
        const sa = JSON.parse(fs.readFileSync(saRaw, "utf8")) as {
          client_email?: string;
        };
        if (!sa.client_email) {
          failed += 1;
          console.error("✖ JSON service account thiếu client_email");
        } else {
          console.log(`\n  SA email: ${sa.client_email}`);
          console.log("  → Share Sheet Editor cho email này + tạo tab:", tab);
        }
      } catch {
        failed += 1;
        console.error("✖ GOOGLE_SERVICE_ACCOUNT_JSON không parse được");
      }
    }
  }

  if (!process.env.CRON_SECRET?.trim()) {
    failed += 1;
    console.error("✖ Thiếu CRON_SECRET (cron /api/cron/sheet-mirror)");
  }

  if (failed) {
    console.error("\nSửa .env → pm2 restart housex --update-env");
    process.exit(1);
  }

  console.log("\n✔ Env mirror OK — chạy: SITE=... npm run go-live:smoke-sheet-mirror");
}

main();
