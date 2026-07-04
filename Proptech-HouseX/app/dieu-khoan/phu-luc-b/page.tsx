import type { Metadata } from "next";
import { BilingualAppendixDocument } from "@/components/content/bilingual-appendix-document";
import { APPENDIX_B_REFUND } from "@/lib/content/terms-appendix-b-refund";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: APPENDIX_B_REFUND.metaTitle,
  description: APPENDIX_B_REFUND.metaDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: `${getSiteUrl()}/dieu-khoan/phu-luc-b` },
};

export default function PhuLucBRefundPage() {
  return <BilingualAppendixDocument doc={APPENDIX_B_REFUND} />;
}
