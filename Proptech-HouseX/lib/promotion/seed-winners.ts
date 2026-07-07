import type { WinnerBoardItem } from "@/lib/data/promotion";

/** Số người trúng mẫu hiển thị công khai khi chưa có win thật trong DB. */
export const PROMOTION_SEED_WINNER_COUNT = 3;

const SEED_WINNER_IDS = [
  "seed-win-1",
  "seed-win-2",
  "seed-win-3",
] as const;

/** Dữ liệu seed — admin biết; người dùng chỉ thấy tên đã ẩn. */
export function getPromotionSeedWinners(): WinnerBoardItem[] {
  const now = Date.now();
  return [
    {
      id: SEED_WINNER_IDS[0],
      displayName: "Trần M***",
      prizeLabel: "Bếp điện từ đôi",
      prizeTier: "FIRST",
      wonAt: new Date(now - 2 * 3600000).toISOString(),
    },
    {
      id: SEED_WINNER_IDS[1],
      displayName: "Nguyễn T***",
      prizeLabel: "Nồi chiên không dầu",
      prizeTier: "SECOND",
      wonAt: new Date(now - 6 * 3600000).toISOString(),
    },
    {
      id: SEED_WINNER_IDS[2],
      displayName: "Lê H***",
      prizeLabel: "Voucher 500.000đ khấu trừ khi ký HĐMB",
      prizeTier: "CONSOLATION",
      wonAt: new Date(now - 26 * 3600000).toISOString(),
    },
  ];
}

export function isPromotionSeedWinnerId(id: string): boolean {
  return id.startsWith("seed-win-");
}

/** Ưu tiên win thật; chỉ dùng seed khi bảng trống. */
export function resolvePromotionPublicWinners(
  realWinners: WinnerBoardItem[],
): WinnerBoardItem[] {
  if (realWinners.length > 0) return realWinners;
  return getPromotionSeedWinners();
}
