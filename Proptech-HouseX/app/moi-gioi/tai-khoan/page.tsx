"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";

type Profile = {
  role: string;
  name: string;
  brokerId?: string;
  ctvCode?: string | null;
  ctvApplicationStatus?: string | null;
};

export default function BrokerAccountPage() {
  const [user, setUser] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setUser(j.data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return <p className="py-16 text-center text-slate-500">Đang tải…</p>;
  }

  if (!user || user.role !== "BROKER") {
    return (
      <div className="mx-auto max-w-md py-16 text-center container-px">
        <p className="text-slate-600">Vui lòng đăng nhập tài khoản môi giới.</p>
        <ButtonLink href="/dang-ky/moi-gioi" className="mt-4">
          Đăng ký môi giới
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10 container-px">
      <h1 className="text-2xl font-bold text-slate-900">Tài khoản môi giới</h1>
      <p className="mt-1 text-slate-500">Xin chào, {user.name}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dang-tin"
          className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300"
        >
          <Icon.Building className="text-2xl text-brand-600" />
          <p className="mt-2 font-semibold">Đăng tin mới</p>
        </Link>
        <Link
          href="/moi-gioi/dang-ky-ctv"
          className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300"
        >
          <Icon.BadgeCheck className="text-2xl text-brand-600" />
          <p className="mt-2 font-semibold">
            {user.ctvCode ? `Mã CTV: ${user.ctvCode}` : "Đăng ký CTV"}
          </p>
          {user.ctvApplicationStatus === "PENDING" ? (
            <p className="text-xs text-amber-600">Đang chờ duyệt</p>
          ) : null}
        </Link>
      </div>
    </div>
  );
}
