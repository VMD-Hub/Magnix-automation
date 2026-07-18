import { AdminShell } from "@/components/admin/admin-shell";
import { ConversionOpsBoard } from "@/components/admin/conversion-ops-board";

export const metadata = {
  title: "Conversion — Admin",
};

export default function AdminConversionPage() {
  return (
    <AdminShell
      title="Sales conversion"
      description="Journey P funnel — proposal, commit evidence, outcome và nurture eligibility (không hiện PII)."
    >
      <ConversionOpsBoard />
    </AdminShell>
  );
}
