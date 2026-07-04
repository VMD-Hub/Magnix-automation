"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { ButtonLink } from "@/components/ui/button";

type Status = "loading" | "ok" | "error";

export default function VerifyEmailClient() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Thiếu mã xác nhận trong link.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          setStatus("ok");
          setMessage("Email của bạn đã được xác nhận thành công.");
        } else {
          setStatus("error");
          setMessage(json?.error?.message ?? "Link không hợp lệ hoặc đã hết hạn.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Lỗi kết nối. Vui lòng thử lại.");
      });
  }, [token]);

  return (
    <div className="mx-auto max-w-md py-16 container-px">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <HouseXHeaderLogo href="/" priority={false} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Xác nhận email</h1>

        {status === "loading" ? (
          <p className="mt-4 text-slate-500">Đang xác nhận…</p>
        ) : null}

        {status === "ok" ? (
          <>
            <p className="mt-4 text-brand-700">{message}</p>
            <p className="mt-2 text-sm text-slate-500">
              Bạn sẽ nhận thông báo tin đăng, nhắc nhở và có thể dùng email để
              khôi phục mật khẩu khi cần.
            </p>
            <ButtonLink href="/" className="mt-6">
              Về trang chủ
            </ButtonLink>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <p className="mt-4 text-rose-700">{message}</p>
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/dang-nhap" className="font-semibold text-brand-700">
                Đăng nhập
              </Link>{" "}
              để gửi lại email xác nhận.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
