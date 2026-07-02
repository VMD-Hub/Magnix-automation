import Link from "next/link";
import { Icon } from "@/components/icons";
import { HouseXLogo } from "@/components/brand/housex-logo";
import { BUYER_REGISTER_CHOOSER } from "@/lib/content/messaging/buyer-discovery";
import { BROKER_REGISTER_CHOOSER } from "@/lib/content/messaging/broker-supply";

const OPTIONS = [
  {
    href: "/dang-ky/khach-hang",
    title: "Khách hàng",
    desc: BUYER_REGISTER_CHOOSER,
    icon: Icon.Heart,
  },
  {
    href: "/dang-ky/moi-gioi",
    title: "Môi giới đăng tin",
    desc: BROKER_REGISTER_CHOOSER,
    icon: Icon.Building,
  },
];

export default function RegisterChooserPage() {
  return (
    <div className="bg-slate-50 py-12 container-px sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <HouseXLogo className="mx-auto justify-center" iconClassName="text-3xl" />
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Chọn loại tài khoản</h1>
          <p className="mt-2 text-slate-600">
            Mọi tài khoản đều yêu cầu <strong>số điện thoại</strong>,{" "}
            <strong>email</strong> và xác nhận qua email.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-brand-300 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600">
                <o.icon />
              </span>
              <h2 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-brand-700">
                {o.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{o.desc}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-semibold text-brand-700">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
