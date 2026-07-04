import type { Metadata } from "next";
import { BilingualTermsDocument } from "@/components/content/bilingual-terms-document";
import { TERMS_OF_USE } from "@/lib/content/terms-of-use-content";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: TERMS_OF_USE.metaTitle,
  description: TERMS_OF_USE.metaDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: `${getSiteUrl()}/dieu-khoan` },
};

export default function DieuKhoanPage() {
  return <BilingualTermsDocument terms={TERMS_OF_USE} />;
}
