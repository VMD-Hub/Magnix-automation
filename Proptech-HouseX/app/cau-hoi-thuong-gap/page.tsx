import type { Metadata } from "next";
import Link from "next/link";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { TrustBreadcrumb, PageCtaBand } from "@/components/content/trust-page-sections";
import { FAQ_HUB, PLATFORM_FAQ } from "@/lib/content/trust-hub-content";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: FAQ_HUB.metaTitle,
  description: FAQ_HUB.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/cau-hoi-thuong-gap` },
};

export default function CauHoiThuongGapPage() {
  const faqJsonLd = buildRichFaqJsonLd(PLATFORM_FAQ);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl py-10 container-px">
        <TrustBreadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: FAQ_HUB.title },
          ]}
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {FAQ_HUB.title}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">{FAQ_HUB.lead}</p>

        <ToolsFaqSection
          heading="Câu hỏi về House X"
          items={PLATFORM_FAQ}
          className="mt-10"
        />

        <p className="mt-8 text-sm text-slate-600">
          Chi tiết quy trình kiểm tra tin:{" "}
          <Link href="/gioi-thieu/phuong-phap-bien-tap" className="font-semibold text-brand-700 underline">
            Phương pháp biên tập
          </Link>
          . Khiếu nại & báo tin sai:{" "}
          <Link href="/chinh-sach-khieu-nai" className="font-semibold text-brand-700 underline">
            Chính sách xử lý khiếu nại
          </Link>
          . Chính sách dữ liệu:{" "}
          <Link href="/bao-mat" className="font-semibold text-brand-700 underline">
            Bảo mật
          </Link>
          .
        </p>

        <PageCtaBand
          className="mt-10"
          primary={{ label: "Liên hệ hỗ trợ", href: "/lien-he" }}
          secondary={{ label: "Tìm nhà", href: "/mua-ban" }}
        />
      </div>
    </>
  );
}
