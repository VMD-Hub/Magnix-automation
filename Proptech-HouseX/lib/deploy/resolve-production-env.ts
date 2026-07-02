import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Parse KEY=VALUE lines — không ghi đè process.env. */
export function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function readEnvFile(cwd: string, name: string): Record<string, string> {
  const path = resolve(cwd, name);
  if (!existsSync(path)) return {};
  return parseEnvFile(readFileSync(path, "utf8"));
}

/**
 * Thứ tự Next.js khi NODE_ENV=production (next start):
 * .env → .env.production → .env.local → .env.production.local
 * (file sau ghi đè file trước)
 */
export function resolveProductionEnv(cwd = process.cwd()): Record<string, string> {
  return {
    ...readEnvFile(cwd, ".env"),
    ...readEnvFile(cwd, ".env.production"),
    ...readEnvFile(cwd, ".env.local"),
    ...readEnvFile(cwd, ".env.production.local"),
  };
}

export function maskDatabaseUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return "(invalid url)";
  }
}

export function isPlaceholderDatabaseUrl(url: string): boolean {
  return (
    !url.trim() ||
    url.includes("CHANGE_ME") ||
    url.includes("THAY_BANG") ||
    url.includes("postgres:postgres@")
  );
}
