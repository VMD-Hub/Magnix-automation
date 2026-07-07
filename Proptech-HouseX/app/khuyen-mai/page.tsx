import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
import { PromotionHub } from "@/components/promotion/promotion-hub";

export const metadata: Metadata = {
  title: "Khuyến mãi NOXH — Vòng quay may mắn HouseX",
  description:
    "Vòng quay khuyến mãi dành riêng phân hệ nhà ở xã hội (NOXH) trên HouseX. Không áp dụng nhà thương mại hay dịch vụ khác. Quà có giá trị sau HĐMB NOXH.",
  alternates: { canonical: "/khuyen-mai" },
};

export default function KhuyenMaiPage() {
  return (
    <CatalogPageShell maxWidth="max-w-6xl">
      <Suspense fallback={<div className="py-16 text-center text-slate-500">Đang tải…</div>}>
        <PromotionHub />
      </Suspense>
    </CatalogPageShell>
  );
}
