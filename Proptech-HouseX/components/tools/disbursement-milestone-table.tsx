"use client";

import type {
  MilestoneInput,
  PaymentScheduleMode,
} from "@/lib/finance/loan-disbursement";
import { DecimalInput } from "@/components/tools/decimal-input";
import { IntegerInput } from "@/components/tools/integer-input";
import { cn } from "@/lib/ui/cn";

const MODE_TABS: {
  id: PaymentScheduleMode;
  label: string;
  hint: string;
}[] = [
  {
    id: "TIME",
    label: "Theo thời gian",
    hint: "Phổ biến nhất — mốc theo tháng sau ký HĐMB.",
  },
  {
    id: "CONSTRUCTION",
    label: "Tiến độ thi công",
    hint: "Mốc theo tầng / cất nóc / bàn giao — kèm tháng dự kiến.",
  },
  {
    id: "PARALLEL",
    label: "Giải ngân song song",
    hint: "Nhập % KH và % NH từng đợt theo công bố CĐT.",
  },
];

const MILESTONE_PRESETS = [
  "Ký HĐMB",
  "Tầng 5",
  "Tầng 10",
  "Tầng 15",
  "Cất nóc",
  "Bàn giao",
  "Cấp sổ",
] as const;

type Props = {
  mode: PaymentScheduleMode;
  onModeChange: (mode: PaymentScheduleMode) => void;
  milestones: MilestoneInput[];
  onMilestonesChange: (rows: MilestoneInput[]) => void;
  loanPct: number;
};

const cellCls =
  "h-9 w-full min-w-0 rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-brand-400";

export function DisbursementMilestoneTable({
  mode,
  onModeChange,
  milestones,
  onMilestonesChange,
  loanPct,
}: Props) {
  const activeTab = MODE_TABS.find((t) => t.id === mode) ?? MODE_TABS[0];

  function updateRow(id: string, patch: Partial<MilestoneInput>) {
    onMilestonesChange(
      milestones.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  function addRow() {
    onMilestonesChange([
      ...milestones,
      {
        id: newMilestoneId(),
        month: milestones.length
          ? Math.max(...milestones.map((m) => m.month)) + 3
          : 0,
        installmentPct: 5,
        label: mode === "CONSTRUCTION" ? "Mốc mới" : undefined,
        customerPct: mode === "PARALLEL" ? 0 : undefined,
        bankPct: mode === "PARALLEL" ? 5 : undefined,
      },
    ]);
  }

  function removeRow(id: string) {
    onMilestonesChange(milestones.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-slate-800">
          Phương thức thanh toán
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          % mỗi đợt là <strong>trong kỳ</strong> (không tích lũy). Trần NH giải
          ngân: {loanPct}% giá căn.
        </p>
      </div>

      <div
        className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
        role="tablist"
      >
        {MODE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            onClick={() => onModeChange(tab.id)}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition sm:text-sm",
              mode === tab.id
                ? "bg-white text-brand-800 shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500">{activeTab.hint}</p>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[32rem] text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-600">
            <tr>
              <th className="px-2 py-2 font-semibold">Tháng*</th>
              {mode === "CONSTRUCTION" ? (
                <th className="px-2 py-2 font-semibold">Mốc tiến độ</th>
              ) : null}
              {mode === "PARALLEL" ? (
                <>
                  <th className="px-2 py-2 font-semibold">KH trả %</th>
                  <th className="px-2 py-2 font-semibold">NH giải ngân %</th>
                </>
              ) : (
                <th className="px-2 py-2 font-semibold">Trả CĐT %/đợt</th>
              )}
              <th className="w-10 px-1 py-2" aria-label="Xóa" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {milestones.map((row) => (
              <tr key={row.id}>
                <td className="px-2 py-1.5">
                  <IntegerInput
                    value={row.month}
                    onChange={(month) => updateRow(row.id, { month })}
                    min={0}
                    max={360}
                    className={cellCls}
                    aria-label="Tháng sau ký HĐMB"
                  />
                </td>
                {mode === "CONSTRUCTION" ? (
                  <td className="px-2 py-1.5">
                    <input
                      list="milestone-presets"
                      className={cellCls}
                      value={row.label ?? ""}
                      placeholder="Tầng 10, cất nóc…"
                      onChange={(e) =>
                        updateRow(row.id, { label: e.target.value })
                      }
                    />
                  </td>
                ) : null}
                {mode === "PARALLEL" ? (
                  <>
                    <td className="px-2 py-1.5">
                      <DecimalInput
                        value={row.customerPct ?? 0}
                        onChange={(customerPct) =>
                          updateRow(row.id, { customerPct })
                        }
                        min={0}
                        max={100}
                        className={cellCls}
                        aria-label="Phần trăm khách trả"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <DecimalInput
                        value={row.bankPct ?? 0}
                        onChange={(bankPct) => updateRow(row.id, { bankPct })}
                        min={0}
                        max={100}
                        className={cellCls}
                        aria-label="Phần trăm ngân hàng giải ngân"
                      />
                    </td>
                  </>
                ) : (
                  <td className="px-2 py-1.5">
                    <DecimalInput
                      value={row.installmentPct}
                      onChange={(installmentPct) =>
                        updateRow(row.id, { installmentPct })
                      }
                      min={0}
                      max={100}
                      className={cellCls}
                      aria-label="Phần trăm trả CĐT trong đợt"
                    />
                  </td>
                )}
                <td className="px-1 py-1.5 text-center">
                  <button
                    type="button"
                    className="text-slate-400 hover:text-red-600"
                    onClick={() => removeRow(row.id)}
                    aria-label="Xóa dòng"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <datalist id="milestone-presets">
          {MILESTONE_PRESETS.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        + Thêm đợt
      </button>
      <p className="text-[11px] text-slate-400">
        * Tháng sau ký HĐMB (0 = ký HĐMB). Thêm dòng «Cấp sổ» nếu cần — thường
        NH giải ngân ~5%.
      </p>
    </div>
  );
}
