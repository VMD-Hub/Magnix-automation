/**
 * Seed bài sổ đỏ điện tử vào content_queue QUA ADMIN API.
 * Dùng khi Postgres local không chạy — trỏ --base tới Admin đang chạy code mới
 * (có allowlist legal-review).
 *
 * Usage:
 *   node scripts/seed-so-do-dien-tu-queue-api.mjs --base http://localhost:3000
 *   node scripts/seed-so-do-dien-tu-queue-api.mjs --base https://timnhaxahoi.com
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DRAFT_REL = "docs/content/drafts/07-so-do-dien-tu-du-thao-luat-dat-dai-2026.md";
const SHEET_KEY = "so-do-dien-tu:H1";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function readAdminSecret() {
  if (process.env.ADMIN_SECRET?.trim()) return process.env.ADMIN_SECRET.trim();
  try {
    const env = readFileSync(resolve(ROOT, ".env"), "utf8");
    const m = env.match(/^ADMIN_SECRET\s*=\s*"?([^"\r\n]+)"?/m);
    if (m) return m[1].trim();
  } catch {}
  return null;
}

function parseDraft(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    meta[m[1]] = val;
  }
  return { meta, body: match[2].trim() };
}

async function main() {
  const base = arg("base", process.env.HOUSEX_BASE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const secret = readAdminSecret();
  if (!secret) {
    console.error("Thiếu ADMIN_SECRET (env hoặc .env).");
    process.exit(1);
  }

  const { meta, body } = parseDraft(readFileSync(resolve(ROOT, DRAFT_REL), "utf8"));
  if (!meta.title?.trim()) throw new Error("Draft thiếu title");
  if (!body.includes("## Kiểm tra nhanh (CTA)")) {
    throw new Error("Draft thiếu section CTA");
  }
  if (meta.ctaToolId !== "legal-review") {
    throw new Error("Draft phải dùng ctaToolId: legal-review");
  }

  const headers = {
    "content-type": "application/json",
    "x-admin-secret": secret,
  };

  const check = await fetch(`${base}/api/admin/content-queue?status=ALL`, { headers });
  if (!check.ok) {
    console.error(`Auth/endpoint fail: GET ${base}/api/admin/content-queue → ${check.status}`);
    console.error((await check.text()).slice(0, 400));
    process.exit(1);
  }
  const existing = await check.json();
  const items = existing?.data?.items ?? existing?.items ?? [];
  const existingKeys = new Set(items.map((i) => i.normalizedKey));
  console.log(`Auth OK — queue hiện có ${existingKeys.size} item tại ${base}`);

  if (existingKeys.has(`sheet:${SHEET_KEY}`)) {
    console.log(`↷ sheet:${SHEET_KEY} đã tồn tại — bỏ qua`);
    console.log(`Duyệt L2 tại ${base}/admin/content-queue`);
    return;
  }

  const payload = {
    title: meta.title.trim(),
    painPoint: meta.painPoint?.trim() || meta.excerpt?.trim() || null,
    bodyPreview: body.slice(0, 19900),
    segment: "general_inbound",
    score: 88,
    publishChannel: "WEBSITE",
    ctaToolId: "legal-review",
    ctaLabel: meta.ctaLabel?.trim() || "Đặt lịch rà soát pháp lý 15 phút miễn phí",
    sheetKey: SHEET_KEY,
    opsNotes: [
      "GENERAL_POLICY — pháp lý đất đai / sổ đỏ (không phải NƠXH).",
      `slug: ${meta.slug}`,
      `Draft: ${DRAFT_REL}`,
      "requires_legal_qa: true",
      "L2 /devil bắt buộc trước submit_l3 — dự thảo ≠ luật đã ban hành.",
      "CTA: legal-review → /lien-he?goi=ra-soat-phap-ly-15-phut#tu-van",
    ].join("\n"),
    l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
  };

  const res = await fetch(`${base}/api/admin/content-queue`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    const data = await res.json().catch(() => ({}));
    const id = data?.data?.id ?? data?.id ?? "?";
    console.log(`✔ Tạo mới → INTAKE · legal-review · id=${id}`);
    console.log(`Duyệt L2 /devil tại ${base}/admin/content-queue`);
    return;
  }

  const text = (await res.text()).slice(0, 500);
  if (res.status === 409 || /unique|P2002/i.test(text)) {
    console.log(`↷ Trùng key — bỏ qua`);
    return;
  }
  console.error(`✖ Lỗi ${res.status}: ${text}`);
  if (/legal-review|ctaToolId|Invalid/i.test(text)) {
    console.error(
      "Gợi ý: Admin đang chạy chưa có allowlist legal-review — deploy code mới rồi chạy lại, hoặc seed Prisma local.",
    );
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
