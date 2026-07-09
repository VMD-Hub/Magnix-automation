/** Lane Khách — NOXH vs CCTM (one brand, two lanes). */

export type UserLane = "noxh" | "cctm";

const STORAGE_KEY = "hx_miniapp_preferred_lane";

export const LANE_LABELS: Record<UserLane, string> = {
  noxh: "Nhà ở xã hội",
  cctm: "Căn hộ thương mại",
};

export const LANE_SHORT_LABELS: Record<UserLane, string> = {
  noxh: "NOXH",
  cctm: "CCTM",
};

export function laneHomePath(lane: UserLane): string {
  return `/${lane}`;
}

export function parseLaneParam(value: string | null): UserLane | null {
  if (value === "noxh" || value === "cctm") return value;
  return null;
}

export function getPreferredLane(): UserLane | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return parseLaneParam(v);
  } catch {
    return null;
  }
}

export function setPreferredLane(lane: UserLane): void {
  try {
    localStorage.setItem(STORAGE_KEY, lane);
    localStorage.setItem(`${STORAGE_KEY}_at`, String(Date.now()));
  } catch {
    /* private mode */
  }
}

export function projectTypeForLane(lane: UserLane): "NHA_O_XA_HOI" | "THUONG_MAI" {
  return lane === "noxh" ? "NHA_O_XA_HOI" : "THUONG_MAI";
}

export function oppositeLane(lane: UserLane): UserLane {
  return lane === "noxh" ? "cctm" : "noxh";
}
