import { AdminShell } from "@/components/admin/admin-shell";
import { OpsLeadBoard } from "@/components/admin/ops-lead-board";

export const metadata = {
  title: "Ops Leads — Admin",
};

export default function AdminOpsLeadsPage() {
  return (
    <AdminShell
      title="Lead marketing"
      description="Telesales pipeline (Super). Staff được duyệt dùng /ops/telesales hoặc Mini App #/ops — cấp quyền tại Quyền telesales."
    >
      <OpsLeadBoard />
    </AdminShell>
  );
}
