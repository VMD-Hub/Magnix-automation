import type { Metadata } from "next";
import Link from "next/link";
import { CtvApplicationForm } from "@/components/auth/ctv-application-form";

export const metadata: Metadata = {
  title: "Đăng ký cộng tác viên (CTV)",
  robots: { index: false },
};

export default function CtvRegisterPage() {
  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900">Đăng ký cộng tác viên</h1>
        <p className="mt-2 text-sm text-slate-600">
          Dành cho cộng tác viên muốn giới thiệu, bán hàng liên kết hoặc mua qua House X.
          Cần{" "}
          <Link href="/dang-ky/moi-gioi" className="font-semibold text-brand-700">
            đăng ký tài khoản
          </Link>{" "}
          trước.{" "}
          <Link
            href="/affiliate-bat-dong-san"
            className="font-semibold text-brand-700"
          >
            Tìm hiểu chương trình
          </Link>
          .
        </p>
      </div>
      <div className="mt-8">
        <CtvApplicationForm />
      </div>
    </div>
  );
}
