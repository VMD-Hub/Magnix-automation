import type { Metadata } from "next";
import { BilingualAppendixDocument } from "@/components/content/bilingual-appendix-document";
import { APPENDIX_A_SLA } from "@/lib/content/terms-appendix-a-sla";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: APPENDIX_A_SLA.metaTitle,
  description: APPENDIX_A_SLA.metaDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: `${getSiteUrl()}/dieu-khoan/phu-luc-a` },
};

export default function PhuLucASlaPage() {
  return <BilingualAppendixDocument doc={APPENDIX_A_SLA} />;
}
