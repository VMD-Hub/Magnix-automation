/** Mã lý do gỡ / ẩn tin — dùng cho email tự động & workflow biên tập. */

export type ListingRemovalReasonCode =
  | "incorrect_price"
  | "incorrect_location"
  | "inappropriate_photos"
  | "duplicate_listing"
  | "legal_violation";

export type ListingRemovalReasonCopy = {
  code: ListingRemovalReasonCode;
  labelVi: string;
  labelEn: string;
  reasonVi: string;
  reasonEn: string;
  actionHintVi: string;
  actionHintEn: string;
};

export const LISTING_REMOVAL_APPEAL_BUSINESS_DAYS = 7;

export const LISTING_REMOVAL_REASONS: Record<ListingRemovalReasonCode, ListingRemovalReasonCopy> = {
  incorrect_price: {
    code: "incorrect_price",
    labelVi: "Sai giá",
    labelEn: "Incorrect price",
    reasonVi:
      "Giá niêm yết không khớp với thông tin thực tế hoặc có dấu hiệu gây hiểu nhầm.",
    reasonEn:
      "The listed price does not match the actual information or appears misleading.",
    actionHintVi: "Vui lòng kiểm tra và cập nhật lại mức giá để đảm bảo thông tin phản ánh đúng thực tế.",
    actionHintEn:
      "Please review and update the price so that it accurately reflects the actual property information.",
  },
  incorrect_location: {
    code: "incorrect_location",
    labelVi: "Sai vị trí",
    labelEn: "Incorrect location",
    reasonVi:
      "Vị trí hiển thị không chính xác, không rõ ràng hoặc không khớp với bất động sản thực tế.",
    reasonEn:
      "The displayed location is inaccurate, unclear, or does not match the actual property.",
    actionHintVi:
      "Vui lòng bổ sung địa chỉ chính xác hoặc đánh dấu vị trí rõ ràng hơn trên bản đồ.",
    actionHintEn: "Please provide the exact address or mark the location more clearly on the map.",
  },
  inappropriate_photos: {
    code: "inappropriate_photos",
    labelVi: "Ảnh không phù hợp",
    labelEn: "Inappropriate photos",
    reasonVi:
      "Hình ảnh không phải ảnh thật, không liên quan trực tiếp đến bất động sản hoặc không đáp ứng tiêu chuẩn hiển thị.",
    reasonEn:
      "The images are not real, are not directly related to the property, or do not meet our publishing standards.",
    actionHintVi: "Vui lòng thay bằng ảnh thật của bất động sản, đúng với nội dung đang rao.",
    actionHintEn:
      "Please replace them with real photos of the property that match the listing content.",
  },
  duplicate_listing: {
    code: "duplicate_listing",
    labelVi: "Tin trùng",
    labelEn: "Duplicate listing",
    reasonVi:
      "Nội dung trùng lặp với một hoặc nhiều tin khác trên nền tảng, gây nhiễu cho người dùng.",
    reasonEn:
      "The content duplicates one or more other listings on the platform, creating unnecessary noise for users.",
    actionHintVi:
      "Vui lòng chỉ giữ một tin đại diện cho cùng một bất động sản để tránh trùng lặp.",
    actionHintEn:
      "Please keep only one representative listing for the same property to avoid duplication.",
  },
  legal_violation: {
    code: "legal_violation",
    labelVi: "Vi phạm pháp lý",
    labelEn: "Legal violation",
    reasonVi:
      "Nội dung có dấu hiệu vi phạm chính sách của House X, Điều khoản sử dụng hoặc quy định pháp luật hiện hành.",
    reasonEn:
      "The content appears to violate House X policies, the Terms of Use, or applicable laws.",
    actionHintVi:
      "Nội dung cần được rà soát và điều chỉnh để phù hợp với chính sách của House X và quy định pháp luật.",
    actionHintEn:
      "The content must be reviewed and adjusted to comply with House X policies and applicable laws.",
  },
};

export function getListingRemovalReason(code: ListingRemovalReasonCode): ListingRemovalReasonCopy {
  return LISTING_REMOVAL_REASONS[code];
}
