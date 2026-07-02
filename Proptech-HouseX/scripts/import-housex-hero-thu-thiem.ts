/**
 * Import & crop hero banner — phối cảnh TT hành chính Thủ Thiêm (House X).
 * Nguồn: đặt file gốc vào assets/incoming/ hoặc truyền đường dẫn.
 * Chạy: npm run hero:import-thu-thiem
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images", "hero");
const INCOMING_DIR = path.join(process.cwd(), "assets", "incoming");
const CURSOR_ASSETS =
  "C:/Users/nguye/.cursor/projects/c-Users-nguye-Magnix-automation-Proptech-HouseX/assets";

import {
  HOUSEX_HERO_BANNER_HEIGHT,
  HOUSEX_HERO_BANNER_WIDTH,
  HOUSEX_HERO_SLIDE_SOURCES,
} from "../lib/brand/hero-assets";

/** @deprecated Dùng npm run hero:import-slides */
const LEGACY_BASE = "housex-thu-thiem-civic-center";

const SOURCE_CANDIDATES = [
  path.join(INCOMING_DIR, HOUSEX_HERO_SLIDE_SOURCES.civicCenter),
  path.join(INCOMING_DIR, HOUSEX_HERO_SLIDE_SOURCES.civicCenter.replace(/\.png$/, ".jpg")),
  path.join(CURSOR_ASSETS, HOUSEX_HERO_SLIDE_SOURCES.civicCenter),
];

async function findSource(): Promise<string> {
  const fromArg = process.argv[2]?.trim();
  if (fromArg) {
    await fs.access(fromArg);
    return fromArg;
  }
  for (const candidate of SOURCE_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    `Không tìm thấy ảnh nguồn. Chạy: npm run hero:import-slides`,
  );
}

async function writeHeroVariant(
  src: string,
  baseName: string,
  profile: { brightness: number; saturation: number; contrast: number },
): Promise<void> {
  let pipeline = sharp(src)
    .rotate()
    .resize(HOUSEX_HERO_BANNER_WIDTH, HOUSEX_HERO_BANNER_HEIGHT, {
      fit: "cover",
      position: "attention",
    })
    .modulate({
      brightness: profile.brightness,
      saturation: profile.saturation,
    })
    .linear(profile.contrast, -(128 * (profile.contrast - 1)))
    .sharpen({ sigma: 0.6 });

  const processed = await pipeline.toBuffer();

  await sharp(processed)
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(ROOT, `${baseName}.webp`));

  await sharp(processed)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(ROOT, `${baseName}.jpg`));
}

async function main(): Promise<void> {
  const src = await findSource();
  await fs.mkdir(ROOT, { recursive: true });

  const archiveName = `${LEGACY_BASE}-source${path.extname(src) || ".jpg"}`;
  await fs.copyFile(src, path.join(ROOT, archiveName));

  await writeHeroVariant(src, `${LEGACY_BASE}-day`, {
    brightness: 1.03,
    saturation: 1.08,
    contrast: 1.05,
  });

  await writeHeroVariant(src, `${LEGACY_BASE}-night`, {
    brightness: 0.52,
    saturation: 0.72,
    contrast: 1.08,
  });

  console.log(
    JSON.stringify({
      source: src,
      archive: `/images/hero/${archiveName}`,
      day: `/images/hero/${LEGACY_BASE}-day.jpg`,
      night: `/images/hero/${LEGACY_BASE}-night.jpg`,
      size: `${HOUSEX_HERO_BANNER_WIDTH}x${HOUSEX_HERO_BANNER_HEIGHT}`,
    }),
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
