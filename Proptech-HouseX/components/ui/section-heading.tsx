import Link from "next/link";
import { Icon } from "@/components/icons";

export function SectionHeading({
  title,
  subtitle,
  href,
  hrefLabel = "Xem tất cả",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="lux-heading-accent text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-sm text-[#666666]">{subtitle}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {hrefLabel}
          <Icon.ChevronRight className="text-base" />
        </Link>
      ) : null}
    </div>
  );
}
