import { EcosystemServicesGrid } from "@/components/EcosystemServicesGrid";
import type { HomeServiceItem } from "@/data/home-ia";

export function HomeServicesSection({ items }: { items: HomeServiceItem[] }) {
  return (
    <EcosystemServicesGrid
      items={items}
      title="Dịch vụ"
      lead="Vay · bảo hiểm · định giá · nội thất — hệ sinh thái House X tạo uy tín và đồng hành đến giao dịch."
    />
  );
}
