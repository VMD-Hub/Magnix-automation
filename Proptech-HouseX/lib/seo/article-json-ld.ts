import { absoluteArticleImageUrl } from "@/lib/content/articles/article-editorial-media";
import type { LegalSourceRef } from "@/lib/content/editorial-trust";
import type { EditorialExpert } from "@/lib/content/editorial-trust";
import type { ArticleDetail } from "@/lib/data/article-types";
import {
  NOXH_HANDBOOK_INTRO,
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
import { getBrandName, getSiteUrl } from "@/lib/site-config";

const BASE = getSiteUrl();

export type ArticleJsonLdOptions = {
  expert?: EditorialExpert | null;
  sources?: LegalSourceRef[];
};

export function buildArticleJsonLd(
  article: ArticleDetail,
  options: ArticleJsonLdOptions = {},
) {
  const expert = options.expert ?? null;
  const sources = options.sources ?? [];
  const publisher = {
    "@type": "Organization" as const,
    name: getBrandName(),
    url: BASE,
  };

  const author = expert
    ? {
        "@type": "Person" as const,
        name: expert.name,
        jobTitle: expert.jobTitle,
        url: `${BASE}/chuyen-gia/${expert.slug}`,
      }
    : {
        "@type": "Organization" as const,
        name: article.authorName ?? getBrandName(),
      };

  const isBasedOn =
    sources.length > 0
      ? sources.map((s) => ({
          "@type": "Legislation" as const,
          name: s.label,
          url: s.url,
          description: s.cite,
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.seoTitle ?? article.title,
    description: article.seoDesc ?? article.excerpt ?? undefined,
    url: `${BASE}/tin-tuc/${article.slug}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author,
    publisher,
    image: article.coverImageUrl
      ? [absoluteArticleImageUrl(article.coverImageUrl, BASE)]
      : undefined,
    mainEntityOfPage: `${BASE}/tin-tuc/${article.slug}`,
    ...(isBasedOn ? { isBasedOn } : {}),
  };
}

export function buildArticleHubJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: NOXH_HANDBOOK_TITLE,
    description: NOXH_HANDBOOK_INTRO,
    url: `${BASE}${NOXH_HANDBOOK_PATH}`,
  };
}
