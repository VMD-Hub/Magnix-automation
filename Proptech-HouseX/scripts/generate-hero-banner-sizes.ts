/**
 * Sinh bản hero 1280 + 768 từ file -1920.jpg (LCP / banner catalog).
 * Chạy: npm run hero:generate-banner-sizes
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { HOUSEX_HERO_SLIDES } from "../lib/brand/hero-assets";

const ROOT = path.join(process.cwd(), "public", "images", "hero");

const SIZES = [
  { suffix: "-1280", width: 1280, height: 549, webpQ: 88, jpegQ: 88 },
  { suffix: "-768", width: 768, height: 329, webpQ: 85, jpegQ: 86 },
] as const;

async function deriveFrom1920(basePath: string): Promise<void> {
  const src1920 = path.join(ROOT, `${basePath}-1920.jpg`);
  try {
    await fs.access(src1920);
  } catch {
    console.warn(`Skip ${basePath}: missing ${src1920}`);
    return;
  }

  for (const size of SIZES) {
    const processed = await sharp(src1920)
      .resize(size.width, size.height, {
        fit: "cover",
        position: "attention",
      })
      .toBuffer();

    await sharp(processed)
      .webp({ quality: size.webpQ, effort: 6 })
      .toFile(path.join(ROOT, `${basePath}${size.suffix}.webp`));

    await sharp(processed)
      .jpeg({ quality: size.jpegQ, mozjpeg: true })
      .toFile(path.join(ROOT, `${basePath}${size.suffix}.jpg`));
  }

  console.log(`OK ${basePath} → 1280 + 768`);
}

async function main(): Promise<void> {
  const bases = HOUSEX_HERO_SLIDES.map((s) => {
    const match = s.jpgMd.match(/\/([^/]+)-1920\.jpg$/);
    return match?.[1] ?? "";
  }).filter(Boolean);

  for (const base of bases) {
    await deriveFrom1920(base);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
