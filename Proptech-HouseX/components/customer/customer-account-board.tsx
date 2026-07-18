"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { AccountPasswordPanel } from "@/components/auth/account-password-panel";
import { LEAD_STATUS_LABEL, UNIT_BOOKING_STATUS_LABEL } from "@/lib/format";
import { cn } from "@/lib/ui/cn";

type Profile = {
  name: string;
  email: string;
  emailVerified: boolean;
  phoneMasked: string;
  passwordReady?: boolean;
};

type LeadRow = {
  id: string;
  status: string;
  source: string;
  message: string | null;
  createdAt: string;
  listing: {
    code: string;
    district: string;
    province: string;
  } | null;
  project: { slug: string; name: string } | null;
};

type BookingRow = {
  id: string;
  code: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
  unit: { code: string; status: string };
  project: { slug: string; name: string };
};

type PromotionGiftRow = {
  id: string;
  campaignName: string;
  campaignSlug: string;
  prizeLabel: string;
  prizeTier: string;
  redemptionCode: string;
  fulfillmentStatus: string;
  wonAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function statusPill(
  label: string,
  tone: "sky" | "emerald" | "slate" | "violet" | "rose",
) {
  const tones = {
    sky: "bg-sky-100 text-sky-800",
    emerald: "bg-emerald-100 text-emerald-800",
    slate: "bg-slate-100 text-slate-600",
    violet: "bg-violet-100 text-violet-800",
    rose: "bg-rose-100 text-rose-800",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
      )}
    >
      {label}
    </span>
  );
}

function bookingTone(
  status: string,
): "sky" | "emerald" | "slate" | "violet" | "rose" {
  if (status === "CONFIRMED" || status === "PENDING") return "sky";
  if (status === "CONVERTED_TO_DEPOSIT") return "violet";
  if (status === "CANCELLED") return "rose";
  return "slate";
}

function giftFulfillmentLabel(status: string) {
  switch (status) {
    case "PENDING_CONTRACT":
      return "Chờ ký HĐMB NOXH";
    case "CONTRACT_SIGNED":
      return "Đã ký HĐMB — chờ trao quà";
    case "DELIVERED":
      return "Đã trao quà";
    default:
      return status;
  }
}

export function CustomerAccountBoard() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [promotionGifts, setPromotionGifts] = useState<PromotionGiftRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/customer/me", {
        headers: { accept: "application/json" },
      });
      if (res.status === 401 || res.status === 403) {
        setProfile(null);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Không tải được dữ liệu.");
        setProfile(null);
        return;
      }
      setProfile(json.data.profile);
      setLeads(json.data.leads ?? []);
      setBookings(json.data.bookings ?? []);
      setPromotionGifts(json.data.promotionGifts ?? []);
    } catch {
      setError("Lỗi mạng.");
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (profile === undefined) {
    return <p className="py-16 text-center text-slate-500">Đang tải…</p>;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-slate-600">Vui lòng đăng nhập tài khoản khách hàng.</p>
        <div className="mt-4 flex justify-center gap-3">
          <ButtonLink href="/dang-nhap?next=/khach-hang/tai-khoan">
            Đăng nhập
          </ButtonLink>
          <ButtonLink
            href="/dang-ky/khach-hang?next=/khach-hang/tai-khoan"
            variant="outline"
          >
            Đăng ký
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Thông tin tài khoản</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Họ tên</dt>
            <dd className="font-medium text-slate-900">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Số điện thoại</dt>
            <dd className="font-medium text-slate-900">{profile.phoneMasked}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Xác nhận email</dt>
            <dd className="font-medium">
              {profile.emailVerified ? (
                <span className="text-emerald-700">Đã xác nhận</span>
              ) : (
                <span className="text-amber-700">
                  Chưa xác nhận — kiểm tra hộp thư hoặc banner trên đầu trang
                </span>
              )}
            </dd>
          </div>
        </dl>
        {!profile.emailVerified ? (
          <p className="mt-3 text-xs text-slate-500">
            Xác nhận email để xem số điện thoại môi giới trên tin đăng.
          </p>
        ) : null}
      </div>

      <nav className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/du-an"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-300"
        >
          <p className="font-semibold text-slate-900">Khám phá dự án</p>
          <p className="mt-1 text-xs text-slate-500">NOXH · căn thương mại</p>
        </Link>
        <Link
          href="/lien-he"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-300"
        >
          <p className="font-semibold text-slate-900">Gửi yêu cầu tư vấn</p>
          <p className="mt-1 text-xs text-slate-500">House X liên hệ lại</p>
        </Link>
        <Link
          href="/khuyen-mai"
          className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-300"
        >
          <p className="font-semibold text-slate-900">Quà & khuyến mãi</p>
          <p className="mt-1 text-xs text-slate-500">Vòng quay NOXH</p>
        </Link>
      </nav>

      {error ? (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      <section>
        <h2 className="text-lg font-bold text-slate-900">Quà tặng (NOXH)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Phần thưởng vòng quay — có giá trị khi ký HĐMB NOXH qua House X.
        </p>
        {promotionGifts.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm">
            <p className="text-slate-600">Chưa có quà trên tài khoản.</p>
            <Link
              href="/khuyen-mai"
              className="mt-2 inline-block font-medium text-brand-700 hover:underline"
            >
              Tham gia vòng quay NOXH →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {promotionGifts.map((gift) => (
              <li
                key={gift.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-900">{gift.prizeLabel}</p>
                <p className="mt-1 text-xs text-slate-500">{gift.campaignName}</p>
                <p className="mt-2 font-mono text-sm font-bold text-brand-800">
                  {gift.redemptionCode}
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  {giftFulfillmentLabel(gift.fulfillmentStatus)} ·{" "}
                  {formatDate(gift.wonAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Yêu cầu tư vấn</h2>
        <p className="mt-1 text-sm text-slate-500">
          Lead gắn tin đăng hoặc dự án bạn đã để lại thông tin.
        </p>
        {leads.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm">
            <p className="text-slate-600">Chưa có yêu cầu tư vấn.</p>
            <Link
              href="/lien-he"
              className="mt-2 inline-block font-medium text-brand-700 hover:underline"
            >
              Gửi yêu cầu tư vấn →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    {lead.listing ? (
                      <Link
                        href={`/tin-dang/${lead.listing.code}`}
                        className="font-semibold text-brand-700 hover:underline"
                      >
                        Tin {lead.listing.code}
                      </Link>
                    ) : lead.project ? (
                      <Link
                        href={`/du-an/${lead.project.slug}`}
                        className="font-semibold text-brand-700 hover:underline"
                      >
                        {lead.project.name}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-800">
                        Tư vấn chung
                      </span>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                  {statusPill(
                    LEAD_STATUS_LABEL[lead.status] ?? lead.status,
                    "emerald",
                  )}
                </div>
                {lead.message ? (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {lead.message}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900">Suất giữ mua (F1)</h2>
        <p className="mt-1 text-sm text-slate-500">
          Giữ suất không khóa căn — vận hành liên hệ khi chuyển cọc.
        </p>
        {bookings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm">
            <p className="text-slate-600">Chưa có suất giữ.</p>
            <Link
              href="/du-an"
              className="mt-2 inline-block font-medium text-brand-700 hover:underline"
            >
              Xem dự án để giữ suất →
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-900">
                      {b.code}
                    </p>
                    <Link
                      href={`/du-an/${b.project.slug}#project-inventory-heading`}
                      className="mt-1 block text-sm font-medium text-brand-700 hover:underline"
                    >
                      {b.project.name} · căn {b.unit.code}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      Gửi {formatDate(b.createdAt)}
                      {b.expiresAt
                        ? ` · hết hạn ${formatDate(b.expiresAt)}`
                        : null}
                    </p>
                  </div>
                  {statusPill(
                    UNIT_BOOKING_STATUS_LABEL[b.status] ?? b.status,
                    bookingTone(b.status),
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Trạng thái căn trên giỏ hàng:{" "}
                  <span className="font-medium">{b.unit.status}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AccountPasswordPanel
        passwordReady={Boolean(profile.passwordReady)}
        defaultEmail={profile.email}
      />
    </div>
  );
}
