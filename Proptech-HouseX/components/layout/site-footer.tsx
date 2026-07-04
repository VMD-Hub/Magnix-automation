import Link from "next/link";
import { AFFILIATE_VERTICALS } from "@/lib/content/affiliate-verticals";
import { PLATFORM_FOOTER_BLURB } from "@/lib/content/messaging/platform-public";
import { RENT_PROPERTY_TYPE_FILTER_OPTIONS } from "@/lib/content/property-type-slug";
import { getBrandName } from "@/lib/site-config";
import { HouseXFooterLogo } from "@/components/brand/housex-footer-logo";
import { SiteContact } from "@/components/layout/site-contact";

const DISTRICTS = [
  "Quận 1",
  "Quận 2",
  "Quận 7",
  "Quận 9",
  "Bình Thạnh",
  "Thủ Đức",
];

const PROPERTY_TYPES = RENT_PROPERTY_TYPE_FILTER_OPTIONS;

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-300">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const taiChinh = AFFILIATE_VERTICALS.find((v) => v.id === "tai-chinh")!;
  const dinhGia = AFFILIATE_VERTICALS.find((v) => v.id === "dinh-gia")!;
  const noiThat = AFFILIATE_VERTICALS.find((v) => v.id === "noi-that")!;

  return (
    <footer className="proptech-footer-glow mt-16 text-slate-300 print:hidden">
      <div className="mx-auto max-w-7xl py-12 container-px">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand + liên hệ — cột trái, không gộp với menu links */}
          <div className="lg:col-span-4 xl:col-span-3">
            <HouseXFooterLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {PLATFORM_FOOTER_BLURB}
            </p>
            <SiteContact variant="dark" className="mt-6" />
          </div>

          {/* Menu footer — lưới đều, tách khỏi block brand */}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-8 xl:col-span-9 xl:grid-cols-5">
          <FooterCol title="Mua bán theo khu vực">
            {DISTRICTS.map((d) => (
              <li key={d}>
                <Link
                  href={`/mua-ban?district=${encodeURIComponent(d)}`}
                  className="hover:text-gold-400"
                >
                  Mua bán nhà đất {d}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Cho thuê theo loại hình">
            {PROPERTY_TYPES.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/cho-thue?propertyType=${t.slug}`}
                  className="hover:text-gold-400"
                >
                  Cho thuê {t.label.toLowerCase()}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={`Tài chính ${getBrandName()}`}>
            <li>
              <Link href={taiChinh.path} className="font-medium hover:text-gold-400">
                {taiChinh.h1}
              </Link>
            </li>
            {taiChinh.productLines?.map((p) => (
              <li key={p.id}>
                <Link href={`${taiChinh.path}#${p.id}`} className="hover:text-gold-400">
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cong-cu/tinh-khoan-vay" className="hover:text-gold-400">
                Công cụ tính khoản vay
              </Link>
            </li>
          </FooterCol>

          <FooterCol title="Định giá BĐS">
            <li>
              <Link href={dinhGia.path} className="font-medium hover:text-gold-400">
                {dinhGia.h1}
              </Link>
            </li>
            {dinhGia.services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${dinhGia.path}/${s.slug}`}
                  className="hover:text-gold-400"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Thiết kế & thi công nội thất">
            <li>
              <Link href={noiThat.path} className="font-medium hover:text-gold-400">
                Dịch vụ nội thất
              </Link>
            </li>
            <li>
              <Link href="/noi-that/nha-dep" className="hover:text-gold-400">
                Nhà đẹp — Ý tưởng
              </Link>
            </li>
            {noiThat.showcases?.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${noiThat.path}/phong-cach/${s.slug}`}
                  className="hover:text-gold-400"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 container-px sm:flex-row">
          <p>© {new Date().getFullYear()} {getBrandName()}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dich-vu" className="hover:text-gold-400">
              Dịch vụ {getBrandName()}
            </Link>
            <Link href="/tin-tuc" className="hover:text-gold-400">
              Tin tức
            </Link>
            <Link href="/gioi-thieu" className="hover:text-gold-400">
              Giới thiệu
            </Link>
            <Link href="/hop-tac" className="hover:text-gold-400">
              Hợp tác &amp; Đăng tin
            </Link>
            <Link href="/cau-hoi-thuong-gap" className="hover:text-gold-400">
              FAQ
            </Link>
            <Link href="/lien-he" className="hover:text-gold-400">
              Liên hệ
            </Link>
            <Link href="/gioi-thieu/phuong-phap-bien-tap" className="hover:text-gold-400">
              Phương pháp biên tập
            </Link>
            <Link href="/doi-ngu" className="hover:text-gold-400">
              Đội ngũ & biên tập
            </Link>
            <Link href="/dieu-khoan" className="hover:text-gold-400">
              Điều khoản
            </Link>
            <Link href="/chinh-sach-khieu-nai" className="hover:text-gold-400">
              Khiếu nại
            </Link>
            <Link href="/bao-mat" className="hover:text-gold-400">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
