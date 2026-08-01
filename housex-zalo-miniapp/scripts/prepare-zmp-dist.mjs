/**
 * Chuẩn bị .zmp-dist/www/ — khớp prompt Dist=www của ZMP CLI.
 * (Lỗi ENOENT .zmp-dist/www/app-config.json = Dist=www nhưng thiếu thư mục www.)
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const wwwSrc = resolve(root, "www");
const distRoot = resolve(root, ".zmp-dist");
const distWww = resolve(distRoot, "www");

if (!existsSync(resolve(wwwSrc, "app-config.json"))) {
  console.error(
    "prepare-zmp-dist: thiếu www/app-config.json — chạy build:zmp hoặc build:smoke-zmp trước",
  );
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(resolve(wwwSrc, "app-config.json"), "utf8"));
const listed = [
  ...(cfg.listCSS || []),
  ...(cfg.listSyncJS || []),
  ...(cfg.listAsyncJS || []),
];
for (const rel of listed) {
  if (!existsSync(resolve(wwwSrc, rel))) {
    console.error("prepare-zmp-dist: thiếu www/" + rel);
    process.exit(1);
  }
}

rmSync(distRoot, { recursive: true, force: true });
mkdirSync(distWww, { recursive: true });

cpSync(wwwSrc, distWww, {
  recursive: true,
  filter: (src) => !src.replace(/\\/g, "/").endsWith("mock-agent.html"),
});

writeFileSync(
  resolve(distWww, "app-config.json"),
  `${JSON.stringify(cfg, null, 2)}\n`,
);
// ZMP đôi khi đọc app-config ở cwd project
writeFileSync(
  resolve(distRoot, "app-config.json"),
  `${JSON.stringify(cfg, null, 2)}\n`,
);

if (existsSync(resolve(root, ".env"))) {
  cpSync(resolve(root, ".env"), resolve(distRoot, ".env"));
}

writeFileSync(
  resolve(distRoot, "package.json"),
  JSON.stringify(
    { name: "housex-zalo-miniapp-dist", private: true, version: "0.1.0" },
    null,
    2,
  ) + "\n",
);

if (!existsSync(resolve(distWww, "app-config.json"))) {
  console.error("prepare-zmp-dist: FAIL — không tạo được www/app-config.json");
  process.exit(1);
}

console.log("prepare-zmp-dist: OK");
console.log("  ", resolve(distWww, "app-config.json"));
console.log("  assets:", listed.join(", "));
console.log("  → zmp deploy từ .zmp-dist · Dist = www");
