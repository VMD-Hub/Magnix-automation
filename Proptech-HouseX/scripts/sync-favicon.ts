/**
 * Đồng bộ favicon / apple-icon từ mark-only OA đã duyệt.
 * Không còn generate SVG chrome X (Iteration 6) — nguồn: public/brand/housex-oa-avatar.png
 *
 * Chạy: npm run brand:sync-favicon
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const OA = join(process.cwd(), "public/brand/housex-oa-avatar.png");
const MARK = join(process.cwd(), "public/brand/housex-mark-only.png");

async function main() {
  const src = existsSync(OA) ? OA : MARK;
  if (!existsSync(src)) {
    throw new Error(
      "Missing public/brand/housex-oa-avatar.png — chạy npm run brand:import-approved-lockup trước.",
    );
  }

  const iconPath = join(process.cwd(), "app/icon.png");
  const applePath = join(process.cwd(), "app/apple-icon.png");
  mkdirSync(dirname(iconPath), { recursive: true });

  await sharp(src)
    .resize(512, 512, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toFile(iconPath);

  await sharp(src)
    .resize(180, 180, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toFile(applePath);

  // Giữ bản SVG legacy trong source nếu còn — không ghi app/icon.svg
  console.log(`Synced app/icon.png + app/apple-icon.png from ${src}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
