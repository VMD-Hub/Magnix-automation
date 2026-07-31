import type { Metadata } from "next";
import Link from "next/link";
import { CtvCartGrid } from "@/components/ctv/ctv-cart-grid";
import { CtvHelpFab } from "@/components/ctv/ctv-help-fab";

export const metadata: Metadata = {
  title: "Giỏ hàng — CTV | HouseX",
  description:
    "Kho sản phẩm House X — NOXH và chung cư tầm trung để đối tác chọn bán / khai báo deal.",
};

export default function CtvCartPage() {
  return (
    <div className="mx-auto max-w-4xl py-8 container-px">
      <Link
        href="/moi-gioi/ho-so"
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        ← Hồ sơ NOXH
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Giỏ hàng</h1>
      <p className="mt-1 text-slate-500">
        Kho sản phẩm hợp tác — chọn dự án rồi khai báo deal (A+B+C).
      </p>
      <div className="mt-6">
        <CtvCartGrid />
      </div>
      <CtvHelpFab />
    </div>
  );
}
