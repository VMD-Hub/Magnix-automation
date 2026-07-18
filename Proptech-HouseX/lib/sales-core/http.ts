import type { NextRequest } from "next/server";
import { fail, handleApiError } from "@/lib/api/http";
import { SalesCoreRuleError } from "./domain";

export function requireIdempotencyKey(req: NextRequest): string {
  const key = req.headers.get("idempotency-key")?.trim();
  if (!key || key.length > 200) {
    throw new SalesCoreRuleError(
      "IDEMPOTENCY_KEY_REQUIRED",
      "A valid Idempotency-Key header is required.",
    );
  }
  return key;
}

export function handleSalesCoreError(error: unknown) {
  if (error instanceof SalesCoreRuleError) {
    if (error.code === "FEATURE_DISABLED") {
      return fail(403, error.code, error.message);
    }
    const notFound =
      error.code === "NOT_FOUND" || error.code.endsWith("_NOT_FOUND");
    return fail(
      notFound ? 404 : error.code.endsWith("_REQUIRED") ? 422 : 409,
      error.code,
      error.message,
    );
  }
  return handleApiError(error);
}
