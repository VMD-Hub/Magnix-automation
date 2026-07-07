import type { ReactNode } from "react";
import { RubySurfaceOrnament } from "@/components/brand/ruby-surface-ornament";
import { cn } from "@/lib/ui/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Khối CTA / holder nền ruby — đồng bộ header & footer. */
export function RubyHolder({ children, className }: Props) {
  return (
    <div className={cn("proptech-ruby-holder", className)}>
      <RubySurfaceOrnament variant="holder" />
      <div className="proptech-ruby-holder__content">{children}</div>
    </div>
  );
}
