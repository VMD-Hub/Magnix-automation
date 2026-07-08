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
}): Promise<CtvCaseDetail> {
  return apiFetch<CtvCaseDetail>("/api/ctv/cases", {
    method: "POST",
    body: JSON.stringify({
      customerName: input.customerName,
      phone: input.phone,
      message: input.message,
      intendToBorrow: input.intendToBorrow ?? false,
    }),
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
