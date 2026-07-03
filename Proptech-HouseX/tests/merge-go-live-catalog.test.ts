import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergeMissingGoLiveCommercialCards } from "../lib/data/merge-go-live-project-cards";
import { GO_LIVE_LANDING_SLUGS } from "../lib/seed/go-live-landing-slugs";
import { SOLENA_GREEN_TOWN_SLUG } from "../lib/content/solena-green-town-slug";
import { listCatalogProjectCards } from "../lib/preview/demo-projects";

describe("merge go-live commercial catalog", () => {
  it("fills Solena when DB list has only 7 Vinhomes + commercial slugs", () => {
    const dbSeven = listCatalogProjectCards({ projectType: "THUONG_MAI" }).filter(
      (c) => c.slug !== SOLENA_GREEN_TOWN_SLUG,
    );
    assert.equal(dbSeven.length, GO_LIVE_LANDING_SLUGS.length - 1);

    const merged = mergeMissingGoLiveCommercialCards(dbSeven);
    assert.equal(merged.length, GO_LIVE_LANDING_SLUGS.length);
    assert.ok(merged.some((c) => c.slug === SOLENA_GREEN_TOWN_SLUG));
  });

  it("never drops go-live slugs when merging", () => {
    const merged = mergeMissingGoLiveCommercialCards([]);
    assert.equal(merged.length, GO_LIVE_LANDING_SLUGS.length);
    for (const slug of GO_LIVE_LANDING_SLUGS) {
      assert.ok(merged.some((c) => c.slug === slug), `missing ${slug}`);
    }
  });
});
