import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  orderProjectRelatedArticles,
  projectRelatedArticlesViewMoreHref,
} from "@/lib/content/project-related-articles";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { LTK_PROJECT_SLUG } from "@/lib/preview/phu-tho-dmc-mock";

describe("project related articles", () => {
  it("LTK landing has trend articles in featured order", () => {
    const articles = getDemoArticlesForProject(LTK_PROJECT_SLUG, 6);
    assert.ok(articles.length >= 3);
    const ordered = orderProjectRelatedArticles(LTK_PROJECT_SLUG, articles, 6);
    assert.equal(
      ordered[0]?.slug,
      "tp-hcm-cong-bo-gia-2-du-an-noxh-ly-thuong-kiet-phu-tho-dmc",
    );
    assert.equal(
      ordered[1]?.slug,
      "gia-nha-o-xa-hoi-ly-thuong-kiet-cong-bo-6-2026",
    );
  });

  it("DTA landing surfaces TOD and NOXH trend articles", () => {
    const articles = getDemoArticlesForProject(DTA_HAPPY_HOME_SLUG, 10);
    assert.ok(articles.length >= 7);
    const ordered = orderProjectRelatedArticles(
      DTA_HAPPY_HOME_SLUG,
      articles,
      10,
    );
    assert.equal(
      ordered[0]?.slug,
      "nhon-trach-cu-tang-truong-ha-tang-tod-2026",
    );
    assert.equal(
      ordered[1]?.slug,
      "metro-thu-thiem-long-thanh-175000-ty-khoi-cong-2026",
    );
    assert.ok(
      ordered.some(
        (a) => a.slug === "so-sanh-gia-noxh-ly-thuong-kiet-dta-happy-home-2026",
      ),
    );
  });

  it("view-more links to project tag hub", () => {
    assert.equal(
      projectRelatedArticlesViewMoreHref(LTK_PROJECT_SLUG),
      "/tin-tuc/chu-de/nha-o-xa-hoi-ly-thuong-kiet",
    );
    assert.equal(
      projectRelatedArticlesViewMoreHref(DTA_HAPPY_HOME_SLUG),
      "/tin-tuc/chu-de/dta-happy-home-nhon-trach",
    );
  });
});
