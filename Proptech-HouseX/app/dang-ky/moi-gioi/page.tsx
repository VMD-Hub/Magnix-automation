import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import {
  resolveAuthPageRedirect,
  safeNextPath,
} from "@/lib/auth/redirect";
import { getSessionUser } from "@/lib/auth/session";
import { loadSessionProfile } from "@/lib/auth/session-profile";

export const metadata: Metadata = {
  title: "Đăng ký môi giới",
  robots: { index: false },
};

type PageProps = { searchParams: Promise<{ next?: string }> };

export default async function BrokerRegisterPage({ searchParams }: PageProps) {
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
      <AuthForm role="BROKER" nextPath={nextPath} />
    </div>
  );
}
