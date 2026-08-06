import { revalidatePath } from "next/cache";
import {
  NOXH_HANDBOOK_PATH,
  NEWS_HUB_PATH,
  RE_KNOWLEDGE_PATH,
  articlePath,
  knowledgeArticlePath,
} from "@/lib/content/article-routes";

/**
 * Xóa ISR cache trang bài + hub sau khi Super Admin đồng bộ / ẩn bài.
 * Trang wiki/kiến thức dùng `revalidate = 300` — không gọi hàm này thì web
 * có thể giữ bản cũ tối đa ~5 phút dù CMS đã cập nhật.
 */
export function revalidatePublicArticleBySlug(slug: string): void {
  const clean = slug.trim().replace(/^\/+|\/+$/g, "");
  if (!clean) return;

  revalidatePath(articlePath(clean));
  revalidatePath(knowledgeArticlePath(clean));
  // Legacy URL trước khi tách silo
  revalidatePath(`/tin-tuc/${clean}`);
  revalidatePath(NOXH_HANDBOOK_PATH);
  revalidatePath(RE_KNOWLEDGE_PATH);
  revalidatePath(NEWS_HUB_PATH);
}
