/**
 * Đọc www/index.html sau build → cập nhật app-config + copy zmp-sdk UMD.
 *
 * Pattern ZIP đã chạy (18/07):
 *   listSyncJS  = [zmp-sdk.umd.js]
 *   listAsyncJS = [index-*.js]
 *
 * Thêm hậu tố .module.js (docs Zalo convert-web-app) để runtime load đúng module.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexHtml = readFileSync(resolve(root, "www/index.html"), "utf8");
const configPath = resolve(root, "app-config.json");

const css = [...indexHtml.matchAll(/<link[^>]+href="\.?\/?([^"]+\.css)"/g)].map(
  (m) => m[1].replace(/^\.\//, ""),
);
const moduleJs = [
  ...indexHtml.matchAll(
    /<script[^>]+type="module"[^>]+src="\.?\/?([^"]+\.js)"/g,
  ),
].map((m) => m[1].replace(/^\.\//, ""));
const classicJs = [
  ...indexHtml.matchAll(
    /<script(?![^>]*type="module")[^>]+src="\.?\/?([^"]+\.js)"/g,
  ),
].map((m) => m[1].replace(/^\.\//, ""));

if (!css.length && !moduleJs.length && !classicJs.length) {
  console.error("sync-app-config: no CSS/JS found in www/index.html");
  process.exit(1);
}

const assetsDir = resolve(root, "www/assets");
if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });

const umdSrc = resolve(root, "node_modules/zmp-sdk/index.umd.js");
const umdRel = "assets/zmp-sdk.umd.js";
if (!existsSync(umdSrc)) {
  console.error("sync-app-config: missing", umdSrc);
  process.exit(1);
}
copyFileSync(umdSrc, resolve(root, "www", umdRel));

let appEntries = [...moduleJs, ...classicJs].filter((p) => p !== umdRel);

for (const rel of appEntries) {
  const abs = resolve(root, "www", rel);
  if (!existsSync(abs)) {
    console.error("sync-app-config: missing", rel);
    process.exit(1);
  }
  const body = readFileSync(abs, "utf8");
  if (
    /\bfrom\s*["']\.\/([^"']+\.js)["']|import\s*\(\s*["']\.\/([^"']+\.js)["']\s*\)/.test(
      body,
    )
  ) {
    console.error(
      "sync-app-config: FAIL — entry còn import chunk phụ (Zalo trắng màn)",
    );
    process.exit(1);
  }
}

/** Đổi tên → *.module.js (docs Zalo). */
appEntries = appEntries.map((rel) => {
  if (rel.endsWith(".module.js")) return rel;
  const next = rel.replace(/\.js$/i, ".module.js");
  const from = resolve(root, "www", rel);
  const to = resolve(root, "www", next);
  if (existsSync(to)) {
    /* already renamed */
  } else {
    renameSync(from, to);
  }
  return next;
});

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.listCSS = css;
config.listSyncJS = [umdRel];
config.listAsyncJS = appEntries;

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
writeFileSync(
  resolve(root, "www/app-config.json"),
  `${JSON.stringify(config, null, 2)}\n`,
);

console.log("app-config.json synced:", {
  listCSS: css,
  listAsyncJS: config.listAsyncJS,
  listSyncJS: config.listSyncJS,
});
