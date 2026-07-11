import { AdminShell } from "@/components/admin/admin-shell";
import { InboundLeadBoard } from "@/components/admin/inbound-lead-board";

export const metadata = {
  title: "Magnix Inbound — Admin",
};

export default function AdminInboundLeadsPage() {
  return (
    <AdminShell
      title="Magnix Inbound"
      description="Lead inbound từ Magnix growth engine — phân loại và chuyển nurture."
    >
      <InboundLeadBoard />
    </AdminShell>
  );
}
