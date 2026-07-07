import type { Metadata } from "next";
import { Suspense } from "react";
import { PromotionHub } from "@/components/promotion/promotion-hub";

export const metadata: Metadata = {
  title: "Khuyến mãi NOXH — Vòng quay may mắn HouseX",
  description:
    "Vòng quay khuyến mãi dành riêng phân hệ nhà ở xã hội (NOXH) trên HouseX. Không áp dụng nhà thương mại hay dịch vụ khác. Quà có giá trị sau HĐMB NOXH.",
  alternates: { canonical: "/khuyen-mai" },
};

export default function KhuyenMaiPage() {
  return (
    <div className="proptech-section-glow mx-auto max-w-6xl py-8 container-px">
      <Suspense fallback={<div className="py-16 text-center text-slate-500">Đang tải…</div>}>
        <PromotionHub />
      </Suspense>
    </div>
  );
}
