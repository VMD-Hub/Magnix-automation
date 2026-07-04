"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { HOUSEX_SERVICES_LABEL } from "@/lib/content/housex-services-copy";
import { NHA_DEP_PINS, NHA_DEP_TAGS } from "@/lib/content/noi-that-content";
import { AffiliateDisclaimer } from "@/components/affiliate/affiliate-vertical-hub";
import {
  buildBreadcrumbJsonLd,
} from "@/lib/seo/affiliate-json-ld";

const breadcrumbs = (vertical: AffiliateVertical) => [
  { name: "Trang chủ", path: "/" },
  { name: HOUSEX_SERVICES_LABEL, path: "/dich-vu" },
  { name: "Nội thất", path: vertical.path },
  { name: "Nhà đẹp", path: "/noi-that/nha-dep" },
];

export function NhaDepInspirationHub({ vertical }: { vertical: AffiliateVertical }) {
  const [activeTag, setActiveTag] = useState<string>("Tất cả");
  const crumbs = breadcrumbs(vertical);

  const filtered = useMemo(() => {
    if (activeTag === "Tất cả") return NHA_DEP_PINS;
    return NHA_DEP_PINS.filter((p) => p.tags.some((t) => t.includes(activeTag)));
  }, [activeTag]);

  return (
    <div className="min-h-screen bg-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(crumbs)),
        }}
      />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl py-10 container-px">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            {crumbs.map((item, i) => (
              <span key={item.path}>
                {i > 0 ? <span className="mx-2">/</span> : null}
                {i < crumbs.length - 1 ? (
                  <Link href={item.path} className="hover:text-brand-700">
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-slate-700">{item.name}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Nhà đẹp — Ý tưởng bố trí
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Bảng cảm hứng phòng khách, bếp, phòng ngủ và decor tại TP.HCM. Lọc theo phong
            cách — nội dung tham khảo, không phải báo giá dịch vụ.
          </p>
          <AffiliateDisclaimer text="Hình ảnh minh họa tham khảo — một số mẫu tổng hợp cho mục đích cảm hứng. Liên hệ House X khi cần thiết kế riêng cho căn nhà của bạn." />
        </div>
      </header>

      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto py-3 container-px">
          {NHA_DEP_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTag === tag
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-8 container-px">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {filtered.map((pin) => (
            <figure
              key={pin.slug}
              className={`mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 ${
                pin.span === "tall" ? "sm:[&_img]:aspect-[3/4]" : pin.span === "wide" ? "" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pin.image}
                alt={pin.title}
                loading="lazy"
                className="w-full object-cover"
              />
              <figcaption className="p-3">
                <p className="text-sm font-semibold text-slate-900">{pin.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {pin.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-slate-500">Chưa có ý tưởng cho bộ lọc này.</p>
        ) : null}

        <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50/80 p-8 text-center">
          <p className="text-slate-700">
            Thích một phong cách? House X kết nối studio thiết kế &amp; thi công tại TP.HCM.
          </p>
          <Link
            href={`${vertical.path}#tu-van`}
            className="mt-4 inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Yêu cầu tư vấn thiết kế
          </Link>
          <p className="mt-4">
            <Link href={vertical.path} className="text-sm font-semibold text-brand-700 hover:underline">
              ← Về trang dịch vụ nội thất
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
