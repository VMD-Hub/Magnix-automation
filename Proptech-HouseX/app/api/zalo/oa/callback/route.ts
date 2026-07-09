import { NextRequest, NextResponse } from "next/server";
import {
  exchangeOaAuthCode,
  getOaCallbackUrl,
  readPkceVerifierFromCookie,
  ZALO_OA_PKCE_COOKIE,
} from "@/lib/zalo/oa-oauth";

function htmlPage(body: string, status = 200): NextResponse {
  const page = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>House X — Zalo OA OAuth</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #0f172a; }
    code, pre { background: #f1f5f9; border-radius: 6px; }
    pre { padding: 1rem; overflow-x: auto; word-break: break-all; white-space: pre-wrap; }
    .err { color: #b91c1c; }
    .ok { color: #15803d; }
    h1 { font-size: 1.25rem; }
  </style>
</head>
<body>${body}</body>
</html>`;
  return new NextResponse(page, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function clearPkceCookie(res: NextResponse): void {
  res.cookies.set(ZALO_OA_PKCE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/zalo/oa",
    maxAge: 0,
  });
}

/**
 * Zalo redirect sau khi admin OA cho phép app.
 * Hiển thị refresh_token để copy vào VPS .env (không log token).
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  const zaloError = req.nextUrl.searchParams.get("error")?.trim();

  if (zaloError) {
    const res = htmlPage(
      `<h1 class="err">Zalo từ chối cấp quyền</h1><p>${zaloError}</p>`,
      400,
    );
    clearPkceCookie(res);
    return res;
  }

  if (!code) {
    return htmlPage(
      `<h1 class="err">Thiếu authorization code</h1>
       <p>Mở <a href="/api/zalo/oa/authorize">/api/zalo/oa/authorize</a> sau khi đăng nhập admin.</p>`,
      400,
    );
  }

  const verifier = readPkceVerifierFromCookie(
    req.cookies.get(ZALO_OA_PKCE_COOKIE)?.value,
  );
  if (!verifier) {
    return htmlPage(
      `<h1 class="err">Phiên OAuth hết hạn</h1>
       <p>Đăng nhập <a href="/admin/login">/admin/login</a>, rồi mở lại
       <a href="/api/zalo/oa/authorize">/api/zalo/oa/authorize</a>.</p>`,
      400,
    );
  }

  const appId = process.env.ZALO_APP_ID?.trim();
  const appSecret = process.env.ZALO_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    return htmlPage(
      `<h1 class="err">Server chưa cấu hình ZALO_APP_ID / ZALO_APP_SECRET</h1>`,
      503,
    );
  }

  let callbackUrl: string;
  try {
    callbackUrl = getOaCallbackUrl();
  } catch {
    return htmlPage(`<h1 class="err">Thiếu NEXT_PUBLIC_SITE_URL</h1>`, 503);
  }

  try {
    const tokens = await exchangeOaAuthCode({
      appId,
      appSecret,
      code,
      codeVerifier: verifier,
    });

    const res = htmlPage(
      `<h1 class="ok">OA authorize thành công</h1>
       <p>Copy <strong>refresh_token</strong> vào VPS <code>Proptech-HouseX/.env</code>:</p>
       <pre>ZALO_OA_REFRESH_TOKEN=${tokens.refreshToken}</pre>
       <p>Access token hết hạn sau ~${tokens.expiresIn}s — production chỉ cần refresh token.</p>
       <p>Callback đã dùng: <code>${callbackUrl}</code></p>
       <p>Sau khi cập nhật VPS: <code>pm2 restart housex --update-env</code></p>
       <p><small>Đóng tab này — không chia sẻ URL có token.</small></p>`,
    );
    clearPkceCookie(res);
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const res = htmlPage(
      `<h1 class="err">Đổi code thất bại</h1>
       <p>${msg}</p>
       <p>Kiểm tra Callback URL trên developers khớp chính xác:</p>
       <pre>${callbackUrl}</pre>
       <p>Hoặc dùng API Explorer → OA Access Token → <code>ZALO_OA_ACCESS_TOKEN</code> tạm (~25h).</p>`,
      502,
    );
    clearPkceCookie(res);
    return res;
  }
}
