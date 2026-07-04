/** Mã lý do báo cáo tin đăng — public form + email biên tập. */

export type ListingReportReasonCode =
  | "incorrect_price"
  | "incorrect_location"
  | "inappropriate_photos"
  | "duplicate_listing"
  | "fraud_suspected"
  | "other";

export type ListingReportReasonCopy = {
  code: ListingReportReasonCode;
  labelVi: string;
  labelEn: string;
};

export const LISTING_REPORT_REASONS: Record<ListingReportReasonCode, ListingReportReasonCopy> = {
  incorrect_price: {
    code: "incorrect_price",
    labelVi: "Sai giá / gây hiểu nhầm",
    labelEn: "Incorrect or misleading price",
  },
  incorrect_location: {
    code: "incorrect_location",
    labelVi: "Sai vị trí / địa chỉ",
    labelEn: "Incorrect location or address",
  },
  inappropriate_photos: {
    code: "inappropriate_photos",
    labelVi: "Ảnh không đúng / không phù hợp",
    labelEn: "Misleading or inappropriate photos",
  },
  duplicate_listing: {
    code: "duplicate_listing",
    labelVi: "Tin trùng lặp",
    labelEn: "Duplicate listing",
  },
  fraud_suspected: {
    code: "fraud_suspected",
    labelVi: "Nghi ngờ lừa đảo",
    labelEn: "Suspected fraud",
  },
  other: {
    code: "other",
    labelVi: "Khác",
    labelEn: "Other",
  },
};

export function getListingReportReason(code: ListingReportReasonCode): ListingReportReasonCopy {
  return LISTING_REPORT_REASONS[code];
}

export const LISTING_REPORT_REASON_OPTIONS = Object.values(LISTING_REPORT_REASONS);
