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
    id: "daily",
    title: "Luồng hàng ngày",
    bullets: [
      "Sáng: Lead «Mới» → ưu tiên HOT/WARM → Hồ sơ NOXH → Xung đột (badge đỏ).",
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
    title: "Telesales CRM (gọi → SMS/Zalo → ấm)",
    subtitle: "Mobile-first trên Lead marketing / Mini App Ops — không dùng Conversion làm dialer.",
    checklist: [
      "Thêm lead hot (SĐT) → chuẩn bị xem Zalo thủ công → Gọi điện trước.",
      "Sau mỗi cuộc gọi: chọn chip kết quả (bắt buộc ghi nhật ký).",
      "Không nghe: SMS + Zalo chào + Task gọi lại; khoá gọi 4 giờ.",
      "Không quan tâm dự án A → script Ấm lead dự án khác.",
      "Chỉ sang Conversion khi đã đàm thoại + có hướng căn/dự án.",
    ],
    table: {
      head: ["Chip", "Ý nghĩa"],
      rows: [
        ["Đàm thoại OK", "CONNECTED — xác nhận nhu cầu nếu được"],
        ["Xin gửi thông tin", "CONNECTED + mở Zalo/OA + hẹn gọi lại"],
        ["Không nghe", "CONTACT_ATTEMPT — SMS/Zalo + cooldown 4h"],
        ["Không quan tâm dự án này", "Ấm lead cohort khác dự án"],
      ],
    },
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
