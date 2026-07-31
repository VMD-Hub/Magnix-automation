import type { Metadata } from "next";
import Link from "next/link";
import { CtvPartnerContractPanel } from "@/components/ctv/ctv-partner-contract-panel";
import { CtvHelpFab } from "@/components/ctv/ctv-help-fab";

export const metadata: Metadata = {
  title: "E-contract đối tác — CTV | HouseX",
  description:
    "Xem điều khoản khung hợp tác, xác minh OTP và ký e-contract lưu hồ sơ tài khoản.",
};

export default function CtvEcontractPage() {
  return (
    <div className="mx-auto max-w-2xl py-8 container-px">
      <Link
        href="/moi-gioi/tai-khoan"
        className="text-sm text-slate-500 hover:text-slate-800"
      >
        ← Tài khoản môi giới
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        E-contract khung hợp tác
      </h1>
      <p className="mt-1 text-slate-500">
        OTP email + đồng ý điều khoản — chữ ký canvas tuỳ chọn. Sau khi ký mới
        khai báo deal đầy đủ (khi gate bật).
      </p>
      <div className="mt-6">
        <CtvPartnerContractPanel />
      </div>
      <CtvHelpFab />
    </div>
  );
}
