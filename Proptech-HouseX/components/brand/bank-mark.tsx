import { getBankProfile } from "@/lib/brand/bank-profile";
import { cn } from "@/lib/ui/cn";

type BankMarkProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE = {
  sm: "h-9 w-9 text-[10px]",
  md: "h-11 w-11 text-xs",
  lg: "h-14 w-14 text-sm",
};

/** Badge ngân hàng — viết tắt + gradient thương hiệu. */
export function BankMark({ name, size = "md", className }: BankMarkProps) {
  const p = getBankProfile(name);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl font-bold tracking-tight text-white shadow-sm",
        SIZE[size],
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})`,
        boxShadow: `0 4px 14px ${p.ring}`,
      }}
      aria-hidden
    >
      {p.abbr}
    </span>
  );
}
