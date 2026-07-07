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
}

export type OutboxEventType = keyof OutboxPayloads;

export type LeadCreatedPayload = OutboxPayloads["lead.created"];
