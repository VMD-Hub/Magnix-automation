"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import {
  formatVnd,
  LISTING_STATUS_LABEL,
  propertyTypeLabel,
  TRANSACTION_TYPE_LABEL,
} from "@/lib/format";
import { cn } from "@/lib/ui/cn";

type ListingRow = {
  id: string;
  code: string;
  status: string;
  transactionType: string;
  propertyType: string;
  price: string | number;
  district: string;
  province: string;
  updatedAt: string;
  media: { url: string }[];
};

function statusTone(status: string): "sky" | "emerald" | "slate" | "rose" | "violet" | "amber" {
  if (status === "ACTIVE") return "emerald";
  if (status === "DRAFT") return "slate";
  if (status === "PENDING_REVIEW") return "amber";
  if (status === "REJECTED") return "rose";
  if (status === "EXPIRED") return "violet";
  return "sky";
}

export function BrokerListingsBoard() {
  const [items, setItems] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/broker/me/listings");
      if (res.status === 401 || res.status === 403) {
        setAuthed(false);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được danh sách.");
        setAuthed(false);
        return;
      }
      setAuthed(true);
      setItems(json.data?.items ?? []);
    } catch {
      setError("Lỗi mạng.");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="py-16 text-center text-slate-500">Đang tải…</p>;
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-slate-600">Vui lòng đăng nhập tài khoản môi giới.</p>
        <div className="mt-4 flex justify-center gap-3">
          <ButtonLink href="/dang-nhap?next=/moi-gioi/tin-cua-toi">Đăng nhập</ButtonLink>
          <ButtonLink href="/dang-ky/moi-gioi" variant="outline">
            Đăng ký
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{items.length} tin đăng</p>
        <ButtonLink href="/moi-gioi/dang-tin">+ Đăng tin mới</ButtonLink>
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      )}

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-500">
          Chưa có tin nào.{" "}
          <Link href="/moi-gioi/dang-tin" className="font-semibold text-brand-700">
            Tạo tin nháp đầu tiên
          </Link>
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((l) => (
            <li
              key={l.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/moi-gioi/dang-tin/${l.id}`}
                    className="font-mono text-sm font-semibold text-brand-700 hover:underline"
                  >
                    {l.code}
                  </Link>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      statusTone(l.status) === "amber" && "bg-amber-100 text-amber-800",
                      statusTone(l.status) === "emerald" && "bg-emerald-100 text-emerald-800",
                      statusTone(l.status) === "slate" && "bg-slate-100 text-slate-600",
                      statusTone(l.status) === "rose" && "bg-rose-100 text-rose-800",
                      statusTone(l.status) === "violet" && "bg-violet-100 text-violet-800",
                      statusTone(l.status) === "sky" && "bg-sky-100 text-sky-800",
                    )}
                  >
                    {LISTING_STATUS_LABEL[l.status] ?? l.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-800">
                  {propertyTypeLabel(l.propertyType)} ·{" "}
                  {TRANSACTION_TYPE_LABEL[l.transactionType] ?? l.transactionType} ·{" "}
                  {formatVnd(l.price)}
                </p>
                <p className="text-xs text-slate-500">
                  {l.district}, {l.province}
                </p>
              </div>
              <div className="flex gap-2">
                {l.status === "ACTIVE" ? (
                  <Link
                    href={`/tin-dang/${l.code}`}
                    className="text-xs font-semibold text-brand-700 hover:underline"
                  >
                    Xem public
                  </Link>
                ) : null}
                <Link
                  href={`/moi-gioi/dang-tin/${l.id}`}
                  className="text-xs font-semibold text-slate-600 hover:underline"
                >
                  Sửa
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
