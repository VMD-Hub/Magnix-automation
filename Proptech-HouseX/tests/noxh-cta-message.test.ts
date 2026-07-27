import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultProjectLanding } from "../lib/content/project-landing.ts";
import {
  attachHousexNoxhServices,
  HOUSEX_NOXH_CTA,
  HOUSEX_NOXH_CTA_MESSAGE,
} from "../lib/content/noxh-editorial.ts";

describe("NOXH CTA message", () => {
  it("uses miễn phí label and Đăng ký ngay message", () => {
    assert.ok(HOUSEX_NOXH_CTA.label.includes("miễn phí"));
    assert.ok(HOUSEX_NOXH_CTA_MESSAGE.includes("Đăng ký ngay"));
  });

  it("attachHousexNoxhServices sets standard subtext", () => {
    const landing = defaultProjectLanding("Test NOXH");
    attachHousexNoxhServices(landing);
    assert.equal(landing.ctaSubtext, HOUSEX_NOXH_CTA_MESSAGE);
  });
});
