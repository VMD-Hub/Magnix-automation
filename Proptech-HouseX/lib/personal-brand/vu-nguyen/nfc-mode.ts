/** Query `?src=nfc` — thẻ vật lý in QR → profile không header site (tracking). */

export const VU_NGUYEN_NFC_SRC = "nfc" as const;

/** Trang DNA thương hiệu từ danh thiếp — `/vu-nguyen/ho-so` */
export const VU_NGUYEN_PORTFOLIO_PATH = "/vu-nguyen/ho-so" as const;

export function isVuNguyenPersonalBrandPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return (
    normalized === "/vu-nguyen" || normalized.startsWith("/vu-nguyen/")
  );
}

export function isVuNguyenNfcPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return normalized === "/vu-nguyen";
}

export function isVuNguyenNfcMode(
  pathname: string,
  src: string | null | undefined,
): boolean {
  return isVuNguyenNfcPath(pathname) && src === VU_NGUYEN_NFC_SRC;
}
