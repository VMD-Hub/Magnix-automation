import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { safeNextPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Đăng ký môi giới",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function BrokerRegisterPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <AuthForm role="BROKER" nextPath={safeNextPath(next)} />
    </div>
  );
}
