import type { Metadata } from "next";
import { BrokerListingsBoard } from "@/components/broker/broker-listings-board";

export const metadata: Metadata = {
  title: "Tin đăng của tôi",
  description: "Quản lý tin bán và cho thuê trên HouseX.",
  robots: { index: false, follow: false },
};

export default function BrokerMyListingsPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 container-px">
      <h1 className="text-2xl font-bold text-slate-900">Tin đăng của tôi</h1>
      <p className="mt-1 text-sm text-slate-600">Nháp, đang hiển thị và tin hết hạn.</p>
      <div className="mt-8">
        <BrokerListingsBoard />
      </div>
    </div>
  );
}
