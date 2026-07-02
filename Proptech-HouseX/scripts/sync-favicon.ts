import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildHouseXMarkSvg } from "../lib/brand/housex-mark-svg";

/** Đồng bộ app/icon.svg từ housex-mark.config — chạy sau khi sửa geometry. */
writeFileSync(
  join(process.cwd(), "app/icon.svg"),
  buildHouseXMarkSvg({ withCard: true, idPrefix: "housex-favicon" }),
);

console.log("app/icon.svg synced from housex-mark.config (Iteration 6 — Housex.vn chrome X)");
