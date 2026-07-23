/**
 * Import logo user thiết kế → lockup transparent + (tuỳ chọn) soft-gold domain.
 * Usage: npx tsx scripts/import-user-housex-lockup.ts <source.png>
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

/** Brand gold (globals.css @theme) */
const GOLD = { r: 0xe8, g: 0xc5, b: 0x47 }; // gold-400
const GOLD_DEEP = { r: 0xda, g: 0xa5, b: 0x20 }; // gold-500

const OUT = {
  mark: "public/brand/housex-lockup-mark-v4.png",
  paper: "public/brand/housex-lockup-mark-paper-v4.png",
  footer: "public/brand/housex-footer-logo-transparent.png",
  header: "public/brand/housex-header-logo.png",
  sourceArchive: "public/brand/housex-lockup-user-source.png",
} as const;

function isNearBlack(r: number, g: number, b: number): boolean {
  return r <= 28 && g <= 28 && b <= 28;
}

/** Orange / warm amber domain text — không đụng brushed gold X (độ bão hòa + value khác). */
function isDomainOrange(r: number, g: number, b: number, a: number): boolean {
  if (a < 40) return false;
  // Orange: R cao, G trung bình, B thấp
  if (r < 180) return false;
  if (b > 120) return false;
  if (g < 70 || g > 190) return false;
  if (r - g < 25) return false; // không phải vàng gần đều (metallic)
  if (g - b < 20) return false;
  return true;
}

function blendTowardGold(r: number, g: number, b: number): [number, number, number] {
  // Giữ luminance tương đối; kéo hue về gold-400/500.
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const target = lum > 0.55 ? GOLD : GOLD_DEEP;
  const t = 0.72; // giữ một phần ấm từ file gốc
  return [
    Math.round(r * (1 - t) + target.r * t),
    Math.round(g * (1 - t) + target.g * t),
    Math.round(b * (1 - t) + target.b * t),
  ];
}

async function main() {
  const srcArg = process.argv[2];
  if (!srcArg) {
    console.error("Usage: npx tsx scripts/import-user-housex-lockup.ts <source.png>");
    process.exit(1);
  }
  const srcPath = resolve(srcArg);
  if (!existsSync(srcPath)) {
    console.error(`Missing: ${srcPath}`);
    process.exit(1);
  }

  const archivePath = join(ROOT, OUT.sourceArchive);
  mkdirSync(dirname(archivePath), { recursive: true });
  copyFileSync(srcPath, archivePath);

  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  if (channels !== 4) throw new Error(`expected RGBA, got ${channels}`);

  let cleared = 0;
  let recolored = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const a = data[i + 3]!;
    if (a > 0 && isNearBlack(r, g, b)) {
      data[i + 3] = 0;
      cleared++;
      continue;
    }
    if (isDomainOrange(r, g, b, a)) {
      const [nr, ng, nb] = blendTowardGold(r, g, b);
      data[i] = nr;
      data[i + 1] = ng;
      data[i + 2] = nb;
      recolored++;
    }
  }

  const png = await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  for (const rel of [OUT.mark, OUT.paper, OUT.footer, OUT.header]) {
    const outPath = join(ROOT, rel);
    await sharp(png).toFile(outPath);
    console.log(`wrote ${rel}`);
  }

  console.log(
    JSON.stringify(
      { width, height, clearedBg: cleared, domainGoldNudge: recolored },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
