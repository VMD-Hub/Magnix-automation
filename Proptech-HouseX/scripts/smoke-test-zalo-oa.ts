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

async function main() {
  if (!isZaloOaNotifyEnabled()) {
    console.error("FAIL — ZALO_OA chưa sẵn sàng.");
    console.error("  ZALO_OA_NOTIFY_ENABLED=true");
    console.error("  ZALO_APP_ID + ZALO_APP_SECRET");
    console.error("  ZALO_OA_ACCESS_TOKEN (API Explorer) hoặc ZALO_OA_REFRESH_TOKEN");
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
