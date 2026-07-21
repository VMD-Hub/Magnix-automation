import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ToolAnalyticsBoard } from "@/components/admin/tool-analytics-board";

export const metadata: Metadata = {
  title: "Tool analytics | House X Admin",
  robots: { index: false, follow: false },
};

export default function ToolAnalyticsAdminPage() {
  return (
    <AdminShell
      title="Tool analytics"
      description="Funnel SoR: bài có CTA tool → lead submit → trạng thái CRM. Ưu tiên 2 tool NƠXH. Pageview chưa lưu DB (GTM)."
    >
      <ToolAnalyticsBoard />
    </AdminShell>
  );
}
