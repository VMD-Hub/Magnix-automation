import {
  HOUSEX_FOOTER_LOGO_SRC,
  HOUSEX_FOOTER_TAGLINE,
} from "@/lib/brand/housex-logo-assets";
import { getSupportEmail, getSupportPhoneDisplay } from "@/lib/site-config";
import { cn } from "@/lib/ui/cn";

type Props = {
  className?: string;
};

/**
 * Header in PDF công cụ — trái: logo + tagline; phải: hotline + email + QR Zalo OA.
 * Không in domain (tránh trùng URL footer trình duyệt khi bật Headers and footers).
 */
export function ToolPrintBrandHeader({ className }: Props) {
  const phone = getSupportPhoneDisplay();
  const email = getSupportEmail();

  return (
    <header className={cn("tool-print-header hidden print:flex", className)}>
      <div className="tool-print-header__brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HOUSEX_FOOTER_LOGO_SRC}
          alt="House X"
          className="tool-print-header__logo"
          width={220}
          height={75}
        />
        <p className="tool-print-header__tagline">{HOUSEX_FOOTER_TAGLINE}</p>
      </div>
      <div className="tool-print-header__contact">
        <div className="tool-print-header__contact-text">
          <p className="tool-print-header__contact-line">
            Hotline: <strong>{phone}</strong>
          </p>
          <p className="tool-print-header__contact-line">{email}</p>
        </div>
        <div className="tool-print-header__qr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/api/brand/zalo-oa-qr"
            alt="QR Zalo OA House X"
            width={72}
            height={72}
            loading="eager"
            decoding="sync"
          />
          <span>Zalo OA</span>
        </div>
      </div>
    </header>
  );
}
