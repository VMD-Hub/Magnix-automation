import type { Metadata } from "next";
import { BrokerListingPage } from "@/components/broker/broker-listing-page";

export const metadata: Metadata = {
  title: "Đăng tin bất động sản",
  description:
    "Môi giới House X đăng tin bán hoặc cho thuê — soạn tin sau khi đăng nhập tài khoản môi giới.",
  robots: { index: false, follow: false },
};

export default function BrokerCreateListingPage() {
  return (
    <>
      <h1 className="sr-only">Đăng tin bất động sản House X</h1>
      <BrokerListingPage />
    </>
  );
}
