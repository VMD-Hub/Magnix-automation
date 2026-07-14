import type { ReactElement, ReactNode } from "react";

/** Icon SVG nhỏ — app-feel, không dùng emoji. */

type IconProps = {
  size?: number;
  className?: string;
};

function Svg({
  size = 22,
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconHome({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M4.5 10.5 12 4l7.5 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-4v5H5.5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconTools({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M14.7 6.3a4 4 0 0 0-5.6 5.6L4 17l3 3 5.1-5.1a4 4 0 0 0 5.6-5.6l-2.2 2.2-1.8-1.8 2-2.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconUser({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 19.2c1.4-3 4-4.5 6.5-4.5s5.1 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconAgent({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M4 18V8.8L12 4l8 4.8V18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 18v-5h6v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBook({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15.5H7.5A2.5 2.5 0 0 0 5 21V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M5 18.5h14" stroke="currentColor" strokeWidth="1.6" />
    </Svg>
  );
}

export function IconWheel({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path
        d="M12 4.5V9.5M12 14.5v5M4.5 12H9.5M14.5 12h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconCheck({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12.2 2.3 2.3 4.7-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconClock({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v4.2L15 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconBuilding({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M5 20V6.5A1.5 1.5 0 0 1 6.5 5H12v15H5Zm7 0h5.5A1.5 1.5 0 0 0 19 18.5V10h-7v10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.5h1.5M8 11.5h1.5M8 14.5h1.5M14.5 12.5H16M14.5 15.5H16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconChat({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4 3.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconScale({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M12 4v16M8 20h8M6 8h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6 8 3.5 13.5h5L6 8Zm12 0-2.5 5.5h5L18 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconChart({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M5 19h14M7.5 16.5v-5M12 16.5V8M16.5 16.5v-8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconNews({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M5 6.5A1.5 1.5 0 0 1 6.5 5H16a1 1 0 0 1 1 1v12.5H6.5A1.5 1.5 0 0 1 5 17V6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M17 7h1.5A1.5 1.5 0 0 1 20 8.5V16a2 2 0 0 1-2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 9h6M8 12h6M8 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconPaint({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M6 14.5c0 2.5 2 4.5 4.5 4.5S15 17 15 14.5V6.5a2.5 2.5 0 0 0-5 0v.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 8.5h2.5A1.5 1.5 0 0 1 19 10v1.5a2 2 0 0 1-2 2H15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconCompass({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m14.8 9.2-1.6 4.4-4.4 1.6 1.6-4.4 4.4-1.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconInterior({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M4 19V9l8-5 8 5v10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 19v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconKey({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="9" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M11.5 11.5 19 19M16.5 16.5l2 2M15 18l2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

const SHORTCUT_ICONS: Record<string, (props: IconProps) => ReactElement> = {
  "cam-nang": IconBook,
  "khuyen-mai": IconWheel,
  "dieu-kien": IconCheck,
  "vay-60s": IconClock,
  "du-an": IconBuilding,
  "tu-van": IconChat,
  "phap-ly": IconScale,
  vay: IconChart,
  "tin-tuc": IconNews,
  "tham-dinh": IconChart,
  "cong-cu-hub": IconTools,
  "vay-bds": IconChart,
  "tham-dinh-gia": IconScale,
  "noi-that": IconInterior,
  "ky-gui": IconKey,
  "tinh-vay": IconChart,
  "han-muc": IconClock,
  "tham-dinh-hs": IconCheck,
  "mau-son": IconPaint,
  "huong-nha": IconCompass,
  "ban-lv": IconCompass,
  "tuoi-xay": IconHome,
};

export function ShortcutGlyph({
  id,
  size = 22,
}: {
  id: string;
  size?: number;
}) {
  const Comp = SHORTCUT_ICONS[id] ?? IconHome;
  return <Comp size={size} className="shortcut-glyph" />;
}
