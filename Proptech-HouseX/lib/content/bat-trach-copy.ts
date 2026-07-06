/** Copy trang /cong-cu/xem-huong-nha — công cụ xem hướng nhà theo Bát trạch. */

export const BAT_TRACH_COPY = {
  metaTitle: "Xem hướng nhà theo tuổi 2026 — La bàn Bát trạch (Đông/Tây tứ mệnh)",
  metaDescription:
    "Công cụ xem hướng nhà hợp tuổi chuẩn Bát trạch miễn phí: nhập năm sinh âm lịch và giới tính để biết cung mệnh, Đông tứ mệnh hay Tây tứ mệnh, cùng sơ đồ 4 hướng tốt (Sinh Khí, Thiên Y, Diên Niên, Phục Vị) và 4 hướng xấu cần tránh.",
  kicker: "House X · Phong thủy nhà ở",
  title: "Xem hướng nhà theo tuổi chuẩn Bát trạch",
  subtitle:
    "Nhập năm sinh âm lịch và giới tính của gia chủ — công cụ tính cung mệnh, phân Đông/Tây tứ mệnh và vẽ sơ đồ la bàn 8 hướng tốt/xấu để bố trí cửa, bếp, giường và bàn thờ.",
  primaryCta: "Xem hướng ngay",
  primaryCtaHref: "#cong-cu",
  secondaryCta: "Nhận tư vấn dự án hợp hướng",
  secondaryCtaHref: "/lien-he",
  faqHeading: "Câu hỏi thường gặp về xem hướng nhà Bát trạch",
} as const;

export const BAT_TRACH_INTRO = [
  {
    heading: "Bát trạch là gì?",
    body: "Bát trạch (八宅) là trường phái phong thủy dương trạch dựa trên cung phi (quái số) của gia chủ. Mỗi người thuộc một trong 8 cung — Càn, Khảm, Cấn, Chấn, Tốn, Ly, Khôn, Đoài — được xếp vào Đông tứ mệnh hoặc Tây tứ mệnh. Từ cung mệnh, không gian sống được chia thành 4 hướng tốt (cát) và 4 hướng xấu (hung).",
  },
  {
    heading: "Nguyên tắc 'Tọa hung — Hướng cát'",
    body: "Người xưa dùng nguyên tắc đặt cửa chính, bàn thờ, giường ngủ và bàn làm việc vào các hướng tốt; đặt bếp, nhà vệ sinh, nhà kho vào các hướng xấu để trấn áp. Đây là căn cứ tham khảo khi chọn hướng nhà, hướng ban công hoặc bố trí nội thất từng phòng.",
  },
] as const;

/** Ứng dụng nhanh 4 hướng tốt cho từng không gian. */
export const BAT_TRACH_PLACEMENTS = [
  { space: "Cửa chính / cổng", advice: "Ưu tiên hướng Sinh Khí hoặc Diên Niên." },
  { space: "Giường ngủ (đầu giường)", advice: "Quay về Thiên Y hoặc Sinh Khí." },
  { space: "Bàn thờ", advice: "Tọa cát hướng cát — hợp Phục Vị, Thiên Y." },
  { space: "Bàn làm việc / học", advice: "Quay mặt về Sinh Khí hoặc Phục Vị." },
  { space: "Bếp (miệng bếp)", advice: "Tọa hung (Ngũ Quỷ, Họa Hại) hướng cát." },
  { space: "Nhà vệ sinh", advice: "Đặt vào Tuyệt Mệnh, Ngũ Quỷ để trấn hung." },
] as const;
