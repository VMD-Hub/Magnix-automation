/**
 * Đồng bộ DATABASE_URL trong .env / .env.production với POSTGRES_PASSWORD trong .env.prod.
 * Fix lỗi PM2 (next start) đọc .env.production ghi đè .env → Prisma auth fail.
 *
 * Usage (VPS):
 *   cd /opt/housex/Proptech-HouseX
 *   npm run go-live:sync-db-url
 *   pm2 restart housex --update-env
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  maskDatabaseUrl,
  parseEnvFile,
  resolveProductionEnv,
} from "../lib/deploy/resolve-production-env";

const cwd = process.cwd();
const envProdPath = resolve(cwd, ".env.prod");

if (!existsSync(envProdPath)) {
  console.error("Thiếu .env.prod — tạo: echo 'POSTGRES_PASSWORD=...' > .env.prod");
  process.exit(1);
}

const prod = parseEnvFile(readFileSync(envProdPath, "utf8"));
const password = prod.POSTGRES_PASSWORD?.trim();

if (!password || password === "CHANGE_ME") {
  console.error("POSTGRES_PASSWORD trong .env.prod trống hoặc CHANGE_ME.");
  process.exit(1);
}

const databaseUrl = `postgresql://housex:${encodeURIComponent(password)}@127.0.0.1:5432/housex?schema=public`;

function upsertDatabaseUrl(fileName: string) {
  const path = resolve(cwd, fileName);
  if (!existsSync(path)) {
    writeFileSync(path, `DATABASE_URL="${databaseUrl}"\n`, "utf8");
    console.log(`✔ Tạo ${fileName}`);
    return;
  }

  const raw = readFileSync(path, "utf8");
  const line = `DATABASE_URL="${databaseUrl}"`;
  const next = /^DATABASE_URL=/m.test(raw)
    ? raw.replace(/^DATABASE_URL=.*$/m, line)
    : `${raw.trimEnd()}\n${line}\n`;
  writeFileSync(path, next, "utf8");
  console.log(`✔ Cập nhật ${fileName} → ${maskDatabaseUrl(databaseUrl)}`);
}

console.log("Đồng bộ DATABASE_URL từ .env.prod …\n");
upsertDatabaseUrl(".env");
upsertDatabaseUrl(".env.production");

const merged = resolveProductionEnv(cwd);
console.log("\nRuntime production (next start) sẽ dùng:");
console.log(`  ${maskDatabaseUrl(merged.DATABASE_URL ?? "")}`);
console.log("\nTiếp theo:");
console.log("  docker exec -e PGPASSWORD='***' housex-postgres psql -U housex -d housex -c 'SELECT 1'");
console.log("  pm2 restart housex --update-env");
console.log("  SITE=http://127.0.0.1:3000 npm run go-live:smoke-auth");
