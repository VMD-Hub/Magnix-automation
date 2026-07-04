import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/content/trust-page-sections";
import { DocSubheading } from "@/components/content/document-typography";
import { PRIVACY_CONTENT } from "@/lib/content/trust-hub-content";
import { getSupportEmail, getSupportPhoneDisplay, getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: PRIVACY_CONTENT.metaTitle,
  description: PRIVACY_CONTENT.metaDescription,
  alternates: { canonical: `${getSiteUrl()}/bao-mat` },
};

export default function BaoMatPage() {
  const p = PRIVACY_CONTENT;
  const supportEmail = getSupportEmail();
  const supportPhone = getSupportPhoneDisplay();

  return (
    <>
      <LegalDocument
        title={p.title}
        updated={p.updated}
        intro={p.intro}
        sections={p.sections}
      />
      <div className="mx-auto max-w-2xl space-y-4 pb-10 container-px">
        <div className="rounded-xl border border-silver-200 bg-slate-50 p-5 not-prose">
          <DocSubheading vi="Liên hệ về bảo mật dữ liệu" className="!mt-0" />
          <ul className="doc-bullets mt-3">
            <li className="doc-body-vi">
              Email:{" "}
              <a href={`mailto:${supportEmail}`} className="font-semibold text-brand-700 underline">
                {supportEmail}
              </a>
            </li>
            <li className="doc-body-vi">
              Hotline:{" "}
              <a href={`tel:${supportPhone.replace(/\s/g, "")}`} className="font-semibold text-brand-700">
                {supportPhone}
              </a>{" "}
              (T2–T6, 8:30–17:30)
            </li>
            <li className="doc-body-vi">
              Form yêu cầu:{" "}
              <Link href="/lien-he" className="font-semibold text-brand-700 underline">
                Trang Liên hệ
              </Link>
            </li>
          </ul>
        </div>
        <p className="text-sm text-slate-500">
          Xem thêm{" "}
          <Link href="/gioi-thieu/phuong-phap-bien-tap" className="text-brand-700 underline">
            Phương pháp biên tập
          </Link>
          {" · "}
          <Link href="/dieu-khoan" className="text-brand-700 underline">
            Điều khoản sử dụng
          </Link>
          .
        </p>
      </div>
    </>
  );
}
