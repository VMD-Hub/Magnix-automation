import { redirect } from "next/navigation";
import { articlePath } from "@/lib/content/article-routes";
import { CASE_CAI_BAY_DTI_SLUG } from "@/lib/personal-brand/vu-nguyen/case-studies";
import { VU_NGUYEN_PORTFOLIO_PATH } from "@/lib/personal-brand/vu-nguyen/nfc-mode";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Zone `/vu-nguyen/case/*` không còn host bài đầy đủ.
 * - cai-bay-dti → Wiki NOXH (CMS / Super Admin)
 * - case khác → portfolio `/vu-nguyen/ho-so` (tạm)
 */
export default async function VuNguyenCaseLegacyRedirect({ params }: Props) {
  const { slug } = await params;
  if (slug === CASE_CAI_BAY_DTI_SLUG) {
    redirect(articlePath(CASE_CAI_BAY_DTI_SLUG));
  }
  redirect(VU_NGUYEN_PORTFOLIO_PATH);
}
