/**
 * Nâng chất lượng ảnh hero ngày/đêm — upscale + khử nhiễu + grade bình minh.
 * Chạy: npm run hero:enhance-assets
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images", "hero");
const ASSETS =
  "C:/Users/nguye/.cursor/projects/c-Users-nguye-Magnix-automation-Proptech-HouseX/assets";

/** Skyline sông Sài Gòn — Bitexco (cặp ngày/đêm cùng khung). */
const SOURCES = {
  day: `${ASSETS}/c__Users_nguye_AppData_Roaming_Cursor_User_workspaceStorage_a50fbff7111c0665c27bc3aa418a3864_images_image-0d14b076-6f35-48ea-a0b8-9f8bf226ffd4.png`,
  night: `${ASSETS}/c__Users_nguye_AppData_Roaming_Cursor_User_workspaceStorage_a50fbff7111c0665c27bc3aa418a3864_images_image-7a60074e-5a5a-4be8-a7bd-a1576a6ceffa.png`,
};

const BASE = "hcmc-skyline-river";
/** 3.75× từ 1024×682 — giữ tỉ lệ, ≥2560px */
const TARGET_W = 3840;
const TARGET_H = 2558;

type Profile = {
  saturation: number;
  brightness: number;
  contrast: number;
  sharpen: number;
  denoise?: boolean;
  morningGrade?: boolean;
};

function buildSkyDepthOverlay(width: number, height: number): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="zenith" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#041e42"/>
      <stop offset="22%" stop-color="#0a3568"/>
      <stop offset="45%" stop-color="#1a5088"/>
      <stop offset="72%" stop-color="#2a6a9e" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="52%" fill="url(#zenith)"/>
</svg>`;
  return Buffer.from(svg);
}

function buildWarmHorizonOverlay(width: number, height: number): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <radialGradient id="sunGlow" cx="78%" cy="5%" r="48%">
      <stop offset="0%" stop-color="#fff9eb" stop-opacity="0.5"/>
      <stop offset="24%" stop-color="#ffd878" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#ff8833" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="horizonWarm" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#9b111e" stop-opacity="0"/>
      <stop offset="35%" stop-color="#c45a20" stop-opacity="0.06"/>
      <stop offset="55%" stop-color="#daa520" stop-opacity="0.14"/>
      <stop offset="75%" stop-color="#ffe9b0" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#9b111e" stop-opacity="0.03"/>
    </linearGradient>
    <linearGradient id="horizonPrism" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b1530" stop-opacity="0.05"/>
      <stop offset="38%" stop-color="#fff4cc" stop-opacity="0.14"/>
      <stop offset="62%" stop-color="#ffd966" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#6b0f1a" stop-opacity="0.04"/>
    </linearGradient>
    <linearGradient id="waterGlint" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#ffe8a8" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#ffe8a8" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="22%" width="100%" height="28%" fill="url(#horizonWarm)"/>
  <rect width="100%" height="100%" fill="url(#sunGlow)"/>
  <rect x="0" y="30%" width="100%" height="12%" fill="url(#horizonPrism)"/>
  <rect x="0" y="48%" width="100%" height="20%" fill="url(#waterGlint)"/>
</svg>`;
  return Buffer.from(svg);
}

async function enhance(
  src: string,
  baseName: string,
  profile: Profile,
): Promise<void> {
  let pipeline = sharp(src).rotate();

  if (profile.denoise) {
    pipeline = pipeline.median(3);
  }

  pipeline = pipeline
    .resize(TARGET_W, TARGET_H, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .modulate({
      saturation: profile.saturation,
      brightness: profile.brightness,
    })
    .linear(profile.contrast, -(128 * (profile.contrast - 1)))
    .sharpen({
      sigma: profile.sharpen,
      m1: 0.75,
      m2: 0.45,
      x1: 2,
      y2: 12,
      y3: 32,
    })
    .gamma(profile.morningGrade ? 1.02 : 1.04);

  let processed = await pipeline.toBuffer();

  if (profile.morningGrade) {
    processed = await sharp(processed)
      .composite([
        {
          input: buildSkyDepthOverlay(TARGET_W, TARGET_H),
          blend: "multiply",
        },
        {
          input: buildWarmHorizonOverlay(TARGET_W, TARGET_H),
          blend: "over",
        },
      ])
      .toBuffer();
  }

  await sharp(processed)
    .webp({ quality: 95, effort: 6, smartSubsample: true })
    .toFile(path.join(ROOT, `${baseName}.webp`));

  await sharp(processed)
    .jpeg({ quality: 94, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(path.join(ROOT, `${baseName}.jpg`));
}

async function main(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });

  for (const key of Object.keys(SOURCES) as Array<keyof typeof SOURCES>) {
    await fs.access(SOURCES[key]);
  }

  await enhance(SOURCES.day, `${BASE}-day`, {
    saturation: 1.14,
    brightness: 1.04,
    contrast: 1.07,
    sharpen: 0.8,
    morningGrade: true,
  });

  await enhance(SOURCES.night, `${BASE}-night`, {
    saturation: 1.22,
    brightness: 1.05,
    contrast: 1.1,
    sharpen: 0.95,
    denoise: true,
  });

  console.log(`Enhanced ${BASE} → ${TARGET_W}×${TARGET_H} (webp + jpg)`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
