"use client";

import { useEffect, useState } from "react";
import { BrokerListingForm } from "@/components/broker/broker-listing-form";
import { ButtonLink } from "@/components/ui/button";

export function BrokerListingPage({ listingId }: { listingId?: string }) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => setAuthed(j.data?.user?.role === "BROKER"))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return <p className="py-16 text-center text-slate-500">Đang tải…</p>;
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md py-16 text-center container-px">
        <p className="text-slate-600">Đăng tin yêu cầu tài khoản môi giới.</p>
        <div className="mt-4 flex justify-center gap-3">
          <ButtonLink href="/dang-nhap?next=/moi-gioi/dang-tin">Đăng nhập</ButtonLink>
          <ButtonLink href="/dang-ky/moi-gioi" variant="outline">
            Đăng ký môi giới
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10 container-px">
      <h1 className="text-2xl font-bold text-slate-900">
        {listingId ? "Sửa tin đăng" : "Đăng tin mới"}
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Lưu nháp trước, thêm ảnh (URL), rồi bấm đăng hiển thị khi đủ điều kiện chất lượng.
      </p>
      <div className="mt-8">
        <BrokerListingForm listingId={listingId} />
      </div>
    </div>
  );
}
