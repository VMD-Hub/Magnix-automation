"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

const TABS = [
  { id: "mua-ban", label: "Mua bán", action: "/mua-ban" },
  { id: "cho-thue", label: "Cho thuê", action: "/cho-thue" },
  { id: "du-an", label: "Dự án", action: "/du-an" },
] as const;

const SALE_PROPERTY_TYPES = [
  { value: "", label: "Loại bất động sản" },
  { value: "can_ho", label: "Căn hộ" },
  { value: "nha_pho", label: "Nhà phố" },
  { value: "biet_thu", label: "Biệt thự" },
  { value: "dat_nen", label: "Đất nền" },
  { value: "shophouse", label: "Shophouse" },
  { value: "van_phong", label: "Văn phòng" },
];

const RENT_PROPERTY_TYPES = [
  { value: "", label: "Loại bất động sản" },
  { value: "can_ho", label: "Căn hộ" },
  { value: "can_ho_dich_vu", label: "Căn hộ dịch vụ" },
  { value: "phong_tro", label: "Phòng trọ" },
  { value: "nha_pho", label: "Nhà phố" },
  { value: "biet_thu", label: "Biệt thự" },
  { value: "shophouse", label: "Shophouse" },
  { value: "van_phong", label: "Văn phòng" },
];

const PRICE_RANGES = [
  { value: "", label: "Khoảng giá" },
  { value: "0-2000000000", label: "Dưới 2 tỷ" },
  { value: "2000000000-5000000000", label: "2 – 5 tỷ" },
  { value: "5000000000-10000000000", label: "5 – 10 tỷ" },
  { value: "10000000000-", label: "Trên 10 tỷ" },
];

export function SearchHero() {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const propertyTypes =
    tab.id === "cho-thue" ? RENT_PROPERTY_TYPES : SALE_PROPERTY_TYPES;

  return (
    <div className="lux-glass w-full max-w-2xl rounded-2xl p-2">
      <div className="flex gap-1 px-1 pt-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              tab.id === t.id
                ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                : "text-[#555555] hover:bg-white/80",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form action={tab.action} method="get" className="p-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Icon.MapPin className="text-lg text-slate-400" />
            <input
              type="text"
              name="q"
              placeholder="Nhập khu vực, dự án hoặc địa điểm"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
          <Button type="submit" size="md" className="sm:w-auto">
            <Icon.Search className="text-lg" /> Tìm kiếm
          </Button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <select
            name="propertyType"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
            defaultValue=""
          >
            {propertyTypes.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            name="price"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
            defaultValue=""
          >
            {PRICE_RANGES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}
