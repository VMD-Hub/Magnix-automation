import type { Metadata } from "next";
import { PromotionHub } from "@/components/promotion/promotion-hub";

export const metadata: Metadata = {
  title: "Preview — Khuyến mãi Lucky Wheel",
  robots: { index: false, follow: false },
};

export default function PreviewKhuyenMaiPage() {
  return (
    <div className="proptech-section-glow mx-auto max-w-6xl py-8 container-px">
      <PromotionHub preview />
    </div>
  );
}
