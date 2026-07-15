import { EcosystemServicesGrid } from "@/components/EcosystemServicesGrid";
import type { HomeServiceItem } from "@/data/home-ia";

export function HomeServicesSection({ items }: { items: HomeServiceItem[] }) {
  return (
    <EcosystemServicesGrid
      items={items}
      title="Dịch vụ"
      lead="Chọn dịch vụ bạn cần hỗ trợ — xem điều kiện, quy trình và gửi yêu cầu tư vấn."
    />
  );
}
