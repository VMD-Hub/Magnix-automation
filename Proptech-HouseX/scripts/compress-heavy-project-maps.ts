/**
 * Nén ảnh map dự án nặng (Ahrefs: image file size too large).
 * Run: node --import tsx scripts/compress-heavy-project-maps.ts
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { mkdir, rename, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  "public/images/projects/la-home/map.jpg",
  "public/images/projects/nam-long-can-tho/map.jpg",
];

async function compressJpg(rel: string) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) {
    console.warn("skip missing", rel);
    return;
  }
  const before = (await stat(abs)).size;
  const tmp = `${abs}.tmp.jpg`;
  await mkdir(dirname(abs), { recursive: true });
  await sharp(abs)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toFile(tmp);
  await rename(tmp, abs);
  const after = (await stat(abs)).size;
  console.log(
    `${rel}: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`,
  );

  const webp = abs.replace(/\.jpe?g$/i, ".webp");
  await sharp(abs)
    .webp({ quality: 72 })
    .toFile(webp);
  const webpSize = (await stat(webp)).size;
  console.log(`  + ${webp.replace(ROOT + "\\", "").replace(ROOT + "/", "")}: ${Math.round(webpSize / 1024)}KB`);
}

async function main() {
  for (const t of TARGETS) {
    await compressJpg(t);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
