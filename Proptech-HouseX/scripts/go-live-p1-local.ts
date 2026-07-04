/**
 * Chuẩn bị P1 go-live trên máy local (DB + env tối thiểu).
 *
 * Usage: npm run go-live:p1-local
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

async function dockerReady(): Promise<boolean> {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("House X — Go-live P1 (local)\n");

  if (!envHas("AUTH_SECRET")) {
    console.error("Thiếu AUTH_SECRET trong .env.");
    console.error("Chạy: npm run go-live:secrets — copy AUTH_SECRET vào .env");
    process.exit(1);
  }

  if (!(await dockerReady())) {
    console.error("Docker chưa chạy — bật Docker Desktop rồi chạy lại:");
    console.error("  npm run go-live:p1-local");
    process.exit(1);
  }

  run("npm run db:up", "Bật Postgres (docker compose)");
  run("npm run db:deploy", "Áp migration production-style (prisma migrate deploy)");

  console.log("\n✔ P1 local — DB sẵn sàng.\n");
  console.log("Bước tiếp theo (2 terminal):");
  console.log("  1) npm run dev");
  console.log("  2) SITE=http://localhost:3000 npm run go-live:smoke-auth");
  console.log("\nProduction VPS:");
  console.log("  - Copy .env.production.example → .env trên VPS");
  console.log("  - npm run go-live:secrets → điền AUTH/ADMIN/CRON + RESEND hoặc EMAIL_WEBHOOK_URL");
  console.log("  - NODE_ENV=production npm run go-live:check-env");
  console.log("  - npm run db:deploy && npm run build && pm2 start …");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
