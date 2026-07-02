/**
 * Reindex toàn bộ listing ACTIVE vào search engine.
 * Chạy: npm run search:reindex
 * Yêu cầu env MEILI_HOST (+ MEILI_MASTER_KEY). Nếu thiếu → no-op.
 */
import { prisma } from "@/lib/prisma";
import { getSearchClient } from "@/lib/search/provider";
import { listingToSearchDoc } from "@/lib/search/listing-doc";

const BATCH = 500;

async function main() {
  const client = getSearchClient();
  if (!client) {
    console.log("[reindex] MEILI_HOST chưa cấu hình — bỏ qua.");
    return;
  }

  await client.ensureIndex();
  console.log(`[reindex] index sẵn sàng (${client.name}).`);

  let cursor: string | undefined;
  let total = 0;
  for (;;) {
    const rows = await prisma.listing.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      take: BATCH,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
      include: {
        project: { select: { name: true } },
        broker: { select: { fullName: true } },
      },
    });
    if (rows.length === 0) break;
    await client.indexListings(rows.map(listingToSearchDoc));
    total += rows.length;
    cursor = rows[rows.length - 1].id;
    console.log(`[reindex] đã đẩy ${total} listing...`);
    if (rows.length < BATCH) break;
  }

  console.log(`[reindex] hoàn tất: ${total} listing.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
