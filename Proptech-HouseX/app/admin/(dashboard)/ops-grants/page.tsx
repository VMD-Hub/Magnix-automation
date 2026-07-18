import { AdminShell } from "@/components/admin/admin-shell";
import { InternalFloorBrokersPanel } from "@/components/admin/internal-floor-brokers-panel";
import { OpsToolGrantsBoard } from "@/components/admin/ops-tool-grants-board";

export const metadata = {
  title: "Ops grants — Admin",
};

export default function AdminOpsGrantsPage() {
  return (
    <AdminShell
      title="Quyền CRM Telesales"
      description="Cấp quyền tool theo SĐT/Zalo id + email thông báo. Mật khẩu đặt trong Tài khoản (OTP) — không phải MK riêng của tool. Nội sàn: đánh dấu BrokerType.INTERNAL bên dưới."
    >
      <div className="space-y-6">
        <OpsToolGrantsBoard />
        <InternalFloorBrokersPanel />
      </div>
    </AdminShell>
  );
}
