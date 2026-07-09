/**
 * Chẩn đoán Zalo OA — không in token/secret.
 *
 * Usage: npm run go-live:zalo-oa-diagnose
 */
import { existsSync } from "fs";
import { join } from "path";
import { buildOaOpenApiHeaders } from "../lib/zalo/oa-api-headers";
import { readOaRefreshToken } from "../lib/zalo/oa-token-store";
import { refreshOaAccessToken } from "../lib/zalo/oa";

async function main() {
  console.log("=== Zalo OA diagnose ===\n");

  const hasProof = existsSync(
    join(process.cwd(), "lib/zalo/oa-api-headers.ts"),
  );
  console.log(`appsecret_proof code: ${hasProof ? "OK" : "THIẾU — git pull"}`);

  const appId = process.env.ZALO_APP_ID?.trim();
  const secretLen = process.env.ZALO_APP_SECRET?.trim().length ?? 0;
  const refreshLen = readOaRefreshToken()?.length ?? 0;
  const accessLen = process.env.ZALO_OA_ACCESS_TOKEN?.trim().length ?? 0;
  const refreshFile = existsSync(join(process.cwd(), ".zalo-oa-refresh"));

  console.log(`ZALO_APP_ID: ${appId ? "set" : "MISSING"}`);
  console.log(`ZALO_APP_SECRET length: ${secretLen}`);
  console.log(`refresh token length: ${refreshLen} (file .zalo-oa-refresh: ${refreshFile})`);
  console.log(`access token length: ${accessLen}`);
  console.log(
    `ZALO_OA_TOKEN_MODE: ${process.env.ZALO_OA_TOKEN_MODE ?? "(default)"}`,
  );

  if (
    /paste_/i.test(process.env.ZALO_APP_SECRET ?? "") ||
    /paste_/i.test(process.env.ZALO_OA_REFRESH_TOKEN ?? "") ||
    /paste_/i.test(process.env.ZALO_OA_ACCESS_TOKEN ?? "")
  ) {
    console.error(
      "\nLỖI: .env vẫn chứa placeholder paste_* — phải dán TOKEN THẬT từ API Explorer, không gõ lệnh vào terminal.",
    );
    process.exit(1);
  }

  try {
    const { accessToken, meta } = await refreshOaAccessToken();
    console.log(
      `\nToken: OK — source=${meta.ok ? meta.source : "?"} len=${accessToken.length}`,
    );

    const headers = buildOaOpenApiHeaders(accessToken);
    console.log(
      `Headers: access_token + appsecret_proof=${headers.appsecret_proof ? "yes" : "NO (thiếu secret)"}`,
    );

    const url = new URL("https://openapi.zalo.me/v2.0/oa/getprofile");
    const res = await fetch(url.toString(), {
      headers,
      cache: "no-store",
    });
    const body = (await res.json()) as {
      error?: number;
      message?: string;
      data?: { name?: string };
    };

    if (body.error === 0 || body.data?.name) {
      console.log(`API getprofile: OK — OA "${body.data?.name ?? "?"}"`);
    } else {
      console.log(
        `API getprofile: FAIL — error=${body.error ?? res.status} ${body.message ?? ""}`,
      );
      if (body.message?.toLowerCase().includes("access token")) {
        console.log(
          "\nGợi ý: 1) Lấy token MỚI từ API Explorer (cùng app 1837365611738849660)",
        );
        console.log(
          "       2) Kiểm tra ZALO_APP_SECRET khớp tab Cài đặt developers",
        );
        console.log(
          "       3) Thử: ZALO_OA_TOKEN_MODE=access_only + chỉ ACCESS_TOKEN mới",
        );
      }
    }
  } catch (err) {
    console.error(`\nToken: FAIL — ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

main();
