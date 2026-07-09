/**
 * Smoke DNA-D — Zalo OA notify (không cần Callback URL).
 *
 * Usage:
 *   npm run go-live:smoke-zalo-oa
 *   ZALO_OA_TEST_USER_ID=<zalo_user_id> npm run go-live:smoke-zalo-oa
 *
 * Cần .env: ZALO_APP_ID, ZALO_APP_SECRET, ZALO_OA_ACCESS_TOKEN hoặc ZALO_OA_REFRESH_TOKEN
 */
import { isZaloOaNotifyEnabled, sendOaCsText } from "../lib/zalo/oa";

function isPlaceholderToken(value: string | undefined): boolean {
  const v = value?.trim() ?? "";
  if (!v) return true;
  return (
    v.startsWith("<") ||
    v.includes("token từ") ||
    v.includes("API Explorer") ||
    v === "..."
  );
}

function diagnoseZaloOaEnv(): string[] {
  const issues: string[] = [];
  if (process.env.ZALO_OA_NOTIFY_ENABLED?.trim().toLowerCase() === "false") {
    issues.push("ZALO_OA_NOTIFY_ENABLED đang false");
  }
  if (!process.env.ZALO_APP_ID?.trim()) {
    issues.push("Thiếu ZALO_APP_ID");
  }
  if (!process.env.ZALO_APP_SECRET?.trim()) {
    issues.push("Thiếu ZALO_APP_SECRET");
  }
  const refresh = process.env.ZALO_OA_REFRESH_TOKEN?.trim();
  const access = process.env.ZALO_OA_ACCESS_TOKEN?.trim();
  if (!refresh && !access) {
    issues.push("Thiếu ZALO_OA_ACCESS_TOKEN hoặc ZALO_OA_REFRESH_TOKEN");
  } else if (
    (!refresh || isPlaceholderToken(refresh)) &&
    (!access || isPlaceholderToken(access))
  ) {
    issues.push(
      "ZALO_OA_ACCESS_TOKEN / REFRESH_TOKEN vẫn là placeholder — paste token thật từ API Explorer",
    );
  }
  return issues;
}

async function main() {
  if (!isZaloOaNotifyEnabled()) {
    console.error("FAIL — ZALO_OA chưa sẵn sàng.");
    for (const issue of diagnoseZaloOaEnv()) {
      console.error(`  • ${issue}`);
    }
    console.error("\nVPS: nano /opt/housex/Proptech-HouseX/.env rồi pm2 restart housex --update-env");
    process.exit(1);
  }

  const mode = process.env.ZALO_OA_REFRESH_TOKEN?.trim()
    ? "refresh_token"
    : "access_token";
  console.log(`OK — Zalo OA configured (${mode})`);

  const userId = process.env.ZALO_OA_TEST_USER_ID?.trim();
  if (!userId) {
    console.log("SKIP send — set ZALO_OA_TEST_USER_ID để gửi tin test thật.");
    process.exit(0);
  }

  const result = await sendOaCsText({
    userId,
    text: "[House X] Smoke DNA-D — OA notify OK.",
  });

  if (!result.ok) {
    console.error(`FAIL send — ${result.error}`);
    process.exit(1);
  }

  console.log("OK — tin test đã gửi tới ZALO_OA_TEST_USER_ID");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
