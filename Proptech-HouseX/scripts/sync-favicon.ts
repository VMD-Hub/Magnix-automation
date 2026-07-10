/**
 * Đồng bộ favicon / apple-icon / favicon.ico từ mark-only OA đã duyệt.
 * Vuông bo góc (~22%) — thân thiện trên tab trình duyệt.
 *
 * Chạy: npm run brand:sync-favicon
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  roundedSquarePng,
  writeRoundedSquarePng,
} from "../lib/brand/favicon-image";

const OA = join(process.cwd(), "public/brand/housex-oa-avatar.png");
const MARK = join(process.cwd(), "public/brand/housex-mark-only.png");

/** Gói nhiều PNG vào một file .ico (Windows Vista+ PNG-in-ICO). */
function packPngIco(images: Array<{ size: number; data: Buffer }>): Buffer {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries: Buffer[] = [];
  const payloads: Buffer[] = [];
  let offset = 6 + 16 * count;

  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    payloads.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...payloads]);
}

async function writeIco(src: string, outPath: string) {
  const sizes = [16, 32, 48];
  const images = await Promise.all(
    sizes.map(async (size) => ({
      size,
      data: await roundedSquarePng(src, size),
    })),
  );
  writeFileSync(outPath, packPngIco(images));
}

async function main() {
  const src = existsSync(OA) ? OA : MARK;
  if (!existsSync(src)) {
    throw new Error(
      "Missing public/brand/housex-oa-avatar.png — chạy npm run brand:import-approved-lockup trước.",
    );
  }

  const iconPath = join(process.cwd(), "app/icon.png");
  const applePath = join(process.cwd(), "app/apple-icon.png");
  const faviconApp = join(process.cwd(), "app/favicon.ico");
  const faviconPublic = join(process.cwd(), "public/favicon.ico");

  mkdirSync(dirname(iconPath), { recursive: true });
  mkdirSync(dirname(faviconPublic), { recursive: true });

  await writeRoundedSquarePng(src, 512, iconPath);
  await writeRoundedSquarePng(src, 180, applePath);
  await writeIco(src, faviconApp);
  await writeIco(src, faviconPublic);

  console.log(
    "Synced rounded favicon: app/icon.png, app/apple-icon.png, app/favicon.ico, public/favicon.ico",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
