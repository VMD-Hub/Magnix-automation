export const SEGMENT_LABEL: Record<string, string> = {
  noxh_income: "NOXH — Thu nhập / vay",
  valuation: "Định giá BĐS",
  sme_credit: "Vay doanh nghiệp",
  general_inbound: "Inbound chung",
  unclassified: "Chưa phân loại",
};

export const OPS_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  reviewing: "Đang xem",
  contacted: "Đã liên hệ",
  converted: "Đã tạo lead sàn",
  dismissed: "Bỏ qua",
};

export function segmentLabel(segment: string): string {
  return SEGMENT_LABEL[segment] ?? segment;
}
