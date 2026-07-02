import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  CHROME_X_ARMS,
  CHROME_X_STROKE,
  HOUSEX_MARK_VIEWBOX,
} from "../lib/brand/housex-mark.config";
import { buildHouseXMarkSvg } from "../lib/brand/housex-mark-svg";

test("housex mark: giữ viewBox và geometry chrome X cố định", () => {
  assert.equal(HOUSEX_MARK_VIEWBOX, "0 0 48 48");
  assert.equal(CHROME_X_ARMS.length, 2);
  assert.equal(CHROME_X_ARMS[0].x1, 11);
  assert.equal(CHROME_X_STROKE, 7.2);
});

test("housex mark: favicon SVG cùng chrome X với config", () => {
  const iconSvg = readFileSync(join(process.cwd(), "app/icon.svg"), "utf8");
  const generated = buildHouseXMarkSvg({
    withCard: true,
    idPrefix: "housex-favicon",
  });

  assert.match(iconSvg, /x1="11"/);
  assert.match(iconSvg, /stroke-width="7\.2"/);
  assert.match(iconSvg, /fill="url\(#housex-favicon-silver\)"/);
  assert.match(iconSvg, /fill="url\(#housex-favicon-gold-x\)"/);
  assert.match(generated, /stroke-width="7\.2"/);
  assert.doesNotMatch(iconSvg, /M14 24 L24 14|CLOVER_HEART_LEAF/);
});
