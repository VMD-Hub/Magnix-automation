/** Nội dung trang Phương pháp biên tập — E-E-A-T công khai. */

export const EDITORIAL_METHODOLOGY = {
  metaTitle: "Phương pháp biên tập & nguồn tham chiếu | House X",
  metaDescription:
    "Quy trình biên tập NOXH trên House X: QA L0–L3, nguồn Chính phủ và báo chí, ranh giới tổng hợp vs công bố chính thức.",
  title: "Phương pháp biên tập",
  lead: "Nguyễn Vũ — Biên tập viên / Luật sư / Chuyên gia Nhà Ở Xã Hội — biên tập nội dung NOXH trên House X theo nguyên tắc đối chiếu văn bản gốc, trích nguồn công khai và phân tách rõ thông tin tổng hợp với công bố của cơ quan nhà nước hoặc chủ đầu tư.",
  sections: [
    {
      heading: "Nguồn được phép trích dẫn",
      bullets: [
        "Cổng Thông tin Chính phủ (vanban.chinhphu.vn) — Luật, Nghị định, Thông tư",
        "Thông báo Sở Xây dựng, UBND tỉnh/TP về giá bán và mở hồ sơ NOXH",
        "Báo chí uy tín (VnExpress, VietnamNet, Tuổi Trẻ, Thanh Niên…) — ghi rõ URL và ngày đăng",
        "Thông tin công bố của chủ đầu tư trên website hoặc hồ sơ pháp lý dự án",
      ],
    },
    {
      heading: "Quy trình QA trước xuất bản",
      bullets: [
        "L0 — Kiểm tra giọng biên tập: không heading meta, không markdown thô, không CTA gắt",
        "L1 — Đối chiếu số liệu pháp lý với bộ quy tắc NOXH đang áp dụng (lib/finance/noxh-rules)",
        "L2 — Rà soát chủ đề nhạy cảm (thu nhập, vay, điều kiện đối tượng) theo checklist pháp lý",
        "L3 — Duyệt người trước khi publish (bài trend, số liệu giá mới)",
      ],
    },
    {
      heading: "Ranh giới trách nhiệm",
      bullets: [
        "Nội dung mang tính tổng hợp và hướng dẫn tra cứu — không thay tư vấn pháp lý cá nhân",
        "Điều kiện mua NOXH chính thức do cơ quan có thẩm quyền xác nhận",
        "Giá bán, lãi suất vay và quỹ căn theo thông báo từng đợt mở bán",
        "Công cụ kiểm tra điều kiện NOXH là sàng lọc sơ bộ, luôn kèm mã phiên bản quy tắc",
      ],
    },
    {
      heading: "Cập nhật nội dung",
      bullets: [
        "Bài pháp lý NOXH: cập nhật khi có Nghị định sửa đổi (hiển thị ngày cập nhật trên trang)",
        "Bài giá/tiến độ dự án: cập nhật khi Sở Xây dựng hoặc CĐT công bố đợt mới",
        "FAQ và công cụ: đồng bộ với CURRENT_NOXH_RULES trong mã nguồn",
      ],
    },
  ],
  disclaimer:
    "Mọi bài viết có khối “Nguồn & cập nhật” cuối trang liệt kê văn bản căn cứ và ngày chỉnh sửa gần nhất. Nếu phát hiện sai lệch so với văn bản gốc, vui lòng liên hệ qua trang Liên hệ để chúng tôi hiệu chỉnh.",
} as const;
