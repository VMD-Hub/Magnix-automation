import { test } from "node:test";
import assert from "node:assert/strict";
import {
  defaultProjectLanding,
  parseProjectOverview,
  projectLandingSchema,
  buildOverviewData,
  resolveLandingHeroImage,
} from "../lib/content/project-landing";
import {
  PROJECT_LANDING_GUIDES,
  PROJECT_LANDING_IMAGE,
} from "../lib/content/project-landing-guidelines";

test("defaultProjectLanding has version 1 and FAQ blocks", () => {
  const landing = defaultProjectLanding("Test Tower");
  assert.equal(landing.version, 1);
  assert.ok(landing.highlights.length >= 3);
  assert.ok(landing.faqs.length >= 2);
  assert.equal(landing.faqs[0].q.includes("Test Tower"), true);
});

test("projectLandingSchema validates gallery URLs", () => {
  const landing = defaultProjectLanding("X");
  landing.gallery = [{ url: "https://example.com/a.jpg", caption: "View" }];
  const parsed = projectLandingSchema.safeParse(landing);
  assert.equal(parsed.success, true);
});

test("parseProjectOverview extracts landing from overviewData", () => {
  const landing = defaultProjectLanding("Riverside");
  const raw = buildOverviewData(null, {
    totalUnits: 1200,
    blocks: 4,
    landing,
  });
  const overview = parseProjectOverview(raw);
  assert.equal(overview.totalUnits, 1200);
  assert.equal(overview.blocks, 4);
  assert.equal(overview.landing?.heroSubtitle, landing.heroSubtitle);
});

test("parseProjectOverview returns empty on invalid JSON", () => {
  assert.deepEqual(parseProjectOverview(null), {});
  assert.deepEqual(parseProjectOverview([]), {});
});

test("projectLandingSchema validates hero banner image", () => {
  const landing = defaultProjectLanding("X");
  landing.heroImage = {
    url: "https://example.com/banner.jpg",
    alt: "Banner X",
  };
  const parsed = projectLandingSchema.safeParse(landing);
  assert.equal(parsed.success, true);
});

test("resolveLandingHeroImage prefers heroImage over gallery", () => {
  const landing = defaultProjectLanding("X");
  landing.heroImage = {
    url: "https://example.com/banner.jpg",
    alt: "Banner",
  };
  landing.gallery = [{ url: "https://example.com/gallery.jpg" }];
  const hero = resolveLandingHeroImage(landing, "X");
  assert.equal(hero?.url, "https://example.com/banner.jpg");
});

test("projectLandingSchema validates location map image", () => {
  const landing = defaultProjectLanding("X");
  landing.locationMapImage = {
    url: "https://example.com/map.jpg",
    alt: "Bản đồ vị trí X",
    caption: "Bán kính 5 km",
  };
  const parsed = projectLandingSchema.safeParse(landing);
  assert.equal(parsed.success, true);
});

test("projectLandingSchema validates introVideo YouTube Shorts", () => {
  const landing = defaultProjectLanding("X");
  landing.introVideo = {
    url: "https://www.youtube.com/shorts/t8Lx4NTnHos",
    title: "Review",
    caption: "Celebrity review",
  };
  const parsed = projectLandingSchema.safeParse(landing);
  assert.equal(parsed.success, true);
  assert.equal(
    parsed.success && parsed.data.introVideo?.url,
    "https://www.youtube.com/shorts/t8Lx4NTnHos",
  );
});

test("projectLandingSchema validates developerProfile", () => {
  const landing = defaultProjectLanding("X");
  landing.developerProfile = {
    title: "Chủ đầu tư là ai?",
    summary: "Công ty đại chúng niêm yết HOSE.",
    facts: [{ label: "Mã số thuế", value: "0303118498" }],
    note: "Lưu ý CBTT.",
    sourceUrl: "https://finance.vietstock.vn/DTA/profile.htm",
  };
  const parsed = projectLandingSchema.safeParse(landing);
  assert.equal(parsed.success, true);
});

test("project landing guidelines cover all form sections", () => {
  const ids = [
    "basic",
    "seo",
    "stats",
    "highlights",
    "amenities",
    "location",
    "faqs",
    "gallery",
    "cta",
  ] as const;
  for (const id of ids) {
    assert.ok(PROJECT_LANDING_GUIDES[id]?.tips.length > 0);
  }
  assert.equal(PROJECT_LANDING_IMAGE.galleryAspect, "16:9");
  assert.ok(PROJECT_LANDING_GUIDES.gallery.imageSpec);
});
