import { HOUSEX_API_BASE, TOKEN_STORAGE_KEY } from "@/config";

function getBearer(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

async function brokerFetch<T>(
  path: string,
  init?: RequestInit & { idempotency?: string },
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const token = getBearer();
  if (!token) {
    return { ok: false, status: 401, error: "Chưa đăng nhập" };
  }
  const headers: Record<string, string> = {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...(init?.body ? { "content-type": "application/json" } : {}),
    ...(init?.idempotency ? { "Idempotency-Key": init.idempotency } : {}),
  };
  const res = await fetch(`${HOUSEX_API_BASE}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: T;
    error?: { message?: string; code?: string };
  };
  return {
    ok: res.ok,
    status: res.status,
    data: json.data,
    error: json.error?.message ?? json.error?.code,
  };
}

export function checkBrokerTelesalesAccess() {
  return brokerFetch<{
    allowed: boolean;
    brokerType: string | null;
    lane: string | null;
    reason: string | null;
  }>("/api/broker/telesales/access");
}

export function listBrokerTelesalesLeads(status?: string) {
  const q = status ? `?status=${status}` : "";
  return brokerFetch<{
    brokerType: string;
    items: Array<{
      id: string;
      statusLabel: string;
      customerName: string | null;
      phoneMasked: string | null;
      sourceLabel: string;
      createdAt: string;
    }>;
  }>(`/api/broker/telesales/leads${q}`);
}

export function getBrokerContact(leadId: string) {
  return brokerFetch<{
    detail: { customerName: string | null; statusLabel: string };
    phone: string | null;
    deepLinks: {
      tel: string;
      sms: string;
      zalo: { copyPhone: string; hint: string };
    } | null;
    lastContact: { at: string; reason: string | null; type: string } | null;
    callBlockedUntil: string | null;
    activities: Array<{
      id: string;
      type: string;
      reason: string | null;
      note: string | null;
      occurredAt: string;
    }>;
    conversionHint?: string;
    callCue?: {
      segment: "NOXH";
      openingLine: string;
      mustCover: Array<{ id: string; label: string; hint: string }>;
      situations?: Array<{
        id: string;
        title: string;
        principle: string;
        boundary: string;
      }>;
      projectFacts: {
        projectName: string | null;
        priceFromLabel: string | null;
        applicationDeadlineLabel: string | null;
        missingFields: string[];
      };
      softMode: boolean;
    } | null;
    deferredSegment?: string | null;
  }>(`/api/broker/telesales/leads/${leadId}/contact`);
}

export function recordBrokerContact(
  leadId: string,
  result: string,
  note?: string,
) {
  const idem = `broker-contact:${crypto.randomUUID()}`;
  return brokerFetch<{ bundle: unknown }>(
    `/api/broker/telesales/leads/${leadId}/contact`,
    {
      method: "POST",
      idempotency: idem,
      body: JSON.stringify({
        result,
        note: note ?? null,
        actorId: "broker-miniapp",
        correlationId: `corr:${crypto.randomUUID()}`,
      }),
    },
  );
}
