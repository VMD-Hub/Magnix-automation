import type { ListingCardData } from "@/components/listings/listing-card";
import { HOUSEX_HERO_SLIDES } from "@/lib/brand/hero-assets";

function u(photoId: string) {
  return `https://images.unsplash.com/${photoId}?w=1920&h=820&fit=crop&q=80&auto=format`;
}

export const LISTINGS_BROWSE_COPY = {
  sale: {
    kicker: "HouseX · Mua bán",
    title: "Bất động sản đang bán",
    subtitle:
      "Căn hộ, nhà phố, đất nền — tin đã kiểm duyệt tại TP.HCM (gồm Bình Dương, Bà Rịa-Vũng Tàu, Côn Đảo), TP. Đồng Nai (gồm Bình Phước cũ), Tây Ninh (gồm Long An cũ), Cần Thơ (gồm Hậu Giang, Sóc Trăng) và các tỉnh lân cận.",
    bannerImage: HOUSEX_HERO_SLIDES[0]!.jpgMd,
    bannerWebp: HOUSEX_HERO_SLIDES[0]!.webpMd,
    bannerAlt: "Phối cảnh đô thị — mua bán bất động sản HouseX",
    objectPosition: HOUSEX_HERO_SLIDES[0]!.objectPosition,
    emptyFilter: "Chưa có tin khớp bộ lọc. Thử bỏ bớt điều kiện hoặc quay lại sau.",
  },
  rent: {
    kicker: "HouseX · Cho thuê",
    title: "Cho thuê bất động sản",
    subtitle:
      "Căn hộ, CHDV, phòng trọ, shophouse — kho tin cho thuê đang được cập nhật.",
    bannerImage: u("photo-1560448204-e02f11c45748"),
    bannerWebp: u("photo-1560448204-e02f11c45748"),
    bannerAlt: "Căn hộ cho thuê — HouseX",
    objectPosition: "50% 45%",
    comingSoonTitle: "Kho tin cho thuê đang cập nhật",
    comingSoonBody:
      "HouseX đang mở rộng tin cho thuê tại TP.HCM. Bạn có thể xem tin mua bán hoặc đăng ký nhận thông báo khi có tin mới.",
    comingSoonCta: "Xem tin mua bán",
    comingSoonCtaHref: "/mua-ban",
  },
} as const;
