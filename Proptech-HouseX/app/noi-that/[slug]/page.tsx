import { permanentRedirect } from "next/navigation";
import { NOI_THAT_LEGACY_REDIRECTS } from "@/lib/content/noi-that-content";

type Props = { params: Promise<{ slug: string }> };

/** Fallback 301 cho URL phong cách flat cũ (redirect chính trong next.config). */
export default async function NoiThatLegacySlugPage({ params }: Props) {
  const { slug } = await params;
  const target = NOI_THAT_LEGACY_REDIRECTS[slug];
  if (target) permanentRedirect(target);
  permanentRedirect("/noi-that");
}
