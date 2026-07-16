/**
 * Ảnh bìa Zalo cá nhân (mobile) — House X.
 *
 * Chuẩn upload: 640×700 · ≤1MB JPG
 * Vùng an toàn: ~640×340 giữa (y ≈ 180–520)
 *
 * From screenshot Zalo «Kéo để điều chỉnh»:
 * - Avatar lớn góc DƯỚI TRÁI che ~160×160
 * - Viền trắng cong cắt đáy cover
 * → Không đặt chữ/chip ở 1/3 dưới; mọi info trong nửa trên–giữa.
 *
 * Không dùng tỉ lệ Facebook (landscape 16:9 / 820×312).
 * Chạy: npm run brand:zalo-personal-cover
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const BG_SRC = join(ROOT, "public/images/hero/housex-hero-brand-ruby-skyline.png");
const LOCKUP_SRC = join(ROOT, "public/brand/housex-footer-logo-transparent.png");
const QR_SRC = join(ROOT, "public/brand/vu-nguyen/qr/qr-housex-miniapp-zalo.png");
const OUT_DIR = join(ROOT, "public/brand/zalo");

const ZALO = {
  width: 640,
  height: 700,
  /** Nội dung chỉ trong box này (giữa canvas) */
  safe: { x: 24, y: 150, w: 592, h: 340 },
  /** Vùng avatar Zalo — cấm chữ */
  avatar: { x: 0, y: 520, w: 200, h: 180 },
  maxBytes: 1024 * 1024,
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
  { file: "housex-zalo-personal-cover-640x700.jpg", scale: 1 },
  { file: "housex-zalo-personal-cover-1280x1400.jpg", scale: 2 },
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
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#1a1214" stop-opacity="0.94"/>
      <stop offset="50%" stop-color="#3d070c" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#5c0b12" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="v" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#1a1214" stop-opacity="0.75"/>
      <stop offset="35%" stop-color="#1a1214" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
</svg>`;
  return Buffer.from(svg);
}

/**
 * Layout 640×700 — tất cả chữ trong safe zone; QR phải-trên; đáy trống.
 *
 * ┌─────────────────────────────────────┐
 * │ lockup                              │
 * │ ┌──────────────┐  ┌──────────────┐  │  safe y150–490
 * │ │ Nhà ở xã hội │  │  QR + CTA    │  │
 * │ │ • 3 nghiệp vụ│  │              │  │
 * │ │ Dịch vụ khác │  └──────────────┘  │
 * │ │ (1 dòng ·)   │                    │
 * │ └──────────────┘                    │
 * │                                     │  trống — avatar dưới trái
 * └─────────────────────────────────────┘
 */
function chrome(width: number, height: number): { svg: Buffer; qr: { left: number; top: number; size: number } } {
  const s = width / ZALO.width;
  const gold = "#C9A227";
  const white = "#F5F5F7";
  const padX = Math.round(ZALO.safe.x * s);
  const safeTop = Math.round(ZALO.safe.y * s);

  /** QR panel — phải, trong safe zone */
  const qrSize = Math.round(128 * s);
  const qrPad = Math.round(8 * s);
  const ctaH = Math.round(44 * s);
  const qrOuter = qrSize + qrPad * 2;
  const qrPanelH = qrOuter + ctaH;
  const qrLeft = width - padX - qrOuter;
  const qrTop = safeTop + Math.round(8 * s);

  /** Cột trái — NOXH + dịch vụ khác (không xuống đáy) */
  const colRight = qrLeft - Math.round(16 * s);
  const titleY = safeTop + Math.round(28 * s);
  const titleSize = Math.round(24 * s);
  const itemSize = Math.round(15 * s);
  const ruleY = titleY + Math.round(10 * s);
  const listStart = ruleY + Math.round(20 * s);
  const gap = Math.round(22 * s);
  const bullet = Math.max(3, Math.round(4 * s));

  const items = COPY.noxhItems
    .map((label, i) => {
      const y = listStart + i * gap;
      const cy = y - Math.round(itemSize * 0.3);
      return `
  <circle cx="${padX + bullet}" cy="${cy}" r="${bullet}" fill="${gold}"/>
  <text x="${padX + bullet * 3}" y="${y}" fill="${white}"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${itemSize}" font-weight="500">${escapeXml(label)}</text>`;
    })
    .join("");

  const otherTitleY = listStart + COPY.noxhItems.length * gap + Math.round(18 * s);
  const otherTitleSize = Math.round(11 * s);
  const otherLineSize = Math.round(12 * s);
  const otherLineGap = Math.round(16 * s);

  const otherLinesSvg = COPY.otherLines
    .map((line, i) => {
      const y = otherTitleY + Math.round(16 * s) + i * otherLineGap;
      return `
  <text x="${padX}" y="${y}" fill="rgba(245,245,247,0.82)"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${otherLineSize}" font-weight="500">${escapeXml(line)}</text>`;
    })
    .join("");

  /** CTA dưới QR */
  const ctaY = qrTop + qrOuter;
  const iconR = Math.round(9 * s);
  const iconCx = qrLeft + Math.round(18 * s);
  const iconCy = ctaY + ctaH / 2;
  const ctaTextX = iconCx + iconR + Math.round(8 * s);
  const ctaTitleSize = Math.round(14 * s);
  const ctaHintSize = Math.round(10 * s);

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Cụm NOXH trái -->
  <text x="${padX}" y="${titleY}" fill="${gold}"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${titleSize}" font-weight="700">${escapeXml(COPY.noxhTitle)}</text>
  <rect x="${padX}" y="${ruleY}" width="${Math.round(44 * s)}"
    height="${Math.max(2, Math.round(3 * s))}" fill="${gold}" rx="1"/>
  ${items}

  <!-- Dịch vụ khác — trong safe zone, không đặt đáy (avatar che) -->
  <text x="${padX}" y="${otherTitleY}" fill="rgba(245,245,247,0.55)"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${otherTitleSize}" font-weight="600" letter-spacing="0.05em">${escapeXml(COPY.otherTitle.toUpperCase())}</text>
  ${otherLinesSvg}

  <!-- QR phải + CTA -->
  <rect x="${qrLeft}" y="${qrTop}" width="${qrOuter}" height="${qrPanelH}"
    rx="${Math.round(8 * s)}" fill="#FFFFFF" fill-opacity="0.97"/>
  <rect x="${qrLeft}" y="${qrTop}" width="${qrOuter}" height="${Math.max(2, Math.round(3 * s))}"
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
  <text x="${ctaTextX}" y="${ctaY + ctaH * 0.72}" fill="rgba(245,245,247,0.75)"
    font-family="Segoe UI, system-ui, -apple-system, sans-serif"
    font-size="${ctaHintSize}" font-weight="500">${escapeXml(COPY.qrHint)}</text>

  <!-- guide ẩn: mép cột trái không tràn QR -->
  <rect x="${padX}" y="${safeTop}" width="${colRight - padX}" height="1" fill="none"/>
</svg>`;

  return {
    svg: Buffer.from(svg),
    qr: { left: qrLeft + qrPad, top: qrTop + qrPad, size: qrSize },
  };
}

async function buildCover(spec: CoverSpec): Promise<void> {
  const width = ZALO.width * spec.scale;
  const height = ZALO.height * spec.scale;
  const s = spec.scale;

  const background = await sharp(BG_SRC)
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  const lockupMeta = await sharp(LOCKUP_SRC).metadata();
  const lockupW = Math.round(180 * s);
  const lockupH = Math.round(
    lockupW * ((lockupMeta.height ?? 1) / (lockupMeta.width ?? 1)),
  );
  const lockup = await sharp(LOCKUP_SRC)
    .resize(lockupW, lockupH, { fit: "inside" })
    .png()
    .toBuffer();

  const { svg, qr } = chrome(width, height);
  const qrImg = await sharp(QR_SRC)
    .resize(qr.size, qr.size, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();

  const outPath = join(OUT_DIR, spec.file);
  await sharp(background)
    .composite([
      { input: gradientOverlay(width, height), blend: "over" },
      { input: svg, blend: "over" },
      { input: lockup, left: Math.round(ZALO.safe.x * s), top: Math.round(32 * s) },
      { input: qrImg, left: qr.left, top: qr.top },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  const { size } = await import("node:fs/promises").then((fs) => fs.stat(outPath));
  const kb = Math.round(size / 1024);
  const warn = size > ZALO.maxBytes ? " ⚠ >1MB" : "";
  console.log(`✓ ${spec.file} — ${meta.width}×${meta.height} (${kb} KB)${warn}`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const spec of COVERS) {
    await buildCover(spec);
  }
  console.log(`\n→ Upload file này lên Zalo (không dùng ảnh 16:9 / Facebook):`);
  console.log(`  ${join(OUT_DIR, "housex-zalo-personal-cover-640x700.jpg")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
