import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import {
  attachAdminCookie,
  clearAdminCookie,
} from "@/lib/admin/cookie-response";
import { defaultAdminHome } from "@/lib/admin/roles";
import {
  getAdminSessionFromCookies,
  resolveAdminRoleFromSecret,
} from "@/lib/admin/session";
import { z } from "zod";

const loginSchema = z.object({
  secret: z.string().min(1, "Vui lòng nhập mật khẩu admin."),
});

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/** Kiểm tra phiên admin hiện tại. */
export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  return applyApiCors(
    ok({
      authenticated: session !== null,
      role: session?.role ?? null,
    }),
    req,
  );
}

/** Đăng nhập — `ADMIN_SECRET` (Super) hoặc `ADMIN_OPS_SECRET` (Ops). */
export async function POST(req: NextRequest) {
  try {
    const superSecret = process.env.ADMIN_SECRET?.trim();
    const opsSecret = process.env.ADMIN_OPS_SECRET?.trim();
    if (!superSecret && !opsSecret) {
      return applyApiCors(
        fail(
          503,
          "ADMIN_NOT_CONFIGURED",
          "ADMIN_SECRET hoặc ADMIN_OPS_SECRET chưa được cấu hình.",
        ),
        req,
      );
    }

    const body = loginSchema.parse(await req.json());
    const role = resolveAdminRoleFromSecret(body.secret);
    if (!role) {
      return applyApiCors(
        fail(401, "INVALID_SECRET", "Mật khẩu admin không đúng."),
        req,
      );
    }

    const res = ok({
      authenticated: true,
      role,
      home: defaultAdminHome(role),
    });
    return applyApiCors(attachAdminCookie(res, role), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}

/** Đăng xuất admin. */
export async function DELETE() {
  const res = ok({ authenticated: false, role: null });
  return clearAdminCookie(res);
}
