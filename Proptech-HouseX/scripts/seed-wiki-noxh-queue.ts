/**
 * Nạp toàn bộ bài wiki NƠXH (handbook từ demo/TS series) vào content_queue
 * để Super Admin duyệt / sửa tại /admin/content-queue.
 *
 * Nguồn: DEMO catalog đã filter isNoxhHandbookArticle (~60+ bài).
 * Key: wiki-noxh:{slug} — idempotent; không ghi đè item PUBLISHED.
 *
 * Usage:
 *   npm run db:seed:wiki-noxh-queue
 *   npm run db:seed:wiki-noxh-queue:dry
 */
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";
import {
  normalizeQueueBodyForReader,
  queueBodyHasSeedCtaMarker,
  queueBodyLinksToCtaHref,
  READER_CTA_HEADING,
} from "../lib/content/content-queue-article";
import { NOXH_TAG_THAM_DINH_VAY } from "../lib/content/articles/noxh-handbook-tags";
import { listNoxhHandbookDemoArticles } from "../lib/preview/demo-articles";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

function pickCtaToolId(tagSlugs: string[]): string {
  if (tagSlugs.includes(NOXH_TAG_THAM_DINH_VAY.slug)) return "noxh-loan-quick";
  return "noxh-check";
}

function ensureCtaSection(
  body: string,
  label: string,
  href: string,
): string {
  const core = normalizeQueueBodyForReader(body);
  if (queueBodyHasSeedCtaMarker(core) || queueBodyLinksToCtaHref(core, href)) {
    return core;
  }
  return [core, "", READER_CTA_HEADING, "", `[${label}](${href})`]
    .join("\n")
    .trim();
}

async function main() {
  const articles = listNoxhHandbookDemoArticles();
  console.log(`Wiki NƠXH handbook: ${articles.length} bài.`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const a of articles) {
    const toolId = pickCtaToolId(a.tags.map((t) => t.slug));
    const cta = getNoxhCtaTool(toolId);
    if (!cta) throw new Error(`Allowlist thiếu ${toolId} (${a.slug})`);

    const body = ensureCtaSection(
      a.body,
      cta.defaultCtaLabel,
      cta.href,
    );

    const key = `wiki-noxh:${a.slug}`;
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
        "Source: wiki NƠXH handbook (lib/content/articles + demo catalog).",
        `slug: ${a.slug}`,
        `tags: ${a.tags.map((t) => t.slug).join(", ")}`,
        `normalized_key: ${key}`,
        "L2: tab Như người đọc · CONG_THUC nếu bài quyết định.",
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
    console.log(`\nDry-run OK: ${articles.length} wiki NƠXH sẵn sàng nạp queue.`);
    return;
  }

  console.log(
    `\nXong wiki NƠXH: ${created} tạo, ${updated} cập nhật, ${skipped} bỏ qua (tổng ${articles.length}).`,
  );
  console.log("Duyệt /admin/content-queue — lọc theo title hoặc opsNotes wiki-noxh.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
