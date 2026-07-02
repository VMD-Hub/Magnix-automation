import type { SVGProps } from "react";
import { CloverMark } from "@/components/brand/clover-mark";
import { HouseXMark } from "@/components/brand/housex-mark";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  /** Cỏ bốn lá HouseX — alias `CloverMark`, cùng geometry mọi nơi. */
  Clover: (p: IconProps) => (
    <CloverMark className={p.className} aria-hidden={p["aria-hidden"]} />
  ),
  Logo: (p: IconProps) => (
    <HouseXMark
      className={p.className}
      variant="iconOnly"
      aria-hidden={p["aria-hidden"] === true || p["aria-hidden"] === "true" ? true : undefined}
    />
  ),
  Search: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  ),
  MapPin: (p: IconProps) => (
    <Svg {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  ),
  Phone: (p: IconProps) => (
    <Svg {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </Svg>
  ),
  Chat: (p: IconProps) => (
    <Svg {...p}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </Svg>
  ),
  BadgeCheck: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 2 14.2 4.2l3 .1.9 2.9 2.4 1.8-1 2.9 1 2.9-2.4 1.8-.9 2.9-3 .1L12 22l-2.2-2.2-3-.1-.9-2.9L3.5 15l1-2.9-1-2.9 2.4-1.8.9-2.9 3-.1Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  Video: (p: IconProps) => (
    <Svg {...p}>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m22 8-6 4 6 4V8Z" />
    </Svg>
  ),
  Bed: (p: IconProps) => (
    <Svg {...p}>
      <path d="M2 17v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="M2 17h20M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M12 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M4 20v-3M20 20v-3" />
    </Svg>
  ),
  Bath: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 12V5a2 2 0 0 1 2-2 2 2 0 0 1 2 2" />
      <path d="M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2ZM6 18l-1 3M18 18l1 3M7 6h2" />
    </Svg>
  ),
  Ruler: (p: IconProps) => (
    <Svg {...p}>
      <path d="M3 9h18v6H3z" />
      <path d="M7 9v3M11 9v4M15 9v3M19 9v4" />
    </Svg>
  ),
  Calculator: (p: IconProps) => (
    <Svg {...p}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14v4M8 18h4" />
    </Svg>
  ),
  Building: (p: IconProps) => (
    <Svg {...p}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 22v-4h4v4" />
    </Svg>
  ),
  Coins: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88l.7.71-2.82 2.82" />
    </Svg>
  ),
  Compass: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12Z" />
    </Svg>
  ),
  FileCheck: (p: IconProps) => (
    <Svg {...p}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </Svg>
  ),
  Layers: (p: IconProps) => (
    <Svg {...p}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </Svg>
  ),
  ShieldCheck: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  Headset: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
      <path d="M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2ZM17 18a4 4 0 0 1-4 3h-1" />
    </Svg>
  ),
  Heart: (p: IconProps) => (
    <Svg {...p}>
      <path d="M19 5.5a4.5 4.5 0 0 0-7 1 4.5 4.5 0 0 0-7-1c-2 1.6-2 5 .5 7.5L12 20l6.5-7C21 10.5 21 7.1 19 5.5Z" />
    </Svg>
  ),
  Bell: (p: IconProps) => (
    <Svg {...p}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
    </Svg>
  ),
  ChevronRight: (p: IconProps) => (
    <Svg {...p}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  ),
  Menu: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  ),
};
