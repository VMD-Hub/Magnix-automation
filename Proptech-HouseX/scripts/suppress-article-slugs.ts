/**
 * Ẩn slug khỏi web (ARCHIVED stub) — dùng khi đã xóa queue/CMS
 * nhưng catalog demo vẫn hiện bài.
 *
 * Usage:
 *   npm run db:suppress:article-slugs -- can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026
 *   npm run db:suppress:article-slugs:dry -- slug-a slug-b
 */
import { PrismaClient } from "@prisma/client";
import { suppressPublicArticleBySlug } from "../lib/data/article-admin";

const dryRun = process.argv.includes("--dry-run");
const slugs = process.argv
  .slice(2)
  .filter((a) => a !== "--dry-run" && !a.startsWith("-"));

const prisma = dryRun ? null : new PrismaClient();

async function main() {
  if (slugs.length === 0) {
    console.error(
      "Thiếu slug. Ví dụ: npm run db:suppress:article-slugs -- can-ho-cho-thue-chuyen-gia-truc-ql13-vanh-dai-4-2026",
    );
    process.exit(1);
  }

  for (const slug of slugs) {
    if (dryRun) {
      console.log(`dry-run: sẽ Ẩn ${slug}`);
      continue;
    }
    const row = await suppressPublicArticleBySlug(slug, slug);
    console.log(`✔ ${row.slug} → ${row.status}`);
  }

  if (dryRun) {
    console.log(`\nDry-run OK: ${slugs.length} slug.`);
    return;
  }
  console.log(`\nĐã Ẩn ${slugs.length} slug — demo không còn phục hồi.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) await prisma.$disconnect();
  });
