/**
 * Import lockup + mark-only đã duyệt → public/brand + app/icon.png
 *
 * Nguồn (Cursor assets):
 * - housex-logo-lockup-unified-x-review.png
 * - housex-mark-only-favicon-oa.png
 *
 * Chạy: node --import tsx scripts/import-approved-brand-lockup.ts
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ASSETS_DIR = join(
  process.env.USERPROFILE || process.env.HOME || "",
  ".cursor",
  "projects",
  "c-Users-nguye-Magnix-automation-Proptech-HouseX",
  "assets",
);

const LOCKUP_SRC = join(ASSETS_DIR, "housex-logo-lockup-unified-x-review.png");
const MARK_SRC = join(ASSETS_DIR, "housex-mark-only-favicon-oa.png");

const OUT = {
  lockupTransparent: "public/brand/housex-footer-logo-transparent.png",
  headerLogo: "public/brand/housex-header-logo.png",
  headerMark: "public/brand/housex-header-logo-mark.png",
  markOnly: "public/brand/housex-mark-only.png",
  oaAvatar: "public/brand/housex-oa-avatar.png",
  faviconPng: "app/icon.png",
  appleIcon: "app/apple-icon.png",
} as const;

function colorDist(
  r: number,
  g: number,
  b: number,
  br: number,
  bg: number,
  bb: number,
) {
  return Math.abs(r - br) + Math.abs(g - bg) + Math.abs(b - bb);
}

/** Xóa nền nâu ruby → alpha; giữ trắng + vàng kim loại. */
async function knockOutBrown(srcPath: string): Promise<{
  data: Buffer;
  width: number;
  height: number;
}> {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const corners: Array<[number, number]> = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
  ];

  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    bgR += data[i]!;
    bgG += data[i + 1]!;
    bgB += data[i + 2]!;
  }
  bgR = Math.round(bgR / corners.length);
  bgG = Math.round(bgG / corners.length);
  bgB = Math.round(bgB / corners.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const dist = colorDist(r, g, b, bgR, bgG, bgB);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Giữ chữ trắng / vàng kim loại
      const isBright = lum >= 95 || max >= 140;
      const isGoldish = r >= 120 && g >= 70 && b <= 110 && sat >= 35;

      if (isBright || isGoldish) {
        continue;
      }

      if (dist <= 28) {
        data[i + 3] = 0;
      } else if (dist <= 72) {
        const t = (dist - 28) / 44;
        data[i + 3] = Math.round(Math.min(1, Math.max(0, t)) * 255);
      } else if (lum < 55 && sat < 45 && dist <= 110) {
        // Vùng nâu tối còn sót
        data[i + 3] = Math.round(((dist - 72) / 38) * 180);
      }
    }
  }

  return { data, width, height };
}

async function trimAndSave(
  raw: { data: Buffer; width: number; height: number },
  outRel: string,
  opts?: { maxWidth?: number; pad?: number },
) {
  const outPath = join(process.cwd(), outRel);
  mkdirSync(dirname(outPath), { recursive: true });

  const trimmed = await sharp(raw.data, {
    raw: { width: raw.width, height: raw.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();

  let pipeline = sharp(trimmed);

  if (opts?.pad && opts.pad > 0) {
    pipeline = pipeline.extend({
      top: opts.pad,
      bottom: opts.pad,
      left: opts.pad,
      right: opts.pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  if (opts?.maxWidth) {
    pipeline = pipeline.resize({
      width: opts.maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
  const meta = await sharp(outPath).metadata();

  return {
    path: outRel,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
  };
}

async function saveSolidBgSquare(
  markSrc: string,
  outRel: string,
  size: number,
) {
  const outPath = join(process.cwd(), outRel);
  mkdirSync(dirname(outPath), { recursive: true });

  // OA / apple: giữ nền ruby + X (crop an toàn)
  await sharp(markSrc)
    .resize(size, size, { fit: "cover", position: "centre" })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return { path: outRel, width: size, height: size };
}

async function saveFaviconFromMark(markSrc: string) {
  // Favicon: X trên nền ruby (đồng bộ OA), 512 → Next tự scale
  return saveSolidBgSquare(markSrc, OUT.faviconPng, 512);
}

async function main() {
  if (!existsSync(LOCKUP_SRC)) {
    throw new Error(`Missing lockup: ${LOCKUP_SRC}`);
  }
  if (!existsSync(MARK_SRC)) {
    throw new Error(`Missing mark: ${MARK_SRC}`);
  }

  // Backup nguồn vào public/brand/source
  const sourceDir = join(process.cwd(), "public/brand/source");
  mkdirSync(sourceDir, { recursive: true });
  copyFileSync(LOCKUP_SRC, join(sourceDir, "housex-logo-lockup-unified-x-review.png"));
  copyFileSync(MARK_SRC, join(sourceDir, "housex-mark-only-favicon-oa.png"));

  const lockupKnocked = await knockOutBrown(LOCKUP_SRC);
  const lockup = await trimAndSave(lockupKnocked, OUT.lockupTransparent, {
    maxWidth: 1400,
    pad: 24,
  });

  // Header dùng cùng lockup trong suốt (ruby bar)
  copyFileSync(
    join(process.cwd(), OUT.lockupTransparent),
    join(process.cwd(), OUT.headerMark),
  );
  // Bản có nền giấy sáng — giữ file header cũ path: xuất PNG nền trong suốt cũng OK trên light pad
  copyFileSync(
    join(process.cwd(), OUT.lockupTransparent),
    join(process.cwd(), OUT.headerLogo),
  );

  const markKnocked = await knockOutBrown(MARK_SRC);
  const markOnly = await trimAndSave(markKnocked, OUT.markOnly, {
    maxWidth: 1024,
    pad: 48,
  });

  const oa = await saveSolidBgSquare(MARK_SRC, OUT.oaAvatar, 1024);
  const favicon = await saveFaviconFromMark(MARK_SRC);
  const apple = await saveSolidBgSquare(MARK_SRC, OUT.appleIcon, 180);

  console.log(
    JSON.stringify(
      {
        lockup,
        markOnly,
        oa,
        favicon,
        apple,
        note: "Update HOUSEX_*_WIDTH/HEIGHT in lib/brand/housex-logo-assets.ts from lockup dims",
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
