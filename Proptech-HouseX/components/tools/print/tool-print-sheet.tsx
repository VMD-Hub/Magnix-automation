import { ToolPrintBrandHeader } from "@/components/tools/print/tool-print-brand-header";
import { cn } from "@/lib/ui/cn";

export type ToolPrintSummaryItem = {
  label: string;
  value: string;
};

type Props = {
  /** Tên bảng tính — vd. "Bảng tính lãi suất trả góp". */
  title: string;
  /** Khối tóm tắt tham số (tuỳ chọn — có thể dùng Stat cards trên trang). */
  summary?: readonly ToolPrintSummaryItem[];
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  generatedAt?: Date;
};

/**
 * Sheet in A4: header brand (logo | liên hệ+QR) → tiêu đề → tóm tắt tuỳ chọn.
 * Pilot: tính trả góp.
 */
export function ToolPrintSheet({
  title,
  summary,
  subtitle,
  children,
  className,
  generatedAt = new Date(),
}: Props) {
  const dateLabel = generatedAt.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className={cn("tool-print-sheet hidden print:block", className)}>
      <ToolPrintBrandHeader />

      <div className="tool-print-meta">
        <h1 className="tool-print-title">{title}</h1>
        <p className="tool-print-date">Ngày lập: {dateLabel}</p>
      </div>

      {subtitle ? <p className="tool-print-subtitle">{subtitle}</p> : null}

      {summary && summary.length > 0 ? (
        <section className="tool-print-summary" aria-label="Tóm tắt">
          {summary.map((item) => (
            <div key={item.label} className="tool-print-summary__item">
              <p className="tool-print-summary__label">{item.label}</p>
              <p className="tool-print-summary__value">{item.value}</p>
            </div>
          ))}
        </section>
      ) : null}

      {children}
    </div>
  );
}
