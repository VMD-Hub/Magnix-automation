import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { getCatalogSlugs } from "../lib/seed/catalog-project-slugs";
import { getDemoProjectBySlug } from "../lib/preview/demo-projects";
import { parseProjectOverview } from "../lib/content/project-landing";
import { ensureArticleCoverUrl, isSafeImageUrl } from "../lib/content/safe-image";
import { ensureNoxhLandingMedia } from "../lib/content/noxh-stock-images";
import { listDemoArticleCards } from "../lib/preview/demo-articles";
import {
  ARTICLE_EDITORIAL_COVERS,
  EDITORIAL_FIGURES,
} from "../lib/content/articles/article-editorial-media";

/**
 * Guardrail toàn cục chống lỗi "ảnh mất" tái diễn (sự cố DTA Happy Home):
 * KHÔNG cho phép bất kỳ ảnh nào hiển thị tới người dùng là hotlink bên thứ ba.
 * Chỉ chấp nhận ảnh /public local hoặc host trong allowlist (xem safe-image.ts).
 */

/** Media landing NOXH SAU khi qua ensureNoxhLandingMedia — đúng như trang render. */
function landingImageUrls(slug: string): string[] {
  const project = getDemoProjectBySlug(slug);
  if (!project) return [];
  const raw = parseProjectOverview(project.overviewData).landing;
  if (!raw) return [];
  const landing = ensureNoxhLandingMedia(raw, slug);
  const urls: string[] = [];
  if (landing.heroImage?.url) urls.push(landing.heroImage.url);
  if (landing.locationMapImage?.url) urls.push(landing.locationMapImage.url);
  for (const g of landing.gallery) urls.push(g.url);
  return urls;
}

describe("no external image hotlinks (chống ảnh mất toàn dự án)", () => {
  it("mọi landing NOXH chỉ dùng ảnh an toàn (local/stock) sau khi render", () => {
    for (const slug of getCatalogSlugs("NHA_O_XA_HOI")) {
      for (const url of landingImageUrls(slug)) {
        assert.ok(
          isSafeImageUrl(url),
          `landing NOXH "${slug}" còn hotlink external: ${url}`,
        );
      }
    }
  });

  it("ảnh landing NOXH local phải tồn tại trong public/", () => {
    for (const slug of getCatalogSlugs("NHA_O_XA_HOI")) {
      for (const url of landingImageUrls(slug)) {
        if (url.startsWith("/")) {
          const filePath = path.join(process.cwd(), "public", url);
          assert.ok(existsSync(filePath), `thiếu file ảnh: ${url} (${slug})`);
        }
      }
    }
  });

  it("nguồn ảnh bìa editorial đã sạch (local/stock) — OG & metadata không lộ hotlink", () => {
    for (const [slug, cover] of Object.entries(ARTICLE_EDITORIAL_COVERS)) {
      assert.ok(
        isSafeImageUrl(cover.url),
        `cover editorial "${slug}" còn external: ${cover.url}`,
      );
    }
  });

  it("ảnh bìa mọi bài viết demo — sau chuẩn hóa hiển thị — đều an toàn", () => {
    const cards = listDemoArticleCards({ page: 1, pageSize: 500 }).items;
    assert.ok(cards.length > 0);
    for (const card of cards) {
      const safe = ensureArticleCoverUrl(card.coverImageUrl);
      assert.ok(
        safe == null || isSafeImageUrl(safe),
        `card "${card.slug}" cover không an toàn: ${card.coverImageUrl}`,
      );
    }
  });

  it("ảnh minh hoạ trong thân bài (EDITORIAL_FIGURES) không hotlink external", () => {
    for (const [key, md] of Object.entries(EDITORIAL_FIGURES)) {
      assert.doesNotMatch(
        md as string,
        /\(https?:\/\//i,
        `figure "${key}" còn ảnh hotlink external trong markdown`,
      );
    }
  });
});
