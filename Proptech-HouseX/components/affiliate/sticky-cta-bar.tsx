"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCtaBar({
  label = "Yêu cầu tư vấn",
  href = "#tu-van",
}: {
  label?: string;
  href?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md md:hidden">
      <Link
        href={href}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {label}
      </Link>
    </div>
  );
}
