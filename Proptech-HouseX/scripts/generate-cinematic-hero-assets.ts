/**
 * Sinh ảnh ngày/đêm hero cinematic từ concept B.
 * Chạy: npm run hero:generate-assets
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { BUILDING_WINDOW_LIGHTS } from "../lib/brand/cinematic-hero-lights";

const ROOT = path.join(process.cwd(), "public", "images", "hero");
const SOURCE = path.join(ROOT, "concept-b-metro-viaduct.png");
const DAY_OUT = path.join(ROOT, "concept-b-metro-viaduct-day.png");
const NIGHT_OUT = path.join(ROOT, "concept-b-metro-viaduct-night.png");

function pct(v: number, total: number): number {
  return (v / 100) * total;
}

function buildNightOverlaySvg(width: number, height: number): string {
  const windows = BUILDING_WINDOW_LIGHTS.map((w) => {
    const x = pct(w.x, width);
    const y = pct(w.y, height);
    const ww = pct(w.w, width);
    const wh = pct(w.h, height);
    const color = w.warm ? "255,205,130" : "175,210,255";
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${ww.toFixed(1)}" height="${wh.toFixed(1)}" fill="rgba(${color},${w.opacity.toFixed(2)})" />`;
  }).join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#040810"/>
      <stop offset="32%" stop-color="#0c1524"/>
      <stop offset="52%" stop-color="#121e30" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#121e30" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="cityAmbient" cx="52%" cy="38%" r="48%">
      <stop offset="0%" stop-color="#182840" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#040810" stop-opacity="0"/>
    </radialGradient>
    <filter id="winGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="0.8"/>
    </filter>
  </defs>
  <rect width="100%" height="52%" fill="url(#nightSky)"/>
  <rect width="100%" height="100%" fill="url(#cityAmbient)"/>
  <g filter="url(#winGlow)">
    ${windows}
  </g>
</svg>`;
}

function buildNightGradeSvg(width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="viaductShade" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#000" stop-opacity="0.22"/>
      <stop offset="45%" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="#0a1220" opacity="0.28"/>
  <rect width="100%" height="100%" fill="url(#viaductShade)"/>
</svg>`;
}

function buildDayGradeSvg(width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="ruby" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9b111e" stop-opacity="0.12"/>
      <stop offset="55%" stop-color="#9b111e" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="goldHaze" cx="68%" cy="18%" r="45%">
      <stop offset="0%" stop-color="#daa520" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#daa520" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#ruby)"/>
  <rect width="100%" height="100%" fill="url(#goldHaze)"/>
</svg>`;
}

async function main(): Promise<void> {
  await fs.access(SOURCE);

  const meta = await sharp(SOURCE).metadata();
  const width = meta.width ?? 800;
  const height = meta.height ?? 600;

  const nightOverlay = Buffer.from(buildNightOverlaySvg(width, height));
  const nightGrade = Buffer.from(buildNightGradeSvg(width, height));
  const dayGrade = Buffer.from(buildDayGradeSvg(width, height));

  await sharp(SOURCE)
    .modulate({ brightness: 1.02, saturation: 0.96 })
    .composite([{ input: dayGrade, blend: "over" }])
    .png({ compressionLevel: 9 })
    .toFile(DAY_OUT);

  await sharp(SOURCE)
    .modulate({ brightness: 0.48, saturation: 0.62 })
    .linear(1.05, -8)
    .composite([
      { input: nightGrade, blend: "multiply" },
      { input: nightOverlay, blend: "screen" },
    ])
    .png({ compressionLevel: 9 })
    .toFile(NIGHT_OUT);

  console.log("Generated:");
  console.log(" ", path.relative(process.cwd(), DAY_OUT));
  console.log(" ", path.relative(process.cwd(), NIGHT_OUT));
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
