/**
 * Smoke test luồng đăng ký khách + môi giới (P1 go-live).
 *
 * Yêu cầu: Postgres đã migrate, Next dev/prod đang chạy, AUTH_SECRET đã set.
 *
 * Usage:
 *   npm run dev   # terminal khác
 *   SITE=http://localhost:3000 npm run go-live:smoke-auth
 */
import { randomBytes } from "node:crypto";
import { prisma } from "../lib/prisma";
import { issueUserAuthToken } from "../lib/data/auth-tokens";

const site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/$/, "");

if (!site) {
  console.error(
    "Thiếu SITE — ví dụ: SITE=http://localhost:3000 npm run go-live:smoke-auth",
  );
  process.exit(1);
}

if (!process.env.AUTH_SECRET?.trim()) {
  console.error("Thiếu AUTH_SECRET trong .env — chạy: npm run go-live:secrets");
  process.exit(1);
}

type JsonBody = {
  data?: Record<string, unknown>;
  error?: { code?: string; message?: string };
};

function sessionFromResponse(res: Response): string | null {
  const raw =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : [];
  const line = raw.find((c) => c.startsWith("hx_session="));
  if (!line) return null;
  return line.split(";")[0] ?? null;
}

async function api(
  path: string,
  init: RequestInit & { cookie?: string } = {},
): Promise<{ res: Response; json: JsonBody; cookie: string | null }> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (init.cookie) headers.set("cookie", init.cookie);

  const res = await fetch(`${site}${path}`, { ...init, headers });
  const json = (await res.json().catch(() => ({}))) as JsonBody;
  const newCookie = sessionFromResponse(res) ?? init.cookie ?? null;
  return { res, json, cookie: newCookie };
}

/** SĐT VN hợp lệ duy nhất cho mỗi lần chạy (09 + 8 số). */
function uniquePhone(suffix: string): string {
  const tail = suffix.padStart(8, "0").slice(-8);
  return `09${tail}`;
}

type Check = { name: string; run: () => Promise<void> };

async function main() {
  const runId = Date.now().toString().slice(-8);
  const customerPhone = uniquePhone(`${runId}1`);
  const brokerPhone = uniquePhone(`${runId}2`);
  const password = "SmokeP1!x";
  let customerCookie: string | null = null;
  let brokerCookie: string | null = null;
  let customerUserId: string | null = null;
  let brokerUserId: string | null = null;

  const checks: Check[] = [
    {
      name: "Đăng ký khách hàng",
      run: async () => {
        const { res, json, cookie } = await api("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            role: "CUSTOMER",
            name: "Smoke Test Khách",
            phone: customerPhone,
            email: `smoke.customer.${runId}@housex.local`,
            password,
            marketingOptIn: true,
          }),
        });
        if (res.status !== 201) {
          throw new Error(`${res.status} ${json.error?.code ?? res.statusText}`);
        }
        if (json.data?.role !== "CUSTOMER") throw new Error("role != CUSTOMER");
        if (!json.data?.customerId) throw new Error("thiếu customerId");
        if (!cookie) throw new Error("không nhận cookie phiên");
        customerCookie = cookie;
        customerUserId = String(json.data.userAccountId);
      },
    },
    {
      name: "GET /api/auth/me — khách (chưa verify email)",
      run: async () => {
        const { res, json } = await api("/api/auth/me", { cookie: customerCookie! });
        if (res.status !== 200) throw new Error(String(res.status));
        if (json.data?.user?.role !== "CUSTOMER") throw new Error("role sai");
        if (json.data?.user?.emailVerified !== false) {
          throw new Error("emailVerified phải false");
        }
      },
    },
    {
      name: "Xác nhận email khách",
      run: async () => {
        if (!customerUserId) throw new Error("thiếu customerUserId");
        const token = await issueUserAuthToken(customerUserId, "EMAIL_VERIFY");
        const { res, json } = await api(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        if (res.status !== 200) {
          throw new Error(`${res.status} ${json.error?.code ?? ""}`);
        }
        if (json.data?.verified !== true) throw new Error("verified != true");
      },
    },
    {
      name: "GET /api/auth/me — khách (đã verify)",
      run: async () => {
        const { res, json } = await api("/api/auth/me", { cookie: customerCookie! });
        if (res.status !== 200) throw new Error(String(res.status));
        if (json.data?.user?.emailVerified !== true) {
          throw new Error("emailVerified phải true");
        }
      },
    },
    {
      name: "GET /api/customer/me — dashboard khách",
      run: async () => {
        const { res, json } = await api("/api/customer/me", { cookie: customerCookie! });
        if (res.status !== 200) throw new Error(String(res.status));
        if (!json.data?.profile) throw new Error("thiếu profile");
      },
    },
    {
      name: "Đăng ký môi giới",
      run: async () => {
        const { res, json, cookie } = await api("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            role: "BROKER",
            name: "Smoke Test MG",
            phone: brokerPhone,
            email: `smoke.broker.${runId}@housex.local`,
            password,
            marketingOptIn: false,
          }),
        });
        if (res.status !== 201) {
          throw new Error(`${res.status} ${json.error?.code ?? res.statusText}`);
        }
        if (json.data?.role !== "BROKER") throw new Error("role != BROKER");
        if (!json.data?.brokerId) throw new Error("thiếu brokerId");
        if (!cookie) throw new Error("không nhận cookie phiên");
        brokerCookie = cookie;
        brokerUserId = String(json.data.userAccountId);
      },
    },
    {
      name: "GET /api/auth/me — môi giới",
      run: async () => {
        const { res, json } = await api("/api/auth/me", { cookie: brokerCookie! });
        if (res.status !== 200) throw new Error(String(res.status));
        if (json.data?.user?.role !== "BROKER") throw new Error("role sai");
        if (!json.data?.user?.brokerId) throw new Error("thiếu brokerId");
      },
    },
    {
      name: "Trùng SĐT khách → 409",
      run: async () => {
        const { res, json } = await api("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            role: "CUSTOMER",
            name: "Trùng",
            phone: customerPhone,
            email: `dup.${runId}@housex.local`,
            password,
          }),
        });
        if (res.status !== 409) throw new Error(`expected 409, got ${res.status}`);
        if (json.error?.code !== "PHONE_REGISTERED") {
          throw new Error(`code=${json.error?.code}`);
        }
      },
    },
    {
      name: "Đăng nhập khách — sai mật khẩu",
      run: async () => {
        const { res } = await api("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone: customerPhone, password: "wrong-pass" }),
        });
        if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`);
      },
    },
    {
      name: "Đăng nhập khách — thành công",
      run: async () => {
        const { res, json, cookie } = await api("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone: customerPhone, password }),
        });
        if (res.status !== 200) {
          throw new Error(`${res.status} ${json.error?.code ?? ""}`);
        }
        if (!cookie) throw new Error("không nhận cookie sau login");
        customerCookie = cookie;
      },
    },
    {
      name: "Đăng xuất",
      run: async () => {
        const { res } = await api("/api/auth/logout", {
          method: "POST",
          cookie: customerCookie!,
        });
        if (res.status !== 200) throw new Error(String(res.status));
      },
    },
  ];

  let failed = 0;
  console.log(`Auth smoke — ${site} (run ${runId})\n`);

  for (const c of checks) {
    try {
      await c.run();
      console.log(`✔ ${c.name}`);
    } catch (err) {
      failed += 1;
      console.error(`✖ ${c.name} —`, err instanceof Error ? err.message : err);
    }
  }

  // Dọn dữ liệu smoke (best-effort) — broker phải xóa trước userAccount (FK RESTRICT).
  try {
    if (brokerUserId) {
      const broker = await prisma.broker.findUnique({
        where: { userAccountId: brokerUserId },
        select: { id: true },
      });
      if (broker) await prisma.broker.delete({ where: { id: broker.id } });
      await prisma.userAccount.delete({ where: { id: brokerUserId } });
    }
    if (customerUserId) {
      await prisma.userAccount.delete({ where: { id: customerUserId } });
    }
  } catch {
    // ignore cleanup errors
  } finally {
    await prisma.$disconnect();
  }

  console.log("");
  if (failed) {
    console.error(`${failed} check(s) failed.`);
    process.exit(1);
  }
  console.log("Auth smoke test passed.");
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
