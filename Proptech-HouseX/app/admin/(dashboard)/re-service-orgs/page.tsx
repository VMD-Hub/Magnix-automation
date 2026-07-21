import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ReServiceOrgBoard } from "@/components/admin/re-service-org-board";

export const metadata: Metadata = {
  title: "Registry dịch vụ BĐS | House X Admin",
  robots: { index: false, follow: false },
};

export default function ReServiceOrgsAdminPage() {
  return (
    <AdminShell
      title="Registry tổ chức KD dịch vụ BĐS"
      description="Tài sản dữ liệu nội bộ (Chủ quản): sàn / DN môi giới theo địa giới mới — biên tập trước khi ra tin người đọc. Không public raw."
    >
      <ReServiceOrgBoard />
    </AdminShell>
  );
}
