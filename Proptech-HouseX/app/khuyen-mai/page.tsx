import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
import { PromotionHub } from "@/components/promotion/promotion-hub";
import { withOpenGraph } from "@/lib/seo/open-graph";

export const metadata: Metadata = {
  title: "Khuyến mãi NOXH — Vòng quay may mắn",
  description:
    "Vòng quay khuyến mãi dành riêng phân hệ nhà ở xã hội (NOXH) trên House X. Không áp dụng nhà thương mại hay dịch vụ khác. Quà có giá trị sau HĐMB NOXH.",
  alternates: { canonical: "/khuyen-mai" },
  openGraph: withOpenGraph({
    title: "Khuyến mãi NOXH — Vòng quay may mắn",
    description:
      "Vòng quay khuyến mãi dành riêng phân hệ nhà ở xã hội (NOXH) trên House X. Không áp dụng nhà thương mại hay dịch vụ khác.",
    url: "/khuyen-mai",
  }),
};

export default function KhuyenMaiPage() {
  return (
    <CatalogPageShell maxWidth="max-w-6xl">
      {/* H1 SSR ngoài Suspense — crawler không chạy client vẫn thấy tiêu đề. */}
      <h1 className="sr-only">Khuyến mãi NOXH — Vòng quay may mắn</h1>
      <Suspense
        fallback={
          <div className="py-16 text-center text-slate-500">Đang tải…</div>
        }
      >
        <PromotionHub />
      </Suspense>
    </CatalogPageShell>
  );
}
