import { redirect } from "next/navigation";
import { VU_NGUYEN_PORTFOLIO_PATH } from "@/lib/personal-brand/vu-nguyen/nfc-mode";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Case đã chuyển sang pipeline SEO website — không còn trên zone danh thiếp. */
export default async function VuNguyenCaseLegacyRedirect({ params }: Props) {
  await params;
  redirect(VU_NGUYEN_PORTFOLIO_PATH);
}
