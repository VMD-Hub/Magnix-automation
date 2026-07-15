"use client";

import { EmbedHomeLink } from "@/components/miniapp/embed-links";
import { getBrandName } from "@/lib/site-config";

/**
 * Thanh mỏng khi trang web được nhúng trong Mini App —
 * thay header site, nhắc người dùng vẫn đang trong luồng app.
 */
export function MiniAppEmbedBar() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm">
      <EmbedHomeLink className="text-sm font-semibold text-[#9b111e] hover:underline">
        ← {getBrandName()} Mini App
      </EmbedHomeLink>
      <span className="truncate text-xs text-slate-500">Đang xem trong app</span>
    </div>
  );
}
