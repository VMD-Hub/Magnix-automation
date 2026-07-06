/**
 * Import & crop hero slides — xuất 1920 + 3840 (21:9), chất lượng cao.
 * Chạy: npm run hero:import-slides
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  HOUSEX_HERO_BANNER_HEIGHT,
  HOUSEX_HERO_BANNER_HEIGHT_2X,
  HOUSEX_HERO_BANNER_WIDTH,
  HOUSEX_HERO_BANNER_WIDTH_2X,
  HOUSEX_HERO_SLIDE_SOURCES,
} from "../lib/brand/hero-assets";

const ROOT = path.join(process.cwd(), "public", "images", "hero");
const INCOMING_DIR = path.join(process.cwd(), "assets", "incoming");
const CURSOR_ASSETS =
  "C:/Users/nguye/.cursor/projects/c-Users-nguye-Magnix-automation-Proptech-HouseX/assets";

const SLIDES = [
  {
    baseName: "housex-hero-slide-01-civic-center",
    sources: [
      HOUSEX_HERO_SLIDE_SOURCES.civicCenter,
      HOUSEX_HERO_SLIDE_SOURCES.civicCenter.replace(/\.png$/, ".jpg"),
    ],
  },
  {
    baseName: "housex-hero-slide-02-metro-hub",
    sources: [HOUSEX_HERO_SLIDE_SOURCES.metroHub],
  },
] as const;

const VARIANTS = [
  {
    suffix: "-768",
    width: 768,
    height: 329,
    webpQuality: 85,
    jpegQuality: 86,
  },
  {
    suffix: "-1280",
    width: 1280,
    height: 549,
    webpQuality: 88,
    jpegQuality: 88,
  },
  {
    suffix: "-1920",
    width: HOUSEX_HERO_BANNER_WIDTH,
    height: HOUSEX_HERO_BANNER_HEIGHT,
    webpQuality: 92,
    jpegQuality: 91,
  },
  {
    suffix: "",
    width: HOUSEX_HERO_BANNER_WIDTH_2X,
    height: HOUSEX_HERO_BANNER_HEIGHT_2X,
    webpQuality: 96,
    jpegQuality: 94,
  },
] as const;

async function resolveSource(filenames: readonly string[]): Promise<string> {
  const dirs = [INCOMING_DIR, CURSOR_ASSETS];
  for (const name of filenames) {
    for (const dir of dirs) {
      const candidate = path.join(dir, name);
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        /* next */
      }
    }
  }
  throw new Error(
    `Không tìm thấy ảnh nguồn (${filenames.join(" | ")}). Đặt vào assets/incoming/.`,
  );
}

async function renderVariant(
  src: string,
  baseName: string,
  variant: (typeof VARIANTS)[number],
): Promise<void> {
  const processed = await sharp(src)
    .rotate()
    .resize(variant.width, variant.height, {
      fit: "cover",
      position: "attention",
      kernel: sharp.kernel.lanczos3,
    })
    .toBuffer();

  const webpPath = path.join(ROOT, `${baseName}${variant.suffix}.webp`);
  const jpgPath = path.join(ROOT, `${baseName}${variant.suffix}.jpg`);

  await sharp(processed)
    .webp({
      quality: variant.webpQuality,
      effort: 6,
      smartSubsample: false,
    })
    .toFile(webpPath);

  await sharp(processed)
    .jpeg({
      quality: variant.jpegQuality,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    })
    .toFile(jpgPath);
}

async function writeSlide(src: string, baseName: string): Promise<void> {
  for (const variant of VARIANTS) {
    await renderVariant(src, baseName, variant);
  }

  const archive = `${baseName}-source${path.extname(src) || ".jpg"}`;
  await fs.copyFile(src, path.join(ROOT, archive));
}

async function main(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
  await fs.mkdir(INCOMING_DIR, { recursive: true });

  const results: Array<{ baseName: string; source: string }> = [];
  for (const slide of SLIDES) {
    const src = await resolveSource(slide.sources);
    await writeSlide(src, slide.baseName);
    results.push({ baseName: slide.baseName, source: src });
  }

  console.log(
    JSON.stringify({
      slides: results,
      variants: [`${HOUSEX_HERO_BANNER_WIDTH}x${HOUSEX_HERO_BANNER_HEIGHT}`, `${HOUSEX_HERO_BANNER_WIDTH_2X}x${HOUSEX_HERO_BANNER_HEIGHT_2X}`],
    }),
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
