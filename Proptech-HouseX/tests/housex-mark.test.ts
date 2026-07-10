import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  CHROME_X_ARMS,
  CHROME_X_STROKE,
  HOUSEX_MARK_VIEWBOX,
} from "../lib/brand/housex-mark.config";
import { faviconCornerRadius } from "../lib/brand/favicon-image";
import { buildHouseXMarkSvg } from "../lib/brand/housex-mark-svg";
import { HOUSEX_FOOTER_TAGLINE } from "../lib/brand/housex-logo-assets";

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

test("favicon: bo góc theo tỷ lệ ~22%", () => {
  assert.equal(faviconCornerRadius(512), 113);
  assert.equal(faviconCornerRadius(32), 7);
  assert.equal(faviconCornerRadius(16), 4);
});

test("housex brand: favicon PNG + OA avatar từ mark-only đã duyệt", () => {
  assert.equal(HOUSEX_FOOTER_TAGLINE, "Smart Tools · Trusted Utility");
  assert.ok(existsSync(join(process.cwd(), "app/icon.png")));
  assert.ok(existsSync(join(process.cwd(), "app/apple-icon.png")));
  assert.ok(existsSync(join(process.cwd(), "app/favicon.ico")));
  assert.ok(existsSync(join(process.cwd(), "public/favicon.ico")));
  assert.equal(existsSync(join(process.cwd(), "app/icon.svg")), false);
});
