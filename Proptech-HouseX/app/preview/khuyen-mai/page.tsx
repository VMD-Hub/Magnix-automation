import type { Metadata } from "next";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
import { PromotionHub } from "@/components/promotion/promotion-hub";

export const metadata: Metadata = {
  title: "Preview — Khuyến mãi Lucky Wheel",
  robots: { index: false, follow: false },
};

export default function PreviewKhuyenMaiPage() {
  return (
    <CatalogPageShell maxWidth="max-w-6xl">
      <PromotionHub preview />
    </CatalogPageShell>
  );
}
