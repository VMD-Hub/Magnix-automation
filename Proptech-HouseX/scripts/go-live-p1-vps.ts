/**
 * P1 trên VPS — Postgres đã chạy sẵn (docker-compose.prod), không cần db:up local.
 *
 * Usage: npm run go-live:p1-vps
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");

function run(cmd: string, label: string) {
  console.log(`\n→ ${label}`);
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd: root, stdio: "inherit", env: process.env });
}

function envHas(key: string): boolean {
  if (process.env[key]?.trim()) return true;
  if (!existsSync(envPath)) return false;
  const text = readFileSync(envPath, "utf8");
  return new RegExp(`^${key}=.+`, "m").test(text);
}

async function main() {
  console.log("House X — Go-live P1 (VPS)\n");

  if (!envHas("AUTH_SECRET")) {
    console.error("Thiếu AUTH_SECRET trong .env — chạy: npm run go-live:secrets");
    process.exit(1);
  }

  if (!envHas("DATABASE_URL")) {
    console.error("Thiếu DATABASE_URL trong .env");
    process.exit(1);
  }

  run("npm run db:generate", "Prisma generate");
  run("npm run db:deploy", "Áp migration (prisma migrate deploy)");

  console.log("\n✔ P1 VPS — DB migration xong.\n");
  console.log("Bước tiếp theo:");
  console.log("  npm run build");
  console.log("  npm start          # hoặc pm2 restart housex");
  console.log("  SITE=http://127.0.0.1:3000 npm run go-live:smoke-auth");
  console.log("  SITE=https://timnhaxahoi.com npm run go-live:smoke");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
