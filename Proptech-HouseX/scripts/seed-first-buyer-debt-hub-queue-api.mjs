/**
 * Seed hub "mua nhà lần đầu + đảo nợ/DTI" vào content_queue_items QUA ADMIN API
 * (không cần DB trực tiếp — dùng khi seed từ máy local vào Admin đang chạy).
 *
 * Nguồn brief: docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json
 * Bản Prisma trực tiếp (chạy trên VPS): scripts/seed-first-buyer-debt-hub-queue.ts
 *
 * Dedupe: gửi sheetKey=`first-buyer-hub:{id}` → normalized_key `sheet:first-buyer-hub:{id}`;
 * chạy lại sẽ báo trùng (unique) và bỏ qua, không tạo bản sao.
 *
 * Usage:
 *   node scripts/seed-first-buyer-debt-hub-queue-api.mjs --base https://timnhaxahoi.com
 *   (ADMIN_SECRET lấy từ env hoặc .env cùng thư mục Proptech-HouseX)
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const CTA_LABELS = {
  "noxh-check": "Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không",
  "noxh-loan-quick": "Kiểm tra nhanh khả năng vay NƠXH (60 giây)",
};

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

function buildBodyPreview(item) {
  const qa = item.editorial_brief_v1.qa_backbone
    .map((q) => `## ${q.question}\n- Góc trả lời: ${q.answer_angle}\n- Keyword: ${q.search_keyword}`)
    .join("\n\n");
  return [
    `# ${item.h1}`,
    "",
    `> ${item.editorial_brief_v1.one_line_insight}`,
    "",
    qa,
    "",
    `**Liên kết nội bộ:** ${item.internal_links.join(" · ")}`,
    `**source_refs (legal pack):** ${item.editorial_brief_v1.source_refs.join(", ")}`,
    `**Compliance:** ${item.editorial_brief_v1.compliance_notes}`,
  ].join("\n");
}

function buildOpsNotes(item, pack) {
  return [
    `Hub mua nhà lần đầu + đảo nợ/DTI — item ${item.id} (${item.priority}).`,
    `slug: ${item.slug}`,
    `content_type: ${item.content_type} · cta_keyword: ${item.cta_keyword} · legal_topic: ${item.legal_topic}`,
    `interest_key: ${item.interest_key} · tags: ${item.tags.join(", ")}`,
    `Ship order: ${pack.ship_order.join(" → ")}`,
    `Brief: ${pack.doc}`,
  ].join("\n");
}

async function main() {
  const base = arg("base", process.env.HOUSEX_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const secret = readAdminSecret();
  if (!secret) {
    console.error("Thiếu ADMIN_SECRET (env hoặc .env).");
    process.exit(1);
  }

  const pack = JSON.parse(
    readFileSync(resolve(ROOT, "docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json"), "utf8"),
  );

  const headers = {
    "content-type": "application/json",
    "x-admin-secret": secret,
  };

  // Verify auth read-only trước khi ghi
  const check = await fetch(`${base}/api/admin/content-queue?status=ALL`, { headers });
  if (!check.ok) {
    console.error(`Auth/endpoint fail: GET ${base}/api/admin/content-queue → ${check.status}`);
    console.error((await check.text()).slice(0, 300));
    process.exit(1);
  }
  const existing = await check.json();
  const existingKeys = new Set(
    (existing?.data?.items ?? existing?.items ?? []).map((i) => i.normalizedKey),
  );
  console.log(`Auth OK — queue hiện có ${existingKeys.size} item.`);

  let createdCount = 0;
  let skipped = 0;

  for (const item of pack.items) {
    const sheetKey = `first-buyer-hub:${item.id}`;
    if (existingKeys.has(`sheet:${sheetKey}`)) {
      console.log(`↷ ${item.id} đã tồn tại — bỏ qua`);
      skipped += 1;
      continue;
    }

    const body = {
      title: item.h1,
      painPoint: item.editorial_brief_v1.one_line_insight,
      bodyPreview: buildBodyPreview(item),
      segment: item.segment,
      score: 85,
      publishChannel: "WEBSITE",
      ctaToolId: item.cta_tool_id,
      ctaLabel: CTA_LABELS[item.cta_tool_id] ?? null,
      sheetKey,
      opsNotes: buildOpsNotes(item, pack),
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: false },
    };

    const res = await fetch(`${base}/api/admin/content-queue`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      createdCount += 1;
      console.log(`✔ ${item.id} tạo mới → INTAKE · ${item.cta_tool_id} · "${item.h1.slice(0, 55)}…"`);
    } else {
      const text = (await res.text()).slice(0, 200);
      if (res.status === 409 || /unique|P2002/i.test(text)) {
        console.log(`↷ ${item.id} trùng key — bỏ qua`);
        skipped += 1;
      } else {
        console.error(`✖ ${item.id} lỗi ${res.status}: ${text}`);
        process.exitCode = 1;
      }
    }
  }

  console.log(`\nXong: ${createdCount} tạo mới, ${skipped} bỏ qua (tổng ${pack.items.length}).`);
  console.log(`Duyệt tại ${base}/admin/content-queue`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
