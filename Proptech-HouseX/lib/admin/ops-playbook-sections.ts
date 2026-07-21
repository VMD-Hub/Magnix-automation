/** Nội dung Playbook Ops — đồng bộ với docs/OPS_PLAYBOOK.md */

export type PlaybookQuickLink = {
  href: string;
  label: string;
  description: string;
  roles: ("super" | "ops")[];
};

export type PlaybookSection = {
  id: string;
  title: string;
  subtitle?: string;
  checklist?: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
};

export const PLAYBOOK_QUICK_LINKS: PlaybookQuickLink[] = [
  {
    href: "/admin/content-queue",
    label: "Content queue",
    description: "Magnix L3 — mỗi bài 1 CTA tool NƠXH",
    roles: ["super"],
  },
  {
    href: "/admin/tool-analytics",
    label: "Tool analytics",
    description: "KPI: bài CTA → lead tool NƠXH → CRM",
    roles: ["super"],
  },
  {
    href: "/admin/ops-leads",
    label: "Lead marketing",
    description: "Pipeline + telesales (gọi/SMS/Zalo) & nurture",
    roles: ["super", "ops"],
  },
  {
    href: "/admin/conversion",
    label: "Chuyển đổi",
    description: "Funnel proposal → cam kết → WON/LOST (sau khi nóng)",
    roles: ["super", "ops"],
  },
  {
    href: "/admin/noxh-cases",
    label: "Hồ sơ NOXH",
    description: "Milestone M1–M5 & checklist giấy tờ",
    roles: ["super", "ops"],
  },
  {
    href: "/admin/conflicts",
    label: "Xung đột",
    description: "Ops vs CTV — cùng SĐT",
    roles: ["super", "ops"],
  },
  {
    href: "/admin/inbound-leads",
    label: "Magnix Inbound",
    description: "UID thô → triage Ops",
    roles: ["super", "ops"],
  },
  {
    href: "/admin/ctv",
    label: "Duyệt CTV",
    description: "Đơn đăng ký cộng tác viên (L3)",
    roles: ["super"],
  },
];

export const PLAYBOOK_SECTIONS: PlaybookSection[] = [
  {
    id: "roles",
    title: "Vai trò & quyền",
    subtitle: "Ops không cần truy cập source code hay VPS.",
    table: {
      head: ["Vai trò", "Được làm", "Không được"],
      rows: [
        [
          "Ops",
          "Lead, NOXH, Xung đột, Inbound, Playbook",
          "Duyệt CTV, nội dung, khuyến mãi, sửa hệ thống",
        ],
        [
          "Chủ quản (L3)",
          "Toàn bộ Admin + publish",
          "—",
        ],
      ],
    },
  },
  {
    id: "content-cta",
    title: "Content → CTA tool NƠXH",
    subtitle:
      "Thiếu lead + không Ads: mọi bài publish phải đổ vào tool. Bài không CTA tool = lãng phí.",
    checklist: [
      "Chọn đúng 1 CTA: /cong-cu/dieu-kien-noxh (điều kiện/hồ sơ) hoặc /cong-cu/kiem-tra-vay-noxh (vay).",
      "Trước publish trả lời đủ 3 câu: nỗi đau? tool nào? câu CTA hành động?",
      "Duyệt trên /admin/content-queue — hệ thống chặn L3 nếu thiếu cta_tool_id.",
      "Đo submit 2 tool / tuần — không chỉ đếm số bài đã đăng.",
      "Sau L3: Publish web ngay (hoặc nháp CMS) — bài luôn có CTA tool.",
    ],
    bullets: [
      "Không viết tool mới trong Q này — phân phối 2 tool NƠXH hiện có.",
      "Không Ads / Zalo Group product — ưu tiên SEO Q&A + Mini App.",
      "Content queue → publish_web đóng vòng SEO trong Admin (không nhảy Sheet).",
    ],
  },
  {
    id: "daily",
    title: "Luồng hàng ngày",
    bullets: [
      "Sáng: Lead «Mới» → ưu tiên HOT/WARM → Hồ sơ NOXH → Xung đột (badge đỏ).",
      "Giữa ngày (Super): Content queue → gắn CTA tool → L3 → publish.",
      "Chiều: Magnix Inbound → triage UID.",
      "Cuối ngày: Lead đã gọi → Đã tiếp nhận / Đã liên hệ.",
    ],
    table: {
      head: ["Tier", "SLA gợi ý"],
      rows: [
        ["HOT", "Gọi ≤ 2 giờ — wizard tự tạo hồ sơ M1"],
        ["WARM", "Gọi trong ngày — nurture theo script"],
        ["COLD / OUT", "Nurture — không gọi ép"],
      ],
    },
  },
  {
    id: "ops-leads",
    title: "Lead marketing",
    checklist: [
      "Chọn lead → đọc Tóm tắt wizard NOXH (số VND chỉ Admin thấy).",
      "Lead cũ thiếu VND: dùng nhãn legacy hoặc nhờ khách submit lại wizard.",
      "Cập nhật trạng thái: Mới → Đã tiếp nhận → Đã liên hệ.",
      "Chọn kịch bản nurture & kênh Zalo/email nếu khác SĐT chính.",
      "Ghi chú Ops ngắn — không paste CCCD đầy đủ.",
    ],
    bullets: [
      "Không hứa «chắc đủ điều kiện NOXH» — chỉ CĐT/Sở quyết định.",
    ],
  },
  {
    id: "telesales",
    title: "Telesales — gọi, nhắn tin, giữ khách ấm",
    subtitle:
      "Ba đội làm trên ba danh sách riêng. Dùng đúng màn hình của đội mình — không lấy lead của đội khác.",
    bullets: [
      "Ops (House X): làm việc trên danh sách lead công ty chưa gán môi giới — mở /ops/telesales hoặc Mini App mục Ops.",
      "Nội sàn: chỉ lead Chủ quản đã gán cho bạn — mở /moi-gioi/telesales hoặc Mini App mục Telesales môi giới.",
      "CTV: chỉ khách / hồ sơ NOXH của mình — không vào danh sách Ops.",
      "Một người vừa là CTV vừa được cấp quyền Ops: vẫn mở hai màn hình riêng; Ops = lead công ty, môi giới = lead của mình.",
    ],
    checklist: [
      "Lần đầu: nhờ Chủ quản cấp quyền Telesales tại /admin/ops-grants (Ops), hoặc đánh dấu Nội sàn rồi gán lead trên bảng Ops.",
      "Lead nóng mới: thêm SĐT → mở Zalo xem nhanh tên/avatar → gọi điện trước (không gọi voice Zalo làm bước 1).",
      "Sau mỗi cuộc gọi: bắt buộc bấm một nút kết quả trên màn hình để ghi nhật ký — không bỏ qua.",
      "Không nghe máy: gửi SMS + tin Zalo chào → hệ thống khoá gọi lại 4 giờ và tạo việc «Gọi lại».",
      "Gửi OA / SMS từ hệ thống (nút riêng): chỉ Ops khi Chủ quản đã bật. Nội sàn và CTV dùng nút mở SMS/Zalo trên điện thoại.",
      "Email nurture (ADR-017): Chủ quản mở /admin/email-marketing — KPI, consent, enroll/gửi/dừng. Không thay hàng đợi gọi telesales.",
      "Chỉ sang màn Chuyển đổi khi đã nói chuyện được và khách có hướng căn / dự án rõ.",
    ],
    table: {
      head: ["Sau cuộc gọi — chọn nút", "Việc tiếp theo"],
      rows: [
        [
          "Đàm thoại OK",
          "Xác nhận nhu cầu nếu được; khi có hướng căn → sang Chuyển đổi",
        ],
        [
          "Xin gửi thông tin",
          "Gửi checklist / tóm tắt qua Zalo — hẹn gọi lại",
        ],
        [
          "Không nghe",
          "SMS + Zalo chào · chờ 4 giờ mới gọi lại (nút Gọi bị khoá tạm)",
        ],
        [
          "Không quan tâm dự án này",
          "Giữ ấm bằng script dự án khác — không gọi lại dự án cũ trong thời gian chờ",
        ],
        [
          "Sai số / Từ chối cứng",
          "Có thể đóng lead mất; ghi lý do ngắn — không nurture ép",
        ],
      ],
    },
  },
  {
    id: "waitlist",
    title: "Đăng ký nhận tin / Waitlist",
    subtitle:
      "Khách sợ bị gọi telesales — cohort này không dùng SLA gọi nóng (ADR-016).",
    bullets: [
      "Đăng ký nhận tin ≠ xin tư vấn gọi ngay. Không gọi chỉ vì có SĐT waitlist.",
      "Hệ thống: captureType=waitlist → nguồn waitlist:project; preference in_app; nút Gọi bị chặn.",
      "Mặc định: cập nhật in-app / tài khoản (OA khi bật + consent).",
      "Chỉ gọi khi khách xin tư vấn, hoặc sau mở bán + khách đồng ý kênh gọi.",
      "Khuyến khích Mini App + hồ sơ + bài lọc đối tượng — không ép gọi.",
      "Nhắc khách (và ghi nhớ Ops): «Không gọi điện chỉ vì bạn đăng ký nhận cập nhật.»",
    ],
  },
  {
    id: "noxh-cases",
    title: "Hồ sơ NOXH (M1→M5)",
    table: {
      head: ["Mốc", "Việc Ops"],
      rows: [
        ["M1 — Nhận hồ sơ", "Hẹn gọi, xác nhận đối tượng"],
        ["M2 — Thu giấy", "Rà checklist, báo thiếu"],
        ["M3 — Đã nộp", "Cập nhật khi có biên nhận CĐT/NH"],
        ["M4 — Phê duyệt", "Theo dõi phản hồi"],
        ["M5 — Ký HĐMB", "Kiểm tra hoa hồng (L3)"],
      ],
    },
    bullets: [
      "Wizard tier HOT tự tạo hồ sơ platform — CTV không nhận SĐT đầy đủ.",
    ],
  },
  {
    id: "conflicts",
    title: "Xung đột attribution",
    table: {
      head: ["Tình huống", "Hành động"],
      rows: [
        ["Ads/form trùng SĐT CTV đang lock", "Không ghi đè — queue Xung đột"],
        ["Ops đã CONTACTED+, CTV claim", "Hệ thống từ chối — Ops giữ khách"],
        ["Lock CTV hết 20 ngày LV", "Ops có thể tiếp quản (theo rule)"],
        ["Đã cọc F1", "CTV giữ attribution — Ops hỗ trợ hậu kỳ"],
      ],
    },
  },
  {
    id: "inbound",
    title: "Magnix Inbound",
    checklist: [
      "UID thô → tab Magnix Inbound.",
      "Nhập SĐT VN chuẩn → tạo Lead hoặc NoxhCase.",
      "Không auto-gán CTV cho inbound Magnix.",
    ],
  },
  {
    id: "security",
    title: "An toàn dữ liệu",
    checklist: [
      "Không chụp màn wizard (thu nhập/nợ) gửi chat công khai.",
      "Không copy PII ra ngoài hệ thống không mã hóa.",
      "Dùng mã lead / mã hồ sơ khi báo lỗi — không cần SĐT đầy đủ.",
    ],
  },
  {
    id: "escalation",
    title: "Leo thang",
    table: {
      head: ["Vấn đề", "Liên hệ"],
      rows: [
        ["Lỗi Admin / 502", "Chủ quản L3 — không tự restart VPS"],
        ["Rule xung đột không rõ", "Chủ quản L3 + ghi chú conflict"],
        ["Khiếu nại pháp lý", "Tư vấn viên có chứng chỉ — Ops không cam kết CĐT"],
      ],
    },
  },
  {
    id: "weekly",
    title: "Kiểm tra cuối tuần",
    checklist: [
      "Lead «Mới» > 24h đã xử lý hoặc chuyển trạng thái.",
      "Hồ sơ HOT/WARM không kẹt M1 quá SLA.",
      "Queue Xung đột = 0 hoặc có quyết định.",
      "Inbound Magnix không tồn > 3 ngày.",
    ],
  },
];
