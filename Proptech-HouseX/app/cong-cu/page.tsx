import type { Metadata } from "next";
import Link from "next/link";
import { AFFILIATE_VERTICALS } from "@/lib/content/affiliate-verticals";

export const metadata: Metadata = {
  title: "Công cụ Proptech",
  description:
    "Công cụ tính khoản vay miễn phí và dịch vụ tài chính, định giá BĐS trên HouseX.",
  alternates: { canonical: "/cong-cu" },
};

const CALC_TOOLS = [
  {
    href: "/cong-cu/tinh-khoan-vay",
    title: "Tính khoản vay mua nhà",
    desc: "Dư nợ giảm dần hoặc gốc + lãi chia đều — xuất PDF.",
    ready: true,
  },
  {
    href: "/cong-cu/kha-nang-vay",
    title: "Khả năng vay tối đa",
    desc: "Ước tính hạn mức theo thu nhập (sắp ra mắt).",
    ready: false,
  },
  {
    href: "/cong-cu/dieu-kien-noxh",
    title: "Kiểm tra điều kiện NOXH",
    desc: "Checklist thu nhập, cư trú (sắp ra mắt).",
    ready: false,
  },
];

export default function CongCuPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 container-px">
      <h1 className="text-3xl font-extrabold text-slate-900">Công cụ Proptech</h1>
      <p className="mt-2 text-slate-600">
        Tính toán miễn phí trên trình duyệt. Dịch vụ vay và thẩm định xem mục{" "}
        <Link href="/dich-vu" className="font-semibold text-brand-700 underline">
          Dịch vụ HouseX
        </Link>
        .
      </p>

      <h2 className="mt-8 text-lg font-bold text-slate-900">Máy tính & tra cứu</h2>
      <ul className="mt-4 space-y-4">
        {CALC_TOOLS.map((t) => (
          <li key={t.href}>
            {t.ready ? (
              <Link
                href={t.href}
                className="block rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <p className="font-semibold text-brand-700">{t.title}</p>
                <p className="mt-1 text-sm text-slate-600">{t.desc}</p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 opacity-80">
                <p className="font-semibold text-slate-700">{t.title}</p>
                <p className="mt-1 text-sm text-slate-500">{t.desc}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-bold text-slate-900">Dịch vụ HouseX</h2>
      <ul className="mt-4 space-y-3">
        {AFFILIATE_VERTICALS.map((v) => (
          <li key={v.id}>
            <Link
              href={v.path}
              className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              {v.h1} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
