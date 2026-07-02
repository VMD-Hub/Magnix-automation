import Link from "next/link";
import type { ReactNode } from "react";
import type { ProjectUnitStatus } from "@prisma/client";
import type { ProjectInventoryPageData } from "@/lib/data/project-unit";
import type { ProjectInventoryPageFilters } from "@/lib/validation/project-unit";
import {
  PROJECT_UNIT_STATUS_LABEL,
  formatPricePerM2,
  formatVnd,
} from "@/lib/format";
import { UnitBookingForm } from "@/components/projects/unit-booking-form";

const STATUS_CHIP_ORDER: ProjectUnitStatus[] = [
  "AVAILABLE",
  "HELD",
  "BOOKED",
  "DEPOSITED",
  "SOLD",
  "HANDED_OVER",
  "LIQUIDATED",
];

const STATUS_BADGE_CLASS: Record<ProjectUnitStatus, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  HELD: "bg-amber-50 text-amber-900 ring-amber-200",
  BOOKED: "bg-sky-50 text-sky-900 ring-sky-200",
  DEPOSITED: "bg-violet-50 text-violet-900 ring-violet-200",
  SOLD: "bg-slate-100 text-slate-700 ring-slate-200",
  HANDED_OVER: "bg-teal-50 text-teal-900 ring-teal-200",
  LIQUIDATED: "bg-stone-100 text-stone-600 ring-stone-200",
};

function filterHref(
  projectSlug: string,
  next: ProjectInventoryPageFilters,
): string {
  const params = new URLSearchParams();
  if (next.status) params.set("status", next.status);
  if (next.block) params.set("block", next.block);
  const qs = params.toString();
  return qs ? `/du-an/${projectSlug}?${qs}` : `/du-an/${projectSlug}`;
}

type Props = {
  projectSlug: string;
  projectName: string;
  inventory: ProjectInventoryPageData;
  filters: ProjectInventoryPageFilters;
};

export function ProjectInventorySection({
  projectSlug,
  projectName,
  inventory,
  filters,
}: Props) {
  const { items, summary, blocks, pagination } = inventory;
  if (summary.total === 0) return null;

  const activeStatuses = STATUS_CHIP_ORDER.filter(
    (s) => summary.byStatus[s] > 0,
  );

  return (
    <section id="project-inventory-heading" aria-label="Bảng hàng dự án">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Bảng hàng {projectName}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Giỏ hàng sơ cấp (F1). <strong>Giữ suất</strong> ghi nhận nhu cầu mua —
            nhiều khách có thể giữ suất cùng căn; căn chỉ khóa khi vận hành chuyển
            cọc thủ công.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-500">
          Tổng{" "}
          <span className="font-bold text-slate-900">{summary.total}</span> căn
          {pagination.total !== summary.total && (
            <>
              {" "}
              · đang lọc{" "}
              <span className="font-bold text-brand-700">
                {pagination.total}
              </span>
            </>
          )}
        </p>
      </div>

      {activeStatuses.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Tóm tắt trạng thái">
          {activeStatuses.map((status) => (
            <span
              key={status}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE_CLASS[status]}`}
            >
              {PROJECT_UNIT_STATUS_LABEL[status] ?? status}
              <span className="opacity-80">{summary.byStatus[status]}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap gap-2" aria-label="Lọc trạng thái">
          <FilterLink
            href={filterHref(projectSlug, { block: filters.block })}
            active={!filters.status}
          >
            Tất cả
          </FilterLink>
          {activeStatuses.map((status) => (
            <FilterLink
              key={status}
              href={filterHref(projectSlug, {
                status,
                block: filters.block,
              })}
              active={filters.status === status}
            >
              {PROJECT_UNIT_STATUS_LABEL[status] ?? status}
            </FilterLink>
          ))}
        </div>

        {blocks.length > 0 && (
          <div
            className="flex flex-wrap gap-2 sm:ml-auto"
            aria-label="Lọc block"
          >
            <FilterLink
              href={filterHref(projectSlug, { status: filters.status })}
              active={!filters.block}
              variant="block"
            >
              Mọi block
            </FilterLink>
            {blocks.map((block) => (
              <FilterLink
                key={block}
                href={filterHref(projectSlug, {
                  status: filters.status,
                  block,
                })}
                active={filters.block === block}
                variant="block"
              >
                Block {block}
              </FilterLink>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {items.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">
            Không có căn nào khớp bộ lọc.{" "}
            <Link
              href={`/du-an/${projectSlug}#project-inventory-heading`}
              className="font-semibold text-brand-700 hover:underline"
            >
              Xóa bộ lọc
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-800 text-slate-100">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Mã căn</th>
                  <th className="px-4 py-3.5 font-semibold">Block</th>
                  <th className="px-4 py-3.5 font-semibold">Tầng</th>
                  <th className="px-4 py-3.5 font-semibold">Loại</th>
                  <th className="px-4 py-3.5 font-semibold">Diện tích</th>
                  <th className="px-4 py-3.5 font-semibold">Hướng / View</th>
                  <th className="px-4 py-3.5 font-semibold">Giá</th>
                  <th className="px-4 py-3.5 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3.5 font-semibold">Suất giữ</th>
                  <th className="px-4 py-3.5 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {items.map((unit, i) => (
                  <tr
                    key={unit.id}
                    className={
                      i % 2 === 0
                        ? "border-t border-slate-100 bg-white"
                        : "border-t border-slate-100 bg-slate-50/80"
                    }
                  >
                    <td className="px-4 py-3.5 font-mono text-sm font-semibold text-slate-900">
                      {unit.code}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {unit.block ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {unit.floor ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {unit.unitType?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {unit.area != null ? `${unit.area} m²` : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {[unit.direction, unit.view].filter(Boolean).join(" · ") ||
                        "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-brand-700">
                        {formatVnd(unit.price) ?? "Liên hệ"}
                      </div>
                      {formatPricePerM2(unit.price, unit.area) && (
                        <div className="mt-0.5 text-xs text-slate-500">
                          {formatPricePerM2(unit.price, unit.area)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_BADGE_CLASS[unit.status]}`}
                      >
                        {PROJECT_UNIT_STATUS_LABEL[unit.status] ?? unit.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {unit._count?.bookings ?? 0}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      {unit.status === "AVAILABLE" ? (
                        <UnitBookingForm
                          projectSlug={projectSlug}
                          unitCode={unit.code}
                          unitLabel={unit.code}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.total > items.length && (
        <p className="mt-3 text-xs text-slate-500">
          Hiển thị {items.length}/{pagination.total} căn khớp bộ lọc (giới hạn{" "}
          {pagination.pageSize} dòng/trang).
        </p>
      )}
    </section>
  );
}

function FilterLink({
  href,
  active,
  children,
  variant = "status",
}: {
  href: string;
  active: boolean;
  children: ReactNode;
  variant?: "status" | "block";
}) {
  const base =
    variant === "block"
      ? "rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
      : "rounded-full px-3 py-1.5 text-xs font-semibold transition";
  const activeCls =
    variant === "block"
      ? "border-brand-600 bg-brand-50 text-brand-800"
      : "bg-brand-600 text-white shadow-sm";
  const idleCls =
    variant === "block"
      ? "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50/50"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <Link href={href} className={`${base} ${active ? activeCls : idleCls}`}>
      {children}
    </Link>
  );
}
