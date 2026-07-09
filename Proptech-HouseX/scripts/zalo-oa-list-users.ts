/**
 * Liệt kê zalo_user_id từ OA — không cần Mini App login.
 *
 * Trước khi chạy: trên điện thoại quan tâm OA + nhắn "test" vào OA.
 *
 * Usage: npm run go-live:zalo-oa-list-users
 */
import { isZaloOaNotifyEnabled } from "../lib/zalo/oa";
import { fetchOaFollowers, fetchOaRecentChats } from "../lib/zalo/oa-users";

async function main() {
  if (!isZaloOaNotifyEnabled()) {
    console.error("FAIL — cấu hình ZALO_OA chưa sẵn sàng (xem go-live:smoke-zalo-oa).");
    process.exit(1);
  }

  console.log("→ Người quan tâm OA (getfollowers):\n");
  const followers = await fetchOaFollowers({ offset: 0, count: 10 });
  if (!followers.ok) {
    console.error(`  Lỗi: ${followers.error}`);
  } else if (followers.users.length === 0) {
    console.log("  (trống) — hãy quan tâm OA House X trên Zalo.");
  } else {
    for (const u of followers.users) {
      console.log(`  user_id=${u.userId}${u.displayName ? `  name=${u.displayName}` : ""}`);
    }
  }

  console.log("\n→ Hội thoại gần đây (listrecentchat):\n");
  const recent = await fetchOaRecentChats({ offset: 0, count: 10 });
  if (!recent.ok) {
    console.error(`  Lỗi: ${recent.error}`);
  } else if (recent.users.length === 0) {
    console.log("  (trống) — nhắn tin vào OA rồi chạy lại.");
  } else {
    for (const u of recent.users) {
      console.log(`  user_id=${u.userId}${u.displayName ? `  name=${u.displayName}` : ""}`);
    }
  }

  console.log(
    "\nGửi test: ZALO_OA_TEST_USER_ID=<user_id> npm run go-live:smoke-zalo-oa",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
