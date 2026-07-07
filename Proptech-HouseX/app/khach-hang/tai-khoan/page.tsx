import type { Metadata } from "next";
import { CustomerAccountBoard } from "@/components/customer/customer-account-board";

export const metadata: Metadata = {
  title: "Tài khoản khách hàng",
  description: "Theo dõi yêu cầu tư vấn, suất giữ mua và quà tặng NOXH trên HouseX.",
  robots: { index: false, follow: false },
};

export default function CustomerAccountPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 container-px">
      <h1 className="text-2xl font-bold text-slate-900">Tài khoản khách hàng</h1>
      <p className="mt-1 text-sm text-slate-600">
        Yêu cầu tư vấn, suất giữ mua, quà tặng vòng quay NOXH và trạng thái xác nhận email.
      </p>
      <div className="mt-8">
        <CustomerAccountBoard />
      </div>
    </div>
  );
}
