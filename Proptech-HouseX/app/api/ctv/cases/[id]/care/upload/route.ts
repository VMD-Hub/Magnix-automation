import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { created, fail, handleApiError } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { requireBrokerSessionFromRequest } from "@/lib/auth/require-broker";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * CTV — upload ảnh bằng chứng CS (multipart field `file`).
 * Trả URL tương đối `/uploads/care/...` để POST /care.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireBrokerSessionFromRequest(req);
    if (!session.ok) {
      return applyApiCors(
        fail(session.status, session.code, session.message),
        req,
      );
    }

    const { id: caseId } = await params;
    const row = await prisma.noxhCase.findFirst({
      where: {
        id: caseId,
        brokerId: session.brokerId,
        caseStatus: "ACTIVE",
      },
      select: { id: true },
    });
    if (!row) {
      return applyApiCors(
        fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ."),
        req,
      );
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return applyApiCors(
        fail(422, "FILE_REQUIRED", "Thiếu file ảnh (field `file`)."),
        req,
      );
    }
    if (!ALLOWED.has(file.type)) {
      return applyApiCors(
        fail(422, "INVALID_TYPE", "Chỉ chấp nhận JPG, PNG hoặc WebP."),
        req,
      );
    }
    if (file.size > MAX_BYTES) {
      return applyApiCors(
        fail(422, "FILE_TOO_LARGE", "Ảnh tối đa 8 MB."),
        req,
      );
    }

    const dir = path.join(process.cwd(), "public", "uploads", "care", caseId);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}.${EXT[file.type] ?? "jpg"}`;
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));

    const url = `/uploads/care/${caseId}/${filename}`;
    return applyApiCors(created({ url }), req);
  } catch (err) {
    return applyApiCors(handleApiError(err), req);
  }
}
