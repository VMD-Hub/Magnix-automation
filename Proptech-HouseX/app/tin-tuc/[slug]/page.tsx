import { permanentRedirect } from "next/navigation";
import { articlePath } from "@/lib/content/article-routes";

type PageProps = { params: Promise<{ slug: string }> };

/** 301 — URL bài cũ `/tin-tuc/[slug]` → silo NOXH. */
export default async function LegacyArticleRedirect({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(articlePath(slug));
}
