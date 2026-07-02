import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { safeNextPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <p className="mb-6 text-center text-sm text-slate-500">
        Chọn đúng loại tài khoản khi{" "}
        <Link href="/dang-ky" className="font-semibold text-brand-700">
          đăng ký mới
        </Link>
        . Đăng nhập dùng chung SĐT + mật khẩu.
      </p>
      {/* Mặc định form khách — broker chuyển tab hoặc dùng /dang-ky/moi-gioi */}
      <AuthForm role="CUSTOMER" nextPath={nextPath} />
    </div>
  );
}
