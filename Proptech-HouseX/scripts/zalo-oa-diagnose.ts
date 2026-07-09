/**
 * Chẩn đoán Zalo OA — không in token/secret.
 *
 * Usage: npm run go-live:zalo-oa-diagnose
 */
import { existsSync } from "fs";
import { join } from "path";
import { buildOaOpenApiHeaders } from "../lib/zalo/oa-api-headers";
import {
  normalizeOaToken,
  readOaRefreshToken,
  writeOaRefreshToken,
} from "../lib/zalo/oa-token-store";
import { refreshOaAccessToken } from "../lib/zalo/oa";

type GetProfileBody = {
  error?: number;
  message?: string;
  data?: { name?: string };
};

async function callGetProfile(
  accessToken: string,
  withProof: boolean,
): Promise<GetProfileBody & { status: number }> {
  const headers: Record<string, string> = { access_token: accessToken };
  if (withProof) {
    Object.assign(headers, buildOaOpenApiHeaders(accessToken));
  }

  const res = await fetch("https://openapi.zalo.me/v2.0/oa/getprofile", {
    headers,
    cache: "no-store",
  });
  const body = (await res.json()) as GetProfileBody;
  return { ...body, status: res.status };
}

/** Gửi refresh token giả — không đốt token thật; chỉ kiểm tra secret_key. */
async function probeRefreshSecret(): Promise<string> {
  const appId = process.env.ZALO_APP_ID?.trim();
  const secret = normalizeOaToken(process.env.ZALO_APP_SECRET);
  if (!appId || !secret) return "SKIP — thiếu app_id/secret";

  const res = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: secret,
    },
    body: new URLSearchParams({
      app_id: appId,
      grant_type: "refresh_token",
      refresh_token: "__housex_secret_probe__",
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    error_name?: string;
    error_description?: string;
  };
  const msg = (data.error_description ?? data.error_name ?? "").toLowerCase();

  if (msg.includes("refresh")) {
    return "OK — secret_key được Zalo chấp nhận (lỗi refresh là đúng kỳ vọng)";
  }
  if (msg.includes("secret") || msg.includes("app")) {
    return "FAIL — ZALO_APP_SECRET có thể SAI (copy lại tab Cài đặt developers)";
  }
  return `? — ${data.error_description ?? data.error_name ?? res.status}`;
}

function explainError(code: number | undefined): string {
  switch (code) {
    case -125:
      return "appsecret_proof thiếu/sai";
    case -216:
      return "token không phải OA token, không thuộc app này, hoặc hết hạn";
    case -217:
      return "refresh token không hợp lệ";
    default:
      return "xem tài liệu Zalo OA";
  }
}

/** Refresh thật — bỏ qua access_only; rotate refresh token nếu Zalo trả mới. */
async function tryRefreshAccessToken(): Promise<
  | { ok: true; accessToken: string; expiresIn?: number }
  | { ok: false; error: string }
> {
  const appId = process.env.ZALO_APP_ID?.trim();
  const secret = normalizeOaToken(process.env.ZALO_APP_SECRET);
  const refresh = readOaRefreshToken();
  if (!appId || !secret || !refresh) {
    return { ok: false, error: "thiếu app_id/secret/refresh_token" };
  }

  const res = await fetch("https://oauth.zaloapp.com/v4/oa/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      secret_key: secret,
    },
    body: new URLSearchParams({
      app_id: appId,
      grant_type: "refresh_token",
      refresh_token: refresh,
    }),
    cache: "no-store",
  });

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error_name?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    return {
      ok: false,
      error: data.error_description ?? data.error_name ?? `HTTP ${res.status}`,
    };
  }

  if (data.refresh_token) {
    writeOaRefreshToken(data.refresh_token);
  }

  return {
    ok: true,
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

async function main() {
  console.log("=== Zalo OA diagnose ===\n");

  const hasProof = existsSync(
    join(process.cwd(), "lib/zalo/oa-api-headers.ts"),
  );
  console.log(`appsecret_proof code: ${hasProof ? "OK" : "THIẾU — git pull"}`);

  const appId = process.env.ZALO_APP_ID?.trim();
  const secretLen = normalizeOaToken(process.env.ZALO_APP_SECRET)?.length ?? 0;
  const refreshLen = readOaRefreshToken()?.length ?? 0;
  const accessLen = normalizeOaToken(process.env.ZALO_OA_ACCESS_TOKEN)?.length ?? 0;
  const refreshFile = existsSync(join(process.cwd(), ".zalo-oa-refresh"));
  const accessOnly =
    process.env.ZALO_OA_TOKEN_MODE?.trim().toLowerCase() === "access_only";

  console.log(`ZALO_APP_ID: ${appId ? "set" : "MISSING"}`);
  console.log(`ZALO_APP_SECRET length: ${secretLen}`);
  console.log(
    `refresh token length: ${refreshLen} (file .zalo-oa-refresh: ${refreshFile})`,
  );
  console.log(`access token length: ${accessLen}`);
  console.log(`ZALO_OA_TOKEN_MODE: ${process.env.ZALO_OA_TOKEN_MODE ?? "(default)"}`);

  if (
    /paste_/i.test(process.env.ZALO_APP_SECRET ?? "") ||
    /paste_/i.test(process.env.ZALO_OA_REFRESH_TOKEN ?? "") ||
    /paste_/i.test(process.env.ZALO_OA_ACCESS_TOKEN ?? "")
  ) {
    console.error(
      "\nLỖI: .env vẫn chứa placeholder paste_* — dán TOKEN THẬT trong nano .env.",
    );
    process.exit(1);
  }

  console.log(`\nSecret probe: ${await probeRefreshSecret()}`);

  try {
    const { accessToken, meta } = await refreshOaAccessToken();
    console.log(
      `\nToken: OK — source=${meta.ok ? meta.source : "?"} len=${accessToken.length}`,
    );
    if (accessOnly || meta.ok && meta.source === "static") {
      console.log(
        "Lưu ý: access token Explorer hết hạn ~1h — copy xong chạy diagnose trong 2 phút.",
      );
    }

    const withProof = await callGetProfile(accessToken, true);
    const withoutProof = await callGetProfile(accessToken, false);

    console.log(
      `\ngetprofile (có proof): ${withProof.error === 0 ? `OK — "${withProof.data?.name ?? "?"}"` : `FAIL ${withProof.error} — ${withProof.message ?? ""}`}`,
    );
    console.log(
      `getprofile (không proof): ${withoutProof.error === 0 ? "OK" : `FAIL ${withoutProof.error} — ${withoutProof.message ?? ""}`}`,
    );

    if (withProof.error !== 0) {
      console.log(`  → Mã ${withProof.error}: ${explainError(withProof.error)}`);
    }

    if (withProof.error === -216 && withoutProof.error === -125) {
      console.log(
        "\nKết luận: secret/proof OK — chỉ access token trong .env đã HẾT HẠN.",
      );
      console.log(
        "Sửa: API Explorer → OA Access Token → copy ACCESS_TOKEN mới → nano .env → chạy lại ngay.",
      );
    } else if (withProof.error === -125) {
      console.log(
        "\nKết luận: ZALO_APP_SECRET không khớp app (proof sai). Copy Secret Key tab Cài đặt.",
      );
    } else if (withProof.error === -216 && withoutProof.error === -216) {
      console.log(
        "\nKết luận: access token hiện tại không hợp lệ cho OA API.",
      );
      console.log(
        "Thường gặp: dán nhầm **User Access Token** (Explorer) thay vì **OA Access Token**.",
      );

      if (refreshLen > 0) {
        console.log("\n→ Thử luồng refresh (bỏ qua access_only)...");
        const refreshed = await tryRefreshAccessToken();
        if (!refreshed.ok) {
          console.log(`  Refresh: FAIL — ${refreshed.error}`);
          console.log(
            "  Cả access + refresh đều lỗi → lấy bộ OA token mới từ Explorer (dropdown OA Access Token).",
          );
        } else {
          const rp = await callGetProfile(refreshed.accessToken, true);
          console.log(
            `  Refresh: OK — access len=${refreshed.accessToken.length}` +
              (refreshed.expiresIn ? `, expires_in=${refreshed.expiresIn}s` : ""),
          );
          console.log(
            `  getprofile sau refresh: ${rp.error === 0 ? `OK — "${rp.data?.name ?? "?"}"` : `FAIL ${rp.error} — ${rp.message ?? ""}`}`,
          );
          if (rp.error === 0) {
            console.log(
              "\n✓ Refresh token ĐÚNG — ZALO_OA_ACCESS_TOKEN trong .env SAI (User token hoặc token cũ).",
            );
            console.log(
              "Sửa .env: comment/xóa ZALO_OA_TOKEN_MODE=access_only và ZALO_OA_ACCESS_TOKEN.",
            );
            console.log(
              "Giữ ZALO_OA_REFRESH_TOKEN (đã rotate vào .zalo-oa-refresh nếu có).",
            );
          }
        }
      }
    } else if (withProof.error === 0) {
      console.log("\nKết luận: Zalo OA API hoạt động. Tiếp: npm run go-live:zalo-oa-list-users");
    }
  } catch (err) {
    console.error(`\nToken: FAIL — ${err instanceof Error ? err.message : err}`);
    if (accessOnly) {
      console.error(
        "access_only: chỉ cần ZALO_OA_ACCESS_TOKEN mới từ Explorer (comment REFRESH_TOKEN).",
      );
    } else {
      console.error(
        "Refresh token Zalo dùng 1 lần — mỗi lần refresh đốt token cũ. Lấy bộ mới từ Explorer.",
      );
    }
    process.exit(1);
  }
}

main();
