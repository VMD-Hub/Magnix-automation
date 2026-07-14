/** Khu vực quan tâm — nhớ local, không bắt buộc GPS. */

export type InterestArea = {
  id: string;
  label: string;
  /** Tỉnh/TP gợi ý cho tư vấn */
  provinceHint?: string;
};

const STORAGE_KEY = "hx_miniapp_interest_area";
const STORAGE_AT = "hx_miniapp_interest_area_at";

export const INTEREST_AREAS: InterestArea[] = [
  { id: "hcm", label: "TP. Hồ Chí Minh", provinceHint: "TP. Hồ Chí Minh" },
  { id: "binh-duong", label: "Bình Dương", provinceHint: "Bình Dương" },
  { id: "dong-nai", label: "Đồng Nai", provinceHint: "Đồng Nai" },
  { id: "long-an", label: "Long An", provinceHint: "Long An" },
  { id: "brvt", label: "Bà Rịa – Vũng Tàu", provinceHint: "Bà Rịa - Vũng Tàu" },
  { id: "can-tho", label: "Cần Thơ", provinceHint: "Cần Thơ" },
  { id: "other", label: "Khu vực khác", provinceHint: undefined },
];

export function getInterestArea(): InterestArea | null {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) return null;
    return INTEREST_AREAS.find((a) => a.id === id) ?? null;
  } catch {
    return null;
  }
}

export function setInterestArea(area: InterestArea | null): void {
  try {
    if (!area) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_AT);
      return;
    }
    localStorage.setItem(STORAGE_KEY, area.id);
    localStorage.setItem(STORAGE_AT, String(Date.now()));
  } catch {
    /* private mode */
  }
}

/** Ước lượng tỉnh miền Nam từ tọa độ — không reverse-geocode API. */
export function guessAreaFromCoords(
  lat: number,
  lng: number,
): InterestArea | null {
  if (lat >= 10.3 && lat <= 11.2 && lng >= 106.35 && lng <= 107.05) {
    if (lng < 106.55 && lat < 10.95) {
      return INTEREST_AREAS.find((a) => a.id === "long-an") ?? null;
    }
    if (lng >= 106.9 || lat >= 10.95) {
      return INTEREST_AREAS.find((a) => a.id === "dong-nai") ?? null;
    }
    if (lat >= 11.0 && lng < 106.85) {
      return INTEREST_AREAS.find((a) => a.id === "binh-duong") ?? null;
    }
    return INTEREST_AREAS.find((a) => a.id === "hcm") ?? null;
  }
  if (lat >= 10.0 && lat <= 10.55 && lng >= 106.9 && lng <= 107.4) {
    return INTEREST_AREAS.find((a) => a.id === "brvt") ?? null;
  }
  if (lat >= 9.9 && lat <= 10.2 && lng >= 105.6 && lng <= 105.95) {
    return INTEREST_AREAS.find((a) => a.id === "can-tho") ?? null;
  }
  return INTEREST_AREAS.find((a) => a.id === "other") ?? null;
}

export function requestBrowserLocation(): Promise<{
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Thiết bị không hỗ trợ định vị"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => reject(new Error("Không lấy được vị trí — hãy chọn khu vực thủ công")),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  });
}
