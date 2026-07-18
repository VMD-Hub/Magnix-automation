import { AdminShell } from "@/components/admin/admin-shell";
import { OpsToolGrantsBoard } from "@/components/admin/ops-tool-grants-board";

export const metadata = {
  title: "Ops grants — Admin",
};

export default function AdminOpsGrantsPage() {
  return (
    <AdminShell
      title="Quyền CRM Telesales"
      description="Super Admin cấp / thu hồi quyền TELESALES_CRM theo SĐT hoặc Zalo user id. Người được duyệt dùng Mini App #/ops hoặc /ops/telesales."
    >
      <OpsToolGrantsBoard />
    </AdminShell>
  );
}
