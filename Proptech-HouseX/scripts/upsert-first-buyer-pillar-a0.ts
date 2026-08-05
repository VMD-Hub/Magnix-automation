/**
 * Upsert pillar A0 “Cẩm nang mua nhà lần đầu…” vào content_queue + Article CMS.
 * Ghi đè cả item/bài đã PUBLISHED (owner rewrite 2026-08-05).
 *
 * Usage:
 *   npm run db:upsert:first-buyer-pillar
 *   npm run db:upsert:first-buyer-pillar:dry
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";
import {
  NOXH_TAG_CHINH_SACH,
} from "../lib/content/articles/noxh-handbook-tags";
import { upsertArticleTag } from "../lib/data/article-admin";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

const NORMALIZED_KEY = "editorial:first-buyer-pillar:2026";
const SLUG = "huong-dan-mua-nha-lan-dau-2026-tu-chon-nha-den-ky-hop-dong";
const DRAFT_REL =
  "docs/content/drafts/huong-dan-mua-nha-lan-dau-2026.md";

function parseDraft(raw: string): {
  title: string;
  painPoint: string;
  body: string;
  ctaToolId: string;
} {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) throw new Error("Draft thiếu YAML frontmatter");
  const meta: Record<string, string> = {};
  for (const line of fm[1]!.split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    meta[m[1]!] = m[2]!.replace(/^"|"$/g, "").trim();
  }
  return {
    title: meta.title || "",
    painPoint: meta.painPoint || "",
    ctaToolId: meta.ctaToolId || "noxh-check",
    body: fm[2]!.trim(),
  };
}

async function main() {
  const draftPath = resolve(__dirname, "..", DRAFT_REL);
  const draft = parseDraft(readFileSync(draftPath, "utf8"));
  if (!draft.title || !draft.body) throw new Error("Draft thiếu title/body");

  const cta = getNoxhCtaTool(draft.ctaToolId);
  if (!cta) throw new Error(`CTA ngoài allowlist: ${draft.ctaToolId}`);

  console.log(`Pillar A0 ← ${DRAFT_REL}`);
  console.log(`title: ${draft.title}`);
  console.log(`slug: ${SLUG}`);
  console.log(`words ≈ ${draft.body.split(/\s+/).length}`);

  if (dryRun) {
    console.log("\nDry-run OK — không ghi DB.");
    return;
  }

  const opsNotes = [
    "Source: docs/content/drafts/huong-dan-mua-nha-lan-dau-2026.md (owner rewrite).",
    `slug: ${SLUG}`,
    `normalized_key: ${NORMALIZED_KEY}`,
    `tags: ${NOXH_TAG_CHINH_SACH.slug}`,
    "L2: tab Như người đọc · Lưu & đồng bộ lên web nếu sửa tiếp.",
  ].join("\n");

  const queueShared = {
    title: draft.title,
    painPoint: draft.painPoint || null,
    bodyPreview: draft.body,
    segment: "noxh_income",
    score: 90,
    publishChannel: "WEBSITE" as const,
    ctaToolId: cta.id,
    ctaLabel: cta.defaultCtaLabel,
    ctaHref: cta.href,
    opsNotes,
    l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
  };

  await upsertArticleTag({
    slug: NOXH_TAG_CHINH_SACH.slug,
    name: NOXH_TAG_CHINH_SACH.name,
    description: NOXH_TAG_CHINH_SACH.description ?? null,
  });

  const tag = await prisma!.articleTag.findUnique({
    where: { slug: NOXH_TAG_CHINH_SACH.slug },
    select: { id: true },
  });

  let article = await prisma!.article.findUnique({ where: { slug: SLUG } });
  if (article) {
    article = await prisma!.article.update({
      where: { id: article.id },
      data: {
        title: draft.title,
        excerpt: draft.painPoint.slice(0, 500) || null,
        body: draft.body,
        status: "PUBLISHED",
        publishedAt: article.publishedAt ?? new Date(),
        seoTitle: draft.title.slice(0, 200),
        seoDesc: draft.painPoint.slice(0, 320) || null,
        authorName: article.authorName ?? "Ban biên tập House X",
      },
    });
    console.log(`✎ Article CMS cập nhật (${article.id})`);
  } else {
    article = await prisma!.article.create({
      data: {
        slug: SLUG,
        title: draft.title,
        excerpt: draft.painPoint.slice(0, 500) || null,
        body: draft.body,
        status: "PUBLISHED",
        publishedAt: new Date(),
        seoTitle: draft.title.slice(0, 200),
        seoDesc: draft.painPoint.slice(0, 320) || null,
        authorName: "Ban biên tập House X",
      },
    });
    console.log(`✔ Article CMS tạo mới (${article.id})`);
  }

  if (tag) {
    await prisma!.articleTagLink.deleteMany({ where: { articleId: article.id } });
    await prisma!.articleTagLink.create({
      data: { articleId: article.id, tagId: tag.id },
    });
  }

  const existingQ = await prisma!.contentQueueItem.findUnique({
    where: { normalizedKey: NORMALIZED_KEY },
    select: { id: true, status: true },
  });

  if (existingQ) {
    await prisma!.contentQueueItem.update({
      where: { id: existingQ.id },
      data: {
        ...queueShared,
        status: "PUBLISHED",
        articleId: article.id,
        publishedAt: new Date(),
        rejectReason: null,
      },
    });
    console.log(`✎ Queue cập nhật (${existingQ.id}) → PUBLISHED`);
  } else {
    await prisma!.contentQueueItem.create({
      data: {
        normalizedKey: NORMALIZED_KEY,
        status: "PUBLISHED",
        articleId: article.id,
        publishedAt: new Date(),
        ...queueShared,
      },
    });
    console.log("✔ Queue tạo mới → PUBLISHED");
  }

  console.log("\nXong. Super Admin: /admin/content-queue (tab Đã đăng) · tìm slug pillar.");
  console.log(`Public: /wiki-nha-o-xa-hoi/${SLUG}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
