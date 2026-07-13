/**
 * Xuất QR PNG in thẻ NFC / name card — màu ruby House X.
 * Chạy: npm run brand:vu-nguyen-qr
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";
import {
  resolveVuNguyenQrUrl,
  VU_NGUYEN_QR_PRINT_DIR,
  type VuNguyenQrTarget,
} from "../lib/personal-brand/vu-nguyen/channel-links";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, VU_NGUYEN_QR_PRINT_DIR);
const BRAND_RUBY = "#3d070c";

const TARGETS: { file: string; target: VuNguyenQrTarget; label: string }[] = [
  {
    file: "qr-profile-nfc.png",
    target: "profile-nfc",
    label: "Thẻ NFC — profile digital card",
  },
  {
    file: "qr-housex-web.png",
    target: "web",
    label: "Web timnhaxahoi.com",
  },
  {
    file: "qr-housex-miniapp-zalo.png",
    target: "miniapp",
    label: "Zalo OA → Mini App House X",
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const item of TARGETS) {
    const url = resolveVuNguyenQrUrl(item.target);
    const png = await QRCode.toBuffer(url, {
      type: "png",
      margin: 2,
      width: 1024,
      color: { dark: BRAND_RUBY, light: "#ffffff" },
      errorCorrectionLevel: "H",
    });
    const outPath = join(OUT_DIR, item.file);
    await writeFile(outPath, png);
    console.log(`✓ ${item.file}\n  ${item.label}\n  ${url}\n`);
  }

  console.log(`Done → ${VU_NGUYEN_QR_PRINT_DIR}/`);
  console.log("In thẻ NFC: dùng qr-profile-nfc.png trên mặt sau name card.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
