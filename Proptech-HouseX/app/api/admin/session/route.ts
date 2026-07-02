import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  attachAdminCookie,
  clearAdminCookie,
} from "@/lib/admin/cookie-response";
import { getAdminSessionFromCookies } from "@/lib/admin/session";
import { z } from "zod";

const loginSchema = z.object({
  secret: z.string().min(1, "Vui lòng nhập mật khẩu admin."),
});

/** Kiểm tra phiên admin hiện tại. */
export async function GET() {
  const authenticated = await getAdminSessionFromCookies();
  return ok({ authenticated });
}

/** Đăng nhập admin bằng ADMIN_SECRET → cookie httpOnly. */
export async function POST(req: NextRequest) {
  try {
    const envSecret = process.env.ADMIN_SECRET;
    if (!envSecret) {
      return fail(503, "ADMIN_NOT_CONFIGURED", "ADMIN_SECRET chưa được cấu hình.");
    }

    const body = loginSchema.parse(await req.json());
    if (body.secret !== envSecret) {
      return fail(401, "INVALID_SECRET", "Mật khẩu admin không đúng.");
    }

    const res = ok({ authenticated: true });
    return attachAdminCookie(res);
  } catch (err) {
    return handleApiError(err);
  }
}

/** Đăng xuất admin. */
export async function DELETE() {
  const res = ok({ authenticated: false });
  return clearAdminCookie(res);
}
