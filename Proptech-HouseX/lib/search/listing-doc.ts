export interface ListingSearchDoc {
  id: string;
  code: string;
  propertyType: string;
  transactionType: string;
  province: string;
  district: string;
  ward?: string | null;
  price: number;
  area?: number | null;
  tier: string;
  status: string;
  verified: boolean;
  photoCount: number;
  hasVideo: boolean;
  qualityScore: number;
  rankScore: number;
  description?: string | null;
  projectName?: string | null;
  brokerName?: string | null;
  createdAt: number; // epoch ms (sortable)
  _geo?: { lat: number; lng: number };
}

type ListingForDoc = {
  id: string;
  code: string;
  propertyType: string;
  transactionType: string;
  province: string;
  district: string;
  ward: string | null;
  price: { toString(): string };
  area: number | null;
  tier: string;
  status: string;
  verified: boolean;
  photoCount: number;
  hasVideo: boolean;
  qualityScore: number;
  rankScore: number;
  description: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: Date;
  project?: { name: string } | null;
  broker?: { fullName: string } | null;
};

export function listingToSearchDoc(l: ListingForDoc): ListingSearchDoc {
  const doc: ListingSearchDoc = {
    id: l.id,
    code: l.code,
    propertyType: l.propertyType,
    transactionType: l.transactionType,
    province: l.province,
    district: l.district,
    ward: l.ward,
    price: Number(l.price.toString()),
    area: l.area,
    tier: l.tier,
    status: l.status,
    verified: l.verified,
    photoCount: l.photoCount,
    hasVideo: l.hasVideo,
    qualityScore: l.qualityScore,
    rankScore: l.rankScore,
    description: l.description,
    projectName: l.project?.name ?? null,
    brokerName: l.broker?.fullName ?? null,
    createdAt: l.createdAt.getTime(),
  };
  if (l.lat != null && l.lng != null) {
    doc._geo = { lat: l.lat, lng: l.lng };
  }
  return doc;
}
