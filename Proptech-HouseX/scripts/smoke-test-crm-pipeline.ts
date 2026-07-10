/**
 * Smoke test CRM pipeline R1–R5 (Ops leads, conflicts, nurture outbox).
 *
 * Usage (read-only — an toàn trên production):
 *   SITE=https://timnhaxahoi.com ADMIN_SECRET=xxx npm run go-live:smoke-crm
 *
 * Ghi DB + kiểm tra outbox (cần DATABASE_URL, chạy trên staging/local):
 *   SITE=http://127.0.0.1:3000 ADMIN_SECRET=xxx CRM_SMOKE_WRITE=1 npm run go-live:smoke-crm
 */
import { prisma } from "../lib/prisma";

const site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/$/, "");
const adminSecret = (process.env.ADMIN_SECRET ?? "").trim();
const writeMode = process.env.CRM_SMOKE_WRITE === "1";

type JsonBody = {
  data?: unknown;
  error?: { code?: string; message?: string };
};

function fail(msg: string): never {
  console.error(`FAIL — ${msg}`);
  process.exit(1);
}

function ok(msg: string) {
  console.log(`OK — ${msg}`);
}

async function adminApi(
  path: string,
  init: RequestInit = {},
): Promise<{ res: Response; json: JsonBody }> {
  if (!adminSecret) {
    fail("Thiếu ADMIN_SECRET — ví dụ: ADMIN_SECRET=... npm run go-live:smoke-crm");
  }
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  headers.set("x-admin-secret", adminSecret);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const res = await fetch(`${site}${path}`, { ...init, headers }).catch(() => {
    fail(`fetch ${path} — app có đang chạy? (${site})`);
  });
  const json = (await res.json().catch(() => ({}))) as JsonBody;
  return { res, json };
}

async function main() {
  if (!site) {
    fail("Thiếu SITE — ví dụ: SITE=https://timnhaxahoi.com npm run go-live:smoke-crm");
  }

  console.log(`CRM smoke @ ${site}${writeMode ? " (WRITE)" : " (read-only)"}`);

  const opsRes = await adminApi("/api/admin/ops-leads");
  if (opsRes.res.status === 403) {
    fail("ops-leads 403 — ADMIN_SECRET sai hoặc chưa set trên server");
  }
  if (!opsRes.res.ok) {
    fail(`ops-leads ${opsRes.res.status} ${opsRes.json.error?.code ?? ""}`);
  }
  const opsData = opsRes.json.data as { items?: unknown[]; total?: number } | undefined;
  ok(`GET /api/admin/ops-leads → ${opsData?.total ?? 0} lead(s)`);

  const conflictRes = await adminApi("/api/admin/conflicts?status=OPEN");
  if (!conflictRes.res.ok) {
    fail(`conflicts ${conflictRes.res.status} ${conflictRes.json.error?.code ?? ""}`);
  }
  const conflictData = conflictRes.json.data as { items?: unknown[] } | undefined;
  ok(`GET /api/admin/conflicts → ${conflictData?.items?.length ?? 0} open`);

  const cronSecret = (process.env.CRON_SECRET ?? "").trim();
  if (cronSecret) {
    const dispatchRes = await fetch(`${site}/api/cron/dispatch-events`, {
      method: "POST",
      headers: { authorization: `Bearer ${cronSecret}` },
    });
    if (dispatchRes.ok) {
      ok("POST /api/cron/dispatch-events → 200");
    } else {
      console.warn(
        `WARN — dispatch-events ${dispatchRes.status} (outbox cron có thể chưa cấu hình)`,
      );
    }
  } else {
    console.warn("WARN — bỏ qua dispatch-events (thiếu CRON_SECRET)");
  }

  if (!writeMode) {
    console.log("\nDone (read-only). Để test nurture outbox: CRM_SMOKE_WRITE=1 + DATABASE_URL");
    return;
  }

  if (!process.env.DATABASE_URL?.trim()) {
    fail("CRM_SMOKE_WRITE=1 cần DATABASE_URL trong env");
  }

  const project = await prisma.project.findFirst({
    where: { status: "PUBLISHED" },
    select: { id: true, name: true, projectType: true },
    orderBy: { updatedAt: "desc" },
  });
  if (!project) fail("Không có project PUBLISHED để tạo lead test");

  const runId = Date.now().toString().slice(-7);
  const phone = `090${runId.padStart(7, "0").slice(0, 7)}`;

  const leadRes = await fetch(`${site}/api/leads`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-housex-channel": "web",
    },
    body: JSON.stringify({
      name: `CRM Smoke ${runId}`,
      phone,
      email: `crm.smoke.${runId}@housex.local`,
      message: "CRM pipeline smoke test",
      projectId: project.id,
      source: "zalo_ads",
      utm_source: "zalo",
      utm_medium: "cpc",
      utm_campaign: "crm_smoke",
      segment: project.projectType === "NHA_O_XA_HOI" ? "noxh" : "cctm",
    }),
  });
  const leadJson = (await leadRes.json().catch(() => ({}))) as {
    data?: { id?: string };
    error?: { code?: string; message?: string };
  };
  if (!leadRes.ok || !leadJson.data?.id) {
    fail(`POST /api/leads ${leadRes.status} ${leadJson.error?.code ?? leadJson.error?.message ?? ""}`);
  }
  const leadId = leadJson.data.id;
  ok(`POST /api/leads → ${leadId}`);

  const leadRow = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { opsMeta: true, source: true },
  });
  const opsMeta = leadRow?.opsMeta as Record<string, unknown> | null;
  const dispatch = opsMeta?.nurtureDispatch;
  if (!Array.isArray(dispatch) || dispatch.length === 0) {
    fail("opsMeta.nurtureDispatch trống — nurture on_create chưa enqueue");
  }
  ok(`nurture on_create enqueued (${(dispatch[0] as { scriptId?: string }).scriptId ?? "?"})`);

  const outbox = await prisma.outboxEvent.findFirst({
    where: {
      type: "lead.nurture",
      dedupeKey: { startsWith: `lead.nurture:${leadId}:` },
    },
    select: { id: true, status: true },
  });
  if (!outbox) fail("outbox lead.nurture không thấy");
  ok(`outbox lead.nurture → status=${outbox.status}`);

  const patchRes = await adminApi(`/api/admin/ops-leads/${leadId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "CONTACTED" }),
  });
  if (!patchRes.res.ok) {
    fail(`PATCH ops-lead CONTACTED ${patchRes.res.status}`);
  }
  ok("PATCH ops-lead → CONTACTED");

  const afterContact = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { opsMeta: true },
  });
  const dispatch2 = (afterContact?.opsMeta as Record<string, unknown> | null)
    ?.nurtureDispatch;
  const contactedCount = Array.isArray(dispatch2)
    ? dispatch2.filter((r) => (r as { trigger?: string }).trigger === "status_contacted")
        .length
    : 0;
  if (contactedCount < 1) {
    fail("nurture status_contacted chưa enqueue sau CONTACTED");
  }
  ok("nurture status_contacted enqueued");

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "LOST" },
  });
  ok("cleanup — lead đánh dấu LOST");

  console.log("\nDone — CRM smoke (write) passed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
