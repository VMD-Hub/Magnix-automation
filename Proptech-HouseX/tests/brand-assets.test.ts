import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { BRAND_ASSETS } from "../lib/brand/assets";

test("brand assets: PNG clover tồn tại trong public/brand", () => {
  const root = join(process.cwd(), "public");

  for (const asset of Object.values(BRAND_ASSETS.clover)) {
    assert.ok(asset.path.startsWith("/brand/"));
    const file = join(root, asset.path.replace(/^\//, ""));
    assert.ok(existsSync(file), `missing ${file}`);
  }
});
