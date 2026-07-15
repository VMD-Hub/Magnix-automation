/**
 * Embed path helper — ưu tiên /mo/tai-chinh/... ; legacy ?p= vẫn đọc được.
 * Không mặc định sang /tin-tuc (gây hiểu nhầm “luôn về tin tức”).
 */
export function moEmbedHref(webPath: string): string {
  const p = webPath.startsWith("/") ? webPath : `/${webPath}`;
  return `/mo${p}`;
}

/** Lấy path web từ location Mini App. Trả null nếu không suy ra được. */
export function webPathFromMoLocation(
  pathname: string,
  queryP: string | null,
  splat?: string | undefined,
): string | null {
  if (queryP) {
    try {
      return decodeURIComponent(queryP.trim());
    } catch {
      return queryP.trim();
    }
  }
  if (splat && splat.length > 0) {
    return splat.startsWith("/") ? splat : `/${splat}`;
  }
  if (pathname.startsWith("/mo/") && pathname.length > 4) {
    return pathname.slice(3);
  }
  return null;
}
