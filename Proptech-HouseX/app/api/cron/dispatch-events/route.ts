import { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { dispatchOutbox } from "@/lib/events/dispatcher";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(200).default(50),
});

// POST /api/cron/dispatch-events — P2. Gọi định kỳ (vd mỗi phút) để xử lý outbox.
// Bảo vệ bằng header Authorization: Bearer <CRON_SECRET>.
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const { limit } = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );
    const result = await dispatchOutbox({ limit });
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
