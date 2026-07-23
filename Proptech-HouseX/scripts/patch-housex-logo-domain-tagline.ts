/**
 * Thay tagline EN trong lockup PNG bằng timnhaxahoi.com (band H→E).
 * Luôn patch từ .pre-domain-tagline.bak.png nếu có.
 *
 * Usage: npx tsx scripts/patch-housex-logo-domain-tagline.ts
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { HOUSEX_DOMAIN_TAGLINE } from "../lib/brand/housex-logo-assets";

const ROOT = process.cwd();

/** Band tagline dưới HOUSE (đo trên lockup 1196×365 backup). */
const TAGLINE = {
  x0: 24,
  x1: 824,
  y0: 302,
  y1: 348,
  textTopPad: 0,
  fontSize: 30,
  textHeight: 46,
} as const;

const TARGETS = [
  "public/brand/housex-lockup-mark.png",
  "public/brand/housex-lockup-mark-paper.png",
  "public/brand/housex-footer-logo-transparent.png",
  "public/brand/housex-header-logo.png",
] as const;

async function clearEnglishBand(
  data: Buffer,
  width: number,
  height: number,
): Promise<void> {
  const { x0, x1, y0, y1 } = TAGLINE;
  for (let y = y0; y <= y1 && y < height; y++) {
    for (let x = x0; x <= x1 && x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  // Halo anti-alias EN quanh band
  for (let y = y0 - 3; y <= y1 + 3; y++) {
    for (let x = x0 - 4; x <= x1 + 4; x++) {
      if (y < 0 || x < 0 || y >= height || x >= width) continue;
      if (y >= y0 && y <= y1 && x >= x0 && x <= x1) continue;
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;
      if (a < 25) continue;
      const max = Math.max(r, g, b);
      const sat = max - Math.min(r, g, b);
      if (max >= 150 && sat <= 40) {
        data[i + 3] = 0;
      }
    }
  }
}

async function patchLogo(relPath: string): Promise<void> {
  const srcPath = join(ROOT, relPath);
  if (!existsSync(srcPath)) {
    console.warn(`skip missing: ${relPath}`);
    return;
  }

  const bak = srcPath.replace(/\.png$/i, ".pre-domain-tagline.bak.png");
  if (!existsSync(bak)) {
    copyFileSync(srcPath, bak);
    console.log(`backup → ${bak}`);
  } else {
    console.log(`restore from backup → ${relPath}`);
  }

  const { data, info } = await sharp(bak)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  await clearEnglishBand(data, width, height);

  const cleared = await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  const textW = TAGLINE.x1 - TAGLINE.x0;
  // Phân bố đều từng ký tự trên band H→E (không stretch glyph).
  // Pad mép để nửa glyph đầu/cuối không bị cắt.
  const chars = [...HOUSEX_DOMAIN_TAGLINE];
  const last = Math.max(chars.length - 1, 1);
  const edgePad = TAGLINE.fontSize * 0.45;
  const span = Math.max(textW - 2 * edgePad, textW * 0.85);
  const charNodes = chars
    .map((ch, i) => {
      const x = edgePad + (i / last) * span;
      const safe = ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch;
      return (
        `<text x="${x.toFixed(1)}" y="34" text-anchor="middle" ` +
        `font-family="Arial, Helvetica, sans-serif" font-size="${TAGLINE.fontSize}" ` +
        `font-weight="500" fill="#f7f7f7">${safe}</text>`
      );
    })
    .join("");
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${textW}" height="${TAGLINE.textHeight}">${charNodes}</svg>`,
  );

  const textPng = await sharp(svg).png().toBuffer();
  await sharp(cleared)
    .composite([
      {
        input: textPng,
        left: TAGLINE.x0,
        top: TAGLINE.y0 + TAGLINE.textTopPad,
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(srcPath);

  console.log(`patched ${relPath}`);
}

async function main() {
  for (const t of TARGETS) {
    await patchLogo(t);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
