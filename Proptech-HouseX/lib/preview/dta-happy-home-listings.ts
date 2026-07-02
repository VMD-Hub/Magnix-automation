import type { ListingCardData } from "@/components/listings/listing-card";
import type { ListingDetail } from "@/lib/data/listing";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import { dtaHappyHomeGallery } from "@/lib/content/dta-happy-home-images";
import {
  DTA_HAPPY_HOME_INVENTORY_A10,
  dtaListingCode,
  findDtaInventoryUnit,
} from "@/lib/content/dta-happy-home-inventory-a10";
import { buildDtaUnitListingCopy } from "@/lib/content/dta-happy-home-listing-copy";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import {
  Prisma,
  type BrokerType,
  type ListingStatus,
  type ListingTier,
} from "@prisma/client";

const GALLERY = dtaHappyHomeGallery();

function imageForIndex(i: number): string {
  return GALLERY[i % GALLERY.length]?.url ?? GALLERY[0]!.url;
}

function tierForIndex(i: number): ListingTier {
  if (i % 7 === 0) return "VIP";
  if (i % 4 === 0) return "PREMIUM";
  return "FREE";
}

/** 30 thẻ tin bán suất Block A10 — catalog khi chưa có Postgres. */
export function listDtaHappyHomeListingCards(): ListingCardData[] {
  return DTA_HAPPY_HOME_INVENTORY_A10.map((u, i) => {
    const copy = buildDtaUnitListingCopy(u, i);
    return {
      code: dtaListingCode(u.unitCode),
      title: copy.title,
      propertyType: "can_ho",
      transactionType: "SALE",
      price: u.priceVnd,
      area: u.netAreaM2,
      province: "Đồng Nai",
      district: "Nhơn Trạch",
      verified: true,
      hasVideo: false,
      photoCount: 3,
      imageUrl: imageForIndex(i),
      offerCount: 1,
    };
  });
}

export function getDtaHappyHomeListingCard(code: string): ListingCardData | null {
  return listDtaHappyHomeListingCards().find((c) => c.code === code) ?? null;
}

export function isDtaHappyHomeListingCode(code: string): boolean {
  return /^DTA-HH-A10\d{3}$/i.test(code);
}

/** Chi tiết tin đăng suất A10 — trang /tin-dang/[code]. */
export function buildDtaHappyHomeListingDetail(code: string): ListingDetail | null {
  const unit = findDtaInventoryUnit(code);
  const card = getDtaHappyHomeListingCard(code);
  if (!unit || !card) return null;

  const index = DTA_HAPPY_HOME_INVENTORY_A10.findIndex(
    (u) => u.unitCode === unit.unitCode,
  );
  const copy = buildDtaUnitListingCopy(unit, index);

  return {
    id: `dta-hh-${unit.unitCode}`,
    code: card.code,
    title: copy.title,
    transactionType: "SALE",
    propertyType: "can_ho",
    price: new Prisma.Decimal(unit.priceVnd),
    area: unit.netAreaM2,
    province: "Đồng Nai",
    district: "Nhơn Trạch",
    ward: "Phước An",
    address: "Nguyễn Văn Cừ, Khu đô thị DTA City — Block A10",
    description: copy.description,
    status: "ACTIVE" as ListingStatus,
    tier: tierForIndex(index),
    verified: true,
    verifiedAt: new Date("2026-07-01"),
    hasVideo: false,
    photoCount: 3,
    broker: {
      id: "housex-noxh-dta",
      fullName: "HouseX — Tư vấn NOXH DTA Happy Home",
      phone: "0900000000",
      brokerType: "CTV" as BrokerType,
      licenseVerified: true,
      rating: null,
    },
    project: {
      id: "preview-dta-happy-home",
      slug: DTA_HAPPY_HOME_SLUG,
      name: "DTA Happy Home Nhơn Trạch",
    },
    unitType: null,
    media: [0, 1, 2].map((offset) => ({
      url: imageForIndex(index + offset),
      type: "image",
      status: "READY",
      position: offset,
    })),
    fingerprint: null,
  } as unknown as ListingDetail;
}

/** Thẻ tin trên landing dự án (giới hạn hiển thị). */
export function buildDtaPreviewListings(take = 30): ProjectLandingListingCard[] {
  return listDtaHappyHomeListingCards().slice(0, take).map((c, i) => ({
    id: `dta-preview-${c.code}`,
    code: c.code,
    transactionType: "SALE" as const,
    propertyType: "can_ho" as const,
    price: c.price,
    tier: tierForIndex(i),
    broker: { fullName: "HouseX — Suất bán CĐT DTA" },
    media: [{ url: c.imageUrl ?? imageForIndex(i) }],
  }));
}
