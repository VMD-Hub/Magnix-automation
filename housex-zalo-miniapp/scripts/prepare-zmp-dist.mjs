/**
 * Chuẩn bị .zmp-dist/ — CHỈ bundle (không mock-agent, không src).
 * zmp deploy từ đây với Dist=. → assets/ khớp app-config.
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
const www = resolve(root, "www");
const dist = resolve(root, ".zmp-dist");

if (!existsSync(resolve(www, "app-config.json"))) {
  console.error("prepare-zmp-dist: thiếu www/app-config.json — chạy build:zmp hoặc build:smoke-zmp trước");
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(resolve(www, "app-config.json"), "utf8"));
const listed = [
  ...(cfg.listCSS || []),
  ...(cfg.listSyncJS || []),
  ...(cfg.listAsyncJS || []),
];
for (const rel of listed) {
  if (!existsSync(resolve(www, rel))) {
    console.error("prepare-zmp-dist: thiếu www/" + rel);
    process.exit(1);
  }
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

cpSync(www, dist, {
  recursive: true,
  filter: (src) => {
    const base = src.replace(/\\/g, "/");
    if (base.endsWith("mock-agent.html")) return false;
    if (base.endsWith("/.env") || base.endsWith(".env")) return false;
    return true;
  },
});

writeFileSync(
  resolve(dist, "app-config.json"),
  `${JSON.stringify(cfg, null, 2)}\n`,
);

if (existsSync(resolve(root, ".env"))) {
  cpSync(resolve(root, ".env"), resolve(dist, ".env"));
}

// Tránh ZMP nhầm project framework — chỉ giữ marker deploy-only
writeFileSync(
  resolve(dist, "package.json"),
  JSON.stringify(
    {
      name: "housex-zalo-miniapp-dist",
      private: true,
      version: "0.1.0",
    },
    null,
    2,
  ) + "\n",
);

console.log("prepare-zmp-dist: OK →", dist);
console.log("  files:", listed.join(", "));
console.log("  (không có mock-agent.html)");
