import Link from "next/link";
import { AFFILIATE_VERTICALS } from "@/lib/content/affiliate-verticals";
import { PLATFORM_FOOTER_BLURB } from "@/lib/content/messaging/platform-public";
import {
  NOXH_CATALOG_PATH,
  NOXH_CATALOG_TITLE,
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
import { RENT_PROPERTY_TYPE_FILTER_OPTIONS } from "@/lib/content/property-type-slug";
import {
  FOOTER_SALE_DISTRICTS,
  listingBrowsePath,
} from "@/lib/content/listing-browse-url";
import { getLegalEntityDisclosure } from "@/lib/content/legal-entity";
import { getBrandName } from "@/lib/site-config";
import { HouseXFooterLogo } from "@/components/brand/housex-footer-logo";
import { FooterBrandOrnament } from "@/components/layout/footer-brand-ornament";
import { SiteContact } from "@/components/layout/site-contact";

const PROPERTY_TYPES = RENT_PROPERTY_TYPE_FILTER_OPTIONS;

const FOOTER_LINK =
  "text-silver-200/90 transition-colors hover:text-gold-300";

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold tracking-wide text-gold-400">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const legalEntity = getLegalEntityDisclosure();
  const taiChinh = AFFILIATE_VERTICALS.find((v) => v.id === "tai-chinh")!;
  const dinhGia = AFFILIATE_VERTICALS.find((v) => v.id === "dinh-gia")!;
  const noiThat = AFFILIATE_VERTICALS.find((v) => v.id === "noi-that")!;

  return (
    <footer className="proptech-footer-glow mt-16 print:hidden">
      <FooterBrandOrnament />
      <div className="mx-auto max-w-7xl py-12 container-px">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <HouseXFooterLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-silver-200/85">
              {PLATFORM_FOOTER_BLURB}
            </p>
            <SiteContact variant="footerRuby" className="mt-6" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-8 xl:col-span-9 xl:grid-cols-5">
          <FooterCol title="Mua bán theo khu vực">
            {FOOTER_SALE_DISTRICTS.map((d) => (
              <li key={d}>
                <Link
                  href={listingBrowsePath("/mua-ban", { district: d })}
                  className={FOOTER_LINK}
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
                  className={FOOTER_LINK}
                >
                  Cho thuê {t.label.toLowerCase()}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={`Vay mua nhà · ${getBrandName()}`}>
            <li>
              <Link href={taiChinh.path} className={`font-medium ${FOOTER_LINK}`}>
                {taiChinh.h1}
              </Link>
            </li>
            {taiChinh.services.map((s) => (
              <li key={s.slug}>
                <Link href={`${taiChinh.path}/${s.slug}`} className={FOOTER_LINK}>
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cong-cu/tinh-khoan-vay" className={FOOTER_LINK}>
                Tính trả góp hàng tháng
              </Link>
            </li>
          </FooterCol>

          <FooterCol title="Định giá BĐS">
            <li>
              <Link href={dinhGia.path} className={`font-medium ${FOOTER_LINK}`}>
                {dinhGia.h1}
              </Link>
            </li>
            {dinhGia.services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${dinhGia.path}/${s.slug}`}
                  className={FOOTER_LINK}
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Thiết kế & thi công">
            <li>
              <Link href={noiThat.path} className={`font-medium ${FOOTER_LINK}`}>
                Thiết kế & thi công nội thất
              </Link>
            </li>
            <li>
              <Link href="/noi-that/nha-dep" className={FOOTER_LINK}>
                Nhà đẹp — Ý tưởng
              </Link>
            </li>
            {noiThat.showcases?.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`${noiThat.path}/phong-cach/${s.slug}`}
                  className={FOOTER_LINK}
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>
          </div>
        </div>
      </div>

      <div className="proptech-footer-divider border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 py-5 text-xs text-silver-300/80 container-px sm:flex-row">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} {getBrandName()}. All rights reserved.</p>
            <p className="mt-1 text-silver-300/65">{legalEntity.vi}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dich-vu" className={FOOTER_LINK}>
              Dịch vụ {getBrandName()}
            </Link>
            <Link href={NOXH_HANDBOOK_PATH} className={FOOTER_LINK}>
              {NOXH_HANDBOOK_TITLE}
            </Link>
            <Link href={NOXH_CATALOG_PATH} className={FOOTER_LINK}>
              {NOXH_CATALOG_TITLE}
            </Link>
            <Link href="/gioi-thieu" className={FOOTER_LINK}>
              Giới thiệu
            </Link>
            <Link href="/hop-tac" className={FOOTER_LINK}>
              Hợp tác &amp; Đăng tin
            </Link>
            <Link href="/cau-hoi-thuong-gap" className={FOOTER_LINK}>
              FAQ
            </Link>
            <Link href="/lien-he" className={FOOTER_LINK}>
              Liên hệ
            </Link>
            <Link href="/gioi-thieu/phuong-phap-bien-tap" className={FOOTER_LINK}>
              Phương pháp biên tập
            </Link>
            <Link href="/doi-ngu" className={FOOTER_LINK}>
              Đội ngũ & biên tập
            </Link>
            <Link href="/dieu-khoan" className={FOOTER_LINK}>
              Điều khoản
            </Link>
            <Link href="/chinh-sach-khieu-nai" className={FOOTER_LINK}>
              Khiếu nại
            </Link>
            <Link href="/bao-mat" className={FOOTER_LINK}>
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
