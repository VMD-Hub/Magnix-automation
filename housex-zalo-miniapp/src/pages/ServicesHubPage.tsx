import { PageBrandHeader } from "@/components/PageBrandHeader";
import { EcosystemServicesGrid } from "@/components/EcosystemServicesGrid";
import { HOME_SERVICES } from "@/data/home-ia";

/** Hub tab Dịch vụ — vay, bảo hiểm, định giá, nội thất… */
export function ServicesHubPage() {
  const items = HOME_SERVICES.filter((s) => s.id !== "dich-vu-hub");

  return (
    <div>
      <PageBrandHeader
        kicker="DỊCH VỤ"
        title="Dịch vụ House X"
        lead="Vay, bảo hiểm, định giá, nội thất — chọn mục bạn cần hỗ trợ."
        backTo="/"
      />
      <EcosystemServicesGrid
        items={items}
        title="Chọn dịch vụ"
        lead="Xem điều kiện, quy trình và gửi yêu cầu tư vấn."
      />
    </div>
  );
}
