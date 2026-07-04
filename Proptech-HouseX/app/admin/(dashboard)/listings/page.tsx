import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ListingReviewBoard } from "@/components/admin/listing-review-board";

export const metadata: Metadata = {
  title: "Duyệt tin đăng",
  robots: { index: false, follow: false },
};

export default function AdminListingsPage() {
  return (
    <AdminShell title="Duyệt tin đăng môi giới">
      <ListingReviewBoard />
    </AdminShell>
  );
}
