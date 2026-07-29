import type { ListingCardData } from "@/components/listings/listing-card";

export const LISTINGS_BROWSE_COPY = {
  sale: {
    kicker: "HouseX · Mua bán",
    heroTitle: "So sánh tin — chọn đúng trước khi đi xem",
    heroSubtitle:
      "Ảnh thật, giá niêm yết, vị trí minh bạch — lọc nhanh theo khu vực bạn quan tâm. Liên hệ an toàn khi sẵn sàng xem nhà.",
    listTitle: "Bất động sản đang bán",
    coverageNote:
      "Đang phủ TP.HCM, Đồng Nai, Tây Ninh, Cần Thơ và các tỉnh lân cận — tin đã kiểm duyệt.",
    emptyFilter: "Chưa có tin khớp bộ lọc. Thử bỏ bớt điều kiện hoặc quay lại sau.",
    /** Hub `/mua-ban` — Ahrefs ~120–160 ký tự. */
    seoDescriptionSuffix:
      "Tin đã kiểm duyệt trên House X — so sánh giá, vị trí và thông tin minh bạch trước khi liên hệ xem nhà.",
  },
  rent: {
    kicker: "HouseX · Cho thuê",
    heroTitle: "Thuê nhà — lọc đúng nhu cầu trước khi gọi",
    heroSubtitle:
      "Căn hộ, CHDV, phòng trọ — tin quảng cáo đã kiểm duyệt nội dung. Chủ nhà có thể đăng tin hoặc nhờ tìm khách.",
    listTitle: "Cho thuê bất động sản",
    comingSoonTitle: "Chưa có tin khớp — bạn vẫn có thể bắt đầu",
    comingSoonBody:
      "Kho tin đang mở rộng. Đăng tin cho thuê, để lại liên hệ nếu bạn là chủ nhà cần tìm khách, hoặc xem kiến thức thuế & dòng tiền.",
    comingSoonCta: "Đăng tin cho thuê",
    comingSoonCtaHref: "/moi-gioi/dang-tin",
    /** Hub `/cho-thue` — Ahrefs ~120–160 ký tự. */
    seoDescriptionSuffix:
      "Tin cho thuê trên House X — căn hộ, CHDV, phòng trọ; chủ nhà đăng tin hoặc nhờ tìm khách; xem thuế & dòng tiền trước khi quyết định.",
  },
} as const;
