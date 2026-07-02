import { prisma } from "@/lib/prisma";
import { getSearchClient } from "./provider";
import { listingToSearchDoc } from "./listing-doc";

const listingInclude = {
  project: { select: { name: true } },
  broker: { select: { fullName: true } },
} as const;

/**
 * Đồng bộ 1 listing vào search index (best-effort, không làm hỏng request chính).
 * ACTIVE → index; trạng thái khác → gỡ khỏi index.
 */
export async function reindexListingSafe(listingId: string): Promise<void> {
  const client = getSearchClient();
  if (!client) return;
  try {
    const l = await prisma.listing.findUnique({
      where: { id: listingId },
      include: listingInclude,
    });
    if (!l) {
      await client.deleteListing(listingId);
      return;
    }
    if (l.status === "ACTIVE" && l.deletedAt == null) {
      await client.indexListings([listingToSearchDoc(l)]);
    } else {
      await client.deleteListing(listingId);
    }
  } catch (e) {
    console.error(
      "[search] reindex failed",
      listingId,
      e instanceof Error ? e.message : e,
    );
  }
}
