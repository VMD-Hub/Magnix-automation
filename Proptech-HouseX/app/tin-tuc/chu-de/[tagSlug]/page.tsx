import { permanentRedirect } from "next/navigation";
import { topicPath } from "@/lib/content/article-routes";

type PageProps = { params: Promise<{ tagSlug: string }> };

/** 301 — URL chủ đề cũ `/tin-tuc/chu-de/[tag]` → silo NOXH. */
export default async function LegacyTopicRedirect({ params }: PageProps) {
  const { tagSlug } = await params;
  permanentRedirect(topicPath(tagSlug));
}
