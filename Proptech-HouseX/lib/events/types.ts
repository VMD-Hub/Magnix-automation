/** P2 — Event-driven outbox: catalog sự kiện + payload typed. */

export interface OutboxPayloads {
  "lead.won": {
    leadId: string;
    status: string;
  };
  "commission.created": {
    commissionId: string;
    leadId: string;
    brokerId: string;
    amount: string; // chuỗi để không mất chính xác Decimal
    rate: number | null;
  };
  /**
   * Đăng ký tài khoản mới — khách hàng hoặc môi giới đăng tin.
   */
  "account.registered": {
    userAccountId: string;
    role: "CUSTOMER" | "BROKER";
    name: string;
    phone: string;
    email: string;
    marketingOptIn: boolean;
    brokerId: string | null;
    customerId: string | null;
    registeredAt: string;
    signupUrl: string;
  };
  /**
   * Môi giới nộp đơn đăng ký CTV — chờ admin duyệt.
   */
  "ctv.application_submitted": {
    applicationId: string;
    brokerId: string;
    brokerName: string;
    brokerPhone: string;
    brokerEmail: string | null;
    idNumberLast4: string;
    region: string;
    experience: string;
    motivation: string;
    submittedAt: string;
    adminUrl: string;
  };
  /**
   * Khác luồng tool NOXH — ưu tiên push Telegram tư vấn kịp thời.
   */
  "lead.created": {
    leadId: string;
    source: string;
    sourceMeta?: {
      utm?: {
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_content?: string;
        utm_term?: string;
      };
      rawSource?: string;
      channel?: "web" | "miniapp" | "api";
    } | null;
    /** Intent lane — `noxh` | `cctm` (null nếu lead cũ / không suy được). */
    segment: "noxh" | "cctm" | null;
    message: string | null;
    contact: {
      name: string;
      phone: string;
      email: string | null;
    };
    context: {
      kind: "project" | "listing";
      entityId: string;
      entityName: string;
      slug: string | null;
      listingCode: string | null;
      projectType: "NHA_O_XA_HOI" | "THUONG_MAI" | null;
      province: string | null;
      adminUrl: string | null;
    };
    assignedBrokerId: string | null;
    createdAt: string;
  };
  /** Form dịch vụ tại /tai-chinh, /dinh-gia, /noi-that và các landing liên kết. */
  "lead.affiliate_contact": {
    leadId: string;
    vertical: string;
    need: string | null;
    message: string | null;
    contact: {
      name: string;
      phone: string;
      email: string | null;
    };
    createdAt: string;
  };
  /**
   * tài chính (thu nhập, nợ xấu) — chỉ tier + contact + tín hiệu định tuyến để
   * n8n route (HOT→chuyên gia, WARM→gỡ hồ sơ, COLD→nurture). Chi tiết tài chính
   * đi qua NOXH_DETAIL_WEBHOOK_URL (best-effort, không lưu Postgres).
   */
  "lead.noxh_checked": {
    leadId: string;
    tier: "HOT" | "WARM" | "COLD" | "OUT";
    overall: "ELIGIBLE" | "CONDITIONAL" | "NOT_ELIGIBLE";
    creditFlag: "NOT_APPLICABLE" | "CLEAN" | "CAUTION" | "BLOCKER";
    reasonCodes: string[];
    recommendedAction: string;
    rulesVersion: string;
    contact: { name: string; phone: string; email: string };
  };
  /**
   * Lead magnet kiểm tra vay NOXH 60 giây — chỉ tier + tuổi sơ bộ + band thu nhập;
   * không lưu chi tiết tài chính vào Postgres.
   */
  "lead.noxh_loan_quick_check": {
    leadId: string;
    tier: "HOT" | "WARM" | "COLD";
    ageStatus: "PROCEED" | "NEEDS_REVIEW" | "NOT_SUITABLE";
    currentAge: number;
    ageAtLoanEnd: number;
    region: string;
    housingType: string;
    incomeBand: string;
    contact: {
      name: string;
      phone: string;
      email?: string;
    };
  };
  "promotion.spin_won": {
    campaignSlug: string;
    campaignName: string;
    spinId: string;
    winId: string;
    prizeTier: string;
    prizeLabel: string;
    prizeType: string;
    redemptionCode: string;
    displayName: string;
    normalizedPhoneHash: string;
    wonAt: string;
  };
  /** Phase 0 — CTV thả lead NOXH. */
  "noxh_case.created": {
    caseId: string;
    caseCode: string;
    brokerId: string | null;
    milestone: string;
    customerName: string;
    normalizedPhone: string;
  };
  /** Ops đổi mốc pipeline — notify CTV. */
  "noxh_case.milestone_changed": {
    caseId: string;
    caseCode: string;
    brokerId: string | null;
    fromMilestone: string;
    toMilestone: string;
    milestoneSub: string | null;
    opsNote: string | null;
  };
  /** CTV nhắc qua hệ thống — Ops queue. */
  "noxh_case.ctv_nudge": {
    caseId: string;
    caseCode: string;
    brokerId: string;
    docType: string | null;
    message: string;
  };
  /** CRM-R5 — xung đột attribution Ops vs CTV → notify OA. */
  "attribution.conflict": {
    phase: "opened" | "resolved";
    conflictId: string;
    kind: "CTV_CLAIM_BLOCKED" | "OPS_LEAD_CTV_LOCK";
    normalizedPhoneMasked: string;
    brokerId: string;
    rejectReason: string | null;
    rejectLabel: string | null;
    resolution: string | null;
    resolutionLabel: string | null;
    platformLeadSource: string | null;
    noxhCaseCode: string | null;
    customerName: string | null;
  };
  /** CRM-2 — Ops nurture auto → n8n route Zalo/Telegram/OA. */
  "lead.nurture": {
    leadId: string;
    nurtureScriptId: string;
    scriptLabel: string;
    scriptDescription: string;
    channel: "oa" | "telegram" | "zalo" | "manual";
    trigger: "on_create" | "status_contacted";
    segment: "noxh" | "cctm" | null;
    source: string;
    contact: {
      name: string;
      phone: string;
      email: string | null;
    };
    channels: {
      phone?: string | null;
      zalo?: string | null;
      email?: string | null;
      facebook?: string | null;
    };
    opsNote: string | null;
  };
}

export type OutboxEventType = keyof OutboxPayloads;

export type LeadCreatedPayload = OutboxPayloads["lead.created"];
