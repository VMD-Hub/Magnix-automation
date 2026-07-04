/**
 * Smoke test luồng môi giới gửi duyệt → admin duyệt → tin ACTIVE public.
 *
 * Usage (VPS — app đang chạy qua PM2):
 *   SITE=http://127.0.0.1:3000 npm run go-live:smoke-listings
 *
 * Cần trong .env: AUTH_SECRET, ADMIN_SECRET, DATABASE_URL (dọn dữ liệu smoke).
 */
import sharp from "sharp";
import { prisma } from "../lib/prisma";

const site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/$/, "");

const adminSecret = process.env.ADMIN_SECRET?.trim();

if (!site) {
  console.error("Thiếu SITE — ví dụ: SITE=http://127.0.0.1:3000 npm run go-live:smoke-listings");
  process.exit(1);
}
if (!process.env.AUTH_SECRET?.trim()) {
  console.error("Thiếu AUTH_SECRET trong .env");
  process.exit(1);
}
if (!adminSecret) {
  console.error("Thiếu ADMIN_SECRET trong .env");
  process.exit(1);
}

type JsonBody = {
  data?: Record<string, unknown> & {
    items?: Array<{ id: string; status: string; code?: string }>;
    listing?: { id: string; status: string; code?: string };
    code?: string;
    counts?: { pending: number };
  };
  error?: { code?: string; message?: string };
};

function sessionFromResponse(res: Response): string | null {
  const raw =
    typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  const line = raw.find((c) => c.startsWith("hx_session="));
  if (!line) return null;
  return line.split(";")[0] ?? null;
}

async function api(
  path: string,
  init: RequestInit & { cookie?: string; admin?: boolean } = {},
): Promise<{ res: Response; json: JsonBody; cookie: string | null }> {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (init.cookie) headers.set("cookie", init.cookie);
  if (init.admin) headers.set("x-admin-secret", adminSecret!);

  const res = await fetch(`${site}${path}`, { ...init, headers }).catch(() => {
    throw new Error(`fetch failed (${site}${path}) — pm2 status / curl ${site}`);
  });
  const json = (await res.json().catch(() => ({}))) as JsonBody;
  const newCookie = sessionFromResponse(res) ?? init.cookie ?? null;
  return { res, json, cookie: newCookie };
}

function uniquePhone(suffix: string): string {
  const tail = suffix.padStart(8, "0").slice(-8);
  return `09${tail}`;
}

async function makeTestJpeg(seed: number): Promise<Buffer> {
  return sharp({
    create: {
      width: 1200,
      height: 800,
      channels: 3,
      background: { r: 40 + seed, g: 80 + seed, b: 120 + seed },
    },
  })
    .jpeg({ quality: 80 })
    .toBuffer();
}

type Check = { name: string; run: () => Promise<void> };

async function main() {
  const runId = Date.now().toString().slice(-8);
  const brokerPhone = uniquePhone(`${runId}3`);
  const password = "SmokeList!x";
  const desc =
    `Smoke test duyệt tin run ${runId}. Mô tả đủ dài để qua publish gate trên production House X.`;

  let brokerCookie: string | null = null;
  let brokerUserId: string | null = null;
  let listingId: string | null = null;
  let listingCode: string | null = null;

  const checks: Check[] = [
    {
      name: "Đăng ký môi giới smoke",
      run: async () => {
        const { res, json, cookie } = await api("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            role: "BROKER",
            name: "Smoke Listing MG",
            phone: brokerPhone,
            email: `smoke.listing.${runId}@housex.local`,
            password,
          }),
        });
        if (res.status !== 201) {
          throw new Error(`${res.status} ${json.error?.code ?? res.statusText}`);
        }
        if (!json.data?.brokerId) throw new Error("thiếu brokerId");
        if (!cookie) throw new Error("không nhận cookie phiên");
        brokerCookie = cookie;
        brokerUserId = String(json.data.userAccountId);
      },
    },
    {
      name: "Tạo tin nháp",
      run: async () => {
        const { res, json } = await api("/api/listings", {
          method: "POST",
          headers: { "content-type": "application/json" },
          cookie: brokerCookie!,
          body: JSON.stringify({
            transactionType: "SALE",
            propertyType: "can_ho",
            price: 1_500_000_000 + Number(runId),
            area: 65,
            province: "TP. Hồ Chí Minh",
            district: `Quận Smoke ${runId.slice(-2)}`,
            ward: "Phường test",
            address: `123 Smoke ${runId}`,
            description: desc,
            status: "DRAFT",
          }),
        });
        if (res.status !== 201) {
          throw new Error(`${res.status} ${json.error?.code ?? json.error?.message ?? ""}`);
        }
        listingId = String(json.data?.id ?? "");
        listingCode = String(json.data?.code ?? "");
        if (!listingId || !listingCode) throw new Error("thiếu id/code tin");
      },
    },
    {
      name: "Upload 5 ảnh READY",
      run: async () => {
        if (!listingId) throw new Error("thiếu listingId");
        for (let i = 0; i < 5; i++) {
          const buf = await makeTestJpeg(i * 10);
          const fd = new FormData();
          fd.append("file", new Blob([buf], { type: "image/jpeg" }), `smoke-${i}.jpg`);
          fd.append("position", String(i));
          const res = await fetch(`${site}/api/listings/${listingId}/media/upload`, {
            method: "POST",
            headers: {
              accept: "application/json",
              cookie: brokerCookie!,
            },
            body: fd,
          });
          const json = (await res.json().catch(() => ({}))) as JsonBody;
          if (!res.ok) {
            throw new Error(`ảnh ${i + 1}: ${res.status} ${json.error?.code ?? ""}`);
          }
          const media = json.data?.media as { status?: string } | undefined;
          if (media?.status !== "READY") {
            throw new Error(`ảnh ${i + 1} status=${media?.status ?? "?"}`);
          }
        }
      },
    },
    {
      name: "Môi giới không thể tự ACTIVE",
      run: async () => {
        const { res, json } = await api(`/api/listings/${listingId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          cookie: brokerCookie!,
          body: JSON.stringify({ status: "ACTIVE" }),
        });
        if (res.status !== 403) {
          throw new Error(`expected 403, got ${res.status}`);
        }
        if (json.error?.code !== "ADMIN_REVIEW_REQUIRED") {
          throw new Error(`code=${json.error?.code}`);
        }
      },
    },
    {
      name: "Gửi duyệt → PENDING_REVIEW",
      run: async () => {
        const { res, json } = await api(`/api/listings/${listingId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          cookie: brokerCookie!,
          body: JSON.stringify({ status: "PENDING_REVIEW" }),
        });
        if (res.status !== 200) {
          throw new Error(`${res.status} ${json.error?.code ?? json.error?.message ?? ""}`);
        }
        if (json.data?.status !== "PENDING_REVIEW") {
          throw new Error(`status=${json.data?.status}`);
        }
      },
    },
    {
      name: "Admin thấy tin trong hàng chờ",
      run: async () => {
        const { res, json } = await api("/api/admin/listings?status=PENDING_REVIEW", {
          admin: true,
        });
        if (res.status !== 200) throw new Error(String(res.status));
        const items = json.data?.items ?? [];
        if (!items.some((i) => i.id === listingId)) {
          throw new Error("tin smoke không có trong queue admin");
        }
      },
    },
    {
      name: "Admin duyệt hiển thị → ACTIVE",
      run: async () => {
        const { res, json } = await api(`/api/admin/listings/${listingId}/review`, {
          method: "POST",
          admin: true,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "approve" }),
        });
        if (res.status !== 200) {
          throw new Error(`${res.status} ${json.error?.code ?? json.error?.message ?? ""}`);
        }
        if (json.data?.code !== listingCode) {
          throw new Error("code sau duyệt không khớp");
        }
      },
    },
    {
      name: "Tin ACTIVE trong API public",
      run: async () => {
        const { res, json } = await api(
          `/api/listings?status=ACTIVE&pageSize=100`,
        );
        if (res.status !== 200) throw new Error(String(res.status));
        const items = (json.data?.items ?? []) as Array<{ code?: string; status?: string }>;
        const hit = items.find((i) => i.code === listingCode);
        if (!hit) throw new Error(`không thấy ${listingCode} trong feed ACTIVE`);
        if (hit.status !== "ACTIVE") throw new Error(`status=${hit.status}`);
      },
    },
    {
      name: "Trang /tin-dang/[code] SSR 200",
      run: async () => {
        const res = await fetch(`${site}/tin-dang/${listingCode}`, {
          headers: { accept: "text/html" },
        });
        if (res.status !== 200) {
          throw new Error(`expected 200, got ${res.status}`);
        }
        const html = await res.text();
        if (!html.includes(listingCode!)) {
          throw new Error("HTML không chứa mã tin");
        }
      },
    },
  ];

  let failed = 0;
  console.log(`Listing review smoke — ${site} (run ${runId})\n`);

  for (const c of checks) {
    try {
      await c.run();
      console.log(`✔ ${c.name}`);
    } catch (err) {
      failed += 1;
      console.error(`✖ ${c.name} —`, err instanceof Error ? err.message : err);
    }
  }

  try {
    if (listingId) {
      await prisma.listingMedia.deleteMany({ where: { listingId } });
      await prisma.listingFingerprint.deleteMany({ where: { listingId } }).catch(() => {});
      await prisma.listing.delete({ where: { id: listingId } }).catch(() => {});
    }
    if (brokerUserId) {
      const broker = await prisma.broker.findUnique({
        where: { userAccountId: brokerUserId },
        select: { id: true },
      });
      if (broker) await prisma.broker.delete({ where: { id: broker.id } });
      await prisma.userAccount.delete({ where: { id: brokerUserId } });
    }
  } catch {
    // best-effort cleanup
  } finally {
    await prisma.$disconnect();
  }

  console.log("");
  if (failed) {
    console.error(`${failed} check(s) failed.`);
    process.exit(1);
  }
  console.log("Listing review smoke test passed.");
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect().catch(() => {});
  process.exit(1);
});
