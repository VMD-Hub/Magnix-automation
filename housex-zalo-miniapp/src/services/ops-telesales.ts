import { HOUSEX_API_BASE, TOKEN_STORAGE_KEY } from "@/config";

function getBearer(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

async function opsFetch<T>(
  path: string,
  init?: RequestInit & { idempotency?: string },
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const token = getBearer();
  if (!token) {
    return { ok: false, status: 401, error: "Chưa đăng nhập Zalo / House X" };
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

export async function checkTelesalesAccess() {
  return opsFetch<{
    allowed: boolean;
    tool: string;
    reason: string | null;
  }>("/api/ops/telesales/access");
}

export function listOpsLeads(status?: string) {
  const q = status ? `?status=${status}` : "";
  return opsFetch<{
    items: Array<{
      id: string;
      status: string;
      statusLabel: string;
      customerName: string | null;
      phoneMasked: string | null;
      sourceLabel: string;
      createdAt: string;
    }>;
  }>(`/api/admin/ops-leads${q}`);
}

export function getOpsContact(leadId: string) {
  return opsFetch<{
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
    conversionHint: string;
    callCue?: {
      segment: "NOXH";
      openingLine: string;
      flowSteps: string[];
      mustCover: Array<{ id: string; label: string; hint: string }>;
      projectFacts: {
        projectName: string | null;
        priceFromLabel: string | null;
        pricePerSqmLabel: string | null;
        applicationDeadlineLabel: string | null;
        promoUnitsRemaining: number | null;
        missingFields: string[];
      };
      softMode: boolean;
    } | null;
    deferredSegment?: string | null;
  }>(`/api/admin/ops-leads/${leadId}/contact`);
}

export function createHotLead(body: {
  name: string;
  phone: string;
  source?: string;
  note?: string;
}) {
  return opsFetch<{ leadId: string; created: boolean }>(
    "/api/admin/ops-leads",
    {
      method: "POST",
      body: JSON.stringify({ ...body, actorId: "ops-miniapp" }),
    },
  );
}

export function recordContact(
  leadId: string,
  result: string,
  note?: string,
) {
  return opsFetch(`/api/admin/ops-leads/${leadId}/contact`, {
    method: "POST",
    idempotency: `ops-mm-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    body: JSON.stringify({
      result,
      note: note || null,
      actorId: "ops-miniapp",
      correlationId: `ops-mm-${Date.now()}`,
    }),
  });
}

export function serverSend(
  leadId: string,
  channels: Array<"oa" | "sms">,
) {
  return opsFetch<{
    results: Array<{
      channel: string;
      status: string;
      reason: string | null;
    }>;
  }>(`/api/admin/ops-leads/${leadId}/server-send`, {
    method: "POST",
    idempotency: `ops-mm-ss-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    body: JSON.stringify({
      channels,
      actorId: "ops-miniapp",
      correlationId: `ops-mm-ss-${Date.now()}`,
    }),
  });
}
