import Link from "next/link";
import { Icon } from "@/components/icons";

const TOOLS = [
  { label: "Tính khoản vay", href: "/cong-cu/tinh-khoan-vay", Icon: Icon.Calculator },
  { label: "Kiểm tra NOXH", href: "/cong-cu/dieu-kien-noxh", Icon: Icon.ShieldCheck },
  { label: "Xem hướng nhà", href: "/cong-cu/xem-huong-nha", Icon: Icon.Bagua },
  { label: "Vay mua nhà", href: "/tai-chinh", Icon: Icon.Coins },
  { label: "Định giá BĐS", href: "/dinh-gia", Icon: Icon.Building },
  { label: "Phong cách nội thất", href: "/noi-that", Icon: Icon.Layers },
  { label: "Dịch vụ HouseX", href: "/dich-vu", Icon: Icon.FileCheck },
  { label: "Mua bán", href: "/mua-ban", Icon: Icon.MapPin },
];

export function ProptechTools() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {TOOLS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="proptech-card flex items-center gap-3 px-4 py-3 hover:border-brand-200"
        >
          <span className="proptech-trust-tile__icon h-9 w-9 text-lg">
            <t.Icon />
          </span>
          <span className="text-sm font-semibold text-[#333333]">{t.label}</span>
        </Link>
      ))}
    </div>
  );
}
