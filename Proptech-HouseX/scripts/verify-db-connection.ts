/**
 * Kiểm tra DATABASE_URL runtime production có login Postgres được không.
 * Khác go-live:check-env-files — script này test thật qua Prisma.
 *
 * Usage: npm run go-live:verify-db
 */
import { PrismaClient } from "@prisma/client";
import {
  maskDatabaseUrl,
  resolveProductionEnv,
} from "../lib/deploy/resolve-production-env";

async function main() {
  const merged = resolveProductionEnv();
  const url = merged.DATABASE_URL?.trim() ?? "";

  console.log("DATABASE_URL runtime (production merge):");
  console.log(`  ${url ? maskDatabaseUrl(url) : "(trống)"}\n`);

  if (!url) {
    console.error("✖ Thiếu DATABASE_URL — chạy: npm run go-live:sync-db-url");
    process.exit(1);
  }

  process.env.DATABASE_URL = url;
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;
    console.log("✔ Prisma kết nối Postgres OK:", rows[0]?.ok);

    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename IN ('user_accounts', 'customers', 'brokers')
      ORDER BY tablename
    `;
    const names = tables.map((t) => t.tablename);
    console.log("  Bảng auth:", names.join(", ") || "(thiếu — chạy npm run go-live:p1-vps)");

    if (!names.includes("user_accounts")) {
      console.error("\n✖ Thiếu user_accounts — chạy: npm run go-live:p1-vps");
      process.exit(1);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("✖ Prisma không kết nối được DB:");
    console.error(`  ${msg.split("\n")[0]}`);
    console.error("\nSửa (một mật khẩu cho mọi nơi):");
    console.error("  1) echo 'POSTGRES_PASSWORD=...' > .env.prod");
    console.error("  2) docker exec housex-postgres psql -U housex -d housex -c \"ALTER USER housex WITH PASSWORD '...';\"");
    console.error("  3) npm run go-live:sync-db-url");
    console.error("  4) npm run go-live:verify-db");
    console.error("  5) pm2 delete housex && cd /opt/housex/Proptech-HouseX && pm2 start npm --name housex -- start");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
