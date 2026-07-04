import type { Metadata } from "next";
import Link from "next/link";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { ComplaintPolicyDocument } from "@/components/content/complaint-policy-document";
import { TrustBreadcrumb, PageCtaBand } from "@/components/content/trust-page-sections";
import { COMPLAINT_FAQ, COMPLAINT_FAQ_HEADING } from "@/lib/content/complaint-faq";
import { COMPLAINT_HANDLING_POLICY } from "@/lib/content/complaint-handling-policy";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: COMPLAINT_HANDLING_POLICY.metaTitle,
  description: COMPLAINT_HANDLING_POLICY.metaDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: `${getSiteUrl()}/chinh-sach-khieu-nai` },
};

export default function ChinhSachKhieuNaiPage() {
  const faqJsonLd = buildRichFaqJsonLd(COMPLAINT_FAQ);

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
            { label: "Điều khoản", href: "/dieu-khoan" },
            { label: COMPLAINT_HANDLING_POLICY.titleVi },
          ]}
        />

        <ComplaintPolicyDocument />

        <ToolsFaqSection
          heading={COMPLAINT_FAQ_HEADING}
          items={COMPLAINT_FAQ}
          className="mt-12 border-t border-slate-200 pt-10"
        />

        <p className="mt-6 text-sm text-slate-600">
          Câu hỏi chung về nền tảng:{" "}
          <Link href="/cau-hoi-thuong-gap" className="font-semibold text-brand-700 underline">
            FAQ House X
          </Link>
          .
        </p>

        <PageCtaBand
          className="mt-10"
          primary={{ label: "Gửi khiếu nại / Liên hệ", href: "/lien-he" }}
          secondary={{ label: "Phụ lục A — SLA báo cáo", href: "/dieu-khoan/phu-luc-a" }}
        />
      </div>
    </>
  );
}
