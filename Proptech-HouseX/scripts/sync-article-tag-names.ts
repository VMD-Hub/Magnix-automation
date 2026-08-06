/**
 * Đồng bộ tên ArticleTag trong DB về SoR handbook (có dấu, đúng casing).
 *
 *   npm run db:sync:article-tags
 *   npm run db:sync:article-tags:dry
 */
import { PrismaClient } from "@prisma/client";
import {
  CANONICAL_ARTICLE_TAGS,
  resolveArticleTagDisplayName,
} from "../lib/content/articles/noxh-handbook-tags";

const dryRun = process.argv.includes("--dry-run");
const prisma = dryRun ? null : new PrismaClient();

async function main() {
  console.log(
    dryRun
      ? "Dry-run — liệt kê tag sẽ sửa:"
      : "Đồng bộ tên tag → SoR handbook…",
  );

  if (dryRun) {
    for (const t of CANONICAL_ARTICLE_TAGS) {
      console.log(`  ${t.slug} → ${t.name}`);
    }
    return;
  }

  let updated = 0;
  for (const t of CANONICAL_ARTICLE_TAGS) {
    const row = await prisma!.articleTag.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        name: t.name,
        description: null,
      },
      update: { name: t.name },
      select: { slug: true, name: true },
    });
    console.log(`✔ ${row.slug} → ${resolveArticleTagDisplayName(row.slug)}`);
    updated += 1;
  }

  // Sửa các tag lạ còn Title-Case từ slug (không trong SoR) nếu trùng alias đã map
  const orphans = await prisma!.articleTag.findMany({
    select: { id: true, slug: true, name: true },
  });
  for (const o of orphans) {
    const fixed = resolveArticleTagDisplayName(o.slug, o.name);
    if (fixed !== o.name) {
      await prisma!.articleTag.update({
        where: { id: o.id },
        data: { name: fixed },
      });
      console.log(`✎ orphan ${o.slug}: "${o.name}" → "${fixed}"`);
      updated += 1;
    }
  }

  console.log(`\nXong. ${updated} tag đã ghi.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
