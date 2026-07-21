/**
 * Telesales call cues — NOXH v1.
 * Cue + must-cover checklist; không phải teleprompter đọc thuộc.
 * Nguồn role-play: HouseX RolePlay — Kỹ thuật tâm lý tư vấn.
 */

export type CallCueTechniqueId =
  | "anchor_value"
  | "loss_frame"
  | "objection_reframe"
  | "closing_silence";

export type CallCueMustCoverId =
  | "object_group"
  | "batch_deadline"
  | "legal_status"
  | "loan_fit"
  | "next_step_hold";

export type CallCueChipHintId =
  | "CONNECTED"
  | "SEND_INFO"
  | "NO_ANSWER"
  | "NOT_THIS_PROJECT"
  | "WRONG_NUMBER"
  | "HARD_REJECT";

export type CallCueTechnique = {
  id: CallCueTechniqueId;
  title: string;
  cue: string;
  exampleNoxh: string;
};

export type CallCueMustCover = {
  id: CallCueMustCoverId;
  label: string;
  hint: string;
};

/** Tình huống đặc thù — expand khi gặp (vd. cắt máu). */
export type CallCueSituation = {
  id: string;
  title: string;
  principle: string;
  steps: string[];
  exampleLines: string[];
  boundary: string;
  verifyQuestions: string[];
};

/** Facts from project master — null = chưa có trên SoR, không bịa. */
export type TelesalesProjectFacts = {
  projectId: string | null;
  projectName: string | null;
  projectSlug: string | null;
  priceFromLabel: string | null;
  pricePerSqmLabel: string | null;
  applicationDeadlineLabel: string | null;
  promoUnitsRemaining: number | null;
  promoDiscountLabel: string | null;
  valueAnchors: string[];
  legalProofHint: string | null;
  bankLoanHint: string | null;
  missingFields: string[];
};

export type TelesalesCallCuePayload = {
  segment: "NOXH";
  version: 1;
  openingLine: string;
  flowSteps: string[];
  diagnoseQuestions: string[];
  mustCover: CallCueMustCover[];
  techniques: CallCueTechnique[];
  situations: CallCueSituation[];
  chipHints: Partial<Record<CallCueChipHintId, string>>;
  projectFacts: TelesalesProjectFacts;
  /** True when loss-frame / price cues should stay soft (missing master facts). */
  softMode: boolean;
};

export const NOXH_CALL_CUE_OPENING =
  "Em gọi từ House X hỗ trợ hồ sơ NOXH — anh/chị đang xem điều kiện mua hay muốn em check nhanh khả năng vay ạ?";

export const NOXH_CALL_CUE_FLOW: string[] = [
  "1. Chẩn đoán — hỏi mở, chưa nói giá",
  "2. Neo giá trị trước giá (2 điểm khách quan tâm)",
  "3. Xử lý phản đối: đồng cảm → định vị lại → bằng chứng",
  "4. Framing mất mát thật (chỉ khi đã hiểu giá trị)",
  "5. Câu hỏi chốt + im lặng có chủ đích",
];

export const NOXH_DIAGNOSE_QUESTIONS: string[] = [
  "Anh/chị đang tìm NOXH để ở hay đầu tư dài hạn?",
  "Ai cùng quyết định (vợ/chồng)? Có cần gọi chung không?",
  "Ngân sách vốn tự có khoảng bao nhiêu, có dự định vay không?",
  "Đã xem dự án / đợt nào chưa? So với gì?",
  "Hồ sơ đối tượng (thu nhập hộ, nhà ở) anh/chị đã nắm đến đâu?",
];

export const NOXH_MUST_COVER: CallCueMustCover[] = [
  {
    id: "object_group",
    label: "Đối tượng / điều kiện",
    hint: "Xác nhận nhóm đối tượng + thu nhập hộ (trấn an mục đích hỏi trước).",
  },
  {
    id: "batch_deadline",
    label: "Đợt xét / hạn nộp",
    hint: "Chỉ nêu ngày thật từ master dự án — không bịa «sắp hết».",
  },
  {
    id: "legal_status",
    label: "Pháp lý / sổ",
    hint: "Nói điểm pháp lý có thể tự kiểm chứng (nguồn công khai nếu có).",
  },
  {
    id: "loan_fit",
    label: "Khả năng vay",
    hint: "Gói vay / vốn tự có theo dữ liệu dự án hoặc hẹn tool check.",
  },
  {
    id: "next_step_hold",
    label: "Bước tiếp — giữ chỗ hồ sơ",
    hint: "Tách «nộp hồ sơ giữ vị trí xét duyệt» vs «ký chính thức».",
  },
];

export const NOXH_TECHNIQUES: CallCueTechnique[] = [
  {
    id: "anchor_value",
    title: "Neo giá trị trước giá",
    cue: "Trả lời giá đủ, nhưng chèn 2 điểm giá trị ngay trước con số.",
    exampleNoxh:
      "Trước khi nói giá: pháp lý đủ mở bán + gói vay ưu đãi (nếu có trên master). Sau đó nêu mức giá từ dữ liệu dự án.",
  },
  {
    id: "objection_reframe",
    title: "Phản đối: đồng cảm → định vị → bằng chứng",
    cue: "Không cãi. Đồng cảm thật → đổi góc nhìn → số liệu/ hạ tầng.",
    exampleNoxh:
      "Xa trung tâm → đồng cảm → thời gian di chuyển thực tế + đánh đổi ngân sách NOXH.",
  },
  {
    id: "loss_frame",
    title: "Framing mất mát (thật)",
    cue: "Chỉ dùng mất mát chính sách thật (đợt xét / số căn ưu đãi). Không hù dọa.",
    exampleNoxh:
      "Nộp hồ sơ giữ vị trí đợt này vẫn còn thời gian cân nhắc ký — nếu master có hạn đợt.",
  },
  {
    id: "closing_silence",
    title: "Im lặng sau câu hỏi chốt",
    cue: "Hỏi xong im 5–10 giây. Không lấp bằng «em gửi thêm thông tin».",
    exampleNoxh:
      "Anh/chị muốn em hỗ trợ chuẩn bị hồ sơ giữ vị trí xét duyệt đợt này không ạ? [im lặng]",
  },
];

export const NOXH_CHIP_HINTS: Partial<Record<CallCueChipHintId, string>> = {
  CONNECTED:
    "Tick must-cover còn thiếu → QUALIFIED khi nhu cầu rõ → mở Conversion nếu có hướng căn.",
  SEND_INFO: "Gửi checklist NOXH / tóm tắt 1 trang qua Zalo — hẹn gọi lại.",
  NO_ANSWER: "SMS/OA value-first + Task gọi lại (+4h). Không gọi trùng trong cooldown.",
  NOT_THIS_PROJECT:
    "Script ấm lead dự án khác — không gọi lại dự án A trong cooldown.",
  WRONG_NUMBER: "Có thể đóng LOST sau khi xác nhận.",
  HARD_REJECT: "Ghi lý do ngắn — không nurture ép.",
};

/** Khách đòi cắt hoa hồng / «cắt máu» — không đua xuống đáy. */
export const NOXH_SITUATION_COMMISSION_CUT: CallCueSituation = {
  id: "commission_cut_pressure",
  title: "Khách đòi cắt hoa hồng / cắt máu",
  principle:
    "Đừng thi cắt máu. Tách «ưu đãi dự án/CĐT» khỏi «cắt hoa hồng cá nhân» → mời kiểm chứng → bán quy trình + dữ liệu → im lặng.",
  steps: [
    "Đồng cảm — công nhận anh/chị đang so sánh chi phí, không phán xét bên kia.",
    "Tách 2 loại giảm: chính sách dự án/đợt (có số liệu master) ≠ cắt hoa hồng cá nhân.",
    "Định vị lại: minh bạch hồ sơ + pháp lý + đồng hành; không hứa vượt thẩm quyền.",
    "Đưa câu kiểm chứng để khách hỏi bên kia (văn bản / kênh công ty).",
    "Câu hỏi chốt + im lặng — để khách chọn quy trình sạch vs lời giảm chưa kiểm chứng.",
  ],
  exampleLines: [
    "Em hiểu anh/chị đang so sánh vì ai cũng muốn tối ưu chi phí. Có hai việc dễ nhầm: (1) ưu đãi theo chính sách dự án/đợt — em gửi số liệu master để đối chiếu; (2) cắt hoa hồng cá nhân — em không làm cách đó vì không minh bạch và dễ hứa vượt quyền.",
    "Em cạnh tranh bằng thông tin đúng, đủ điều kiện, và người chịu trách nhiệm đến bước hồ sơ — không bằng cuộc đua cắt máu.",
    "Nếu bên kia thật có thẩm quyền, anh/chị nên xin xác nhận qua kênh công ty hoặc văn bản — điều đó tốt cho anh/chị. Phía em giữ đúng khung quy định; em có thể leo thang ưu đãi thật theo chính sách dự án nếu có.",
    "Anh/chị chọn em vì tin quy trình và dữ liệu, hay vì một lời giảm hoa hồng chưa kiểm chứng được ạ? [im lặng]",
  ],
  boundary:
    "Ranh giới cứng (nói một lần, giữ vững): Em không cắt hoa hồng cá nhân. Em hỗ trợ trong khung chính sách dự án/công ty. Nếu khách chỉ chốt theo ai cắt nhiều hơn — buông lịch sự, để lại checklist, giữ cửa.",
  verifyQuestions: [
    "Ưu đãi này là của CĐT/đợt mở bán hay cắt hoa hồng anh/chị?",
    "Có xác nhận qua công ty hoặc văn bản không?",
    "Nếu sau này không đúng như đã nói, ai chịu trách nhiệm?",
  ],
};

export const NOXH_SITUATIONS: CallCueSituation[] = [
  NOXH_SITUATION_COMMISSION_CUT,
];

export function buildNoxhCallCuePayload(
  facts: TelesalesProjectFacts,
): TelesalesCallCuePayload {
  const softMode =
    facts.missingFields.includes("applicationDeadline") ||
    facts.missingFields.includes("promoUnitsRemaining");

  return {
    segment: "NOXH",
    version: 1,
    openingLine: NOXH_CALL_CUE_OPENING,
    flowSteps: NOXH_CALL_CUE_FLOW,
    diagnoseQuestions: NOXH_DIAGNOSE_QUESTIONS,
    mustCover: NOXH_MUST_COVER,
    techniques: NOXH_TECHNIQUES,
    situations: NOXH_SITUATIONS,
    chipHints: NOXH_CHIP_HINTS,
    projectFacts: facts,
    softMode,
  };
}
