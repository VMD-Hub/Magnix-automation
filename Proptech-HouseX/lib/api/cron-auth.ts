import type { NextRequest } from "next/server";
import { fail } from "@/lib/api/http";

/** Fail closed: production maintenance endpoints must never run without a secret. */
export function cronAuthError(req: NextRequest): Response | null {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return fail(
      503,
      "CRON_SECRET_REQUIRED",
      "CRON_SECRET chưa được cấu hình an toàn.",
    );
  }

  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
  }

  return null;
}
