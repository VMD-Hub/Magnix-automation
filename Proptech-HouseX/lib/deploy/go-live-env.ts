/**
 * Kiểm tra biến môi trường tối thiểu trước go-live timnhaxahoi.com.
 */

export type EnvCheck = {
  key: string;
  ok: boolean;
  level: "required" | "recommended" | "warn";
  message: string;
};

function has(key: string): boolean {
  return Boolean(process.env[key]?.trim());
}

function minLen(key: string, min: number): boolean {
  return (process.env[key]?.trim().length ?? 0) >= min;
}

function isHttpsUrl(key: string): boolean {
  const v = process.env[key]?.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function hasEmailProvider(): boolean {
  return has("RESEND_API_KEY") || has("EMAIL_WEBHOOK_URL");
}

/** Danh sách kiểm tra — dùng cho script CLI và CI. */
export function checkGoLiveEnv(): EnvCheck[] {
  const checks: EnvCheck[] = [];

  checks.push({
    key: "DATABASE_URL",
    ok:
      has("DATABASE_URL") &&
      !process.env.DATABASE_URL!.includes("postgres:postgres@") &&
      !process.env.DATABASE_URL!.includes("CHANGE_ME"),
    level: "required",
    message: "Postgres production (đổi mật khẩu mặc định / CHANGE_ME)",
  });

  checks.push({
    key: "NEXT_PUBLIC_SITE_URL",
    ok: isHttpsUrl("NEXT_PUBLIC_SITE_URL"),
    level: "required",
    message: "https://timnhaxahoi.com (hoặc domain canonical)",
  });

  checks.push({
    key: "AUTH_SECRET",
    ok: minLen("AUTH_SECRET", 32),
    level: "required",
    message: "≥ 32 ký tự — openssl rand -base64 32",
  });

  checks.push({
    key: "ADMIN_SECRET",
    ok: minLen("ADMIN_SECRET", 32),
    level: "required",
    message: "≥ 32 ký tự — bảo vệ /admin",
  });

  checks.push({
    key: "CRON_SECRET",
    ok: minLen("CRON_SECRET", 16),
    level: "required",
    message: "≥ 16 ký tự — /api/cron/*",
  });

  checks.push({
    key: "REDIS_URL",
    ok: has("REDIS_URL"),
    level: "required",
    message: "Bắt buộc production (rate limit, scrape guard)",
  });

  checks.push({
    key: "EMAIL",
    ok: hasEmailProvider(),
    level: "required",
    message: "RESEND_API_KEY hoặc EMAIL_WEBHOOK_URL",
  });

  checks.push({
    key: "EMAIL_FROM",
    ok: has("EMAIL_FROM") || has("RESEND_API_KEY"),
    level: "recommended",
    message: 'EMAIL_FROM="House X <noreply@timnhaxahoi.com>" khi dùng Resend',
  });

  checks.push({
    key: "NEXT_PUBLIC_SUPPORT_EMAIL",
    ok: has("NEXT_PUBLIC_SUPPORT_EMAIL"),
    level: "recommended",
    message: "Email hiển thị footer / liên hệ",
  });

  const scrapeOn = process.env.SCRAPE_GUARD_ENABLED !== "false";
  checks.push({
    key: "SCRAPE_GUARD",
    ok: scrapeOn && has("REDIS_URL"),
    level: scrapeOn ? "required" : "warn",
    message: scrapeOn
      ? "SCRAPE_GUARD_ENABLED=true cần REDIS_URL"
      : "SCRAPE_GUARD tắt — chỉ dev/staging",
  });

  if (has("RESEND_API_KEY") && !has("EMAIL_FROM")) {
    checks.push({
      key: "RESEND+FROM",
      ok: false,
      level: "recommended",
      message: "Resend cần EMAIL_FROM đã verify domain",
    });
  }

  return checks;
}

export function summarizeGoLiveEnv(checks: EnvCheck[]): {
  ok: boolean;
  requiredFailed: string[];
  warnings: string[];
} {
  const requiredFailed = checks
    .filter((c) => c.level === "required" && !c.ok)
    .map((c) => `${c.key}: ${c.message}`);
  const warnings = checks
    .filter((c) => (c.level === "recommended" || c.level === "warn") && !c.ok)
    .map((c) => `${c.key}: ${c.message}`);

  return {
    ok: requiredFailed.length === 0,
    requiredFailed,
    warnings,
  };
}
