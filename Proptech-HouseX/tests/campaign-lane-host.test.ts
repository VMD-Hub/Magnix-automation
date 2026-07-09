import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildCampaignLaneRedirectUrl,
  resolveCampaignLanePath,
} from "../lib/miniapp/campaign-lane-host";

test("resolveCampaignLanePath — host campaign mặc định", () => {
  assert.equal(
    resolveCampaignLanePath("noxh.timnhaxahoi.com"),
    "/du-an/nha-o-xa-hoi",
  );
  assert.equal(
    resolveCampaignLanePath("cctm.timnhaxahoi.com:443"),
    "/du-an/thuong-mai",
  );
  assert.equal(resolveCampaignLanePath("timnhaxahoi.com"), null);
});

test("buildCampaignLaneRedirectUrl — utm + canonical site", () => {
  const url = buildCampaignLaneRedirectUrl(
    "noxh.timnhaxahoi.com",
    "https://timnhaxahoi.com",
  );
  assert.ok(url);
  assert.equal(url!.pathname, "/du-an/nha-o-xa-hoi");
  assert.equal(url!.searchParams.get("utm_source"), "campaign_lane");
  assert.equal(url!.searchParams.get("utm_medium"), "noxh");
});

test("CAMPAIGN_LANE_HOSTS env override", () => {
  const prev = process.env.CAMPAIGN_LANE_HOSTS;
  process.env.CAMPAIGN_LANE_HOSTS =
    "promo.example.com=/du-an/thuong-mai";
  assert.equal(
    resolveCampaignLanePath("promo.example.com"),
    "/du-an/thuong-mai",
  );
  if (prev === undefined) delete process.env.CAMPAIGN_LANE_HOSTS;
  else process.env.CAMPAIGN_LANE_HOSTS = prev;
});
