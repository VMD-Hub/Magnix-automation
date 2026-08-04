/**
 * Seed bài tuyến legal-review vào content_queue (INTAKE → L2 /devil).
 *   - 07 sổ đỏ điện tử / dự thảo Luật Đất đai
 *   - 08 TP.HCM đề xuất trần thu nhập NƠXH 60 triệu
 *   - 09 VNeID NƠXH + môi giới / House X
 *   - 10 Quy trình mua NƠXH QĐ 1346
 *   - 11 Quy hoạch 100 năm TP.HCM đa cực
 *   - 12 Giá dự án mới TP.HCM H1/2026
 *
 * Usage:
 *   node --env-file=.env --import tsx scripts/seed-legal-review-queue-pack.ts
 *   node --import tsx scripts/seed-legal-review-queue-pack.ts --dry-run
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

type DraftFrontmatter = {
  title?: string;
  painPoint?: string;
  excerpt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  slug?: string;
  ctaToolId?: string;
};

type PackItem = {
  id: string;
  sheetKey: string;
  draftRel: string;
  opsExtra: string;
};

const ITEMS: PackItem[] = [
  {
    id: "so-do-H1",
    sheetKey: "so-do-dien-tu:H1",
    draftRel: "docs/content/drafts/07-so-do-dien-tu-du-thao-luat-dat-dai-2026.md",
    opsExtra:
      "GENERAL_POLICY — pháp lý đất đai / sổ đỏ (không phải NƠXH). L2 /devil: dự thảo ≠ luật đã ban hành.",
  },
  {
    id: "tphcm-60tr-H1",
    sheetKey: "tphcm-tran-thu-nhap-noxh-60tr:H1",
    draftRel: "docs/content/drafts/08-tphcm-tran-thu-nhap-noxh-60-trieu.md",
    opsExtra:
      "GENERAL_POLICY — đề xuất TP.HCM sửa QĐ 14 (liên quan NƠXH tương lai). L2 /devil: đề xuất ≠ QĐ đã ban hành; neo NĐ 136 + QĐ 14 hiện hành.",
  },
  {
    id: "vneid-moi-gioi-H1",
    sheetKey: "vneid-noxh-moi-gioi-housex:H1",
    draftRel: "docs/content/drafts/09-vneid-noxh-moi-gioi-housex.md",
    opsExtra:
      "GENERAL_POLICY — VNeID xét duyệt NƠXH + định hướng môi giới/House X. L2 /devil: TB 152 = nghiên cứu quy trình, chưa thay xét duyệt hiện hành; không bao đậu hồ sơ.",
  },
  {
    id: "qd-1346-H1",
    sheetKey: "quy-trinh-mua-noxh-qd-1346:H1",
    draftRel: "docs/content/drafts/10-quy-trinh-mua-noxh-qd-1346.md",
    opsExtra:
      "GENERAL_POLICY — quy trình CĐT↔Sở theo QĐ 1346. L2 /devil: neo văn bản; không bao đậu / không thay tư vấn pháp lý cá nhân.",
  },
  {
    id: "quy-hoach-100nam-H1",
    sheetKey: "quy-hoach-100-nam-tphcm-da-cuc:H1",
    draftRel: "docs/content/drafts/11-quy-hoach-100-nam-tphcm-da-cuc.md",
    opsExtra:
      "GENERAL_POLICY — tầm nhìn–hạ tầng, reader-first (đối thủ giá trị CafeLand). L2 /devil: đồ án đang hoàn thiện ≠ đã phê duyệt cuối; không định giá / không hứa ROI.",
  },
  {
    id: "gia-du-an-tphcm-H1",
    sheetKey: "gia-du-an-moi-tphcm-h1-2026:H1",
    draftRel: "docs/content/drafts/12-gia-du-an-moi-tphcm-h1-2026.md",
    opsExtra:
      "GENERAL_POLICY — giá phổ biến dự án mở bán H1/2026 + bản đồ hạ tầng House X. L2 /devil: khoảng giá tham chiếu ≠ giá CĐT chốt; không logo/CTA đối thủ; không hứa ROI.",
  },
];

function parseDraft(raw: string): { meta: DraftFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const body = match[2].trim();
  const meta: DraftFrontmatter = {};
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
    meta[m[1] as keyof DraftFrontmatter] = val;
  }
  return { meta, body };
}

async function seedOne(root: string, item: PackItem) {
  const draftAbs = resolve(root, item.draftRel);
  const { meta, body } = parseDraft(readFileSync(draftAbs, "utf8"));
  const title = meta.title?.trim();
  if (!title) throw new Error(`${item.id}: thiếu title`);
  if (!body.includes("## Kiểm tra nhanh (CTA)")) {
    throw new Error(`${item.id}: thiếu section CTA`);
  }
  if (meta.ctaToolId !== "legal-review") {
    throw new Error(`${item.id}: ctaToolId phải là legal-review`);
  }

  const cta = getNoxhCtaTool("legal-review");
  if (!cta) throw new Error("Allowlist thiếu legal-review");

  const opsNotes = [
    item.opsExtra,
    `slug: ${meta.slug ?? "(none)"}`,
    `Draft: ${item.draftRel}`,
    "requires_legal_qa: true",
    "CTA: legal-review → /lien-he?goi=ra-soat-phap-ly-15-phut#tu-van",
    "Pack: legal-review queue (07–12)",
  ].join("\n");

  const shared = {
    title,
    painPoint: meta.painPoint?.trim() || meta.excerpt?.trim() || null,
    bodyPreview: body,
    segment: "general_inbound",
    score: 88,
    publishChannel: "WEBSITE" as const,
    ctaToolId: cta.id,
    ctaLabel: meta.ctaLabel?.trim() || cta.defaultCtaLabel,
    ctaHref: meta.ctaHref?.trim() || cta.href,
    sheetKey: item.sheetKey,
    opsNotes,
  };

  if (dryRun) {
    console.log(
      `✓ ${item.id} dry-run · legal-review · ${body.split(/\s+/).length} từ · "${title.slice(0, 52)}…"`,
    );
    return { created: 0, updated: 0, skipped: 0 };
  }

  const key = `sheet:${item.sheetKey}`;
  const existing = await prisma!.contentQueueItem.findUnique({
    where: { normalizedKey: key },
    select: { id: true, status: true },
  });

  if (existing?.status === "PUBLISHED") {
    console.log(`↷ ${item.id} đã PUBLISHED — bỏ qua`);
    return { created: 0, updated: 0, skipped: 1 };
  }

  if (existing) {
    await prisma!.contentQueueItem.update({
      where: { normalizedKey: key },
      data: {
        ...shared,
        l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
      },
    });
    console.log(`✎ ${item.id} cập nhật (status giữ ${existing.status}) · id=${existing.id}`);
    return { created: 0, updated: 1, skipped: 0 };
  }

  const row = await prisma!.contentQueueItem.create({
    data: {
      normalizedKey: key,
      status: "INTAKE",
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
      ...shared,
    },
  });
  console.log(`✔ ${item.id} → INTAKE · id=${row.id}`);
  return { created: 1, updated: 0, skipped: 0 };
}

async function main() {
  const root = resolve(__dirname, "..");
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of ITEMS) {
    const r = await seedOne(root, item);
    created += r.created;
    updated += r.updated;
    skipped += r.skipped;
  }

  console.log(
    `\nXong: ${created} tạo mới, ${updated} cập nhật, ${skipped} bỏ qua (tổng ${ITEMS.length}).`,
  );
  if (!dryRun) {
    console.log("Duyệt L2 /devil tại /admin/content-queue → rồi submit_l3.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
