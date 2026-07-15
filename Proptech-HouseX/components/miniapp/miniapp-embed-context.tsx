"use client";

import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  HX_EMBED_MINIAPP,
  HX_EMBED_STORAGE_KEY,
  isMiniAppEmbedValue,
  withMiniAppEmbedParam,
} from "@/lib/miniapp/embed-mode";

const MiniAppEmbedContext = createContext(false);

function persistEmbed(on: boolean) {
  try {
    if (on) {
      sessionStorage.setItem(HX_EMBED_STORAGE_KEY, HX_EMBED_MINIAPP);
      document.documentElement.dataset.hxEmbed = HX_EMBED_MINIAPP;
    }
  } catch {
    /* private mode */
  }
}

function readStoredEmbed(): boolean {
  try {
    return isMiniAppEmbedValue(sessionStorage.getItem(HX_EMBED_STORAGE_KEY));
  } catch {
    return false;
  }
}

/**
 * Đọc ?hx_embed= — phải nằm trong <Suspense> (Next.js: /_not-found, CSR bailout).
 */
function MiniAppEmbedFromSearch({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [stored, setStored] = useState(false);

  useEffect(() => {
    const fromQuery = isMiniAppEmbedValue(searchParams.get("hx_embed"));
    if (fromQuery) {
      persistEmbed(true);
      setStored(true);
      return;
    }
    setStored(readStoredEmbed());
  }, [searchParams]);

  const embed =
    stored || isMiniAppEmbedValue(searchParams.get("hx_embed"));

  return (
    <MiniAppEmbedContext.Provider value={embed}>
      {children}
    </MiniAppEmbedContext.Provider>
  );
}

/**
 * Bắt ?hx_embed=miniapp từ Mini App + giữ session trong tab webview.
 * Cung cấp context cho logo / breadcrumb "Trang chủ" / chrome tối giản.
 */
export function MiniAppEmbedProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <MiniAppEmbedContext.Provider value={false}>
          {children}
        </MiniAppEmbedContext.Provider>
      }
    >
      <MiniAppEmbedFromSearch>{children}</MiniAppEmbedFromSearch>
    </Suspense>
  );
}

export function useMiniAppEmbed(): boolean {
  return useContext(MiniAppEmbedContext);
}

/** URL home khi đang embed Mini App; ngược lại path web. */
export function useEmbedHomeHref(webFallback = "/"): string {
  const embed = useMiniAppEmbed();
  return useMemo(() => (embed ? "/" : webFallback), [embed, webFallback]);
}

/** Giữ hx_embed khi điều hướng nội bộ trong iframe Mini App. */
export function useEmbedAwareHref(href: string): string {
  const embed = useMiniAppEmbed();
  if (!embed) return href;
  if (!href.startsWith("/")) return href;
  if (href === "/" || href.startsWith("/#")) {
    return "/";
  }
  return withMiniAppEmbedParam(href);
}

export { withMiniAppEmbedParam };
