/**
 * L0 gates trước khi gửi Early Signal sang PENDING_L3 (ADR-016).
 */

import type { EarlySignalTier } from "@prisma/client";

const FOMO_NON_T4: RegExp[] = [
  /đang\s+mở\s+bán/i,
  /sắp\s+hết\s*(suất|căn)/i,
  /không\s+thể\s+bỏ\s+lỡ/i,
  /cam\s+kết\s+giá/i,
  /giá\s+chốt/i,
];

export type EarlySignalGateInput = {
  tier: EarlySignalTier;
  readerTitle?: string | null;
  readerBody?: string | null;
  readerDisclaimer?: string | null;
  pressUrl?: string | null;
  sxdUrl?: string | null;
};

export type EarlySignalGateResult = {
  pass: boolean;
  errors: string[];
};

export function assertEarlySignalReadyForL3(
  input: EarlySignalGateInput,
): EarlySignalGateResult {
  const errors: string[] = [];

  if (!input.readerTitle?.trim()) {
    errors.push("Thiếu tiêu đề người đọc (readerTitle).");
  }
  if (!input.readerBody?.trim()) {
    errors.push("Thiếu nội dung người đọc (readerBody).");
  }
  if (!input.pressUrl?.trim() && !input.sxdUrl?.trim()) {
    errors.push("Cần ít nhất một nguồn (pressUrl hoặc sxdUrl).");
  }

  if (input.tier === "T1_PRESS" && !input.readerDisclaimer?.trim()) {
    errors.push("Tier T1 bắt buộc disclaimer người đọc.");
  }

  if (input.tier !== "T4_SOR") {
    const blob = `${input.readerTitle ?? ""}\n${input.readerBody ?? ""}\n${input.readerDisclaimer ?? ""}`;
    for (const re of FOMO_NON_T4) {
      if (re.test(blob)) {
        errors.push(`Claim vượt tầng (FOMO / mở bán) khi tier ≠ T4: /${re.source}/i`);
      }
    }
  }

  return { pass: errors.length === 0, errors };
}

/** Disclaimer T1 mặc định (reader). */
export const DEFAULT_T1_READER_DISCLAIMER =
  "Theo báo chí / chưa thấy công bố Sở — đăng ký nhận cập nhật khi có xác nhận. Không gọi điện chỉ vì bạn đăng ký nhận tin.";
