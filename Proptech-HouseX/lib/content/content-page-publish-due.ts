/**
 * P4.3 — due filter cho Facebook Page Publish từ Postgres ContentDraft.
 * scheduledAt (Admin) ưu tiên hơn meta.scheduled_at (Sheet legacy).
 */

export type PagePublishMeta = {
  target_channel?: unknown;
  content_format?: unknown;
  product_type?: unknown;
  schedule_page_publish?: unknown;
  scheduled_at?: unknown;
  publish_body?: unknown;
  page_published?: unknown;
  fb_post_id?: unknown;
  [key: string]: unknown;
};

export type PagePublishDueInput = {
  status: string;
  publishChannel?: string | null;
  scheduledAt?: Date | string | null;
  hookLine?: string | null;
  artifactMarkdown?: string | null;
  ctaOptIn?: string | null;
  meta?: unknown;
};

export type PagePublishBlocker =
  | "not_approved"
  | "already_published"
  | "wrong_channel"
  | "wrong_format"
  | "not_due"
  | "empty_body";

export type PagePublishDueResult =
  | { due: true; meta: PagePublishMeta; body: string; scheduledAtIso: string | null }
  | { due: false; reason: PagePublishBlocker; meta: PagePublishMeta };

const PAGE_CHANNELS = new Set(["facebook_page", "fb_page"]);
const PAGE_FORMATS = new Set(["fb_page_post", "fb_page_post_image"]);

export function parsePagePublishMeta(raw: unknown): PagePublishMeta {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parsed && typeof parsed === "object"
        ? (parsed as PagePublishMeta)
        : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as PagePublishMeta;
  return {};
}

function parseMs(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isNaN(t) ? null : t;
  }
  const d = new Date(String(value).trim());
  if (Number.isNaN(d.getTime())) return null;
  return d.getTime();
}

export function resolvePagePublishScheduledMs(
  scheduledAt: Date | string | null | undefined,
  meta: PagePublishMeta,
): number | null {
  const fromColumn = parseMs(scheduledAt ?? null);
  if (fromColumn != null) return fromColumn;
  return parseMs(meta.scheduled_at);
}

export function wantsFacebookPagePublish(
  publishChannel: string | null | undefined,
  meta: PagePublishMeta,
): boolean {
  if (publishChannel === "FB_PAGE") return true;
  const channel = String(meta.target_channel ?? "")
    .trim()
    .toLowerCase();
  if (PAGE_CHANNELS.has(channel)) return true;
  if (meta.schedule_page_publish === true) return true;
  const product = String(meta.product_type ?? "")
    .trim()
    .toLowerCase();
  return product === "fb_page_post" || product === "fb_page_post_image";
}

export function isPagePublishFormatOk(
  publishChannel: string | null | undefined,
  meta: PagePublishMeta,
): boolean {
  if (publishChannel === "FB_PAGE") return true;
  const fmt = String(meta.content_format ?? meta.product_type ?? "fb_page_post")
    .trim()
    .toLowerCase();
  return PAGE_FORMATS.has(fmt);
}

export function resolvePagePublishBody(
  input: Pick<
    PagePublishDueInput,
    "hookLine" | "artifactMarkdown" | "ctaOptIn"
  >,
  meta: PagePublishMeta,
): string {
  return (
    String(meta.publish_body ?? "").trim() ||
    String(input.artifactMarkdown ?? "").trim() ||
    String(input.hookLine ?? "").trim() ||
    String(input.ctaOptIn ?? "").trim()
  );
}

/** Pure gate — dùng cho unit test + listDue. */
export function evaluateContentDraftPagePublishDue(
  input: PagePublishDueInput,
  nowMs: number = Date.now(),
): PagePublishDueResult {
  const meta = parsePagePublishMeta(input.meta);

  if (input.status !== "APPROVED") {
    return { due: false, reason: "not_approved", meta };
  }
  if (meta.page_published === true || meta.fb_post_id) {
    return { due: false, reason: "already_published", meta };
  }
  if (!wantsFacebookPagePublish(input.publishChannel, meta)) {
    return { due: false, reason: "wrong_channel", meta };
  }
  if (!isPagePublishFormatOk(input.publishChannel, meta)) {
    return { due: false, reason: "wrong_format", meta };
  }

  const scheduledMs = resolvePagePublishScheduledMs(input.scheduledAt, meta);
  if (scheduledMs != null && scheduledMs > nowMs) {
    return { due: false, reason: "not_due", meta };
  }

  const body = resolvePagePublishBody(input, meta);
  if (body.length < 40) {
    return { due: false, reason: "empty_body", meta };
  }

  return {
    due: true,
    meta,
    body,
    scheduledAtIso:
      scheduledMs != null ? new Date(scheduledMs).toISOString() : null,
  };
}
