/**
 * Gỡ câu hệ thống “Không cần để lại SĐT trước khi xem kết quả gợi ý”
 * khỏi toàn bộ bài CMS + content_queue + content_drafts trong Postgres.
 *
 * Không phải copy người đọc — không được tái sử dụng trên web.
 *
 * Usage:
 *   npm run db:scrub:system-cta-notes
 *   npm run db:scrub:system-cta-notes:dry
 */
import { PrismaClient } from "@prisma/client";
import {
  stripSystemReaderForbiddenNotes,
  SYSTEM_NO_PHONE_CTA_NOTE,
} from "../lib/content/content-queue-article";

const dryRun = process.argv.includes("--dry-run");
const prisma = new PrismaClient();

function needsScrub(text: string | null | undefined): boolean {
  return Boolean(text && text.includes(SYSTEM_NO_PHONE_CTA_NOTE));
}

async function main() {
  let articleHits = 0;
  let queueHits = 0;
  let draftHits = 0;

  const articles = await prisma.article.findMany({
    select: { id: true, slug: true, body: true, excerpt: true, seoDesc: true },
  });
  for (const a of articles) {
    const body = needsScrub(a.body)
      ? stripSystemReaderForbiddenNotes(a.body)
      : a.body;
    const excerpt =
      a.excerpt && needsScrub(a.excerpt)
        ? stripSystemReaderForbiddenNotes(a.excerpt)
        : a.excerpt;
    const seoDesc =
      a.seoDesc && needsScrub(a.seoDesc)
        ? stripSystemReaderForbiddenNotes(a.seoDesc)
        : a.seoDesc;
    if (body === a.body && excerpt === a.excerpt && seoDesc === a.seoDesc) {
      continue;
    }
    articleHits += 1;
    console.log(`article ${a.slug}`);
    if (!dryRun) {
      await prisma.article.update({
        where: { id: a.id },
        data: { body, excerpt, seoDesc },
      });
    }
  }

  const queue = await prisma.contentQueueItem.findMany({
    select: { id: true, title: true, bodyPreview: true, painPoint: true },
  });
  for (const q of queue) {
    const bodyPreview =
      q.bodyPreview && needsScrub(q.bodyPreview)
        ? stripSystemReaderForbiddenNotes(q.bodyPreview)
        : q.bodyPreview;
    const painPoint =
      q.painPoint && needsScrub(q.painPoint)
        ? stripSystemReaderForbiddenNotes(q.painPoint)
        : q.painPoint;
    if (bodyPreview === q.bodyPreview && painPoint === q.painPoint) continue;
    queueHits += 1;
    console.log(`queue ${q.title.slice(0, 60)}`);
    if (!dryRun) {
      await prisma.contentQueueItem.update({
        where: { id: q.id },
        data: { bodyPreview, painPoint },
      });
    }
  }

  const drafts = await prisma.contentDraft.findMany({
    select: {
      id: true,
      title: true,
      artifactMarkdown: true,
      hookLine: true,
      ctaOptIn: true,
      disclaimer: true,
    },
  });
  for (const d of drafts) {
    const artifactMarkdown =
      d.artifactMarkdown && needsScrub(d.artifactMarkdown)
        ? stripSystemReaderForbiddenNotes(d.artifactMarkdown)
        : d.artifactMarkdown;
    const hookLine =
      d.hookLine && needsScrub(d.hookLine)
        ? stripSystemReaderForbiddenNotes(d.hookLine)
        : d.hookLine;
    const ctaOptIn =
      d.ctaOptIn && needsScrub(d.ctaOptIn)
        ? stripSystemReaderForbiddenNotes(d.ctaOptIn)
        : d.ctaOptIn;
    const disclaimer =
      d.disclaimer && needsScrub(d.disclaimer)
        ? stripSystemReaderForbiddenNotes(d.disclaimer)
        : d.disclaimer;
    if (
      artifactMarkdown === d.artifactMarkdown &&
      hookLine === d.hookLine &&
      ctaOptIn === d.ctaOptIn &&
      disclaimer === d.disclaimer
    ) {
      continue;
    }
    draftHits += 1;
    console.log(`draft ${d.title.slice(0, 60)}`);
    if (!dryRun) {
      await prisma.contentDraft.update({
        where: { id: d.id },
        data: { artifactMarkdown, hookLine, ctaOptIn, disclaimer },
      });
    }
  }

  const total = articleHits + queueHits + draftHits;
  if (dryRun) {
    console.log(
      `\nDry-run: sẽ scrub ${total} bản ghi (article=${articleHits}, queue=${queueHits}, draft=${draftHits}).`,
    );
    return;
  }
  console.log(
    `\nĐã scrub ${total} bản ghi (article=${articleHits}, queue=${queueHits}, draft=${draftHits}). Câu hệ thống SĐT không còn trong DB.`,
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
