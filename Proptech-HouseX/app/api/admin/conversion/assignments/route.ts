import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  assignLead,
  recordAssignmentFact,
} from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { assignmentCommandSchema } from "@/lib/validation/sales-core";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền gán lead.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = assignmentCommandSchema.parse(await req.json());
    if (body.action === "assign") {
      const { action, ...input } = body;
      void action;
      return ok(await assignLead({ ...input, idempotencyKey }));
    }
    const { action, ...input } = body;
    return ok(
      await recordAssignmentFact({
        ...input,
        fact: action,
        idempotencyKey,
      }),
    );
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
