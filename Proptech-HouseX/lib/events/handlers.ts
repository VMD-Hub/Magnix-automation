/**
 * Handler cho từng sự kiện outbox. Mặc định forward sang n8n webhook
 * (EVENTS_WEBHOOK_URL) — đúng triết lý Magnix (n8n là trục tự động hoá).
 * Chưa cấu hình URL → chỉ log (dev). Handler PHẢI idempotent ở phía nhận
 * (delivery là at-least-once).
 */

export type EventHandler = (payload: unknown) => Promise<void>;

async function forwardToWebhook(type: string, payload: unknown): Promise<void> {
  const url = process.env.EVENTS_WEBHOOK_URL;
  if (!url) {
    console.log(`[outbox] (no EVENTS_WEBHOOK_URL) ${type}`, payload);
    return;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.EVENTS_WEBHOOK_SECRET
        ? { "x-events-secret": process.env.EVENTS_WEBHOOK_SECRET }
        : {}),
    },
    body: JSON.stringify({ type, payload, sentAt: new Date().toISOString() }),
  });
  if (!res.ok) {
    throw new Error(`webhook ${type} → ${res.status} ${await res.text()}`);
  }
}

// Registry: cho phép gắn handler chuyên biệt theo type sau này.
const handlers: Record<string, EventHandler> = {};

export async function handleEvent(
  type: string,
  payload: unknown,
): Promise<void> {
  const specific = handlers[type];
  if (specific) {
    await specific(payload);
    return;
  }
  await forwardToWebhook(type, payload);
}

/** Backoff luỹ thừa (giây) có trần — pure, test được. */
export function backoffSeconds(attempts: number): number {
  return Math.min(3600, 30 * 2 ** Math.max(0, attempts - 1));
}
