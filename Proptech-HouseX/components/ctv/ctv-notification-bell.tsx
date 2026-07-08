"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/ui/cn";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  caseId: string | null;
  read: boolean;
  createdAt: string;
};

export function CtvNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/ctv/notifications");
      if (!res.ok) return;
      const json = await res.json();
      setItems(json.data?.items ?? []);
      setUnread(json.data?.unreadCount ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function markAllRead() {
    await fetch("/api/ctv/notifications", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: "{}",
    });
    void load();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        aria-label="Thông báo"
      >
        Thông báo
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <span className="text-sm font-semibold text-slate-900">Thông báo</span>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-brand-600 hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            ) : null}
          </div>
          <ul className="max-h-80 overflow-auto">
            {items.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-500">
                Chưa có thông báo.
              </li>
            ) : (
              items.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "border-b border-slate-50 px-3 py-2 text-sm",
                    !n.read && "bg-brand-50/30",
                  )}
                >
                  <p className="font-medium text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600 line-clamp-3">{n.body}</p>
                  {n.caseId ? (
                    <Link
                      href="/moi-gioi/ho-so"
                      className="mt-1 inline-block text-xs text-brand-600 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      Xem hồ sơ
                    </Link>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
