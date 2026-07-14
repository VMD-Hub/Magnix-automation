/**
 * Fail build nếu bundle React chưa chứa PromoTeaser mới — tránh zmp deploy www cũ.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = resolve(root, "www/assets");
const files = readdirSync(assetsDir).filter(
  (f) => f.endsWith(".js") && !f.includes("zmp-sdk"),
);
if (!files.length) {
  console.error("verify-promo-bundle: no React JS in www/assets");
  process.exit(1);
}

const needle = "Quay là có quà";
const wheel = "promo-wheel";
let foundCopy = false;
let foundWheel = false;
let localhostApi = false;
for (const f of files) {
  const body = readFileSync(resolve(assetsDir, f), "utf8");
  if (body.includes(needle)) foundCopy = true;
  if (body.includes(wheel)) foundWheel = true;
  // Vite mang VITE_HOUSEX_API_BASE vào const e="…".replace — cấm localhost trong PROD.
  if (/="http:\/\/localhost:\d+"\.replace/.test(body)) localhostApi = true;
}

if (!foundCopy || !foundWheel) {
  console.error("verify-promo-bundle: FAIL — bundle thiếu teaser mới", {
    foundCopy,
    foundWheel,
    files,
  });
  process.exit(1);
}

if (localhostApi) {
  console.error(
    "verify-promo-bundle: FAIL — bundle đang trỏ API localhost (Zalo không gọi được).",
  );
  console.error(
    "  Fix: dùng .env.production với VITE_HOUSEX_API_BASE=https://timnhaxahoi.com",
  );
  process.exit(1);
}

console.log("verify-promo-bundle: OK", { files, needle, wheel });
