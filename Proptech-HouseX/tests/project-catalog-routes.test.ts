import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COMMERCIAL_CATALOG_PATH,
  NOXH_CATALOG_PATH,
  projectCatalogCanonicalUrl,
  projectCatalogPageHref,
  projectCatalogPathForType,
  projectCatalogTypeFromLegacyQuery,
  projectCatalogTypeFromSegmentSlug,
} from "../lib/content/project-catalog-paths";

describe("project catalog SEO routes", () => {
  it("maps legacy query values to path hubs", () => {
    assert.equal(
      projectCatalogPathForType("NHA_O_XA_HOI"),
      NOXH_CATALOG_PATH,
    );
    assert.equal(
      projectCatalogPathForType("THUONG_MAI"),
      COMMERCIAL_CATALOG_PATH,
    );
    assert.equal(
      projectCatalogTypeFromLegacyQuery("NHA_O_XA_HOI"),
      "NHA_O_XA_HOI",
    );
    assert.equal(projectCatalogTypeFromLegacyQuery("invalid"), undefined);
  });

  it("builds pagination hrefs on path URLs", () => {
    assert.equal(projectCatalogPageHref("NHA_O_XA_HOI", 1), NOXH_CATALOG_PATH);
    assert.equal(
      projectCatalogPageHref("NHA_O_XA_HOI", 2),
      `${NOXH_CATALOG_PATH}?page=2`,
    );
    assert.equal(projectCatalogPageHref(undefined, 1), "/du-an");
    assert.equal(
      projectCatalogPageHref("THUONG_MAI", 3),
      `${COMMERCIAL_CATALOG_PATH}?page=3`,
    );
  });

  it("sets canonical URLs for catalog hubs", () => {
    assert.equal(
      projectCatalogCanonicalUrl("NHA_O_XA_HOI", 1, "https://timnhaxahoi.com"),
      "https://timnhaxahoi.com/du-an/nha-o-xa-hoi",
    );
    assert.equal(
      projectCatalogCanonicalUrl("THUONG_MAI", 2, "https://timnhaxahoi.com"),
      "https://timnhaxahoi.com/du-an/thuong-mai?page=2",
    );
  });

  it("reserves catalog segment slugs", () => {
    assert.equal(
      projectCatalogTypeFromSegmentSlug("nha-o-xa-hoi"),
      "NHA_O_XA_HOI",
    );
    assert.equal(
      projectCatalogTypeFromSegmentSlug("thuong-mai"),
      "THUONG_MAI",
    );
    assert.equal(projectCatalogTypeFromSegmentSlug("dragon-e-home"), undefined);
  });
});
