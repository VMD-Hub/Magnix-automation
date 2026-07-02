import { applyEditorialMedia, absoluteArticleImageUrl } from "@/lib/content/articles/article-editorial-media";
import type { ArticleDetail } from "@/lib/data/article-types";

import { getSiteUrl, getBrandName } from "@/lib/site-config";

const BASE = getSiteUrl();

export function buildArticleJsonLd(article: ArticleDetail) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.seoTitle ?? article.title,
    description: article.seoDesc ?? article.excerpt ?? undefined,
    url: `${BASE}/tin-tuc/${article.slug}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: article.authorName ?? getBrandName(),
    },
    publisher: {
      "@type": "Organization",
      name: getBrandName(),
      url: BASE,
    },
    image: article.coverImageUrl
      ? [absoluteArticleImageUrl(article.coverImageUrl, BASE)]
      : undefined,
    mainEntityOfPage: `${BASE}/tin-tuc/${article.slug}`,
  };
}

export function buildArticleHubJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tin tức & kiến thức bất động sản",
    description:
      `Cập nhật tiến độ dự án NOXH, pháp lý nhà ở, kiến thức đầu tư — ${getBrandName()}.`,
    url: `${BASE}/tin-tuc`,
  };
}
