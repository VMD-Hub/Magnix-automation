import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDtaConnectivityMarkdown,
  dtaConnectivityWithinKm,
  pickConnectivityLead,
  resolveDtaConnectivity,
} from "../lib/content/dta-happy-home-connectivity";
import { buildDtaUnitListingCopy } from "../lib/content/dta-happy-home-listing-copy";
import { DTA_HAPPY_HOME_INVENTORY_A10 } from "../lib/content/dta-happy-home-inventory-a10";

describe("DTA Happy Home connectivity", () => {
  it("resolves distances and prioritizes CĐT travel minutes in seo lines", () => {
    const nodes = resolveDtaConnectivity();
    assert.ok(nodes.length >= 6);
    const caoToc = nodes.find((n) => n.id === "cao-toc-bien-hoa-vung-tau");
    assert.ok(caoToc);
    assert.ok(caoToc!.distanceKm <= 5);
    assert.match(caoToc!.seoLine, /10 phút/);
    assert.match(caoToc!.seoLine, /Cao tốc Biên Hòa/);
  });

  it("lists operational nodes within 5 km for map-radius copy", () => {
    const within5 = dtaConnectivityWithinKm(5);
    assert.ok(within5.length >= 3);
    assert.ok(
      within5.every((n) => n.distanceKm <= 5),
      "all nodes should be within radius",
    );
  });

  it("connectivity markdown includes Vành đai 3 and disclaimer", () => {
    const md = buildDtaConnectivityMarkdown();
    assert.match(md, /Vành đai 3/);
    assert.match(md, /bán kính ~5 km/);
    assert.match(md, /tham khảo bản đồ/);
  });

  it("listing copy weaves highway hooks and connectivity section", () => {
    const highwayPattern =
      /Vành đai 3|cao tốc|Quốc lộ 51|25B|25C|Long Thành|liên vùng|kết nối/i;
    const titles = DTA_HAPPY_HOME_INVENTORY_A10.map((u, i) =>
      buildDtaUnitListingCopy(u, i).title,
    );
    assert.ok(
      titles.filter((t) => highwayPattern.test(t)).length >= 6,
      "expected multiple highway-themed titles",
    );

    const copy = buildDtaUnitListingCopy(DTA_HAPPY_HOME_INVENTORY_A10[6]!, 6);
    assert.match(copy.title, /cao tốc|10 phút/i);
    assert.match(copy.description, /## Kết nối giao thông/);
    assert.match(copy.description, /Vành đai 3/);
    assert.match(copy.seoDescription, /NOXH Happy Home/);

    assert.ok(pickConnectivityLead(0).length > 10);
  });
});
