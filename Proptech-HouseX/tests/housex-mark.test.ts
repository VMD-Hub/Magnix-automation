import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  CHROME_X_ARMS,
  CHROME_X_STROKE,
  HOUSEX_MARK_VIEWBOX,
} from "../lib/brand/housex-mark.config";
import { buildHouseXMarkSvg } from "../lib/brand/housex-mark-svg";
import {
  HOUSEX_FOOTER_TAGLINE,
  HOUSEX_MARK_ONLY_SRC,
  HOUSEX_OA_AVATAR_SRC,
} from "../lib/brand/housex-logo-assets";

test("housex mark: giữ viewBox và geometry chrome X cố định (SVG legacy / UI)", () => {
  assert.equal(HOUSEX_MARK_VIEWBOX, "0 0 48 48");
  assert.equal(CHROME_X_ARMS.length, 2);
  assert.equal(CHROME_X_ARMS[0].x1, 11);
  assert.equal(CHROME_X_STROKE, 7.2);
});

test("housex mark: buildHouseXMarkSvg vẫn xuất chrome X (UI fallback)", () => {
  const generated = buildHouseXMarkSvg({
    withCard: true,
    idPrefix: "housex-favicon",
  });
  assert.match(generated, /stroke-width="7\.2"/);
  assert.match(generated, /x1="11"/);
  assert.doesNotMatch(generated, /M14 24 L24 14|CLOVER_HEART_LEAF/);
});

test("housex brand: favicon PNG + OA avatar từ mark-only đã duyệt", () => {
  assert.equal(HOUSEX_FOOTER_TAGLINE, "Smart Tools · Trusted Utility");
  assert.ok(existsSync(join(process.cwd(), "app/icon.png")));
  assert.ok(existsSync(join(process.cwd(), "app/apple-icon.png")));
  assert.ok(
    existsSync(join(process.cwd(), "public", HOUSEX_OA_AVATAR_SRC.replace(/^\//, ""))),
  );
  assert.ok(
    existsSync(join(process.cwd(), "public", HOUSEX_MARK_ONLY_SRC.replace(/^\//, ""))),
  );
  // Legacy SVG archived — không còn là favicon runtime
  assert.equal(existsSync(join(process.cwd(), "app/icon.svg")), false);
  const legacy = join(
    process.cwd(),
    "public/brand/source/housex-favicon-legacy.svg",
  );
  if (existsSync(legacy)) {
    const svg = readFileSync(legacy, "utf8");
    assert.match(svg, /stroke-width="7\.2"/);
  }
});
