/** Card / list item — public article summary. */
export type ArticleCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  tags: { slug: string; name: string }[];
  projects: { slug: string; name: string }[];
};

export type ArticleDetail = ArticleCardData & {
  body: string;
  seoTitle: string | null;
  seoDesc: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type ArticleTagSummary = {
  slug: string;
  name: string;
  description: string | null;
  articleCount: number;
};
