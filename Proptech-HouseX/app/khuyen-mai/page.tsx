import type { Metadata } from "next";
import { PromotionHub } from "@/components/promotion/promotion-hub";

export const metadata: Metadata = {
  title: "Khuyến mãi — Vòng quay may mắn HouseX",
  description:
    "Tham gia vòng quay khuyến mãi dành cho khách hàng đủ điều kiện mua nhà ở xã hội trên HouseX. Quà tặng sau khi ký HĐMB thành công.",
  alternates: { canonical: "/khuyen-mai" },
};

export default function KhuyenMaiPage() {
  return (
    <div className="proptech-section-glow mx-auto max-w-6xl py-8 container-px">
      <PromotionHub />
    </div>
  );
}
