import { AdminShell } from "@/components/admin/admin-shell";
import { ConversionOpsBoard } from "@/components/admin/conversion-ops-board";

export const metadata = {
  title: "Conversion — Admin",
};

export default function AdminConversionPage() {
  return (
    <AdminShell
      title="Chuyển đổi bán hàng (Journey P)"
      description="Theo dõi cơ hội từ lead → đề xuất căn → giữ chỗ/cọc → thắng/thua. Không hiện SĐT/email."
    >
      <ConversionOpsBoard />
    </AdminShell>
  );
}
