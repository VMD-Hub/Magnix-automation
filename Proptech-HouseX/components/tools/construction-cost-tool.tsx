"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  COST_ESTIMATE_DISCLAIMER,
  estimateDetail,
  estimateQuick,
  formatVnd,
  type BuildPackage,
  type DetailEstimateInput,
  type FoundationType,
  type QuickEstimateInput,
  type RegionKey,
  type RoofType,
} from "@/lib/construction/cost-estimate";

type Mode = "quick" | "detail";

export function ConstructionCostTool({ mode }: { mode: Mode }) {
  const [floorAreaM2, setFloorAreaM2] = useState(80);
  const [floors, setFloors] = useState(2);
  const [packageType, setPackageType] = useState<BuildPackage>("TRON_GOI");
  const [region, setRegion] = useState<RegionKey>("TPHCM");
  const [foundation, setFoundation] = useState<FoundationType>("BANG");
  const [roof, setRoof] = useState<RoofType>("NGOI");
  const [wallMm, setWallMm] = useState<110 | 220>(110);
  const [balconyM2, setBalconyM2] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;
    const base = {
      floorAreaM2,
      floors,
      package: packageType,
      region,
      hasBalcony: balconyM2 > 0,
      balconyM2: balconyM2 || undefined,
    };
    if (mode === "quick") return estimateQuick(base as QuickEstimateInput);
    return estimateDetail({
      ...base,
      foundation,
      roof,
      wallThicknessMm: wallMm,
    } as DetailEstimateInput);
  }, [submitted, floorAreaM2, floors, packageType, region, foundation, roof, wallMm, balconyM2, mode]);

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="proptech-ruby-soft-panel p-5 sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-slate-700">Diện tích sàn/tầng (m²)</span>
            <input type="number" min={20} max={500} value={floorAreaM2} onChange={(e) => { setFloorAreaM2(Number(e.target.value)); setSubmitted(false); }} className={inputCls} />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Số tầng</span>
            <select value={floors} onChange={(e) => { setFloors(Number(e.target.value)); setSubmitted(false); }} className={inputCls}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} tầng</option>)}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Gói thi công</span>
            <select value={packageType} onChange={(e) => { setPackageType(e.target.value as BuildPackage); setSubmitted(false); }} className={inputCls}>
              <option value="THO">Phần thô</option>
              <option value="CO_BAN">Hoàn thiện cơ bản</option>
              <option value="TRON_GOI">Trọn gói tiêu chuẩn</option>
              <option value="CAO_CAP">Trọn gói cao cấp</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Khu vực</span>
            <select value={region} onChange={(e) => { setRegion(e.target.value as RegionKey); setSubmitted(false); }} className={inputCls}>
              <option value="TPHCM">TP.HCM</option>
              <option value="HA_NOI">Hà Nội</option>
              <option value="TINH">Tỉnh/thành khác</option>
            </select>
          </label>
          {mode === "detail" ? (
            <>
              <label>
                <span className="text-sm font-medium text-slate-700">Loại móng</span>
                <select value={foundation} onChange={(e) => { setFoundation(e.target.value as FoundationType); setSubmitted(false); }} className={inputCls}>
                  <option value="DON">Móng đơn</option>
                  <option value="BANG">Móng băng</option>
                  <option value="COC">Móng cọc</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-medium text-slate-700">Loại mái</span>
                <select value={roof} onChange={(e) => { setRoof(e.target.value as RoofType); setSubmitted(false); }} className={inputCls}>
                  <option value="NGOI">Mái ngói</option>
                  <option value="TON">Mái tôn</option>
                  <option value="BTCT">Mái BTCT</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-medium text-slate-700">Tường</span>
                <select value={wallMm} onChange={(e) => { setWallMm(Number(e.target.value) as 110 | 220); setSubmitted(false); }} className={inputCls}>
                  <option value={110}>110mm</option>
                  <option value={220}>220mm</option>
                </select>
              </label>
            </>
          ) : null}
          <label className={mode === "detail" ? "" : "sm:col-span-2"}>
            <span className="text-sm font-medium text-slate-700">Ban công (m², 0 nếu không có)</span>
            <input type="number" min={0} max={100} value={balconyM2} onChange={(e) => { setBalconyM2(Number(e.target.value)); setSubmitted(false); }} className={inputCls} />
          </label>
        </div>
        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">
          {mode === "quick" ? "Ước tính chi phí" : "Tính dự toán chi tiết"}
        </Button>
      </form>

      {result ? (
        <div className="rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase text-brand-600">
            {result.packageLabel} · {result.regionLabel}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {formatVnd(result.totalWithContingency)}
          </p>
          <p className="text-sm text-slate-500">
            Gồm dự phòng 10% · DT quy đổi {result.totalBuiltAreaM2} m² · {formatVnd(result.unitPricePerM2)}/m²
          </p>

          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="pb-2">Hạng mục</th>
                <th className="pb-2">Quy đổi</th>
                <th className="pb-2 text-right">m² quy đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.lines.map((l) => (
                <tr key={l.label}>
                  <td className="py-2 font-medium text-slate-800">{l.label}</td>
                  <td className="py-2 text-slate-600">{l.coefficient}</td>
                  <td className="py-2 text-right text-slate-800">{l.subtotalM2.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-4 space-y-1 text-xs text-slate-500">
            {result.notes.map((n) => <li key={n}>· {n}</li>)}
          </ul>
          <p className="mt-3 text-xs text-slate-500">{COST_ESTIMATE_DISCLAIMER}</p>
        </div>
      ) : null}
    </div>
  );
}
