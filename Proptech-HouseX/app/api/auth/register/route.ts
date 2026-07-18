import { NextRequest } from "next/server";
import { created, fail, handleApiError } from "@/lib/api/http";
import { authRegisterSchema } from "@/lib/validation/auth";
import { registerUserAccount } from "@/lib/auth/register-account";
import { attachSessionCookie } from "@/lib/auth/cookie-response";
import { isRateLimited } from "@/lib/redis";
import { ipHash } from "@/lib/api/request-meta";

const AUTH_RATE_MAX = Number(process.env.AUTH_RATE_MAX ?? "10");
const AUTH_RATE_WINDOW_SEC = Number(process.env.AUTH_RATE_WINDOW_SEC ?? "900");

export async function POST(req: NextRequest) {
  try {
    const ip = ipHash(req);
    if (await isRateLimited(`auth:reg:${ip}`, AUTH_RATE_MAX, AUTH_RATE_WINDOW_SEC)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều lần thử. Vui lòng thử lại sau.");
    }

    const body = authRegisterSchema.parse(await req.json());
    const result = await registerUserAccount(body);

    if (!result.ok) {
      return fail(
        result.code === "PHONE_REGISTERED" || result.code === "EMAIL_REGISTERED"
          ? 409
          : 422,
        result.code,
        result.message,
        result.details,
      );
    }

    const res = created(result.data);
    return attachSessionCookie(res, result.data.userAccountId);
  } catch (err) {
    return handleApiError(err);
  }
}
