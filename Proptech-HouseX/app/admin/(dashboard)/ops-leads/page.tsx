import { AdminShell } from "@/components/admin/admin-shell";
import { OpsLeadBoard } from "@/components/admin/ops-lead-board";

export const metadata = {
  title: "Ops Leads — Admin",
};

export default function AdminOpsLeadsPage() {
  return (
    <AdminShell
      title="Lead marketing"
      description="Pipeline lead từ Ads, form web và công cụ kiểm tra NOXH — nurture theo segment, không gán CTV."
    >
      <OpsLeadBoard />
    </AdminShell>
  );
}
