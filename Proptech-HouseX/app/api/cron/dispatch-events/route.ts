import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { dispatchOutbox } from "@/lib/events/dispatcher";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(200).default(50),
});

// POST /api/cron/dispatch-events — P2. Gọi định kỳ (vd mỗi phút) để xử lý outbox.
// Bảo vệ bằng header Authorization: Bearer <CRON_SECRET>.
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
      }
    }

    const { limit } = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );
    const result = await dispatchOutbox({ limit });
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
