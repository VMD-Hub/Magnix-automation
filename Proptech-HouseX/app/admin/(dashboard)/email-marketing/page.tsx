import { AdminShell } from "@/components/admin/admin-shell";
import { EmailMarketingBoard } from "@/components/admin/email-marketing-board";

export const metadata = {
  title: "Email marketing — Admin",
};

export default function AdminEmailMarketingPage() {
  return (
    <AdminShell
      title="Email marketing"
      description="Nurture email (ADR-017): KPI, consent, enroll/gửi/dừng. Chỉ Chủ quản — không thay telesales gọi nóng."
    >
      <EmailMarketingBoard />
    </AdminShell>
  );
}
