import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import {
  resolveAuthPageRedirect,
  safeNextPath,
} from "@/lib/auth/redirect";
import { getSessionUser } from "@/lib/auth/session";
import { loadSessionProfile } from "@/lib/auth/session-profile";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  const session = await getSessionUser();
  if (session) {
    const profile = await loadSessionProfile(session);
    if (profile) {
      redirect(resolveAuthPageRedirect(nextPath, profile.role));
    }
  }

  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <h1 className="mb-4 text-center text-2xl font-bold text-slate-900">
        Đăng nhập House X
      </h1>
      <p className="mb-6 text-center text-sm text-slate-500">
        Chọn đúng loại tài khoản khi{" "}
        <Link href="/dang-ky" className="font-semibold text-brand-700">
          đăng ký mới
        </Link>
        . Đăng nhập bằng SĐT + mật khẩu — sau đó vào{" "}
        <strong>Tài khoản</strong> (khách hoặc môi giới).
      </p>
      {/* Mặc định form khách — broker chuyển tab hoặc dùng /dang-ky/moi-gioi */}
      <AuthForm role="CUSTOMER" nextPath={nextPath} />
    </div>
  );
}
