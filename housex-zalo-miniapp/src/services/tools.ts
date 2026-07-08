import { HOUSEX_API_BASE } from "../config";

export type ToolLink = {
  id: string;
  title: string;
  desc: string;
  /** Path trên House X web, bắt đầu bằng /cong-cu/... */
  path: string;
};

/** Công cụ NOXH — mở trong Mini App (iframe / webview), không nhảy trình duyệt ngoài. */
export const NOXH_TOOLS: ToolLink[] = [
  {
    id: "dieu-kien",
    title: "Điều kiện NOXH",
    desc: "Đối tượng, nhà ở, thu nhập — quy định hiện hành.",
    path: "/cong-cu/dieu-kien-noxh",
  },
  {
    id: "vay-60s",
    title: "Kiểm tra vay 60 giây",
    desc: "Ước tính tuổi / khả năng vay sơ bộ.",
    path: "/cong-cu/kiem-tra-vay-noxh",
  },
  {
    id: "tham-dinh",
    title: "Thẩm định vay NOXH",
    desc: "Bộ công cụ hạn mức và khoản trả trước khi cọc.",
    path: "/cong-cu/tham-dinh-vay-noxh",
  },
];

export function toolAbsoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${HOUSEX_API_BASE}${p}`;
}
