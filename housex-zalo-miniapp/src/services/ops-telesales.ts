import { HOUSEX_API_BASE } from "@/config";

const OPS_SECRET_KEY = "housex_ops_admin_secret";

export function getOpsSecret(): string | null {
  try {
    return sessionStorage.getItem(OPS_SECRET_KEY);
  } catch {
    return null;
  }
}

export function setOpsSecret(secret: string) {
  sessionStorage.setItem(OPS_SECRET_KEY, secret.trim());
}

export function clearOpsSecret() {
  sessionStorage.removeItem(OPS_SECRET_KEY);
}

async function opsFetch<T>(
  path: string,
  init?: RequestInit & { idempotency?: string },
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const secret = getOpsSecret();
  if (!secret) {
    return { ok: false, status: 401, error: "Chưa đăng nhập Ops" };
  }
  const headers: Record<string, string> = {
    accept: "application/json",
    "x-admin-secret": secret,
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

export async function opsLogin(secret: string) {
  const res = await fetch(`${HOUSEX_API_BASE}/api/admin/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false as const,
      error: json?.error?.message ?? "Đăng nhập thất bại",
    };
  }
  setOpsSecret(secret);
  return { ok: true as const, role: json?.data?.role as string };
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
    { method: "POST", body: JSON.stringify({ ...body, actorId: "ops-miniapp" }) },
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
