/**
 * Xuất banner Zalo OA + Mini App — ruby skyline + lockup House X + tagline.
 *
 * Chạy: node --import tsx scripts/generate-zalo-brand-banners.ts
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const BG_SRC = join(ROOT, "public/images/hero/housex-hero-brand-ruby-skyline.png");
const LOCKUP_SRC = join(
  ROOT,
  "public/brand/housex-footer-logo-transparent.png",
);
const OUT_DIR = join(ROOT, "public/brand/zalo");

/** Tagline chính thức (đã có trong lockup) + dòng VN cho Mini App / OA bio. */
const TAGLINE_VN = "Công cụ mua nhà thông minh";

type BannerSpec = {
  file: string;
  width: number;
  height: number;
  /** Phần trăm chiều rộng lockup so với banner */
  lockupWidthPct: number;
  /** Vị trí lockup — % từ trái / trên */
  lockupLeftPct: number;
  lockupTopPct: number;
  showVnLine: boolean;
};

const BANNERS: BannerSpec[] = [
  {
    file: "housex-zalo-oa-cover-1280x720.png",
    width: 1280,
    height: 720,
    lockupWidthPct: 0.42,
    lockupLeftPct: 0.06,
    lockupTopPct: 0.28,
    showVnLine: true,
  },
  {
    file: "housex-zalo-oa-cover-1920x1080.png",
    width: 1920,
    height: 1080,
    lockupWidthPct: 0.4,
    lockupLeftPct: 0.06,
    lockupTopPct: 0.3,
    showVnLine: true,
  },
  {
    file: "housex-miniapp-banner-1280x720.png",
    width: 1280,
    height: 720,
    lockupWidthPct: 0.44,
    lockupLeftPct: 0.05,
    lockupTopPct: 0.26,
    showVnLine: true,
  },
  {
    file: "housex-miniapp-banner-750x420.png",
    width: 750,
    height: 420,
    lockupWidthPct: 0.48,
    lockupLeftPct: 0.04,
    lockupTopPct: 0.24,
    showVnLine: true,
  },
  {
    file: "housex-zalo-oa-cover-1280x720-compact.png",
    width: 1280,
    height: 720,
    lockupWidthPct: 0.5,
    lockupLeftPct: 0.25,
    lockupTopPct: 0.32,
    showVnLine: false,
  },
];

function gradientOverlay(width: number, height: number): Buffer {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a1214" stop-opacity="0.88"/>
      <stop offset="42%" stop-color="#3d070c" stop-opacity="0.55"/>
      <stop offset="72%" stop-color="#5c0b12" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="v" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1a1214" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
</svg>`;
  return Buffer.from(svg);
}

function vnTaglineSvg(
  width: number,
  height: number,
  leftPx: number,
  topPx: number,
  fontSize: number,
): Buffer {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="${leftPx}"
    y="${topPx}"
    fill="#f5f5f7"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${fontSize}"
    font-weight="500"
    letter-spacing="0.02em"
    opacity="0.92"
  >${TAGLINE_VN}</text>
</svg>`;
  return Buffer.from(svg);
}

async function buildBanner(spec: BannerSpec): Promise<void> {
  const { width, height } = spec;

  const background = await sharp(BG_SRC)
    .resize(width, height, {
      fit: "cover",
      position: "right",
    })
    .png()
    .toBuffer();

  const lockupMeta = await sharp(LOCKUP_SRC).metadata();
  const lockupTargetW = Math.round(width * spec.lockupWidthPct);
  const lockupTargetH = Math.round(
    lockupTargetW * ((lockupMeta.height ?? 1) / (lockupMeta.width ?? 1)),
  );

  const lockup = await sharp(LOCKUP_SRC)
    .resize(lockupTargetW, lockupTargetH, { fit: "inside" })
    .png()
    .toBuffer();

  const lockupLeft = Math.round(width * spec.lockupLeftPct);
  const lockupTop = Math.round(height * spec.lockupTopPct);

  const layers: sharp.OverlayOptions[] = [
    { input: gradientOverlay(width, height), blend: "over" },
    { input: lockup, left: lockupLeft, top: lockupTop },
  ];

  if (spec.showVnLine) {
    const vnTop = lockupTop + lockupTargetH + Math.round(height * 0.04);
    const vnLeft = lockupLeft + Math.round(lockupTargetW * 0.02);
    const fontSize = Math.max(14, Math.round(height * 0.034));
    layers.push({
      input: vnTaglineSvg(width, height, vnLeft, vnTop, fontSize),
      blend: "over",
    });
  }

  const outPath = join(OUT_DIR, spec.file);
  await sharp(background).composite(layers).png({ compressionLevel: 9 }).toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(
    `✓ ${spec.file} — ${meta.width}×${meta.height} (${Math.round((meta.size ?? 0) / 1024)} KB)`,
  );
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const spec of BANNERS) {
    await buildBanner(spec);
  }

  console.log(`\nOutput: ${OUT_DIR}`);
  console.log("Upload OA: housex-zalo-oa-cover-1280x720.png (hoặc 1920×1080)");
  console.log("Mini App: housex-miniapp-banner-1280x720.png + 750×420");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
