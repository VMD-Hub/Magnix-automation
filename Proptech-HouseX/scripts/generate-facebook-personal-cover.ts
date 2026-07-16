/**
 * Ảnh bìa Facebook cá nhân — House X (dùng chung đội ngũ).
 *
 * Chuẩn Facebook profile cover:
 * - Upload khuyến nghị: 851×315 (hoặc 1702×630 @2x)
 * - Desktop ~820×312 · Mobile cắt 2 bên → safe zone ngang ~640×315 giữa
 * - Avatar che góc dưới TRÁI — không đặt chữ ở đó
 *
 * Nội dung: cụm NOXH · dịch vụ khác · QR + CTA Mini App (không lặp tagline brand).
 * Chạy: npm run brand:facebook-personal-cover
 */
import { stat } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const BG_SRC = join(ROOT, "public/images/hero/housex-hero-brand-ruby-skyline.png");
const LOCKUP_SRC = join(ROOT, "public/brand/housex-footer-logo-transparent.png");
const QR_SRC = join(ROOT, "public/brand/vu-nguyen/qr/qr-housex-miniapp-zalo.png");
const OUT_DIR = join(ROOT, "public/brand/facebook");

/** Base Facebook cover — tỉ lệ ~2.7:1 */
const FB = {
  width: 851,
  height: 315,
  /** Safe zone giữa (visible mobile) — pad 2 bên */
  safePadX: 120,
  /** Avatar desktop che dưới trái — chữ phải kết thúc trước y ≈ 230 */
  avatarReserveBottom: 95,
} as const;

const COPY = {
  noxhTitle: "Nhà ở xã hội",
  noxhItems: [
    "Tư vấn hồ sơ nhà ở xã hội",
    "Tư vấn rủi ro tài chính BĐS",
    "Cho vay mua NOXH ưu đãi",
  ],
  otherTitle: "Dịch vụ khác",
  otherLines: [
    "Định giá BĐS · Cho vay mua BĐS · Cho vay SXKD",
    "BH phi nhân thọ · Thiết kế · thi công nội thất",
  ],
  qrCta: "Mở Mini App",
  qrHint: "Quét mã kết nối",
} as const;

type CoverSpec = { file: string; scale: number };

const COVERS: CoverSpec[] = [
  { file: "housex-facebook-personal-cover-851x315.jpg", scale: 1 },
  { file: "housex-facebook-personal-cover-1702x630.jpg", scale: 2 },
];

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function gradientOverlay(width: number, height: number): Buffer {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a1214" stop-opacity="0.92"/>
      <stop offset="40%" stop-color="#3d070c" stop-opacity="0.72"/>
      <stop offset="75%" stop-color="#5c0b12" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="v" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1a1214" stop-opacity="0.55"/>
      <stop offset="50%" stop-color="#1a1214" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
</svg>`;
  return Buffer.from(svg);
}

/**
 * Layout ngang Facebook — chữ trong safe giữa; đáy trái trống cho avatar.
 *
 * | lockup + NOXH + DV khác (trái/giữa) | QR+CTA (phải trong safe) |
 * |________ avatar zone trống __________|
 */
function chrome(width: number, height: number): {
  svg: Buffer;
  qr: { left: number; top: number; size: number };
  lockup: { left: number; top: number; w: number };
} {
  const s = width / FB.width;
  const gold = "#C9A227";
  const white = "#F5F5F7";
  const safeL = Math.round(FB.safePadX * s);
  const safeR = width - Math.round(FB.safePadX * s);

  /** QR compact — kéo vào trong safe (mobile cắt mép) */
  const qrSize = Math.round(78 * s);
  const qrPad = Math.round(5 * s);
  const ctaH = Math.round(30 * s);
  const qrOuter = qrSize + qrPad * 2;
  const qrPanelH = qrOuter + ctaH;
  const qrLeft = safeR - qrOuter;
  const qrTop = Math.round(22 * s);

  const padX = safeL;
  const titleY = Math.round(70 * s);
  const titleSize = Math.round(20 * s);
  const itemSize = Math.round(12.5 * s);
  const ruleY = titleY + Math.round(7 * s);
  const listStart = ruleY + Math.round(14 * s);
  const gap = Math.round(15 * s);
  const bullet = Math.max(2, Math.round(3 * s));

  const items = COPY.noxhItems
    .map((label, i) => {
      const y = listStart + i * gap;
      const cy = y - Math.round(itemSize * 0.28);
      return `
  <circle cx="${padX + bullet}" cy="${cy}" r="${bullet}" fill="${gold}"/>
  <text x="${padX + bullet * 3}" y="${y}" fill="${white}"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${itemSize}" font-weight="500">${escapeXml(label)}</text>`;
    })
    .join("");

  const otherTitleY = listStart + COPY.noxhItems.length * gap + Math.round(12 * s);
  const otherTitleSize = Math.round(9 * s);
  const otherLineSize = Math.round(11 * s);
  const otherLineGap = Math.round(13 * s);

  const otherLinesSvg = COPY.otherLines
    .map((line, i) => {
      const y = otherTitleY + Math.round(13 * s) + i * otherLineGap;
      return `
  <text x="${padX}" y="${y}" fill="rgba(245,245,247,0.85)"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${otherLineSize}" font-weight="500">${escapeXml(line)}</text>`;
    })
    .join("");

  const ctaY = qrTop + qrOuter;
  const iconR = Math.round(6.5 * s);
  const iconCx = qrLeft + Math.round(12 * s);
  const iconCy = ctaY + ctaH / 2;
  const ctaTextX = iconCx + iconR + Math.round(5 * s);
  const ctaTitleSize = Math.round(11 * s);
  const ctaHintSize = Math.round(8 * s);

  const lockupW = Math.round(128 * s);
  const lockupTop = Math.round(10 * s);

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <text x="${padX}" y="${titleY}" fill="${gold}"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${titleSize}" font-weight="700">${escapeXml(COPY.noxhTitle)}</text>
  <rect x="${padX}" y="${ruleY}" width="${Math.round(32 * s)}"
    height="${Math.max(2, Math.round(2.5 * s))}" fill="${gold}" rx="1"/>
  ${items}

  <text x="${padX}" y="${otherTitleY}" fill="rgba(245,245,247,0.55)"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${otherTitleSize}" font-weight="600" letter-spacing="0.05em">${escapeXml(COPY.otherTitle.toUpperCase())}</text>
  ${otherLinesSvg}

  <rect x="${qrLeft}" y="${qrTop}" width="${qrOuter}" height="${qrPanelH}"
    rx="${Math.round(6 * s)}" fill="#FFFFFF" fill-opacity="0.97"/>
  <rect x="${qrLeft}" y="${qrTop}" width="${qrOuter}" height="${Math.max(2, Math.round(2.5 * s))}"
    fill="${gold}"/>
  <rect x="${qrLeft}" y="${ctaY}" width="${qrOuter}" height="${ctaH}" fill="#3d070c"/>

  <circle cx="${iconCx}" cy="${iconCy}" r="${iconR}" fill="${gold}"/>
  <path d="M ${iconCx - iconR * 0.35} ${iconCy + iconR * 0.15}
           L ${iconCx} ${iconCy - iconR * 0.4}
           L ${iconCx + iconR * 0.35} ${iconCy + iconR * 0.15} Z" fill="#3d070c"/>
  <rect x="${iconCx - iconR * 0.28}" y="${iconCy + iconR * 0.05}"
    width="${iconR * 0.56}" height="${iconR * 0.35}" rx="1" fill="#3d070c"/>

  <text x="${ctaTextX}" y="${ctaY + ctaH * 0.42}" fill="#FFFFFF"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${ctaTitleSize}" font-weight="700">${escapeXml(COPY.qrCta)}</text>
  <text x="${ctaTextX}" y="${ctaY + ctaH * 0.75}" fill="rgba(245,245,247,0.75)"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${ctaHintSize}" font-weight="500">${escapeXml(COPY.qrHint)}</text>
</svg>`;

  return {
    svg: Buffer.from(svg),
    qr: { left: qrLeft + qrPad, top: qrTop + qrPad, size: qrSize },
    lockup: { left: padX, top: lockupTop, w: lockupW },
  };
}

async function buildCover(spec: CoverSpec): Promise<void> {
  const width = FB.width * spec.scale;
  const height = FB.height * spec.scale;

  const background = await sharp(BG_SRC)
    .resize(width, height, { fit: "cover", position: "right" })
    .png()
    .toBuffer();

  const { svg, qr, lockup } = chrome(width, height);

  const lockupMeta = await sharp(LOCKUP_SRC).metadata();
  const lockupH = Math.round(
    lockup.w * ((lockupMeta.height ?? 1) / (lockupMeta.width ?? 1)),
  );
  const lockupImg = await sharp(LOCKUP_SRC)
    .resize(lockup.w, lockupH, { fit: "inside" })
    .png()
    .toBuffer();

  const qrImg = await sharp(QR_SRC)
    .resize(qr.size, qr.size, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();

  const outPath = join(OUT_DIR, spec.file);
  await sharp(background)
    .composite([
      { input: gradientOverlay(width, height), blend: "over" },
      { input: svg, blend: "over" },
      { input: lockupImg, left: lockup.left, top: lockup.top },
      { input: qrImg, left: qr.left, top: qr.top },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  const { size } = await stat(outPath);
  console.log(
    `✓ ${spec.file} — ${meta.width}×${meta.height} (${Math.round(size / 1024)} KB)`,
  );
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const spec of COVERS) {
    await buildCover(spec);
  }
  console.log(`\n→ Upload Facebook cá nhân:`);
  console.log(`  ${join(OUT_DIR, "housex-facebook-personal-cover-851x315.jpg")}`);
  console.log(`  (bản sắc nét: housex-facebook-personal-cover-1702x630.jpg)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
