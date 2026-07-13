"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

type Props = {
  className?: string;
};

export function PrintChecklistButton({ className }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("border-brand-200 text-brand-800 hover:border-brand-300", className)}
      onClick={() => window.print()}
    >
      In / PDF
    </Button>
  );
}
