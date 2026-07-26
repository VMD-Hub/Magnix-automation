/**
 * Upsert tag hub NOXH + gắn cho 8 bài first-buyer / debt hub đã PUBLISHED.
 *
 * Usage (VPS):
 *   cd /opt/housex/Proptech-HouseX
 *   npx tsx scripts/tag-first-buyer-debt-hub-articles.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import {
  NOXH_HANDBOOK_TAG_DESCRIPTIONS,
  NOXH_TAG_CHINH_SACH,
  NOXH_TAG_THAM_DINH_VAY,
} from "../lib/content/articles/noxh-handbook-tags";
import { articlePath } from "../lib/content/article-routes";

const prisma = new PrismaClient();

type BriefItem = {
  id: string;
  slug: string;
  content_type: string;
  tags: string[];
};

type BriefPack = {
  ship_order: string[];
  items: BriefItem[];
};

function primaryTagSlug(item: BriefItem): string {
  if (
    item.content_type === "LOAN_FINANCE" ||
    item.tags.includes("tham-dinh-vay")
  ) {
    return NOXH_TAG_THAM_DINH_VAY.slug;
  }
  return NOXH_TAG_CHINH_SACH.slug;
}

async function upsertHubTags() {
  const defs = [
    {
      ...NOXH_TAG_CHINH_SACH,
      description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_CHINH_SACH.slug],
    },
    {
      ...NOXH_TAG_THAM_DINH_VAY,
      description: NOXH_HANDBOOK_TAG_DESCRIPTIONS[NOXH_TAG_THAM_DINH_VAY.slug],
    },
  ];

  const bySlug = new Map<string, string>();
  for (const d of defs) {
    const tag = await prisma.articleTag.upsert({
      where: { slug: d.slug },
      update: { name: d.name, description: d.description },
      create: {
        slug: d.slug,
        name: d.name,
        description: d.description,
      },
    });
    bySlug.set(tag.slug, tag.id);
    console.log(`✔ tag ${tag.slug} (${tag.id.slice(0, 8)}…)`);
  }
  return bySlug;
}

async function main() {
  const pack = JSON.parse(
    readFileSync(
      resolve(__dirname, "../docs/content/FIRST_BUYER_DEBT_HUB_BRIEFS_V1.json"),
      "utf8",
    ),
  ) as BriefPack;

  const tagIds = await upsertHubTags();
  let linked = 0;
  let missing = 0;

  for (const id of pack.ship_order) {
    const item = pack.items.find((x) => x.id === id);
    if (!item) throw new Error(`ship_order thiếu: ${id}`);

    const article = await prisma.article.findUnique({
      where: { slug: item.slug },
      select: { id: true, slug: true, title: true },
    });
    if (!article) {
      console.error(`✖ ${id} chưa có article slug=${item.slug}`);
      missing += 1;
      process.exitCode = 1;
      continue;
    }

    const tagSlug = primaryTagSlug(item);
    const tagId = tagIds.get(tagSlug);
    if (!tagId) throw new Error(`Thiếu tag id: ${tagSlug}`);

    // Một tag hub chính / bài (theo handbook: mỗi bài cẩm nang gắn một tag)
    await prisma.articleTagLink.deleteMany({ where: { articleId: article.id } });
    await prisma.articleTagLink.create({
      data: { articleId: article.id, tagId },
    });

    linked += 1;
    console.log(
      `→ ${id} · ${tagSlug} · ${articlePath(article.slug)}`,
    );
  }

  console.log(`\nXong: ${linked} gắn tag, ${missing} thiếu article.`);
  console.log(
    `Hub: /wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_CHINH_SACH.slug} · /wiki-nha-o-xa-hoi/chu-de/${NOXH_TAG_THAM_DINH_VAY.slug}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
