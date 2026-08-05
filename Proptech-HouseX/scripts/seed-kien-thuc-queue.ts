/**
 * Nạp toàn bộ bài Kiến thức BĐS (catalog demo/TS) vào content_queue
 * để Super Admin duyệt / sửa / ẩn tại /admin/content-queue.
 *
 * Nguồn: DEMO catalog filter isGeneralReKnowledgeArticle (~50+ bài).
 * Key: kien-thuc:{slug} — idempotent; không ghi đè item PUBLISHED.
 *
 * Usage:
 *   npm run db:seed:kien-thuc-queue
 *   npm run db:seed:kien-thuc-queue:dry
 */
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";
import {
  normalizeQueueBodyForReader,
  queueBodyHasSeedCtaMarker,
  READER_CTA_HEADING,
} from "../lib/content/content-queue-article";
import { listGeneralReKnowledgeDemoArticles } from "../lib/preview/demo-articles";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

function ensureCtaSection(
  body: string,
  label: string,
  href: string,
): string {
  const core = normalizeQueueBodyForReader(body);
  if (queueBodyHasSeedCtaMarker(core)) return core;
  return [core, "", READER_CTA_HEADING, "", `[${label}](${href})`]
    .join("\n")
    .trim();
}

async function main() {
  const articles = listGeneralReKnowledgeDemoArticles();
  console.log(`Kiến thức BĐS: ${articles.length} bài.`);

  const cta = getNoxhCtaTool("noxh-check");
  if (!cta) throw new Error("Allowlist thiếu noxh-check");

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const a of articles) {
    const body = ensureCtaSection(
      a.body,
      cta.defaultCtaLabel,
      cta.href,
    );

    const key = `kien-thuc:${a.slug}`;
    const shared = {
      title: a.title,
      painPoint: a.excerpt?.trim() || null,
      bodyPreview: body,
      segment: "general_inbound",
      score: 80,
      publishChannel: "WEBSITE" as const,
      ctaToolId: cta.id,
      ctaLabel: cta.defaultCtaLabel,
      ctaHref: cta.href,
      opsNotes: [
        "Source: Kiến thức BĐS (/tin-tuc/kien-thuc — lib/content/articles + demo).",
        `slug: ${a.slug}`,
        `tags: ${a.tags.map((t) => t.slug).join(", ")}`,
        `normalized_key: ${key}`,
        "L2: tab Như người đọc · Ẩn/Xóa nếu bài không đạt.",
      ].join("\n"),
    };

    if (dryRun) {
      console.log(
        `✓ ${a.slug} · ${cta.id} · ${body.split(/\s+/).length} từ · "${a.title.slice(0, 48)}…"`,
      );
      continue;
    }

    const existing = await prisma!.contentQueueItem.findUnique({
      where: { normalizedKey: key },
      select: { id: true, status: true },
    });

    if (existing?.status === "PUBLISHED") {
      console.log(`↷ PUBLISHED — bỏ qua ${a.slug}`);
      skipped += 1;
      continue;
    }

    if (existing) {
      await prisma!.contentQueueItem.update({
        where: { normalizedKey: key },
        data: {
          ...shared,
          l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
        },
      });
      updated += 1;
      console.log(`✎ ${a.slug} (giữ ${existing.status})`);
    } else {
      await prisma!.contentQueueItem.create({
        data: {
          normalizedKey: key,
          status: "INTAKE",
          l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
          ...shared,
        },
      });
      created += 1;
      console.log(`✔ ${a.slug} → INTAKE`);
    }
  }

  if (dryRun) {
    console.log(`\nDry-run OK: ${articles.length} Kiến thức BĐS sẵn sàng nạp queue.`);
    return;
  }

  console.log(
    `\nXong Kiến thức BĐS: ${created} tạo, ${updated} cập nhật, ${skipped} bỏ qua (tổng ${articles.length}).`,
  );
  console.log("Duyệt /admin/content-queue — lọc opsNotes kien-thuc.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
