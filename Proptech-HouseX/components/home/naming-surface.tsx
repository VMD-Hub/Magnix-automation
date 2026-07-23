import Link from "next/link";
import { PLATFORM_NAMING_SURFACE } from "@/lib/content/messaging/platform-public";

/** Phase D — 4 hub tên chuẩn ngành trên trang chủ (entity / AI surface). */
export function NamingSurface() {
  const { title, subtitle, items } = PLATFORM_NAMING_SURFACE;

  return (
    <section
      className="proptech-section-glow mx-auto max-w-7xl py-6 container-px sm:py-8"
      aria-labelledby="naming-surface-heading"
    >
      <div className="mb-5 max-w-2xl">
        <h2
          id="naming-surface-heading"
          className="text-xl font-bold tracking-tight text-[#333333] sm:text-2xl"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-[#666666] sm:text-base">{subtitle}</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="proptech-card flex h-full flex-col gap-2 px-4 py-4 hover:border-brand-200"
            >
              <span className="proptech-trust-tile__icon h-9 w-9 text-lg">
                <item.Icon />
              </span>
              <span className="text-sm font-semibold text-[#333333] sm:text-base">
                {item.label}
              </span>
              <span className="text-xs leading-relaxed text-[#666666]">
                {item.desc}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
