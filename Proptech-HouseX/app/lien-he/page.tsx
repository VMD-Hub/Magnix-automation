import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AffiliateContactForm } from "@/components/affiliate/affiliate-contact-form";
import { SiteContact } from "@/components/layout/site-contact";
import {
  ContactRouteCards,
  TrustBreadcrumb,
} from "@/components/content/trust-page-sections";
import { CONTACT_PAGE } from "@/lib/content/trust-hub-content";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: CONTACT_PAGE.metaTitle,
  description: CONTACT_PAGE.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/lien-he` },
};

type Props = {
  searchParams: Promise<{ "dich-vu"?: string; goi?: string }>;
};

export default async function LienHePage({ searchParams }: Props) {
  const sp = await searchParams;
  const vertical = sp["dich-vu"] ?? undefined;
  const need = sp.goi ?? undefined;
  const c = CONTACT_PAGE;

  return (
    <div className="mx-auto max-w-2xl py-10 container-px">
      <TrustBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Liên hệ" },
        ]}
      />

      <h1 className="text-3xl font-extrabold text-slate-900">{c.title}</h1>
      <p className="mt-2 text-slate-600">{c.lead}</p>

      <SiteContact variant="light" className="mt-4" />
      <p className="mt-1 text-sm text-slate-500">Thứ 2 – Thứ 6, 8:30 – 17:30</p>

      <ContactRouteCards routes={c.routes} className="mt-8" />

      <section className="mt-10 rounded-2xl border border-silver-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Gửi yêu cầu tư vấn</h2>
        <p className="mt-1 text-sm text-slate-600">
          Vay mua nhà, thẩm định giá, nội thất — điền form, chúng tôi liên hệ trong giờ hành chính.
        </p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-slate-500">Đang tải form…</p>}>
            <AffiliateContactForm defaultVertical={vertical} defaultNeed={need} />
          </Suspense>
        </div>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        Câu hỏi nhanh:{" "}
        <Link href="/cau-hoi-thuong-gap" className="font-semibold text-brand-700 underline">
          Câu hỏi thường gặp
        </Link>
        . Báo tin sai hoặc khiếu nại:{" "}
        <Link href="/chinh-sach-khieu-nai" className="font-semibold text-brand-700 underline">
          Chính sách xử lý khiếu nại
        </Link>
        . Chính sách dữ liệu:{" "}
        <Link href="/bao-mat" className="font-semibold text-brand-700 underline">
          Bảo mật
        </Link>
        .
      </p>
    </div>
  );
}
