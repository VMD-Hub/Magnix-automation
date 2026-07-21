"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { ButtonLink } from "@/components/ui/button";

type Status = "loading" | "ok" | "error";

export default function UnsubscribeEmailClient() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Thiếu mã hủy đăng ký trong link.");
      return;
    }

    fetch("/api/consent/email-unsubscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          setStatus("ok");
          setMessage(
            "Bạn đã hủy nhận email marketing từ House X. Chúng tôi sẽ không gửi bản tin / chuỗi nurture qua email nữa.",
          );
        } else {
          setStatus("error");
          setMessage(
            json?.error?.message ?? "Link không hợp lệ hoặc đã hết hạn.",
          );
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
          <HouseXHeaderLogo href="/" priority={false} surface="light" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Hủy đăng ký email
        </h1>

        {status === "loading" ? (
          <p className="mt-4 text-slate-500">Đang hủy đăng ký…</p>
        ) : null}

        {status === "ok" ? (
          <>
            <p className="mt-4 text-brand-700">{message}</p>
            <p className="mt-2 text-sm text-slate-500">
              Email xác nhận tài khoản, OTP và thông báo dịch vụ bắt buộc (nếu
              có) không bị ảnh hưởng. Bạn vẫn có thể dùng Mini App / Zalo OA khi
              muốn nhận cập nhật dự án.
            </p>
            <ButtonLink href="/" className="mt-6">
              Về trang chủ
            </ButtonLink>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <p className="mt-4 text-red-600">{message}</p>
            <ButtonLink href="/lien-he" className="mt-6" variant="outline">
              Liên hệ hỗ trợ
            </ButtonLink>
          </>
        ) : null}
      </div>
    </div>
  );
}
