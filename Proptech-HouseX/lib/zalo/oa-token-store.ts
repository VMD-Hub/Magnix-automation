import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DEFAULT_FILE = ".zalo-oa-refresh";

function tokenFilePath(): string {
  return (
    process.env.ZALO_OA_REFRESH_TOKEN_FILE?.trim() ||
    join(process.cwd(), DEFAULT_FILE)
  );
}

/** Đọc refresh token: env trước, fallback file (sau lần rotate). */
export function readOaRefreshToken(): string | null {
  const fromEnv = process.env.ZALO_OA_REFRESH_TOKEN?.trim();
  if (fromEnv && !fromEnv.startsWith("<")) return fromEnv;

  const path = tokenFilePath();
  if (!existsSync(path)) return null;
  try {
    const t = readFileSync(path, "utf8").trim();
    return t || null;
  } catch {
    return null;
  }
}

/** Lưu refresh token mới (Zalo rotate mỗi lần refresh). Không log giá trị. */
export function writeOaRefreshToken(token: string): void {
  const t = token.trim();
  if (!t) return;
  process.env.ZALO_OA_REFRESH_TOKEN = t;
  try {
    writeFileSync(tokenFilePath(), `${t}\n`, { encoding: "utf8", mode: 0o600 });
    console.warn(
      `[zalo-oa] refresh_token đã rotate → lưu ${tokenFilePath()} (cập nhật .env khi tiện)`,
    );
  } catch (err) {
    console.warn(
      `[zalo-oa] refresh_token rotate — cập nhật ZALO_OA_REFRESH_TOKEN trong .env`,
    );
  }
}
