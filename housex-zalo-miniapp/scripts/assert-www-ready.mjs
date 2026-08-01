/**
 * Đảm bảo www sẵn sàng deploy — và in cảnh báo Dist.
 * Fail nếu thiếu file khai báo trong app-config.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const www = resolve(root, "www");
const cfgPath = resolve(www, "app-config.json");

if (!existsSync(cfgPath)) {
  console.error("assert-www-ready: thiếu www/app-config.json — chạy npm run build:zmp trước");
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
const listed = [
  ...(cfg.listCSS || []),
  ...(cfg.listSyncJS || []),
  ...(cfg.listAsyncJS || []),
];

let missing = 0;
for (const rel of listed) {
  const abs = resolve(www, rel);
  if (!existsSync(abs)) {
    console.error("MISSING under www/:", rel);
    missing += 1;
  }
}
if (missing) process.exit(1);

const top = readdirSync(www);
if (top.includes("mock-agent.html")) {
  console.error(
    "assert-www-ready: www/ còn mock-agent.html — Dist sai sẽ kéo file này; xóa rồi build lại.",
  );
  process.exit(1);
}

console.log("assert-www-ready: OK");
console.log("  app-config listSyncJS :", cfg.listSyncJS);
console.log("  app-config listAsyncJS:", cfg.listAsyncJS);
console.log("  app-config listCSS    :", cfg.listCSS);
console.log("");
console.log("╔════════════════════════════════════════════════════════╗");
console.log("║  Dist folder PHẢI là thư mục www (hoặc deploy từ www) ║");
console.log("║  Nếu chọn Dist = . (root) → JS không load → TRẮNG MÀN ║");
console.log("╚════════════════════════════════════════════════════════╝");
