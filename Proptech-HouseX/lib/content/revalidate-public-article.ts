import { revalidatePath } from "next/cache";
import {
  NOXH_HANDBOOK_FS_SEGMENT,
  NOXH_HANDBOOK_PATH,
  NEWS_HUB_PATH,
  RE_KNOWLEDGE_PATH,
  articlePath,
  knowledgeArticlePath,
} from "@/lib/content/article-routes";

/**
 * Xóa ISR cache trang bài + hub sau khi Super Admin đồng bộ / ẩn bài.
 *
 * Quan trọng: URL công khai `/wiki-nha-o-xa-hoi/:slug` chỉ là rewrite tới
 * `/tin-tuc/cam-nang-noxh/:slug` (filesystem page). `revalidatePath` phải
 * gọi đúng path trang thật — chỉ revalidate URL rewrite sẽ không xóa cache.
 */
export function revalidatePublicArticleBySlug(slug: string): void {
  const clean = slug.trim().replace(/^\/+|\/+$/g, "");
  if (!clean) return;

  const wikiPublic = articlePath(clean);
  const knowledgePublic = knowledgeArticlePath(clean);
  // Path thật trong app/ (ISR key)
  const wikiFs = `/tin-tuc/${NOXH_HANDBOOK_FS_SEGMENT}/${clean}`;
  const knowledgeFs = knowledgePublic; // đã là /tin-tuc/kien-thuc/...

  for (const path of [
    wikiFs,
    wikiPublic,
    knowledgeFs,
    knowledgePublic,
    `/tin-tuc/${clean}`,
    NOXH_HANDBOOK_PATH,
    RE_KNOWLEDGE_PATH,
    NEWS_HUB_PATH,
  ]) {
    revalidatePath(path);
    revalidatePath(path, "page");
  }
}
