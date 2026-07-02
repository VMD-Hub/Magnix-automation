import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildCloverMarkSvg } from "../lib/brand/clover-mark-svg";

/**
 * Xuất SVG cỏ bốn lá độc lập (banner / marketing) — không còn dùng làm favicon.
 * Favicon: `npm run brand:sync-favicon`
 */
const out = process.argv[2] ?? join(process.cwd(), "public/clover-mark.svg");

writeFileSync(
  out,
  buildCloverMarkSvg({ withBackground: true, idPrefix: "housex-clover" }),
);

console.log(`Clover mark SVG written to ${out}`);
