import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import {
  listDueContentDraftsForPagePublish,
  markContentDraftPagePublishResult,
} from "@/lib/data/content-page-publish";

export const dynamic = "force-dynamic";

const dueQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).optional().default(3),
});

const markSchema = z.object({
  id: z.string().uuid(),
  publish_ok: z.boolean(),
  fb_post_id: z.string().max(200).optional().nullable(),
  fb_permalink: z.string().max(500).optional().nullable(),
  publish_error: z.string().max(2000).optional().nullable(),
  publish_mode: z.string().max(40).optional().nullable(),
  pin_after_publish: z.boolean().optional(),
});

/**
 * n8n content-page-publish — lấy draft APPROVED đã tới lịch (P4.3).
 * Authorization: Bearer CRON_SECRET
 */
export async function GET(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const parsed = dueQuerySchema.parse({
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
    });
    const result = await listDueContentDraftsForPagePublish({
      limit: parsed.limit,
    });
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * n8n callback sau Graph publish — cập nhật meta + status PUBLISHED.
 */
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const body = markSchema.parse(await req.json());
    try {
      const updated = await markContentDraftPagePublishResult({
        id: body.id,
        publishOk: body.publish_ok,
        fbPostId: body.fb_post_id,
        fbPermalink: body.fb_permalink,
        publishError: body.publish_error,
        publishMode: body.publish_mode,
        pinAfterPublish: body.pin_after_publish,
      });
      return ok({
        id: updated.id,
        status: updated.status,
        publishedAt: updated.publishedAt,
        meta: updated.meta,
      });
    } catch (inner) {
      if (inner instanceof Error) {
        if (inner.message === "NOT_FOUND") {
          return fail(404, "NOT_FOUND", "Không tìm thấy content draft.");
        }
        if (inner.message === "INVALID_STATUS") {
          return fail(
            409,
            "INVALID_STATUS",
            "Draft phải APPROVED (hoặc đã PUBLISHED) để ghi kết quả Page Publish.",
          );
        }
      }
      throw inner;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
