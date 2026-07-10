import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEAD_SOURCE,
  isFanpageUtm,
  isZaloAdsUtm,
  magnixInboundSource,
  resolveLeadSource,
} from "../lib/leads/source.ts";
import {
  normalizeLeadUtm,
  parseLeadUtmFromRecord,
  parseLeadUtmFromSearchParams,
} from "../lib/leads/utm.ts";

describe("lead-utm", () => {
  it("parses UTM from search params", () => {
    const utm = parseLeadUtmFromSearchParams(
      new URLSearchParams(
        "utm_source=zalo&utm_medium=cpc&utm_campaign=noxh_q3",
      ),
    );
    assert.deepEqual(utm, {
      utm_source: "zalo",
      utm_medium: "cpc",
      utm_campaign: "noxh_q3",
    });
  });

  it("normalizes source/medium to lowercase", () => {
    const utm = normalizeLeadUtm({
      utm_source: " Zalo ",
      utm_medium: "CPC",
      utm_campaign: "Campaign-A",
    });
    assert.equal(utm.utm_source, "zalo");
    assert.equal(utm.utm_medium, "cpc");
    assert.equal(utm.utm_campaign, "Campaign-A");
  });

  it("parses flat record fields", () => {
    const utm = parseLeadUtmFromRecord({
      utm_source: "facebook",
      utm_medium: "social",
    });
    assert.equal(utm?.utm_source, "facebook");
    assert.equal(utm?.utm_medium, "social");
  });
});

describe("lead-source", () => {
  it("detects Zalo Ads UTM", () => {
    assert.equal(
      isZaloAdsUtm({ utm_source: "zalo", utm_medium: "cpc" }),
      true,
    );
    assert.equal(isZaloAdsUtm({ utm_source: "zalo" }), true);
    assert.equal(
      isZaloAdsUtm({ utm_source: "campaign_lane", utm_medium: "noxh" }),
      false,
    );
  });

  it("detects fanpage UTM", () => {
    assert.equal(
      isFanpageUtm({ utm_source: "facebook", utm_medium: "social" }),
      true,
    );
  });

  it("maps Zalo Ads UTM to zalo_ads on web channel", () => {
    const resolved = resolveLeadSource({
      channel: "web",
      utm: { utm_source: "zalo", utm_medium: "cpc", utm_campaign: "noxh" },
      referralAssigned: false,
    });
    assert.equal(resolved.source, LEAD_SOURCE.ZALO_ADS);
    assert.equal(resolved.sourceMeta?.utm?.utm_campaign, "noxh");
    assert.equal(resolved.sourceMeta?.channel, "web");
  });

  it("maps miniapp without UTM to miniapp:consult", () => {
    const resolved = resolveLeadSource({
      channel: "miniapp",
      bodySource: "zalo_miniapp",
      referralAssigned: false,
    });
    assert.equal(resolved.source, LEAD_SOURCE.MINIAPP_CONSULT);
    assert.equal(resolved.sourceMeta?.rawSource, "zalo_miniapp");
  });

  it("Zalo Ads UTM overrides miniapp body source", () => {
    const resolved = resolveLeadSource({
      channel: "miniapp",
      bodySource: "zalo_miniapp",
      utm: { utm_source: "zalo", utm_medium: "cpc" },
      referralAssigned: false,
    });
    assert.equal(resolved.source, LEAD_SOURCE.ZALO_ADS);
  });

  it("defaults web form to web:lead", () => {
    const resolved = resolveLeadSource({
      channel: "web",
      referralAssigned: false,
    });
    assert.equal(resolved.source, LEAD_SOURCE.WEB_LEAD);
  });

  it("maps legacy organic to web:lead", () => {
    const resolved = resolveLeadSource({
      channel: "web",
      bodySource: "organic",
      referralAssigned: false,
    });
    assert.equal(resolved.source, LEAD_SOURCE.WEB_LEAD);
  });

  it("referral wins over UTM", () => {
    const resolved = resolveLeadSource({
      channel: "web",
      utm: { utm_source: "zalo", utm_medium: "cpc" },
      referralAssigned: true,
    });
    assert.equal(resolved.source, LEAD_SOURCE.REFERRAL);
    assert.equal(resolved.sourceMeta?.utm?.utm_source, "zalo");
  });

  it("builds magnix inbound source slug", () => {
    assert.equal(magnixInboundSource("TikTok Live"), "magnix:tiktok_live");
  });
});
