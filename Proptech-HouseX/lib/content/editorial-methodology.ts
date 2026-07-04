/** Nội dung công khai — trang Phương pháp biên tập & kiểm chứng tin (E-E-A-T). */

export type MethodologyStep = {
  id: number;
  heading: string;
  summary: string;
  bullets: readonly string[];
};

export const EDITORIAL_METHODOLOGY = {
  metaTitle: "Phương pháp biên tập & kiểm chứng tin | House X",
  metaDescription:
    "Quy trình kiểm chứng tin đăng House X: đối chiếu địa chỉ, giá, ảnh; kiểm duyệt biên tập; phản hồi cộng đồng — minh bạch và có thể kiểm tra.",
  title: "Phương pháp biên tập House X",
  lead: "Chúng tôi công khai quy trình kiểm chứng và tiêu chí biên tập để đảm bảo mọi tin đăng trên House X đều minh bạch, có thể kiểm tra và đáng tin.",

  overviewTitle: "Tóm tắt quy trình",
  overviewSteps: [
    "Nhận tin",
    "Kiểm tra tự động",
    "Kiểm duyệt biên tập",
    "Đăng hiển thị",
    "Lắng nghe phản hồi",
  ] as const,

  steps: [
    {
      id: 1,
      heading: "Nhận tin và phân loại",
      summary: "Thu tin từ nhiều nguồn, phân loại trước khi đưa vào hàng kiểm tra.",
      bullets: [
        "Nguồn: môi giới, chủ nhà, đối tác, CTV, thu thập tự động (theo chính sách nguồn).",
        "Phân loại: tin bán, thuê, dự án, NOXH, cho thuê ngắn hạn.",
      ],
    },
    {
      id: 2,
      heading: "Kiểm tra tự động (Công nghệ)",
      summary: "Lớp sàng lọc đầu — đối chiếu dữ liệu và phát hiện dấu hiệu bất thường.",
      bullets: [
        "Đối chiếu địa chỉ: so sánh với bản đồ và dữ liệu địa chính khi có.",
        "Đối chiếu giá: so sánh giá niêm yết với biên độ thị trường khu vực.",
        "Kiểm tra hình ảnh: phát hiện ảnh stock / trùng lặp; so metadata khi có.",
        "Gom tin trùng: ưu tiên một tin đại diện, hợp nhất nguồn thông tin.",
      ],
    },
    {
      id: 3,
      heading: "Kiểm duyệt biên tập (Con người)",
      summary: "Biên tập viên rà soát trước khi tin được công bố.",
      bullets: [
        "Rà soát ảnh, mô tả, thông tin pháp lý cơ bản.",
        "Tiêu chí từ chối / ghi chú: thiếu ảnh thật, giá không rõ, địa chỉ mơ hồ, nội dung vi phạm.",
        "Chủ đề đặc thù (NOXH, pháp lý): rà soát bởi chuyên gia — ví dụ Nguyễn Vũ.",
      ],
    },
    {
      id: 4,
      heading: "Hiển thị và ghi chú",
      summary: "Người dùng thấy trạng thái kiểm chứng và cảnh báo khi thông tin chưa đủ.",
      bullets: [
        "Thẻ tin hiển thị trạng thái: đã xác minh / chờ xác minh / chưa xác minh.",
        "Ghi chú minh bạch: nếu thông tin chưa rõ, cảnh báo hiển thị trực tiếp trên tin.",
      ],
    },
    {
      id: 5,
      heading: "Cập nhật & phản hồi cộng đồng",
      summary: "Cơ chế báo cáo và lưu lịch sử chỉnh sửa.",
      bullets: [
        "Người dùng báo tin sai — team xử lý theo SLA nội bộ.",
        "Lưu bản ghi chỉnh sửa để minh bạch khi thông tin được cập nhật.",
      ],
    },
  ] satisfies MethodologyStep[],

  displayCriteria: {
    title: "Tiêu chí hiển thị",
    required: {
      label: "Bắt buộc",
      items: [
        "Ảnh thật (tối thiểu 3 ảnh — có thể điều chỉnh theo loại hình).",
        "Vị trí chính xác (địa chỉ hoặc dự án + block/tầng khi là căn hộ).",
        "Giá niêm yết rõ ràng (bán hoặc thuê/tháng).",
      ],
    },
    recommended: {
      label: "Khuyến nghị",
      items: [
        "Giấy tờ pháp lý, sơ đồ căn hộ.",
        "Bằng chứng quyền sở hữu hoặc uỷ quyền đăng tin (với chủ nhà).",
      ],
    },
    excluded: {
      label: "Loại bỏ",
      items: [
        "Tin có dấu hiệu lừa đảo hoặc giá cố tình sai lệch.",
        "Nội dung vi phạm pháp luật hoặc chính sách sàn.",
      ],
    },
  },

  techAndHuman: {
    title: "Kết hợp công nghệ và con người",
    body: "Hệ thống tự động sàng lọc ban đầu — nhanh và nhất quán. Biên tập viên kiểm duyệt chuyên sâu trước khi công bố. Với lĩnh vực đặc thù (NOXH, pháp lý nhạy cảm), chuyên gia rà soát bổ sung trước khi xuất bản.",
  },

  verificationGuide: {
    title: "Làm sao bạn biết tin đã kiểm chứng?",
    items: [
      "Biểu tượng trạng thái kiểm chứng trên thẻ tin và trang chi tiết.",
      "Ghi chú minh bạch khi thông tin đang chờ bổ sung.",
      "Đọc thêm tại trang chi tiết tin — mục trạng thái và ngày cập nhật gần nhất.",
    ],
  },

  ctas: [
    { label: "Báo tin sai / góp ý", href: "/lien-he" },
    { label: "Câu hỏi thường gặp", href: "/cau-hoi-thuong-gap" },
    { label: "Giới thiệu House X", href: "/gioi-thieu" },
    { label: "Chính sách bảo mật", href: "/bao-mat" },
  ] as const,

  /** Biên tập nội dung NOXH & bài viết — bổ sung cho quy trình tin đăng. */
  noxhEditorial: {
    title: "Biên tập nội dung NOXH & bài viết",
    lead: "Nguyễn Vũ — Biên tập viên / Luật sư / Chuyên gia Nhà Ở Xã Hội — tổng hợp và đối chiếu nội dung NOXH theo văn bản Cổng Thông tin Chính phủ, thông báo cơ quan NN và nguồn báo chí được trích dẫn.",
    sections: [
      {
        heading: "Nguồn được phép trích dẫn",
        bullets: [
          "Cổng Thông tin Chính phủ (vanban.chinhphu.vn) — Luật, Nghị định, Thông tư",
          "Thông báo Sở Xây dựng, UBND về giá bán và mở hồ sơ NOXH",
          "Báo chí uy tín — ghi rõ URL và ngày đăng",
          "Thông tin công bố của chủ đầu tư trên website hoặc hồ sơ pháp lý dự án",
        ],
      },
      {
        heading: "Ranh giới trách nhiệm",
        bullets: [
          "Nội dung tổng hợp và hướng dẫn tra cứu — không thay tư vấn pháp lý cá nhân.",
          "Điều kiện mua NOXH chính thức do cơ quan có thẩm quyền xác nhận.",
          "Giá bán, lãi suất và quỹ căn theo thông báo từng đợt mở bán.",
        ],
      },
    ],
  },

  disclaimer:
    "Quy trình trên mô tả tiêu chuẩn vận hành công khai của House X. Một số tin có thể ở trạng thái chờ bổ sung — luôn kiểm tra nhãn trạng thái trên từng tin trước khi quyết định.",
} as const;
