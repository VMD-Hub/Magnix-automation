/**
 * Đọc www/index.html sau build → cập nhật listCSS / listSyncJS / listAsyncJS.
 * Copy zmp-sdk UMD + boot shim vào www.
 *
 * Pattern đã chạy thật (housex-miniapp-upload.zip 18/07):
 *   listSyncJS  = [zmp-sdk.umd.js]
 *   listAsyncJS = [index-*.js]   ← React entry (Vite module)
 * Đưa React vào listSyncJS từng làm trắng màn trên ZMP 4.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
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
const umdDest = resolve(root, "www", umdRel);
if (!existsSync(umdSrc)) {
  console.error("sync-app-config: missing", umdSrc);
  process.exit(1);
}
copyFileSync(umdSrc, umdDest);

/** Boot sau DOM — tạo #app nếu thiếu, paint loading, bắt lỗi JS. */
const bootRel = "assets/hx-boot.js";
writeFileSync(
  resolve(root, "www", bootRel),
  `(function () {
  function paint() {
    try {
      var el = document.getElementById("app");
      if (!el) {
        el = document.createElement("div");
        el.id = "app";
        (document.body || document.documentElement).appendChild(el);
      }
      if (!el.dataset.hxBoot) {
        el.dataset.hxBoot = "1";
        el.innerHTML =
          '<p style="margin:0;padding:24px;font-family:sans-serif;color:#2d2d2d;font-size:15px">House X dang mo...</p>';
      }
      window.addEventListener("error", function (e) {
        var msg =
          (e && (e.message || (e.error && e.error.message))) || "JS error";
        el.innerHTML =
          '<div style="padding:24px;font-family:sans-serif"><b>House X - JS error</b><p style="color:#9b111e;font-size:13px;word-break:break-word">' +
          String(msg).replace(/</g, "&lt;") +
          "</p></div>";
      });
      window.addEventListener("unhandledrejection", function (e) {
        var r = e && e.reason;
        var msg = r && r.message ? r.message : String(r || "Promise rejection");
        el.innerHTML =
          '<div style="padding:24px;font-family:sans-serif"><b>House X - error</b><p style="color:#9b111e;font-size:13px;word-break:break-word">' +
          String(msg).replace(/</g, "&lt;") +
          "</p></div>";
      });
    } catch (_) {}
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paint);
  } else {
    paint();
  }
})();
`,
);

const appEntries = [...moduleJs, ...classicJs].filter(
  (p) => p !== umdRel && p !== bootRel,
);

for (const rel of appEntries) {
  const abs = resolve(root, "www", rel);
  if (!existsSync(abs)) {
    console.error("sync-app-config: missing", rel);
    process.exit(1);
  }
  const body = readFileSync(abs, "utf8");
  const siblingImport = body.match(
    /\bfrom\s*["']\.\/([^"']+\.js)["']|import\s*\(\s*["']\.\/([^"']+\.js)["']\s*\)/,
  );
  if (siblingImport) {
    const name = siblingImport[1] || siblingImport[2];
    console.error(
      "sync-app-config: FAIL — entry còn import chunk phụ (Zalo trắng màn):",
      `./${name}`,
    );
    process.exit(1);
  }
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
config.listCSS = css;
/** boot + SDK sync; React async — khớp ZIP đã chạy trên Zalo. */
config.listSyncJS = [bootRel, umdRel];
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
