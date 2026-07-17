import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createAppointment,
  transitionAppointment,
} from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { appointmentCommandSchema } from "@/lib/validation/sales-core";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền cập nhật appointment.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = appointmentCommandSchema.parse(await req.json());
    if (body.action === "create") {
      const { action, ...input } = body;
      void action;
      return ok(await createAppointment({ ...input, idempotencyKey }));
    }
    const { action, ...input } = body;
    void action;
    return ok(await transitionAppointment({ ...input, idempotencyKey }));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
