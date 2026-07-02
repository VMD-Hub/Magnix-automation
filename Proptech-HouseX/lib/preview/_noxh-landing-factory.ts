import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  defaultProjectLanding,
  type ProjectLanding,
} from "@/lib/content/project-landing";
import { attachHousexNoxhServices } from "@/lib/content/noxh-editorial";
import { ensureNoxhLandingMedia } from "@/lib/content/noxh-stock-images";

const NOW = new Date("2026-06-29T00:00:00.000Z");

export type NoxhLandingDef = {
  id: string;
  slug: string;
  name: string;
  commercialName?: string;
  developerId: string;
  developerName: string;
  developerTax: string;
  developerLogo?: string | null;
  projectType: "NHA_O_XA_HOI";
  status: "SAP_MO_BAN" | "DANG_BAN" | "DA_BAN_GIAO";
  province: string;
  district: string;
  ward: string;
  address: string;
  lat: number;
  lng: number;
  totalArea?: number | null;
  handoverDate?: Date | null;
  totalUnits?: number;
  blocks?: number;
  description: string;
  seoTitle: string;
  seoDesc: string;
  heroSubtitle: string;
  locationNotes: string;
  highlights: { title: string; text: string }[];
  amenities: string[];
  faqs: { q: string; a: string }[];
  heroImage: { url: string; alt: string };
  locationMapImage?: { url: string; alt: string; caption?: string };
  gallery: { url: string; caption?: string }[];
  unitTypes: {
    name: string;
    areaMin?: number;
    areaMax?: number;
    bedrooms?: number;
    priceFrom?: number | null;
  }[];
  legalDocs: { docType: string; status: string; issuedDate?: Date | null }[];
  listings?: ProjectLandingListingCard[];
};

function buildLanding(def: NoxhLandingDef): ProjectLanding {
  const landing = defaultProjectLanding(def.name);
  landing.heroSubtitle = def.heroSubtitle;
  landing.heroImage = { ...def.heroImage };
  if (def.locationMapImage) landing.locationMapImage = { ...def.locationMapImage };
  landing.locationNotes = def.locationNotes;
  landing.highlights = def.highlights;
  landing.amenities = def.amenities;
  landing.faqs = def.faqs;
  landing.gallery = def.gallery.map((g) => ({ url: g.url, caption: g.caption }));
  return ensureNoxhLandingMedia(
    attachHousexNoxhServices(landing),
    def.slug,
  );
}

export function buildNoxhMock(def: NoxhLandingDef): ProjectDetail {
  const landing = buildLanding(def);
  const overviewData = buildOverviewData(null, {
    totalUnits: def.totalUnits,
    ...(def.blocks != null && def.blocks > 0 ? { blocks: def.blocks } : {}),
    landing,
  });

  return {
    id: def.id,
    developerId: def.developerId,
    slug: def.slug,
    name: def.name,
    projectType: def.projectType,
    status: def.status,
    province: def.province,
    district: def.district,
    ward: def.ward,
    address: def.address,
    lat: def.lat,
    lng: def.lng,
    totalArea: def.totalArea ?? null,
    density: null,
    handoverDate: def.handoverDate ?? null,
    overviewData,
    description: def.description,
    seoTitle: def.seoTitle,
    seoDesc: def.seoDesc,
    deletedAt: null,
    createdAt: NOW,
    updatedAt: NOW,
    developer: {
      id: def.developerId,
      name: def.developerName,
      taxCode: def.developerTax,
      verified: true,
      logoUrl: def.developerLogo ?? null,
      deletedAt: null,
      createdAt: NOW,
      updatedAt: NOW,
    },
    unitTypes: def.unitTypes.map((u, i) => ({
      id: `${def.id}-ut-${i}`,
      projectId: def.id,
      name: u.name,
      areaMin: u.areaMin ?? null,
      areaMax: u.areaMax ?? null,
      bedrooms: u.bedrooms ?? null,
      priceFrom: u.priceFrom ?? null,
      createdAt: NOW,
      updatedAt: NOW,
    })),
    legalDocs: def.legalDocs.map((ld, i) => ({
      id: `${def.id}-ld-${i}`,
      projectId: def.id,
      docType: ld.docType,
      status: ld.status,
      issuedDate: ld.issuedDate ?? null,
      createdAt: NOW,
      updatedAt: NOW,
    })),
  } as unknown as ProjectDetail;
}

export function buildNoxhSeedLanding(def: NoxhLandingDef) {
  return buildLanding(def);
}

export function buildNoxhListings(
  def: NoxhLandingDef,
  items: { code: string; price: number; tier: "FREE" | "VIP" | "PREMIUM"; image: string }[],
): ProjectLandingListingCard[] {
  return items.map((item, i) => ({
    id: `${def.id}-listing-${i}`,
    code: item.code,
    transactionType: "SALE" as const,
    propertyType: "can_ho" as const,
    price: item.price,
    tier: item.tier,
    broker: { fullName: "CTV HouseX" },
    media: [{ url: item.image }],
  }));
}
