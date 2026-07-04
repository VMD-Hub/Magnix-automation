import { PROPERTY_TYPE_FILTER_OPTIONS } from "@/lib/content/property-type-slug";

export const BROKER_LISTING_PROVINCES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Bình Dương",
  "Đồng Nai",
  "Long An",
  "Bà Rịa - Vũng Tàu",
  "Cần Thơ",
  "Đà Nẵng",
] as const;

export const BROKER_PROPERTY_TYPE_OPTIONS = PROPERTY_TYPE_FILTER_OPTIONS;

export const LISTING_GATE_HINT = {
  minPhotos: Number(process.env.NEXT_PUBLIC_LISTING_MIN_PHOTOS ?? "5"),
  minDescLen: Number(process.env.NEXT_PUBLIC_LISTING_MIN_DESC_LEN ?? "50"),
};
