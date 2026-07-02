import type { Metadata } from "next";
import { Suspense } from "react";
import { AffiliateContactForm } from "@/components/affiliate/affiliate-contact-form";
import { SiteContact } from "@/components/layout/site-contact";

export const metadata: Metadata = {
  title: "Liên hệ & tư vấn dịch vụ",
  description:
    "Để lại thông tin — tư vấn viên hoặc trợ lý AI HouseX hỗ trợ dịch vụ vay, định giá BĐS và thiết kế nội thất.",
  alternates: { canonical: "/lien-he" },
};

type Props = {
  searchParams: Promise<{ "dich-vu"?: string; goi?: string }>;
};

export default async function LienHePage({ searchParams }: Props) {
  const sp = await searchParams;
  const vertical = sp["dich-vu"] ?? undefined;
  const need = sp.goi ?? undefined;

  return (
    <div className="mx-auto max-w-xl py-10 container-px">
      <h1 className="text-3xl font-extrabold text-slate-900">Liên hệ tư vấn</h1>
      <SiteContact variant="light" className="mt-3" />
      <p className="mt-2 text-sm text-slate-500">Thứ 2 – Thứ 6, 8:30 – 17:30</p>

      <div className="mt-8">
        <Suspense fallback={<p className="text-slate-500">Đang tải form…</p>}>
          <AffiliateContactForm defaultVertical={vertical} defaultNeed={need} />
        </Suspense>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Xem số môi giới trên tin đăng:{" "}
        <a href="/dang-ky/khach-hang" className="text-brand-700 underline">
          đăng ký khách hàng
        </a>{" "}
        và xác nhận email.
      </p>
    </div>
  );
}
