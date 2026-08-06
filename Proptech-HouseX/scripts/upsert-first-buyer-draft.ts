/**
 * Upsert bài editorial từ markdown draft (frontmatter) → content_queue + Article CMS.
 * Ghi đè cả item/bài đã PUBLISHED.
 *
 * Frontmatter bắt buộc: title, slug, normalizedKey
 * Tuỳ chọn: ctaToolId (mặc định noxh-check), painPoint
 *
 * Usage:
 *   npm run db:upsert:first-buyer-pillar
 *   npm run db:upsert:first-buyer-a1
 *   npx tsx scripts/upsert-first-buyer-draft.ts --draft docs/content/drafts/….md --dry-run
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { getNoxhCtaTool } from "../lib/content/noxh-cta-tools";
import {
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_THAM_DINH_VAY,
} from "../lib/content/articles/noxh-handbook-tags";
import { upsertArticleTag } from "../lib/data/article-admin";

const TAG_BY_SLUG = {
  [NOXH_TAG_CHINH_SACH.slug]: NOXH_TAG_CHINH_SACH,
  [NOXH_TAG_THAM_DINH_VAY.slug]: NOXH_TAG_THAM_DINH_VAY,
  "tham-dinh-vay": NOXH_TAG_THAM_DINH_VAY,
  "phap-ly": NOXH_TAG_CHINH_SACH,
} as const;

const dryRun = process.argv.includes("--dry-run");
const draftFlagIdx = process.argv.indexOf("--draft");
const draftArg =
  draftFlagIdx >= 0 ? process.argv[draftFlagIdx + 1] : undefined;

const DEFAULT_DRAFT = "docs/content/drafts/huong-dan-mua-nha-lan-dau-2026.md";
const DRAFT_REL = draftArg || DEFAULT_DRAFT;

const prisma = dryRun ? null : new PrismaClient();

function parseDraft(raw: string): {
  title: string;
  slug: string;
  legacySlug: string | null;
  normalizedKey: string;
  painPoint: string;
  body: string;
  ctaToolId: string;
  tagSlug: string;
} {
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) throw new Error("Draft thiếu YAML frontmatter");
  const meta: Record<string, string> = {};
  for (const line of fm[1]!.split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    meta[m[1]!] = m[2]!.replace(/^"|"$/g, "").trim();
  }
  if (!meta.title || !meta.slug || !meta.normalizedKey) {
    throw new Error("Frontmatter cần title, slug, normalizedKey");
  }
  return {
    title: meta.title,
    slug: meta.slug,
    legacySlug: meta.legacySlug || null,
    painPoint: meta.painPoint || "",
    ctaToolId: meta.ctaToolId || "noxh-check",
    tagSlug: meta.tagSlug || NOXH_TAG_CHINH_SACH.slug,
    normalizedKey: meta.normalizedKey,
    body: fm[2]!.trim(),
  };
}

async function main() {
  const draftPath = resolve(__dirname, "..", DRAFT_REL);
  const draft = parseDraft(readFileSync(draftPath, "utf8"));
  if (!draft.body) throw new Error("Draft thiếu body");

  const cta = getNoxhCtaTool(draft.ctaToolId);
  if (!cta) throw new Error(`CTA ngoài allowlist: ${draft.ctaToolId}`);

  const tagDef =
    TAG_BY_SLUG[draft.tagSlug as keyof typeof TAG_BY_SLUG] ??
    NOXH_TAG_CHINH_SACH;

  console.log(`Upsert ← ${DRAFT_REL}`);
  console.log(`title: ${draft.title}`);
  console.log(`slug: ${draft.slug}`);
  if (draft.legacySlug) console.log(`legacySlug: ${draft.legacySlug}`);
  console.log(`key: ${draft.normalizedKey}`);
  console.log(`tag: ${tagDef.slug}`);
  console.log(`words ≈ ${draft.body.split(/\s+/).length}`);

  if (dryRun) {
    console.log("\nDry-run OK — không ghi DB.");
    return;
  }

  const opsNotes = [
    `Source: ${DRAFT_REL} (owner rewrite).`,
    `slug: ${draft.slug}`,
    draft.legacySlug ? `legacy_slug: ${draft.legacySlug}` : "",
    `normalized_key: ${draft.normalizedKey}`,
    `tags: ${tagDef.slug}`,
    "L2: tab Như người đọc · Lưu & đồng bộ lên web nếu sửa tiếp.",
  ]
    .filter(Boolean)
    .join("\n");

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
    slug: tagDef.slug,
    name: tagDef.name,
    description: null,
  });

  const tag = await prisma!.articleTag.findUnique({
    where: { slug: tagDef.slug },
    select: { id: true },
  });

  let article = await prisma!.article.findUnique({
    where: { slug: draft.slug },
  });
  if (!article && draft.legacySlug) {
    article = await prisma!.article.findUnique({
      where: { slug: draft.legacySlug },
    });
    if (article) {
      article = await prisma!.article.update({
        where: { id: article.id },
        data: { slug: draft.slug },
      });
      console.log(`↪ Đổi slug CMS: ${draft.legacySlug} → ${draft.slug}`);
    }
  }
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
        slug: draft.slug,
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
    await prisma!.articleTagLink.deleteMany({
      where: { articleId: article.id },
    });
    await prisma!.articleTagLink.create({
      data: { articleId: article.id, tagId: tag.id },
    });
  }

  const existingQ = await prisma!.contentQueueItem.findUnique({
    where: { normalizedKey: draft.normalizedKey },
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
        normalizedKey: draft.normalizedKey,
        status: "PUBLISHED",
        articleId: article.id,
        publishedAt: new Date(),
        ...queueShared,
      },
    });
    console.log("✔ Queue tạo mới → PUBLISHED");
  }

  console.log("\nXong. Super Admin: /admin/content-queue (tab Đã đăng).");
  console.log(`Public: /wiki-nha-o-xa-hoi/${draft.slug}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
