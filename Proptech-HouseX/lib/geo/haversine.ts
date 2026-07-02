const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Khoảng cách great-circle (km) giữa 2 toạ độ. */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Hộp bao quanh điểm tâm với bán kính cho trước — dùng prefilter rẻ bằng index
 * (lat, lng) trước khi tính haversine chính xác.
 */
export function boundingBox(
  lat: number,
  lng: number,
  radiusKm: number,
): BoundingBox {
  const latDelta = radiusKm / 111.32; // 1° vĩ độ ≈ 111.32 km
  const lngDelta =
    radiusKm / (111.32 * Math.max(0.01, Math.cos(toRad(lat))));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}
