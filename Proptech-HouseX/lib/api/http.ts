import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

/**
 * Centralised error mapper for route handlers. Keeps PII out of logs by only
 * logging the error code/message, never the full request body.
 */
export function handleApiError(err: unknown) {
  if (err instanceof ZodError) {
    return fail(422, "VALIDATION_ERROR", "Dữ liệu không hợp lệ.", err.issues);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return fail(409, "CONFLICT", "Giá trị unique đã tồn tại.", {
        target: err.meta?.target,
      });
    }
    if (err.code === "P2025") {
      return fail(404, "NOT_FOUND", "Không tìm thấy bản ghi.");
    }
    if (err.code === "P2003") {
      return fail(409, "FK_CONSTRAINT", "Tham chiếu khoá ngoại không hợp lệ.", {
        field: err.meta?.field_name,
      });
    }
  }

  console.error("[api] unhandled error:", err instanceof Error ? err.message : err);
  return fail(500, "INTERNAL_ERROR", "Đã có lỗi xảy ra.");
}
