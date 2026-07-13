"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui/cn";

const VCARD_API = "/api/vu-nguyen/vcard?inline=1";
const VCARD_FILENAME = "vu-nguyen-housex.vcf";

type Props = {
  className?: string;
};

export function SaveVcardButton({ className }: Props) {
  const [busy, setBusy] = useState(false);

  async function saveVcard() {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch(VCARD_API);
      if (!res.ok) throw new Error("vcard fetch failed");

      const blob = await res.blob();
      const file = new File([blob], VCARD_FILENAME, {
        type: "text/vcard;charset=utf-8",
      });

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function" &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Vũ Nguyễn — House X",
        });
        return;
      }

      const isIos =
        typeof navigator !== "undefined" &&
        /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isIos) {
        window.location.assign(VCARD_API);
        return;
      }

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = VCARD_FILENAME;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      window.location.assign(VCARD_API);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      className={cn("w-full max-w-xs", className)}
      disabled={busy}
      onClick={() => void saveVcard()}
    >
      {busy ? "Đang mở…" : "Lưu danh thiếp"}
    </Button>
  );
}
