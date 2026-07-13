/**
 * Đọc www/index.html sau build → cập nhật listCSS / listAsyncJS trong app-config.json.
 * ZMP CLI cần đường dẫn tương đối từ thư mục www (không có leading slash).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
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

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.listCSS = css;
config.listAsyncJS = asyncJs;
config.listSyncJS = syncJs;

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log("app-config.json synced:", { listCSS: css, listAsyncJS: asyncJs, listSyncJS: syncJs });
