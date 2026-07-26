/**
 * Publish thẳng hub mua nhà lần đầu + đảo nợ/DTI — bỏ qua L3 human.
 *
 * Owner request 2026-07-26: publish trước, Super sửa sau tại Admin.
 * Vẫn bắt buộc: CTA tool allowlist + checklist 3 mục (auto tick).
 *
 * - Tìm 8 item theo normalized_key trong FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json
 * - APPROVED → tạo/cập nhật Article PUBLISHED (slug từ brief)
 * - Queue → PUBLISHED + gắn articleId
 *
 * Usage (VPS):
 *   cd /opt/housex/Proptech-HouseX
 *   npx tsx scripts/publish-first-buyer-debt-hub-queue.ts
 *   npx tsx scripts/publish-first-buyer-debt-hub-queue.ts --dry-run
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { buildArticleBodyFromQueue } from "../lib/content/content-queue-article";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";
import {
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_THAM_DINH_VAY,
} from "../lib/content/articles/noxh-handbook-tags";
import { articlePath } from "../lib/content/article-routes";

const dryRun = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

type BriefItem = {
  id: string;
  normalized_key: string;
  slug: string;
  h1: string;
  content_type: string;
  cta_tool_id: string;
  tags: string[];
  editorial_brief_v1: { one_line_insight: string };
};

type BriefPack = {
  ship_order: string[];
  items: BriefItem[];
};

function tagSlugsFor(item: BriefItem): string[] {
  const out = new Set<string>();
  for (const t of item.tags) {
    if (t === "phap-ly") out.add(NOXH_TAG_CHINH_SACH.slug);
    else if (t === "tham-dinh-vay") out.add(NOXH_TAG_THAM_DINH_VAY.slug);
  }
  if (item.content_type === "LOAN_FINANCE") {
    out.add(NOXH_TAG_THAM_DINH_VAY.slug);
  } else {
    out.add(NOXH_TAG_CHINH_SACH.slug);
  }
  return [...out];
}

async function resolveTagIds(slugs: string[]): Promise<string[]> {
  if (slugs.length === 0) return [];
  const ids: string[] = [];
  for (const slug of slugs) {
    const def =
      slug === NOXH_TAG_THAM_DINH_VAY.slug
        ? NOXH_TAG_THAM_DINH_VAY
        : slug === NOXH_TAG_CHINH_SACH.slug
          ? NOXH_TAG_CHINH_SACH
          : null;
    if (!def) {
      console.warn(`  ⚠ tag ngoài handbook: ${slug} — bỏ qua`);
      continue;
    }
    const tag = await prisma.articleTag.upsert({
      where: { slug: def.slug },
      update: { name: def.name },
      create: { slug: def.slug, name: def.name },
    });
    ids.push(tag.id);
  }
  return ids;
}

async function main() {
  const pack = JSON.parse(
    readFileSync(
      resolve(__dirname, "../docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json"),
      "utf8",
    ),
  ) as BriefPack;

  let published = 0;
  let updated = 0;
  let skipped = 0;

  for (const id of pack.ship_order) {
    const item = pack.items.find((x) => x.id === id);
    if (!item) throw new Error(`ship_order thiếu item: ${id}`);

    const cta = getNoxhCtaTool(item.cta_tool_id);
    if (!cta) throw new Error(`cta_tool_id ngoài allowlist: ${item.cta_tool_id}`);

    const row = await prisma.contentQueueItem.findUnique({
      where: { normalizedKey: item.normalized_key },
    });
    if (!row) {
      console.error(`✖ ${id} không có trong queue (${item.normalized_key}) — chạy seed trước`);
      process.exitCode = 1;
      continue;
    }

    const body = buildArticleBodyFromQueue({
      title: row.title,
      painPoint: row.painPoint,
      bodyPreview: row.bodyPreview,
      ctaToolId: row.ctaToolId ?? cta.id,
      ctaLabel: row.ctaLabel ?? cta.defaultCtaLabel,
      ctaHref: row.ctaHref ?? cta.href,
    });
    const excerpt =
      row.painPoint?.trim().slice(0, 500) ||
      item.editorial_brief_v1.one_line_insight.slice(0, 500);
    const tagIds = await resolveTagIds(tagSlugsFor(item));
    const now = new Date();

    if (dryRun) {
      console.log(
        `✓ ${id} dry-run → /wiki-nha-o-xa-hoi/${item.slug} · ${cta.id} · status=${row.status}`,
      );
      continue;
    }

    // Gate: tick đủ checklist + CTA
    await prisma.contentQueueItem.update({
      where: { id: row.id },
      data: {
        ctaToolId: cta.id,
        ctaHref: cta.href,
        ctaLabel: row.ctaLabel?.trim() || cta.defaultCtaLabel,
        l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
        status: "APPROVED",
        reviewedAt: now,
        reviewedBy: "super-force-publish",
        rejectReason: null,
        opsNotes: [
          row.opsNotes?.trim() || "",
          "FORCE_PUBLISH 2026-07-26: bỏ L3 human theo yêu cầu owner — sửa body tại /admin/articles.",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    });

    let articleId = row.articleId;
    const bySlug = await prisma.article.findUnique({
      where: { slug: item.slug },
      select: { id: true, status: true },
    });

    if (articleId) {
      const existing = await prisma.article.findUnique({
        where: { id: articleId },
        select: { id: true },
      });
      if (!existing) articleId = null;
    }
    if (!articleId && bySlug) articleId = bySlug.id;

    if (articleId) {
      await prisma.$transaction(async (tx) => {
        await tx.articleTagLink.deleteMany({ where: { articleId: articleId! } });
        await tx.article.update({
          where: { id: articleId! },
          data: {
            slug: item.slug,
            title: row.title,
            excerpt,
            body,
            status: "PUBLISHED",
            publishedAt: now,
            authorName: "House X",
            seoTitle: row.title.slice(0, 200),
            seoDesc: excerpt.slice(0, 320),
            tags: { create: tagIds.map((tagId) => ({ tagId })) },
          },
        });
      });
      updated += 1;
      console.log(`✎ ${id} cập nhật article PUBLISHED · ${articlePath(item.slug)}`);
    } else {
      const created = await prisma.article.create({
        data: {
          slug: item.slug,
          title: row.title,
          excerpt,
          body,
          status: "PUBLISHED",
          publishedAt: now,
          authorName: "House X",
          seoTitle: row.title.slice(0, 200),
          seoDesc: excerpt.slice(0, 320),
          tags: { create: tagIds.map((tagId) => ({ tagId })) },
        },
      });
      articleId = created.id;
      published += 1;
      console.log(`✔ ${id} tạo article PUBLISHED · ${articlePath(item.slug)}`);
    }

    await prisma.contentQueueItem.update({
      where: { id: row.id },
      data: {
        articleId,
        status: "PUBLISHED",
        publishedAt: now,
        publishChannel: "WEBSITE",
      },
    });
  }

  if (dryRun) {
    console.log(`\nDry-run xong — chưa ghi DB.`);
    return;
  }

  console.log(
    `\nXong: ${published} tạo mới, ${updated} cập nhật, ${skipped} bỏ qua (tổng ${pack.ship_order.length}).`,
  );
  console.log("Sửa body tại /admin/articles hoặc /admin/content-queue (đã PUBLISHED).");
  console.log("Public: /wiki-nha-o-xa-hoi/<slug>");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
