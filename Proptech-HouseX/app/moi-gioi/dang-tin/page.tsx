import type { Metadata } from "next";
import { BrokerListingPage } from "@/components/broker/broker-listing-page";

export const metadata: Metadata = {
  title: "Đăng tin bất động sản",
  description: "Môi giới HouseX đăng tin bán hoặc cho thuê.",
  robots: { index: false, follow: false },
};

export default function BrokerCreateListingPage() {
  return <BrokerListingPage />;
}
