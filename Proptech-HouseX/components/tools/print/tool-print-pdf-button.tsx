"use client";

import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useToolPrintPdf } from "@/components/tools/print/use-tool-print-pdf";
import { cn } from "@/lib/ui/cn";

type Props = {
  className?: string;
  label?: string;
  beforePrint?: () => void;
  disabled?: boolean;
};

/** Nút Tải PDF — dùng chung mọi bảng tính House X. */
export function ToolPrintPdfButton({
  className,
  label = "Tải PDF",
  beforePrint,
  disabled,
}: Props) {
  const printPdf = useToolPrintPdf();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={() => printPdf({ beforePrint })}
      className={cn("shrink-0 print:hidden", className)}
    >
      <Icon.FileCheck className="text-base" /> {label}
    </Button>
  );
}
