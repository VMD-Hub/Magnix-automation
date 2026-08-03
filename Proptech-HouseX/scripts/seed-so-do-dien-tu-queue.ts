/**
 * Seed bài SEO pháp lý chung: sổ đỏ điện tử / dự thảo Luật Đất đai
 * vào content_queue_items (INTAKE — chờ L2 /devil rồi submit_l3).
 *
 * Usage:
 *   node --env-file=.env --import tsx scripts/seed-so-do-dien-tu-queue.ts
 *   node --import tsx scripts/seed-so-do-dien-tu-queue.ts --dry-run
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

const DRAFT_REL = "docs/content/drafts/07-so-do-dien-tu-du-thao-luat-dat-dai-2026.md";
const NORMALIZED_KEY = "editorial:so-do-dien-tu-du-thao-luat-dat-dai-2026";
const SHEET_KEY = "so-do-dien-tu:H1";
const CTA_ID = "legal-review";

type DraftFrontmatter = {
  title?: string;
  painPoint?: string;
  excerpt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  slug?: string;
  ctaToolId?: string;
};

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
    const key = m[1] as keyof DraftFrontmatter;
    meta[key] = val;
  }
  return { meta, body };
}

async function main() {
  const root = resolve(__dirname, "..");
  const draftAbs = resolve(root, DRAFT_REL);
  const { meta, body } = parseDraft(readFileSync(draftAbs, "utf8"));
  const title = meta.title?.trim();
  if (!title) throw new Error("Draft thiếu title");
  if (!body.includes("## Kiểm tra nhanh (CTA)")) {
    throw new Error("Draft thiếu section CTA");
  }

  const cta = getNoxhCtaTool(meta.ctaToolId || CTA_ID);
  if (!cta || cta.id !== CTA_ID) {
    throw new Error(`CTA phải là ${CTA_ID} (pháp lý chung, không NƠXH)`);
  }

  const opsNotes = [
    "GENERAL_POLICY — pháp lý đất đai / sổ đỏ (không phải NƠXH).",
    `slug: ${meta.slug ?? "so-do-dien-tu-va-5-thay-doi-du-thao-luat-dat-dai-2026"}`,
    `Draft: ${DRAFT_REL}`,
    "requires_legal_qa: true",
    "L2 /devil bắt buộc trước submit_l3 — dự thảo ≠ luật đã ban hành; không tư vấn hồ sơ cá nhân chắc chắn được cấp sổ.",
    "CTA: legal-review → /lien-he?goi=ra-soat-phap-ly-15-phut#tu-van",
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
    sheetKey: SHEET_KEY,
    opsNotes,
  };

  if (dryRun) {
    console.log(
      `✓ dry-run OK · ${cta.id} · ${body.split(/\s+/).length} từ · "${title.slice(0, 60)}…"`,
    );
    console.log(`normalized_key sẽ dùng: ${NORMALIZED_KEY} (hoặc sheet:${SHEET_KEY})`);
    return;
  }

  const key = `sheet:${SHEET_KEY}`;
  const existing = await prisma!.contentQueueItem.findUnique({
    where: { normalizedKey: key },
    select: { id: true, status: true },
  });

  if (existing) {
    if (existing.status === "PUBLISHED") {
      console.log(`↷ Đã PUBLISHED — bỏ qua (${key})`);
      return;
    }
    await prisma!.contentQueueItem.update({
      where: { normalizedKey: key },
      data: {
        ...shared,
        l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
      },
    });
    console.log(`✎ Cập nhật draft (status giữ ${existing.status}) · id=${existing.id}`);
  } else {
    const row = await prisma!.contentQueueItem.create({
      data: {
        normalizedKey: key,
        status: "INTAKE",
        l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
        ...shared,
      },
    });
    console.log(`✔ Tạo mới → INTAKE · ${cta.id} · id=${row.id}`);
  }

  console.log("Duyệt L2 /devil tại /admin/content-queue → rồi submit_l3.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
