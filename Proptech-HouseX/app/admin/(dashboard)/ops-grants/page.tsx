import { AdminShell } from "@/components/admin/admin-shell";
import { OpsToolGrantsBoard } from "@/components/admin/ops-tool-grants-board";

export const metadata = {
  title: "Ops grants — Admin",
};

export default function AdminOpsGrantsPage() {
  return (
    <AdminShell
      title="Quyền CRM Telesales"
      description="Cấp quyền theo SĐT/Zalo id + email công việc. Hệ thống gửi link đặt mật khẩu (72 giờ) để staff đăng nhập web trên mọi thiết bị."
    >
      <OpsToolGrantsBoard />
    </AdminShell>
  );
}
