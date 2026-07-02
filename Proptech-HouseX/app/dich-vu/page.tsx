import type { Metadata } from "next";
import {
  HOUSEX_SERVICES_LABEL,
} from "@/lib/content/housex-services-copy";
import { ServicesHubLanding } from "@/components/affiliate/services-hub-landing";

export const metadata: Metadata = {
  title: "Dịch vụ HouseX — Tài chính, định giá, nội thất",
  description:
    "Dịch vụ tài chính, thẩm định giá và thiết kế nội thất trên nền tảng HouseX — đồng hành từ tìm nhà đến an cư trọn vẹn.",
  alternates: { canonical: "/dich-vu" },
};

export default function DichVuPage() {
  return <ServicesHubLanding />;
}
