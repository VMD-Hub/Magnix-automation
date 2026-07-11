import { AdminShell } from "@/components/admin/admin-shell";
import { OpsPlaybook } from "@/components/admin/ops-playbook";

export const metadata = {
  title: "Playbook Ops — Admin",
};

export default function AdminPlaybookPage() {
  return (
    <AdminShell
      title="Playbook Ops"
      description="Đào tạo & SOP vận hành — lead, hồ sơ NOXH, xung đột. In PDF cho nhân viên không cần truy cập mã nguồn."
    >
      <OpsPlaybook />
    </AdminShell>
  );
}
