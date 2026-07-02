/** Màu chuẩn thương hiệu VN — badge stylized (viết tắt). */
export type BankProfile = {
  abbr: string;
  /** Màu primary chính thức */
  brandColor: string;
  gradientFrom: string;
  gradientTo: string;
  ring: string;
};

const PROFILES: Record<string, BankProfile> = {
  Vietcombank: { abbr: "VCB", brandColor: "#006837", gradientFrom: "#006837", gradientTo: "#004526", ring: "#00683733" },
  BIDV: { abbr: "BIDV", brandColor: "#005a9c", gradientFrom: "#005a9c", gradientTo: "#003d6b", ring: "#005a9c33" },
  VietinBank: { abbr: "CTG", brandColor: "#00529b", gradientFrom: "#00529b", gradientTo: "#003566", ring: "#00529b33" },
  Agribank: { abbr: "AGR", brandColor: "#ae1c3f", gradientFrom: "#ae1c3f", gradientTo: "#7a1230", ring: "#ae1c3f33" },
  Techcombank: { abbr: "TCB", brandColor: "#ed1c24", gradientFrom: "#ed1c24", gradientTo: "#b01018", ring: "#ed1c2433" },
  "MB Bank": { abbr: "MB", brandColor: "#005baa", gradientFrom: "#005baa", gradientTo: "#003d78", ring: "#005baa33" },
  VPBank: { abbr: "VPB", brandColor: "#009640", gradientFrom: "#009640", gradientTo: "#006b2d", ring: "#00964033" },
  ACB: { abbr: "ACB", brandColor: "#003da5", gradientFrom: "#003da5", gradientTo: "#002870", ring: "#003da533" },
  Sacombank: { abbr: "STB", brandColor: "#0054a6", gradientFrom: "#0054a6", gradientTo: "#003875", ring: "#0054a633" },
  HDBank: { abbr: "HDB", brandColor: "#e31837", gradientFrom: "#e31837", gradientTo: "#a81028", ring: "#e3183733" },
};

export function getBankProfile(name: string): BankProfile {
  return (
    PROFILES[name] ?? {
      abbr: name.slice(0, 3).toUpperCase(),
      brandColor: "#9B111E",
      gradientFrom: "#9B111E",
      gradientTo: "#7A0E18",
      ring: "#9B111E33",
    }
  );
}
