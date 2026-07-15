/**
 * Catalog Tài liệu đào tạo Agent — 2 lĩnh vực: Cho vay · Thẩm định.
 *
 * Cấu trúc ghi nhận từ UI đào tạo gốc (folder + document).
 * Nội dung từng mục: PENDING — chờ bạn cung cấp tài liệu để nạp.
 * Brand gốc đã trung lập hóa (Agent / hệ thống / House X) khi biên soạn lại.
 *
 * Root UI: Tài liệu đào tạo
 *   ├─ Vay thế chấp (5)
 *   └─ Kinh doanh thẩm định (2)
 */

export type TrainingMediaKind = "pdf" | "video" | "markdown";

export type TrainingDocStatus = "pending" | "draft" | "ready";

export type TrainingDoc = {
  /** Mã ổn định — dùng khi seed / map file sau này */
  code: string;
  /** Tiêu đề hiển thị (House X) */
  title: string;
  /** Tiêu đề gốc trên UI tham chiếu (để đối chiếu khi nhận file) */
  sourceTitle: string;
  kind: TrainingMediaKind;
  status: TrainingDocStatus;
  sortOrder: number;
  /** Code AgentService đã seed sẵn (nếu có) */
  agentServiceCode?: string;
  /** Đường dẫn nội dung trong repo khi đã nạp */
  contentPath?: string;
  note?: string;
};

export type TrainingFolder = {
  code: string;
  /** Nhãn lĩnh vực ngắn */
  domain: "cho-vay" | "tham-dinh";
  title: string;
  sourceTitle: string;
  sortOrder: number;
  docs: TrainingDoc[];
};

/** Root: Tài liệu đào tạo */
export const AGENT_TRAINING_CATALOG: TrainingFolder[] = [
  {
    code: "VAY_THE_CHAP",
    domain: "cho-vay",
    title: "Vay thế chấp",
    sourceTitle: "Vay thế chấp",
    sortOrder: 10,
    docs: [
      {
        code: "VAY_01_UNG_DUNG_VA_QUY_TRINH",
        title: "1. Ứng dụng Agent và quy trình vay",
        sourceTitle: "1. Ứng dụng Citics Agent và quy trình vay",
        kind: "markdown",
        status: "ready",
        sortOrder: 1,
        agentServiceCode: "HOUSEX_AGENT_GUIDE",
        contentPath: "docs/agent/huong-dan-house-x-agent.md",
        note:
          "Hợp nhất Huong_dan_Citics_Agent.md + Citics_Agent_User_Guide.md — brand Citics → House X / House X Agent; C-Value → HX-Value; CP → HXP; contact Citics không đưa sang (dùng kênh hỗ trợ House X trên app).",
      },
      {
        code: "VAY_02_NGUON_KHACH",
        title: "2. Nguồn khách hàng vay",
        sourceTitle: "2. Nguồn khách hàng vay",
        kind: "markdown",
        status: "ready",
        sortOrder: 2,
        agentServiceCode: "NGUON_KHACH_VAY",
        contentPath: "docs/agent/nguon-khach-hang-vay.md",
        note: "Nạp từ Nguon_Khach_Hang_Vay_Citics.md — Citics Mortgages → House X Mortgages.",
      },
      {
        code: "VAY_03_PHAP_LY_BDS",
        title: "3. Phân tích hồ sơ pháp lý bất động sản",
        sourceTitle: "3. Phân tích hồ sơ pháp lý bất động sản",
        kind: "markdown",
        status: "ready",
        sortOrder: 3,
        agentServiceCode: "PHAP_LY_BDS",
        contentPath: "docs/agent/cam-nang-phap-ly-bds.md",
        note: "Nạp từ cam_nang_phap_ly_bat-dong-san.md — Citics Team → House X.",
      },
      {
        code: "VAY_04_BAO_HIEM",
        title: "4. Hướng dẫn bảo hiểm khoản vay",
        sourceTitle: "4. Hướng dẫn Citics Insurance",
        kind: "markdown",
        status: "ready",
        sortOrder: 4,
        agentServiceCode: "HOUSEX_INSURANCE",
        contentPath: "docs/agent/huong-dan-house-x-insurance.md",
        note: "Nạp từ Huong_dan_Citics_Insurance.md — Citics Insurance → House X Insurance; không mang URL thanh toán Citics.",
      },
      {
        code: "VAY_05_HUONG_DAN_QUY_TRINH_VIDEO",
        title: "Hướng dẫn quy trình",
        sourceTitle: "Hướng dẫn quy trình",
        kind: "video",
        status: "pending",
        sortOrder: 5,
        note: "Video — chờ link/file.",
      },
    ],
  },
  {
    code: "KINH_DOANH_THAM_DINH",
    domain: "tham-dinh",
    title: "Kinh doanh thẩm định",
    sourceTitle: "Kinh doanh thẩm định",
    sortOrder: 20,
    docs: [
      {
        code: "TD_01_BAO_CAO_CHUNG_THU",
        title: "Báo cáo chứng thư nhà đất",
        sourceTitle: "Báo cáo chứng thư nhà đất",
        kind: "pdf",
        status: "ready",
        sortOrder: 1,
        contentPath:
          "docs/agent/td01-chung-thu/chung-thu-mau-nha-dat-HOUSEX.pdf",
        note:
          "PDF mẫu 40 trang — rebrand Citics→House X bằng scripts/rebrand-chung-thu-pdf.py. Giữ SOURCE để tái chạy. Xem docs/agent/td01-chung-thu/README.md.",
      },
      {
        code: "TD_02_DINH_GIA_KHACH_LE",
        title: "Hướng dẫn gửi định giá khách hàng lẻ",
        sourceTitle: "Hướng dẫn gửi định giá khách hàng lẻ",
        kind: "markdown",
        status: "draft",
        sortOrder: 2,
        agentServiceCode: "THAM_DINH_BDS",
        contentPath: "docs/agent/huong-dan-tham-dinh-bds.md",
        note: "Đã có bản markdown nội bộ + seed AgentService THAM_DINH_BDS; chờ PDF gốc (nếu có) để đối chiếu.",
      },
    ],
  },
];

export function trainingFolderByCode(code: string): TrainingFolder | undefined {
  return AGENT_TRAINING_CATALOG.find((f) => f.code === code);
}

export function trainingDocByCode(code: string): TrainingDoc | undefined {
  for (const folder of AGENT_TRAINING_CATALOG) {
    const doc = folder.docs.find((d) => d.code === code);
    if (doc) return doc;
  }
  return undefined;
}

export function trainingPendingDocs(): TrainingDoc[] {
  return AGENT_TRAINING_CATALOG.flatMap((f) =>
    f.docs.filter((d) => d.status === "pending"),
  );
}
