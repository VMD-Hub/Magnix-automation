import assert from "node:assert/strict";
import test from "node:test";
import {
  CLOVER_HEART_LEAF,
  CLOVER_STEM,
  CLOVER_STROKE_WIDTH,
} from "../lib/brand/clover-mark.config";
import { buildCloverMarkSvg } from "../lib/brand/clover-mark-svg";

test("clover mark: SVG builder cùng path và strokeWidth body với config", () => {
  const generated = buildCloverMarkSvg({
    withBackground: true,
    idPrefix: "housex-clover",
  });

  assert.match(
    generated,
    new RegExp(CLOVER_HEART_LEAF.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  assert.match(
    generated,
    new RegExp(CLOVER_STEM.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  assert.match(generated, new RegExp(`stroke-width="${CLOVER_STROKE_WIDTH}"`));
  assert.match(generated, /gold-body/);
  assert.match(generated, /gold-highlight/);
  assert.match(generated, /feDropShadow/);
});
