import type { Metadata } from "next";
import Link from "next/link";
import { PartnershipsBilingualPage } from "@/components/content/partnerships-bilingual-page";
import { TrustBreadcrumb } from "@/components/content/trust-page-sections";
import { PARTNERSHIPS_PAGE } from "@/lib/content/partnerships-page-content";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: PARTNERSHIPS_PAGE.metaTitle,
  description: PARTNERSHIPS_PAGE.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/hop-tac` },
};

export default function HopTacPage() {
  return (
    <div className="proptech-section-glow mx-auto max-w-4xl py-10 container-px">
      <TrustBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "/gioi-thieu" },
          { label: "Hợp tác & Đăng tin" },
        ]}
      />

      <PartnershipsBilingualPage />

      <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600">
        Câu hỏi thường gặp:{" "}
        <Link href="/cau-hoi-thuong-gap" className="font-semibold text-brand-700 underline">
          FAQ House X
        </Link>
        . Chính sách khiếu nại:{" "}
        <Link href="/chinh-sach-khieu-nai" className="font-semibold text-brand-700 underline">
          Xử lý khiếu nại
        </Link>
        .
      </p>
    </div>
  );
}
