/**
 * Embed path helper — tránh ?p=%2F... trên HashRouter Zalo (dễ mất param → fallback /tin-tuc).
 * Dùng /mo/tai-chinh/vay-mua-nha thay cho /mo?p=/tai-chinh/vay-mua-nha
 */
export function moEmbedHref(webPath: string): string {
  const p = webPath.startsWith("/") ? webPath : `/${webPath}`;
  return `/mo${p}`;
}

/** Lấy path web từ location Mini App (/mo/... hoặc ?p= legacy). */
export function webPathFromMoLocation(
  pathname: string,
  queryP: string | null,
): string {
  if (queryP) {
    try {
      return decodeURIComponent(queryP.trim());
    } catch {
      return queryP.trim();
    }
  }
  if (pathname.startsWith("/mo/") && pathname.length > 4) {
    return pathname.slice(3); // "/mo" + "/tai-chinh/..." → "/tai-chinh/..."
  }
  return "/tin-tuc";
}
