import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HouseXHeaderLogo } from "@/components/brand/housex-header-logo";
import { BrokerTelesalesBoard } from "@/components/broker/broker-telesales-board";
import { requireBrokerSession } from "@/lib/auth/require-broker";

export const metadata: Metadata = {
  title: "Telesales môi giới — House X",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BrokerTelesalesPage() {
  const session = await requireBrokerSession();
  if (!session.ok) {
    redirect("/dang-nhap?next=/moi-gioi/telesales");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <HouseXHeaderLogo />
          <p className="mt-1 text-xs text-slate-500">
            Telesales CTV / Nội sàn — chỉ lead thuộc bạn (không pool Ops)
          </p>
        </div>
        <Link href="/moi-gioi/tai-khoan" className="text-xs text-slate-500 underline">
          Tài khoản
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4">
        <BrokerTelesalesBoard />
      </main>
    </div>
  );
}
