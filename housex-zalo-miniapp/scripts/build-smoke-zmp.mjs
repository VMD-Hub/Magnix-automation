/**
 * Smoke ZMP — không React. Deploy để biết Zalo có inject JS không.
 *
 *   npm run build:smoke-zmp
 *   zmp deploy --existing --testing   # Dist = www
 *
 * Thấy nền vàng + chữ đỏ "SMOKE OK" = Zalo load OK → lỗi ở bundle React.
 * Vẫn trắng = lỗi app-config / phiên bản / tài khoản Testing (không phải React).
 */
import {
  copyFileSync,
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
const assets = resolve(www, "assets");
const configPath = resolve(root, "app-config.json");

rmSync(www, { recursive: true, force: true });
mkdirSync(assets, { recursive: true });

const umdSrc = resolve(root, "node_modules/zmp-sdk/index.umd.js");
if (!existsSync(umdSrc)) {
  console.error("build-smoke-zmp: missing zmp-sdk — npm ci trong housex-zalo-miniapp");
  process.exit(1);
}
copyFileSync(umdSrc, resolve(assets, "zmp-sdk.umd.js"));

writeFileSync(
  resolve(assets, "hx-smoke.js"),
  `(function () {
  function go() {
    var el = document.getElementById("app");
    if (!el) {
      el = document.createElement("div");
      el.id = "app";
      (document.body || document.documentElement).appendChild(el);
    }
    el.innerHTML =
      '<div style="min-height:100vh;margin:0;padding:32px 20px;box-sizing:border-box;background:#ffe600;color:#b00020;font-family:sans-serif">' +
      '<p style="font-size:22px;font-weight:800;margin:0 0 12px">SMOKE OK</p>' +
      '<p style="font-size:15px;margin:0;color:#222">Zalo dang load JS. Neu thay man nay: app-config OK. Deploy lai bundle React.</p>' +
      "</div>";
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }
})();
`,
);

const base = JSON.parse(readFileSync(configPath, "utf8"));
const config = {
  app: base.app,
  listCSS: [],
  listSyncJS: ["assets/hx-smoke.js", "assets/zmp-sdk.umd.js"],
  listAsyncJS: [],
};

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
writeFileSync(resolve(www, "app-config.json"), `${JSON.stringify(config, null, 2)}\n`);
writeFileSync(
  resolve(www, "index.html"),
  `<!doctype html><html><body><div id="app"></div></body></html>\n`,
);

console.log("build-smoke-zmp: OK — Dist=www, roi zmp deploy --existing --testing");
console.log(JSON.stringify(config, null, 2));
