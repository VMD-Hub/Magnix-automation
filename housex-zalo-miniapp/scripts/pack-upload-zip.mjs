/**
 * Đóng gói www → housex-miniapp-upload.zip (upload console developers.zalo.me).
 * Chạy sau npm run build:zmp.
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const www = resolve(root, "www");
const out = resolve(root, "housex-miniapp-upload.zip");

if (!existsSync(resolve(www, "app-config.json"))) {
  console.error(
    "pack-upload-zip: thiếu www/app-config.json — chạy npm run build:zmp trước",
  );
  process.exit(1);
}

if (process.platform === "win32") {
  const ps = `
    $out = '${out.replace(/'/g, "''")}'
    $www = '${www.replace(/'/g, "''")}'
    if (Test-Path $out) { Remove-Item $out -Force }
    Compress-Archive -Path (Join-Path $www '*') -DestinationPath $out -Force
  `;
  execFileSync("powershell.exe", ["-NoProfile", "-Command", ps], {
    stdio: "inherit",
  });
} else {
  execFileSync(
    "bash",
    [
      "-lc",
      `rm -f "${out}" && cd "${www}" && zip -r "${out}" . -x 'mock-agent.html'`,
    ],
    { stdio: "inherit" },
  );
}

console.log("pack-upload-zip: OK", out);
