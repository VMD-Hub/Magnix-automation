import type { SocialChannel } from "@/lib/site-config";
import { getBrandName } from "@/lib/site-config";
import { socialPlatformStyle, SocialPlatformIcon } from "@/components/brand/platform-icons";
import { cn } from "@/lib/ui/cn";

type SocialConnectProps = {
  channels: SocialChannel[];
  variant?: "light" | "dark";
  className?: string;
};

export function SocialConnect({ channels, variant = "light", className }: SocialConnectProps) {
  const labelClass =
    variant === "dark" ? "text-slate-400" : "text-slate-500";

  return (
    <div className={className}>
      <p className={cn("proptech-kicker", labelClass)}>Kết nối {getBrandName()}</p>
      <ul className="mt-3 flex flex-wrap gap-3">
        {channels.map((ch) => {
          const style = socialPlatformStyle(ch.id);
          const inner = (
            <>
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl shadow-md transition-all duration-300",
                  style.bg,
                  style.text,
                  ch.href ? cn("group-hover:scale-105", style.glow, "group-hover:shadow-lg") : "opacity-50",
                )}
              >
                <SocialPlatformIcon id={ch.id} className="h-5 w-5" />
              </span>
              <span className="mt-2 text-center text-xs font-medium leading-tight">
                {ch.label}
                {!ch.href ? (
                  <span className="mt-0.5 block text-[10px] font-normal opacity-60">Sắp có</span>
                ) : null}
              </span>
            </>
          );

          return (
            <li key={ch.id}>
              {ch.href ? (
                <a
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex w-[4.5rem] flex-col items-center transition-transform",
                    variant === "dark" ? "text-slate-200" : "text-slate-700",
                  )}
                  aria-label={`${ch.label} — ${getBrandName()}`}
                >
                  {inner}
                </a>
              ) : (
                <span
                  className={cn(
                    "flex w-[4.5rem] flex-col items-center",
                    variant === "dark" ? "text-slate-500" : "text-slate-400",
                  )}
                  title="Sắp cập nhật"
                >
                  {inner}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
