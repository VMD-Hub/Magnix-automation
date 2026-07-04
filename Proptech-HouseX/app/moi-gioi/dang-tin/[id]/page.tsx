import type { Metadata } from "next";
import { BrokerListingPage } from "@/components/broker/broker-listing-page";

export const metadata: Metadata = {
  title: "Sửa tin đăng",
  robots: { index: false, follow: false },
};

export default async function BrokerEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrokerListingPage listingId={id} />;
}
