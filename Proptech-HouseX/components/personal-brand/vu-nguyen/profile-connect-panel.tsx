import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { getVuNguyenVisitorConnectChannels } from "@/lib/personal-brand/vu-nguyen/channel-links";
import { cn } from "@/lib/ui/cn";

type Props = {
  /** Trên nền ruby holder — chữ sáng hơn */
  variant?: "default" | "on-dark";
  className?: string;
};

export function ProfileConnectPanel({ variant = "default", className }: Props) {
  const channels = getVuNguyenVisitorConnectChannels();
  const onDark = variant === "on-dark";
  const actionChannels = channels.filter((ch) => ch.id !== "profile-nfc");

  return (
    <section className={cn("not-prose", className)}>
      <ul className="grid grid-cols-3 gap-2 sm:gap-3">
        {channels.map((ch) => (
          <li
            key={ch.id}
            className={cn(
              "flex flex-col items-center rounded-xl border px-2 py-3 text-center",
              onDark
                ? "border-white/20 bg-black/15"
                : "proptech-card border-brand-100",
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-md bg-white p-1.5 shadow-sm",
                "ring-1 ring-gold-500/25",
              )}
            >
              <Image
                src={ch.qrSrc}
                alt={`QR ${ch.label}`}
                width={96}
                height={96}
                unoptimized
                className="h-20 w-20 sm:h-[5.5rem] sm:w-[5.5rem]"
              />
            </div>
            <p
              className={cn(
                "mt-2 text-[10px] font-bold leading-tight sm:text-xs",
                onDark ? "text-white" : "text-brand-900",
              )}
            >
              {ch.shortLabel}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {actionChannels.map((ch) => (
          <ButtonLink
            key={ch.id}
            href={ch.href}
            variant={ch.buttonVariant}
            size="sm"
            className="w-full text-xs"
            {...(ch.id === "miniapp"
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {ch.openLabel}
          </ButtonLink>
        ))}
      </div>
    </section>
  );
}
