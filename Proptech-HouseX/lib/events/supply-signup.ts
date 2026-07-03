import type { AccountRole } from "@prisma/client";
import { getSiteUrl } from "@/lib/site-config";
import type { OutboxPayloads } from "@/lib/events/types";

/** Best-effort push event sang n8n — outbox vẫn retry nếu lỗi. */
export async function forwardOutboxEventBestEffort(
  type: string,
  payload: unknown,
): Promise<void> {
  const url = process.env.EVENTS_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.EVENTS_WEBHOOK_SECRET
          ? { "x-events-secret": process.env.EVENTS_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify({
        type,
        payload,
        sentAt: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error(
      `[outbox] realtime forward ${type} failed:`,
      err instanceof Error ? err.message : err,
    );
  }
}

export function buildAccountRegisteredPayload(input: {
  userAccountId: string;
  role: AccountRole;
  name: string;
  phone: string;
  email: string;
  marketingOptIn: boolean;
  brokerId?: string;
  customerId?: string;
  registeredAt: Date;
}): OutboxPayloads["account.registered"] {
  const site = getSiteUrl();
  const signupPath =
    input.role === "BROKER" ? "/dang-ky/moi-gioi" : "/dang-ky/khach-hang";

  return {
    userAccountId: input.userAccountId,
    role: input.role,
    name: input.name,
    phone: input.phone,
    email: input.email,
    marketingOptIn: input.marketingOptIn,
    brokerId: input.brokerId ?? null,
    customerId: input.customerId ?? null,
    registeredAt: input.registeredAt.toISOString(),
    signupUrl: `${site}${signupPath}`,
  };
}

export function buildCtvApplicationPayload(input: {
  applicationId: string;
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerEmail: string | null;
  idNumber: string;
  experience: string;
  region: string;
  motivation: string;
  submittedAt: Date;
}): OutboxPayloads["ctv.application_submitted"] {
  const site = getSiteUrl();
  return {
    applicationId: input.applicationId,
    brokerId: input.brokerId,
    brokerName: input.brokerName,
    brokerPhone: input.brokerPhone,
    brokerEmail: input.brokerEmail,
    idNumberLast4: input.idNumber.slice(-4),
    region: input.region,
    experience: input.experience.slice(0, 300),
    motivation: input.motivation.slice(0, 300),
    submittedAt: input.submittedAt.toISOString(),
    adminUrl: `${site}/moi-gioi/dang-ky-ctv`,
  };
}
