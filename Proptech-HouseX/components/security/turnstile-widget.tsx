"use client";

import { useEffect, useRef, useState } from "react";
import { turnstileSiteKey } from "@/lib/security/turnstile-public";

type Props = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

let scriptLoading: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    const done = () => resolve();
    window.onTurnstileLoad = done;
    const existing = document.querySelector('script[data-turnstile="1"]');
    if (existing && window.turnstile) {
      done();
      return;
    }
    if (existing) {
      const poll = setInterval(() => {
        if (window.turnstile) {
          clearInterval(poll);
          done();
        }
      }, 50);
      return;
    }

    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = "1";
    s.onerror = () => reject(new Error("Turnstile load failed"));
    document.head.appendChild(s);
  });

  return scriptLoading;
}

/** Cloudflare Turnstile — chỉ render khi có NEXT_PUBLIC_TURNSTILE_SITE_KEY. */
export function TurnstileWidget({ onToken, onExpire, onError, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [failed, setFailed] = useState(false);
  const siteKey = turnstileSiteKey();

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;

    void loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "auto",
          size: "normal",
          callback: (token) => onToken(token),
          "expired-callback": () => onExpire?.(),
          "error-callback": () => {
            setFailed(true);
            onError?.();
          },
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onToken, onExpire, onError]);

  if (!siteKey) return null;

  if (failed) {
    return (
      <p className="text-center text-xs text-rose-600">
        Không tải được xác minh. Tải lại trang hoặc thử sau.
      </p>
    );
  }

  return <div ref={containerRef} className={className} />;
}

export function useTurnstileRequired(): boolean {
  return Boolean(turnstileSiteKey());
}
