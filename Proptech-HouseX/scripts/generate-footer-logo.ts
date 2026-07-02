import { join } from "node:path";
import sharp from "sharp";
import { HOUSEX_HEADER_LOGO_SRC } from "../lib/brand/housex-logo-assets";

/** @deprecated Footer dùng `housex-footer-logo-dark.png` (file brand) — script giữ tham khảo. */
const FOOTER_LOGO_LEGACY_OUT = "/brand/housex-footer-logo-legacy-auto.png" as const;

/** @deprecated Footer dùng PNG gốc + khung tối — script giữ để tham khảo/tái tạo thủ công. */
const FOOTER_LOGO_BG = { r: 26, g: 18, b: 20 } as const;

/** Thay nền giấy logo header bằng ink-900 — giữ nguyên artwork gốc. */
async function main() {
  const srcPath = join(process.cwd(), "public", HOUSEX_HEADER_LOGO_SRC.replace(/^\//, ""));
  const outPath = join(
    process.cwd(),
    "public",
    FOOTER_LOGO_LEGACY_OUT.replace(/^\//, ""),
  );

  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const samples: Array<[number, number]> = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
    [Math.floor(width / 2), 0],
    [0, Math.floor(height / 2)],
  ];

  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  for (const [x, y] of samples) {
    const i = (y * width + x) * 4;
    bgR += data[i]!;
    bgG += data[i + 1]!;
    bgB += data[i + 2]!;
  }
  bgR = Math.round(bgR / samples.length);
  bgG = Math.round(bgG / samples.length);
  bgB = Math.round(bgB / samples.length);

  const threshold = 88;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const dist =
        Math.abs(data[i]! - bgR) +
        Math.abs(data[i + 1]! - bgG) +
        Math.abs(data[i + 2]! - bgB);
      if (dist <= threshold) {
        data[i] = FOOTER_LOGO_BG.r;
        data[i + 1] = FOOTER_LOGO_BG.g;
        data[i + 2] = FOOTER_LOGO_BG.b;
        data[i + 3] = 255;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(outPath);
  console.log(`Generated ${FOOTER_LOGO_LEGACY_OUT} from ${HOUSEX_HEADER_LOGO_SRC}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
