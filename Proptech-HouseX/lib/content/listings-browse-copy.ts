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
  },
  rent: {
    kicker: "HouseX · Cho thuê",
    heroTitle: "Thuê nhà — lọc đúng nhu cầu trước khi gọi",
    heroSubtitle:
      "Căn hộ, CHDV, phòng trọ — kho tin đang mở rộng. Xem tin mua bán hoặc đăng tin cho thuê sớm.",
    listTitle: "Cho thuê bất động sản",
    comingSoonTitle: "Kho tin cho thuê đang cập nhật",
    comingSoonBody:
      "HouseX đang mở rộng tin cho thuê tại TP.HCM. Bạn có thể xem tin mua bán hoặc đăng ký nhận thông báo khi có tin mới.",
    comingSoonCta: "Xem tin mua bán",
    comingSoonCtaHref: "/mua-ban",
  },
} as const;
