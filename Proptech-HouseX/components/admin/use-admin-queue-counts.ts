"use client";

import { useCallback, useEffect, useState } from "react";

export type AdminQueueCounts = {
  opsLeadsNew: number;
  opsLeadsActive: number;
  conflictsOpen: number;
  fetchedAt: string;
};

const POLL_MS = 45_000;
export const ADMIN_QUEUE_REFRESH_EVENT = "housex:admin-queue-refresh";

export function useAdminQueueCounts() {
  const [counts, setCounts] = useState<AdminQueueCounts | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/queue-counts", {
        headers: { accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) return;
      const body = (await res.json()) as { data?: AdminQueueCounts };
      if (body.data) setCounts(body.data);
    } catch {
      /* ignore — badge optional */
    }
  }, []);

  useEffect(() => {
    void refresh();

    const onFocus = () => void refresh();
    const onRefresh = () => void refresh();
    const timer = window.setInterval(() => void refresh(), POLL_MS);

    window.addEventListener("focus", onFocus);
    window.addEventListener(ADMIN_QUEUE_REFRESH_EVENT, onRefresh);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(ADMIN_QUEUE_REFRESH_EVENT, onRefresh);
    };
  }, [refresh]);

  return counts;
}

export function notifyAdminQueueRefresh() {
  window.dispatchEvent(new Event(ADMIN_QUEUE_REFRESH_EVENT));
}
