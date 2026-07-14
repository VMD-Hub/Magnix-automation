/**
 * Fail build nếu bundle chưa chứa PromoTeaser mới — tránh zmp deploy www cũ.
 */
import { readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = resolve(root, "www/assets");
const files = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
if (!files.length) {
  console.error("verify-promo-bundle: no JS in www/assets");
  process.exit(1);
}

const needle = "Quay là có quà";
const wheel = "promo-wheel";
let foundCopy = false;
let foundWheel = false;
for (const f of files) {
  const body = readFileSync(resolve(assetsDir, f), "utf8");
  if (body.includes(needle)) foundCopy = true;
  if (body.includes(wheel)) foundWheel = true;
}

if (!foundCopy || !foundWheel) {
  console.error("verify-promo-bundle: FAIL — bundle thiếu teaser mới", {
    foundCopy,
    foundWheel,
    files,
  });
  process.exit(1);
}

console.log("verify-promo-bundle: OK", { files, needle, wheel });
