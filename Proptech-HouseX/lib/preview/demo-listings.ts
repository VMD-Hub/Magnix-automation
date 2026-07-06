import type { ListingCardData } from "@/components/listings/listing-card";
import type { PublicListingDetail } from "@/lib/data/listing";
import { HOUSEX_RIVERSIDE_DEMO_IMAGES } from "@/lib/content/project-landing-demo-images";
import {
  buildDtaHappyHomeListingDetail,
  isDtaHappyHomeListingCode,
  listDtaHappyHomeListingCards,
} from "@/lib/preview/dta-happy-home-listings";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import { isInternalDemoListingCode } from "@/lib/deploy/internal-demo-content";
import { listCatalogSaleListingCards } from "@/lib/preview/catalog-listings";
import {
  Prisma,
  type BrokerType,
  type ListingStatus,
  type ListingTier,
  type TransactionType,
} from "@prisma/client";

function u(photoId: string) {
  return `https://images.unsplash.com/${photoId}?w=1200&h=900&fit=crop&q=80&auto=format`;
}

/** Tin mẫu marketplace — hiển thị khi Postgres chưa seed listing. */
export const DEMO_SALE_LISTING_CARDS: ListingCardData[] = [
  {
    code: "HX-DEMO-S001",
    title: "Căn hộ 2PN view sông — full nội thất",
    propertyType: "can_ho",
    transactionType: "SALE",
    price: 3_900_000_000,
    area: 68,
    province: "TP. Hồ Chí Minh",
    district: "Quận 2",
    verified: true,
    hasVideo: false,
    photoCount: 4,
    imageUrl: HOUSEX_RIVERSIDE_DEMO_IMAGES.hero.url,
    offerCount: 1,
  },
  {
    code: "HX-DEMO-S002",
    title: "Nhà phố 1 trệt 2 lầu — hẻm xe hơi",
    propertyType: "nha_pho",
    transactionType: "SALE",
    price: 6_200_000_000,
    area: 80,
    province: "TP. Hồ Chí Minh",
    district: "Gò Vấp",
    verified: false,
    hasVideo: false,
    photoCount: 3,
    imageUrl: u("photo-1600596542815-ffad4c1539a9"),
    offerCount: 1,
  },
  {
    code: "HX-DEMO-S003",
    title: "Căn hộ 1PN Thủ Đức — sổ hồng",
    propertyType: "can_ho",
    transactionType: "SALE",
    price: 2_450_000_000,
    area: 49,
    province: "TP. Hồ Chí Minh",
    district: "Thủ Đức",
    verified: true,
    hasVideo: false,
    photoCount: 5,
    imageUrl: u("photo-1600607687939-ce8a6c25118c"),
    offerCount: 1,
  },
];

export function listDemoSaleListingCards(): ListingCardData[] {
  const generic = allowDemoProjectFallback() ? DEMO_SALE_LISTING_CARDS : [];
  return [...generic, ...listCatalogSaleListingCards()];
}

export function getDemoListingCard(code: string): ListingCardData | null {
  if (isDtaHappyHomeListingCode(code)) {
    return listDtaHappyHomeListingCards().find((l) => l.code === code) ?? null;
  }
  return DEMO_SALE_LISTING_CARDS.find((l) => l.code === code) ?? null;
}

/** Chi tiết tin demo — đủ field cho trang /tin-dang/[code]. */
export function buildDemoListingDetail(code: string): PublicListingDetail | null {
  if (isDtaHappyHomeListingCode(code)) {
    return buildDtaHappyHomeListingDetail(code);
  }

  const card = getDemoListingCard(code);
  if (!card) return null;

  const price = typeof card.price === "string" ? Number(card.price) : card.price;

  return {
    id: `demo-${code}`,
    code: card.code,
    title: card.title ?? null,
    transactionType: card.transactionType as TransactionType,
    propertyType: card.propertyType,
    price: new Prisma.Decimal(price),
    area: card.area ?? null,
    province: card.province,
    district: card.district,
    ward: card.district === "Gò Vấp" ? "Phường 5" : null,
    address:
      card.district === "Gò Vấp"
        ? "Hẻm xe hơi đường Quang Trung"
        : "Đường Nguyễn Hữu Thọ, Quận 2",
    description:
      card.code === "HX-DEMO-S001"
        ? "Căn 2PN view sông, full nội thất, sổ hồng lâu dài. Phù hợp an cư hoặc cho thuê."
        : card.code === "HX-DEMO-S002"
          ? "Nhà phố 1 trệt 2 lầu, hẻm xe hơi, gần chợ và trường học."
          : "Căn hộ 1 phòng ngủ, sổ hồng, tiện di chuyển khu vực Thủ Đức.",
    status: "ACTIVE" as ListingStatus,
    tier: (card.verified ? "VIP" : "FREE") as ListingTier,
    verified: card.verified ?? false,
    verifiedAt: card.verified ? new Date() : null,
    hasVideo: false,
    photoCount: card.photoCount ?? 1,
    broker: {
      id: "demo-broker",
      fullName: "HouseX Demo Broker",
      phone: "0900000000",
      brokerType: "CTV" as BrokerType,
      licenseVerified: true,
      rating: null,
    },
    project: null,
    unitType: null,
    media: card.imageUrl
      ? [{ url: card.imageUrl, type: "image", status: "READY", position: 0 }]
      : [],
    fingerprint: null,
  } as PublicListingDetail;
}

export function isDemoListingCode(code: string): boolean {
  if (isInternalDemoListingCode(code)) return true;
  return isDtaHappyHomeListingCode(code);
}
