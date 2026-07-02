/**
 * Tính lại quality + rank cho toàn bộ tin ACTIVE (P2).
 * Chạy: npm run ranking:recompute
 * Dùng khi backfill sau migration, hoặc thay cron nếu không chạy serverless cron.
 */
import { prisma } from "@/lib/prisma";
import { recomputeActiveRankings } from "@/lib/data/ranking";

async function main() {
  const { updated } = await recomputeActiveRankings(prisma);
  console.log(`[ranking] đã tính lại ${updated} tin ACTIVE.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
