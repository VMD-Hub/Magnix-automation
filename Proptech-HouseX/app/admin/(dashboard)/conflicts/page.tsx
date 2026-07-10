import { AdminShell } from "@/components/admin/admin-shell";
import { AttributionConflictBoard } from "@/components/admin/attribution-conflict-board";

export const metadata = {
  title: "Xung đột attribution — Admin",
};

export default function AdminConflictsPage() {
  return (
    <AdminShell title="Xung đột Ops vs CTV">
      <p className="mb-4 text-sm text-slate-600">
        SĐT trùng giữa pipeline Ops (ads/form) và CTV affiliate — duyệt theo rule{" "}
        <code className="text-xs">LEAD_ATTRIBUTION_CONFLICT_RULES</code>.
      </p>
      <AttributionConflictBoard />
    </AdminShell>
  );
}
