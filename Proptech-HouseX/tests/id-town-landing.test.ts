import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildIdTownLanding,
  ID_TOWN_SLUG,
} from "../lib/content/id-town-landing";
import { ID_TOWN_IMAGES } from "../lib/content/id-town-images";
import { buildIdTownMock } from "../lib/preview/id-town-mock";
import { isSafeImageUrl } from "../lib/content/safe-image";

describe("ID Town Long Thành landing", () => {
  it("uses stable slug and NOXH project type", () => {
    const project = buildIdTownMock();
    assert.equal(project.slug, ID_TOWN_SLUG);
    assert.equal(project.projectType, "NHA_O_XA_HOI");
    assert.equal(project.province, "TP. Đồng Nai");
    assert.equal(project.district, "Long Thành");
  });

  it("landing media is local /public (safe)", () => {
    const landing = buildIdTownLanding();
    assert.ok(landing.heroImage?.url.startsWith("/images/projects/id-town/"));
    assert.ok(isSafeImageUrl(landing.heroImage?.url));
    assert.ok(isSafeImageUrl(landing.locationMapImage?.url));
    assert.ok(landing.gallery.length >= 6);
    assert.ok(landing.gallery.every((g) => isSafeImageUrl(g.url)));
    assert.equal(
      ID_TOWN_IMAGES.developerLogo,
      "/images/projects/id-town/logo.png",
    );
  });

  it("has Q&A FAQ and CTA to /lien-he", () => {
    const landing = buildIdTownLanding();
    assert.ok(landing.faqs.length >= 5);
    assert.ok(landing.faqs.every((f) => f.q.includes("?") || f.q.length > 10));
    assert.equal(landing.ctaHref, "/lien-he");
  });
});
