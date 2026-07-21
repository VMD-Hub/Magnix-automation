import { apiFetch } from "@/services/api";

export type CustomerNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  projectId: string | null;
  leadId: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export function listCustomerNotifications() {
  return apiFetch<{
    items: CustomerNotification[];
    unreadCount: number;
  }>("/api/customer/notifications");
}

export function markCustomerNotificationsRead(ids?: string[]) {
  return apiFetch<{ marked: number }>("/api/customer/notifications", {
    method: "PATCH",
    body: JSON.stringify(ids?.length ? { ids } : {}),
  });
}
