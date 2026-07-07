import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PromotionAdminBoard } from "@/components/admin/promotion-admin-board";
import { getPromotionForAdmin } from "@/lib/data/promotion-admin";

export const metadata: Metadata = {
  title: "Chi tiết khuyến mãi",
  robots: { index: false, follow: false },
};

export default async function AdminPromotionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await getPromotionForAdmin(id);
  if (!campaign) notFound();

  return (
    <AdminShell title={`Khuyến mãi: ${campaign.name}`}>
      <PromotionAdminBoard campaignId={id} />
    </AdminShell>
  );
}
