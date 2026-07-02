/**
 * HouseX brand tokens — Thiên Thượng Hoả + Số 1.
 * Tỷ lệ 60-30-10: Silver (Kim) · Ruby (Hoả) · Gold (CTA).
 */
export const BRAND = {
  /** 60% — nền Kim, tiết chế Hoả */
  silver: {
    50: "#F5F5F7",
    100: "#EBEBED",
    200: "#DCDCE0",
  },
  /** 30% — Hoả chủ đạo */
  ruby: {
    50: "#fdf2f3",
    100: "#fce4e6",
    200: "#f9c8cc",
    300: "#f0959c",
    400: "#d6404f",
    500: "#b81425",
    600: "#9B111E",
    700: "#7A0E18",
    800: "#5c0b12",
    900: "#3d070c",
  },
  /** 10% — CTA, năng lượng Số 1 */
  gold: {
    400: "#e8c547",
    500: "#DAA520",
    600: "#b8860b",
    700: "#96700a",
  },
  /** Mộc sinh Hoả — accent phụ (tin cậy BĐS) */
  emerald: {
    500: "#2E8B57",
    600: "#046307",
  },
  /** Văn bản & dark sections */
  charcoal: "#333333",
  ink: {
    700: "#4a4446",
    800: "#2a2224",
    900: "#1a1214",
  },
} as const;
