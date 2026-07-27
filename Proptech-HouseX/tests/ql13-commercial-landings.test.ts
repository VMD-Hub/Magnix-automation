import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ASTRAL_CITY_SLUG,
  AT_SKY_GARDEN_SLUG,
  buildAstralCityMock,
  buildAtSkyGardenMock,
  buildEmerald68Mock,
  buildEmeraldBoulevardMock,
  EMERALD_68_SLUG,
  EMERALD_BOULEVARD_SLUG,
  QL13_COMMERCIAL_SLUGS,
} from "@/lib/preview/ql13-commercial-mocks";
import { getDemoProjectBySlug } from "@/lib/preview/demo-projects";
import { isCatalogProjectSlug } from "@/lib/seed/catalog-project-slugs";
import { COMMERCIAL_LANDING_SLUGS } from "@/lib/seed/commercial-landings";

describe("QL13 commercial landings", () => {
  it("registers 4 catalog commercial slugs", () => {
    assert.equal(QL13_COMMERCIAL_SLUGS.length, 4);
    for (const slug of QL13_COMMERCIAL_SLUGS) {
      assert.ok(COMMERCIAL_LANDING_SLUGS.includes(slug as never));
      assert.ok(isCatalogProjectSlug(slug));
      assert.ok(getDemoProjectBySlug(slug));
    }
  });

  it("Emerald 68 / A&T / Astral are DANG_BAN; Boulevard is SAP_MO_BAN", () => {
    assert.equal(buildEmerald68Mock().status, "DANG_BAN");
    assert.equal(buildAtSkyGardenMock().status, "DANG_BAN");
    assert.equal(buildAstralCityMock().status, "DANG_BAN");
    assert.equal(buildEmeraldBoulevardMock().status, "SAP_MO_BAN");
    assert.equal(buildEmerald68Mock().slug, EMERALD_68_SLUG);
    assert.equal(buildAtSkyGardenMock().slug, AT_SKY_GARDEN_SLUG);
    assert.equal(buildAstralCityMock().slug, ASTRAL_CITY_SLUG);
    assert.equal(buildEmeraldBoulevardMock().slug, EMERALD_BOULEVARD_SLUG);
  });

  it("landings use /lien-he CTA not NOXH-only wording", () => {
    const overview = buildEmerald68Mock().overviewData as {
      landing?: { ctaHref?: string; ctaLabel?: string };
    };
    assert.equal(overview.landing?.ctaHref, "/lien-he");
    assert.match(overview.landing?.ctaLabel ?? "", /bảng giá|tư vấn/i);
  });
});
