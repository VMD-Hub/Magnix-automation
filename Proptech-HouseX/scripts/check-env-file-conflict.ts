/**
 * Phát hiện DATABASE_URL seed CLI (.env) khác runtime Next.js production.
 * Usage: npm run go-live:check-env-files
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  isPlaceholderDatabaseUrl,
  maskDatabaseUrl,
  parseEnvFile,
  resolveProductionEnv,
} from "../lib/deploy/resolve-production-env";

function readEnv(name: string): Record<string, string> {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) return {};
  return parseEnvFile(readFileSync(path, "utf8"));
}

function main() {
  const dotEnv = readEnv(".env");
  const dotProduction = readEnv(".env.production");
  const dotLocal = readEnv(".env.local");
  const dotProductionLocal = readEnv(".env.production.local");
  const merged = resolveProductionEnv();

  const cliUrl = dotEnv.DATABASE_URL?.trim() ?? "";
  const runtimeUrl = merged.DATABASE_URL?.trim() ?? "";

  console.log("Kiểm tra xung đột env (Next.js production):\n");

  for (const [label, value] of [
    [".env", dotEnv.DATABASE_URL?.trim()],
    [".env.production", dotProduction.DATABASE_URL?.trim()],
    [".env.local", dotLocal.DATABASE_URL?.trim()],
    [".env.production.local", dotProductionLocal.DATABASE_URL?.trim()],
    ["→ PM2/next start dùng", runtimeUrl],
  ] as const) {
    const display =
      !value ? "(không có)" : maskDatabaseUrl(value);
    console.log(`  ${label}: ${display}`);
  }

  let failed = 0;

  if (isPlaceholderDatabaseUrl(runtimeUrl)) {
    failed += 1;
    console.error(
      "\n✖ DATABASE_URL runtime production vẫn placeholder — trang /du-an/* sẽ 404 dù seed OK.",
    );
    if (dotProduction.DATABASE_URL && dotProduction.DATABASE_URL !== dotEnv.DATABASE_URL) {
      console.error(
        "  Nguyên nhân thường gặp: `.env.production` ghi đè `.env` khi pm2 start.",
      );
      console.error("  Sửa: đồng bộ mật khẩu trong `.env.production` HOẶC `rm .env.production`.");
    }
  }

  if (cliUrl && runtimeUrl && cliUrl !== runtimeUrl && !isPlaceholderDatabaseUrl(cliUrl)) {
    failed += 1;
    console.error(
      "\n✖ DATABASE_URL `.env` (seed CLI) ≠ runtime production — seed vào DB khác app đang đọc.",
    );
  }

  if (!failed) {
    console.log("\n✔ DATABASE_URL đồng bộ — runtime production khớp seed CLI.");
    return;
  }

  console.error("\nSau khi sửa: pm2 restart housex --update-env");
  process.exit(1);
}

main();
