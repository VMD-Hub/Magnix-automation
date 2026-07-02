/**
 * Kiểm tra Postgres có đủ landing thương mại trước smoke test.
 * Usage: npm run db:verify:landings
 */
import { PrismaClient } from "@prisma/client";
import { VINHOMES_PROJECT_SLUGS } from "../lib/seed/vinhomes-projects";
import { COMMERCIAL_LANDING_SLUGS } from "../lib/seed/commercial-landings";
import {
  isPlaceholderDatabaseUrl,
  maskDatabaseUrl,
  resolveProductionEnv,
} from "../lib/deploy/resolve-production-env";

const REQUIRED = [...VINHOMES_PROJECT_SLUGS, ...COMMERCIAL_LANDING_SLUGS];

async function main() {
  const prodEnv = resolveProductionEnv();
  const url = prodEnv.DATABASE_URL?.trim() ?? process.env.DATABASE_URL?.trim() ?? "";

  if (!url) {
    console.error("✖ DATABASE_URL trống — kiểm tra .env / .env.production");
    process.exit(1);
  }
  if (isPlaceholderDatabaseUrl(url)) {
    console.error("✖ DATABASE_URL runtime production vẫn placeholder — sửa .env.production hoặc xóa file đó");
    process.exit(1);
  }

  const cliUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (cliUrl && cliUrl !== url) {
    console.warn("⚠ CLI (.env) khác runtime production — chạy: npm run go-live:check-env-files");
  }

  const prisma = new PrismaClient({
    datasources: { db: { url } },
  });
  try {
    await prisma.$queryRaw`SELECT 1`;

    const rows = await prisma.project.findMany({
      where: { slug: { in: [...REQUIRED] }, deletedAt: null },
      select: { slug: true, name: true },
      orderBy: { slug: "asc" },
    });

    let missing = 0;

    console.log(`DATABASE_URL host: ${maskDatabaseUrl(url)}`);
    console.log(`Tìm thấy ${rows.length}/${REQUIRED.length} landing:\n`);

    for (const slug of REQUIRED) {
      const row = rows.find((r) => r.slug === slug);
      if (row) {
        console.log(`  ✔ ${slug} — ${row.name}`);
      } else {
        missing += 1;
        console.error(`  ✖ ${slug} — MISSING`);
      }
    }

    if (missing) {
      console.error(
        `\nThiếu ${missing} dự án. Chạy:\n  npm run db:deploy\n  npm run db:seed:vinhomes\n  npm run db:seed:commercial\n  pm2 restart housex --update-env`,
      );
      process.exit(1);
    }

    console.log("\nDB OK — có thể chạy: SITE=https://timnhaxahoi.com npm run go-live:smoke");
  } catch (err) {
    console.error("✖ Không kết nối Postgres hoặc bảng projects:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
