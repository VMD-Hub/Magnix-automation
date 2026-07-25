"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ToolPrintSheet } from "@/components/tools/print/tool-print-sheet";
import { ToolPrintPdfButton } from "@/components/tools/print/tool-print-pdf-button";
import {
  estimateMaterials,
  MATERIAL_ESTIMATE_DISCLAIMER,
} from "@/lib/construction/material-estimate";

export function MaterialEstimateTool() {
  const [floorAreaM2, setFloorAreaM2] = useState(80);
  const [floors, setFloors] = useState(2);
  const [wallMm, setWallMm] = useState<110 | 220>(110);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(
    () =>
      submitted
        ? estimateMaterials({ floorAreaM2, floors, wallThicknessMm: wallMm })
        : null,
    [submitted, floorAreaM2, floors, wallMm],
  );

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="tool-calc-print-root space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="proptech-ruby-soft-panel p-5 sm:p-6 print:hidden"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label>
            <span className="text-sm font-medium text-slate-700">
              Diện tích sàn/tầng (m²)
            </span>
            <input
              type="number"
              min={20}
              value={floorAreaM2}
              onChange={(e) => {
                setFloorAreaM2(Number(e.target.value));
                setSubmitted(false);
              }}
              className={inputCls}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Số tầng</span>
            <select
              value={floors}
              onChange={(e) => {
                setFloors(Number(e.target.value));
                setSubmitted(false);
              }}
              className={inputCls}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-slate-700">Tường</span>
            <select
              value={wallMm}
              onChange={(e) => {
                setWallMm(Number(e.target.value) as 110 | 220);
                setSubmitted(false);
              }}
              className={inputCls}
            >
              <option value={110}>110mm</option>
              <option value={220}>220mm</option>
            </select>
          </label>
        </div>
        <Button type="submit" className="mt-5 w-full sm:w-auto" size="md">
          Dự trù vật liệu
        </Button>
      </form>

      {result ? (
        <>
          <ToolPrintSheet
            title="Bảng dự trù vật liệu xây dựng"
            subtitle={`${floorAreaM2} m²/tầng · ${floors} tầng · tường ${wallMm}mm`}
            summary={[
              { label: "Tổng DT sàn", value: `${result.builtFloorM2} m²` },
              { label: "Diện tích/tầng", value: `${floorAreaM2} m²` },
              { label: "Số tầng", value: `${floors}` },
              { label: "Tường", value: `${wallMm}mm` },
            ]}
          >
            <div className="tool-print-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th className="text-left">Vật liệu</th>
                    <th className="text-right">Số lượng</th>
                    <th className="text-left">ĐVT</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item) => (
                    <tr key={item.name}>
                      <td className="text-left">
                        {item.name}
                        {item.note ? (
                          <span
                            style={{
                              display: "block",
                              fontSize: "8pt",
                              color: "#64748b",
                            }}
                          >
                            {item.note}
                          </span>
                        ) : null}
                      </td>
                      <td className="text-right">
                        {item.quantity.toLocaleString("vi-VN")}
                      </td>
                      <td className="text-left">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="tool-print-disclaimer">{MATERIAL_ESTIMATE_DISCLAIMER}</p>
          </ToolPrintSheet>

          <div className="rounded-2xl border border-brand-200 bg-white p-5 sm:p-6 print:hidden">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-sm text-slate-600">
                Tổng diện tích sàn: <strong>{result.builtFloorM2} m²</strong>
              </p>
              <ToolPrintPdfButton />
            </div>
            <table className="mt-4 w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-2">Vật liệu</th>
                  <th className="pb-2 text-right">Số lượng</th>
                  <th className="pb-2">ĐVT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.items.map((item) => (
                  <tr key={item.name}>
                    <td className="py-2">
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.note}</p>
                    </td>
                    <td className="py-2 text-right font-bold text-slate-900">
                      {item.quantity.toLocaleString("vi-VN")}
                    </td>
                    <td className="py-2 text-slate-600">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-4 space-y-1 text-xs text-slate-500">
              {result.notes.map((n) => (
                <li key={n}>· {n}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500">{MATERIAL_ESTIMATE_DISCLAIMER}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
