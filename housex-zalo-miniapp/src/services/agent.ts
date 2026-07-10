import { apiFetch } from "./api";
import { formatVnd } from "../utils/media";

export type CtvCaseListItem = {
  id: string;
  code: string;
  customerName: string;
  phoneMasked: string;
  projectName: string | null;
  milestone: string;
  milestoneLabel: string;
  milestoneProgress: string;
  milestoneSub: string | null;
  caseStatus: string;
  docPercent: number;
  docPassed: number;
  docRequired: number;
  opsNote: string | null;
  attributionLocked: boolean;
  consultScheduledAt: string | null;
  lockExpiresAt: string | null;
  lockCompliance: {
    businessDaysUntilLockExpiry: number | null;
    hasRecentProgress: boolean;
    needsProgressWarning: boolean;
    needsScheduleWarning: boolean;
    canExtendLock: boolean;
  };
  updatedAt: string;
};

export type CtvCaseDocument = {
  id: string;
  docType: string;
  label: string;
  status: string;
  statusLabel: string;
  rejectReason: string | null;
  ctvActionHint: string | null;
};

export type CtvCaseDetail = CtvCaseListItem & {
  documents: CtvCaseDocument[];
  missingDocs: CtvCaseDocument[];
  assistLogs: Array<{
    id: string;
    assistType: string;
    message: string;
    createdAt: string;
  }>;
};

export type BrokerNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  caseId: string | null;
  read: boolean;
  createdAt: string;
};

export type CommissionItem = {
  id: string;
  amount: string | number;
  status: string;
  accruedAt: string | null;
  payableAt: string | null;
  paidAt: string | null;
  lead?: {
    project?: { name?: string | null; slug?: string | null } | null;
    listing?: { code?: string | null } | null;
  } | null;
};

export type CommissionSummary = {
  broker: { id: string; fullName: string } | null;
  items: CommissionItem[];
  totalsByStatus: Record<string, { count: number; amount: number }>;
  totalAmount: number;
};

export async function listCtvCases(): Promise<CtvCaseListItem[]> {
  const data = await apiFetch<{ items: CtvCaseListItem[] }>("/api/ctv/cases");
  return data.items;
}

export async function getCtvCase(id: string): Promise<CtvCaseDetail> {
  return apiFetch<CtvCaseDetail>(`/api/ctv/cases/${encodeURIComponent(id)}`);
}

export async function claimCtvCase(input: {
  customerName: string;
  phone: string;
  message?: string;
  intendToBorrow?: boolean;
  consultScheduledAt: string;
}): Promise<CtvCaseDetail> {
  return apiFetch<CtvCaseDetail>("/api/ctv/cases", {
    method: "POST",
    body: JSON.stringify({
      customerName: input.customerName,
      phone: input.phone,
      message: input.message,
      intendToBorrow: input.intendToBorrow ?? false,
      consultScheduledAt: input.consultScheduledAt,
    }),
  });
}

export async function updateCtvCaseSchedule(
  caseId: string,
  consultScheduledAt: string,
): Promise<CtvCaseDetail> {
  return apiFetch<CtvCaseDetail>(
    `/api/ctv/cases/${encodeURIComponent(caseId)}/schedule`,
    {
      method: "PATCH",
      body: JSON.stringify({ consultScheduledAt }),
    },
  );
}

export async function addCtvCaseNote(
  caseId: string,
  message: string,
): Promise<{ id: string }> {
  return apiFetch(`/api/ctv/cases/${encodeURIComponent(caseId)}/assist`, {
    method: "POST",
    body: JSON.stringify({ assistType: "NOTE", message }),
  });
}

export async function nudgeCtvCase(
  caseId: string,
  message?: string,
): Promise<{ id: string; message: string }> {
  return apiFetch(`/api/ctv/cases/${encodeURIComponent(caseId)}/nudge`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function listNotifications(): Promise<{
  items: BrokerNotification[];
  unreadCount: number;
}> {
  return apiFetch("/api/ctv/notifications");
}

export async function markNotificationsRead(ids?: string[]): Promise<number> {
  const data = await apiFetch<{ marked: number }>("/api/ctv/notifications", {
    method: "PATCH",
    body: JSON.stringify(ids?.length ? { ids } : {}),
  });
  return data.marked;
}

export async function getCommissions(): Promise<CommissionSummary> {
  return apiFetch("/api/ctv/commissions");
}

export type AgentServiceCategory = "TRAINING" | "LEGAL" | "PRODUCT";

export type AgentServiceListItem = {
  id: string;
  code: string;
  category: AgentServiceCategory;
  name: string;
  description: string;
  isRequiredForCtv: boolean;
  requiresCode: string | null;
  status: "LOCKED" | "ACTIVE" | "EXPIRED" | "REVOKED";
  unlocked: boolean;
  activatedAt: string | null;
  trainingCompletedAt: string | null;
  hasQuiz: boolean;
  quizId: string | null;
  quizTitle: string | null;
  passScore: number | null;
};

export type AgentServiceDetail = {
  id: string;
  code: string;
  category: AgentServiceCategory;
  name: string;
  description: string;
  contentMarkdown: string | null;
  isRequiredForCtv: boolean;
  requiresCode: string | null;
  status: string;
  unlocked: boolean;
  activatedAt: string | null;
  quiz: {
    id: string;
    title: string;
    passScore: number;
    questions: Array<{
      id: string;
      prompt: string;
      options: Array<{ id: string; label: string }>;
      sortOrder: number;
    }>;
  } | null;
};

export type QuizSubmitResult = {
  attemptId: string;
  score: number;
  passScore: number;
  passed: boolean;
  unlockedServiceCodes: string[];
};

export async function listAgentServices(): Promise<{
  items: AgentServiceListItem[];
  byCategory: Record<AgentServiceCategory, AgentServiceListItem[]>;
}> {
  return apiFetch("/api/ctv/services");
}

export async function getAgentService(
  code: string,
): Promise<AgentServiceDetail> {
  return apiFetch(`/api/ctv/services/${encodeURIComponent(code)}`);
}

export async function submitQuiz(
  quizId: string,
  answers: Record<string, string>,
): Promise<QuizSubmitResult> {
  return apiFetch("/api/ctv/quizzes/submit", {
    method: "POST",
    body: JSON.stringify({ quizId, answers }),
  });
}

export function serviceCategoryLabel(cat: AgentServiceCategory) {
  const map: Record<AgentServiceCategory, string> = {
    TRAINING: "Đào tạo",
    LEGAL: "Pháp lý",
    PRODUCT: "Dịch vụ",
  };
  return map[cat] ?? cat;
}

export function entitlementLabel(status: string, unlocked: boolean) {
  if (unlocked || status === "ACTIVE") return "Đã mở";
  if (status === "REVOKED") return "Đã thu hồi";
  if (status === "EXPIRED") return "Hết hạn";
  return "Chưa mở";
}

export function formatCommission(amount: string | number | null | undefined) {
  return formatVnd(amount) ?? "—";
}

export function statusLabelVi(status: string) {
  const map: Record<string, string> = {
    PENDING: "Chờ",
    ACCRUED: "Đã ghi nhận",
    PAYABLE: "Đến hạn chi",
    APPROVED: "Đã duyệt",
    PAID: "Đã chi",
    REJECTED: "Từ chối",
    ACTIVE: "Đang xử lý",
    COMPLETED: "Hoàn tất",
  };
  return map[status] ?? status;
}
