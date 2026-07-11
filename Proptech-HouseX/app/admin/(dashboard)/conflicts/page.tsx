import { AdminShell } from "@/components/admin/admin-shell";
import { AttributionConflictBoard } from "@/components/admin/attribution-conflict-board";

export const metadata = {
  title: "Xung đột attribution — Admin",
};

export default function AdminConflictsPage() {
  return (
    <AdminShell
      title="Xung đột attribution"
      description="SĐT trùng giữa pipeline Ops (ads/form) và CTV — duyệt theo LEAD_ATTRIBUTION_CONFLICT_RULES."
    >
      <AttributionConflictBoard />
    </AdminShell>
  );
}
