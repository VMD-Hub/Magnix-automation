/**
 * Đọc www/index.html sau build → cập nhật listCSS / listAsyncJS / listSyncJS.
 * Copy zmp-sdk UMD vào www (không bundle bằng Vite — tránh trắng màn).
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexHtml = readFileSync(resolve(root, "www/index.html"), "utf8");
const configPath = resolve(root, "app-config.json");

const css = [...indexHtml.matchAll(/<link[^>]+href="\.?\/?([^"]+\.css)"/g)].map(
  (m) => m[1].replace(/^\.\//, ""),
);
const asyncJs = [
  ...indexHtml.matchAll(
    /<script[^>]+type="module"[^>]+src="\.?\/?([^"]+\.js)"/g,
  ),
].map((m) => m[1].replace(/^\.\//, ""));
const syncJs = [
  ...indexHtml.matchAll(
    /<script(?![^>]*type="module")[^>]+src="\.?\/?([^"]+\.js)"/g,
  ),
].map((m) => m[1].replace(/^\.\//, ""));

if (!css.length && !asyncJs.length && !syncJs.length) {
  console.error("sync-app-config: no CSS/JS found in www/index.html");
  process.exit(1);
}

const assetsDir = resolve(root, "www/assets");
if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });

const umdSrc = resolve(root, "node_modules/zmp-sdk/index.umd.js");
const umdRel = "assets/zmp-sdk.umd.js";
const umdDest = resolve(root, "www", umdRel);
if (!existsSync(umdSrc)) {
  console.error("sync-app-config: missing", umdSrc);
  process.exit(1);
}
copyFileSync(umdSrc, umdDest);

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.listCSS = css;
/** UMD trước — React app sau (module) */
config.listSyncJS = [umdRel, ...syncJs.filter((p) => p !== umdRel)];
config.listAsyncJS = asyncJs;

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
writeFileSync(
  resolve(root, "www/app-config.json"),
  `${JSON.stringify(config, null, 2)}\n`,
);

console.log("app-config.json synced:", {
  listCSS: css,
  listAsyncJS: asyncJs,
  listSyncJS: config.listSyncJS,
});
