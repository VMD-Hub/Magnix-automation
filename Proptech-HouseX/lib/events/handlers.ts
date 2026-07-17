/**
 * Handler cho từng sự kiện outbox. Mặc định forward sang n8n webhook
 * (EVENTS_WEBHOOK_URL) — đúng triết lý Magnix (n8n là trục tự động hoá).
 * Chưa cấu hình URL → chỉ log (dev). Handler PHẢI idempotent ở phía nhận
 * (delivery là at-least-once).
 */

export type EventHandler = (payload: unknown) => Promise<void>;

export async function forwardEventToWebhook(
  type: string,
  payload: unknown,
): Promise<void> {
  const url = process.env.EVENTS_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`EVENTS_WEBHOOK_URL is required for outbox event ${type}`);
    }
    console.warn(`[outbox] skipped outside production (no EVENTS_WEBHOOK_URL): ${type}`);
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

function registerWebhookPlusHandler(
  type: string,
  extra?: EventHandler,
): void {
  handlers[type] = async (payload) => {
    await forwardEventToWebhook(type, payload);
    if (extra) await extra(payload);
  };
}

// Registry: handler chuyên biệt theo type (mặc định chỉ forward webhook).
const handlers: Record<string, EventHandler> = {};

registerWebhookPlusHandler("noxh_case.milestone_changed", async (payload) => {
  const { notifyBrokerMilestoneZaloOa } = await import(
    "@/lib/zalo/broker-oa-notify"
  );
  await notifyBrokerMilestoneZaloOa(
    payload as import("@/lib/events/types").OutboxPayloads["noxh_case.milestone_changed"],
  );
});

registerWebhookPlusHandler("attribution.conflict", async (payload) => {
  const { notifyBrokerConflictZaloOa } = await import(
    "@/lib/zalo/broker-oa-notify"
  );
  await notifyBrokerConflictZaloOa(
    payload as import("@/lib/events/types").OutboxPayloads["attribution.conflict"],
  );
});

export async function handleEvent(
  type: string,
  payload: unknown,
): Promise<void> {
  const specific = handlers[type];
  if (specific) {
    await specific(payload);
    return;
  }
  await forwardEventToWebhook(type, payload);
}

/** Backoff luỹ thừa (giây) có trần — pure, test được. */
export function backoffSeconds(attempts: number): number {
  return Math.min(3600, 30 * 2 ** Math.max(0, attempts - 1));
}
