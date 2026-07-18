import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createProposalSnapshot,
  listProposalSnapshots,
} from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { proposalCommandSchema } from "@/lib/validation/sales-core";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền đọc proposal.");
    }
    const opportunityId = z
      .string()
      .trim()
      .min(1)
      .max(128)
      .parse(req.nextUrl.searchParams.get("opportunityId"));
    return ok({ proposals: await listProposalSnapshots(opportunityId) });
  } catch (error) {
    return handleSalesCoreError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền tạo proposal.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = proposalCommandSchema.parse(await req.json());
    return ok(await createProposalSnapshot({ ...body, idempotencyKey }));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
