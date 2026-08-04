"use client";

import { ArticleBody } from "@/components/articles/article-body";
import { normalizeQueueBodyForReader } from "@/lib/content/content-queue-article";

/**
 * Preview L2/L3 — cùng renderer với /tin-tuc (ArticleBody).
 * Body đã normalize: không frontmatter, không nhãn `(CTA)`.
 */
export function QueueArticleReaderPreview({
  markdown,
  className = "",
}: {
  markdown: string;
  className?: string;
}) {
  const body = normalizeQueueBodyForReader(markdown);
  if (!body.trim()) {
    return (
      <p className="text-sm text-slate-500 italic">
        Chưa có nội dung — người đọc sẽ thấy trống.
      </p>
    );
  }
  return (
    <div className={className}>
      <ArticleBody body={body} />
    </div>
  );
}
