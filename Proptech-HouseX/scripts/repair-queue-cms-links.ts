/**
 * Vá liên kết content_queue.articleId ↔ Article CMS theo slug SoR.
 * Chạy trên mọi item (kể cả PUBLISHED) — không ghi đè title/body.
 *
 * Usage:
 *   npm run db:repair:queue-cms-links
 *   npm run db:repair:queue-cms-links:dry
 */
import { PrismaClient } from "@prisma/client";

const dryRun = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

const KEY_SLUG_RE = /^(?:wiki-noxh|kien-thuc|re-knowledge|editorial):(.+)$/;

function slugFromQueue(row: {
  normalizedKey: string;
  opsNotes: string | null;
  article: { slug: string } | null;
}): string | null {
  if (row.article?.slug) return row.article.slug;
  const fromKey = row.normalizedKey.match(KEY_SLUG_RE)?.[1]?.trim();
  if (fromKey) return fromKey;
  const fromNotes = row.opsNotes?.match(/^slug:\s*(.+)$/m)?.[1]?.trim();
  return fromNotes || null;
}

async function main() {
  const rows = await prisma.contentQueueItem.findMany({
    select: {
      id: true,
      normalizedKey: true,
      opsNotes: true,
      articleId: true,
      status: true,
      article: { select: { id: true, slug: true, status: true } },
    },
  });

  let linked = 0;
  let already = 0;
  let missingCms = 0;
  let noSlug = 0;

  for (const row of rows) {
    const slug = slugFromQueue(row);
    if (!slug) {
      noSlug += 1;
      continue;
    }

    const cms = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });
    if (!cms) {
      missingCms += 1;
      if (dryRun) {
        console.log(`· missing CMS  ${slug}  queue=${row.id}  status=${row.status}`);
      }
      continue;
    }

    if (row.articleId === cms.id) {
      already += 1;
      continue;
    }

    if (dryRun) {
      console.log(
        `→ link  ${slug}  queue=${row.id}  ${row.articleId ?? "null"} → ${cms.id} (${cms.status})`,
      );
    } else {
      await prisma.contentQueueItem.update({
        where: { id: row.id },
        data: { articleId: cms.id },
      });
    }
    linked += 1;
  }

  console.log(
    [
      dryRun ? "Dry-run" : "Done",
      `linked=${linked}`,
      `alreadyOk=${already}`,
      `missingCms=${missingCms}`,
      `noSlug=${noSlug}`,
      `total=${rows.length}`,
    ].join(" · "),
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
