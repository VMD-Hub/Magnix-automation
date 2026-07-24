import { cn } from "@/lib/ui/cn";

/** Icon id cho khối Giá trị / Sứ mệnh–Tầm nhìn trên /gioi-thieu. */
export type AboutBrandIconId =
  | "du-lieu-thuc"
  | "mot-du-an"
  | "bao-mat-ket-noi"
  | "dong-hanh-an-cu"
  | "su-menh"
  | "tam-nhin";

type Props = {
  id: AboutBrandIconId;
  className?: string;
  title?: string;
};

/**
 * Icon đồ họa House X (ruby + gold) — inline SVG để không phụ thuộc static /brand/*.svg.
 * Cùng hệ: nền #FDF2F3 bo góc, nét #B81425, nhấn #DAA520.
 */
export function AboutBrandIcon({ id, className, title }: Props) {
  const label = title ?? id;
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[4.5rem] w-[4.5rem] shrink-0", className)}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      <rect x="8" y="8" width="112" height="112" rx="28" fill="#FDF2F3" />
      {id === "du-lieu-thuc" && <IconDuLieuThuc />}
      {id === "mot-du-an" && <IconMotDuAn />}
      {id === "bao-mat-ket-noi" && <IconBaoMat />}
      {id === "dong-hanh-an-cu" && <IconDongHanh />}
      {id === "su-menh" && <IconSuMenh />}
      {id === "tam-nhin" && <IconTamNhin />}
    </svg>
  );
}

function IconDuLieuThuc() {
  return (
    <>
      <rect x="34" y="28" width="52" height="68" rx="8" fill="#fff" stroke="#B81425" strokeWidth="3" />
      <rect x="40" y="38" width="28" height="4" rx="2" fill="#F9C8CC" />
      <rect x="40" y="48" width="36" height="4" rx="2" fill="#F9C8CC" />
      <rect x="40" y="58" width="22" height="4" rx="2" fill="#F9C8CC" />
      <rect x="42" y="72" width="8" height="14" rx="2" fill="#B81425" />
      <rect x="54" y="66" width="8" height="20" rx="2" fill="#DAA520" />
      <rect x="66" y="70" width="8" height="16" rx="2" fill="#7A0E18" />
      <circle cx="86" cy="88" r="18" fill="#B81425" />
      <circle cx="86" cy="88" r="13" fill="#DAA520" />
      <path
        d="M79.5 88.2l4.2 4.2 8.6-9.2"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function IconMotDuAn() {
  return (
    <>
      <path
        d="M36 96V48l28-16 28 16v48H36z"
        fill="#fff"
        stroke="#B81425"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M64 32v64" stroke="#F9C8CC" strokeWidth="2" />
      <rect x="44" y="54" width="10" height="10" rx="2" fill="#B81425" />
      <rect x="58" y="54" width="10" height="10" rx="2" fill="#B81425" />
      <rect x="74" y="54" width="10" height="10" rx="2" fill="#B81425" />
      <rect x="44" y="70" width="10" height="10" rx="2" fill="#7A0E18" />
      <rect x="58" y="70" width="10" height="10" rx="2" fill="#DAA520" />
      <rect x="74" y="70" width="10" height="10" rx="2" fill="#7A0E18" />
      <rect x="58" y="84" width="12" height="12" rx="2" fill="#5C0B12" />
      <circle cx="94" cy="40" r="16" fill="#B81425" />
      <circle cx="94" cy="36" r="5.5" fill="#fff" />
      <path d="M83.5 50c2.5-6 8-9 10.5-9s8 3 10.5 9" fill="#fff" />
    </>
  );
}

function IconBaoMat() {
  return (
    <>
      <path
        d="M64 24l36 12v28c0 22-14 36-36 44-22-8-36-22-36-44V36l36-12z"
        fill="#fff"
        stroke="#B81425"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="50" y="58" width="28" height="24" rx="5" fill="#B81425" />
      <path
        d="M56 58v-8a8 8 0 0 1 16 0v8"
        stroke="#DAA520"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="64" cy="68" r="3.5" fill="#DAA520" />
      <rect x="62.5" y="70" width="3" height="6" rx="1.5" fill="#DAA520" />
      <circle cx="38" cy="92" r="5" fill="#7A0E18" />
      <circle cx="90" cy="92" r="5" fill="#7A0E18" />
      <path
        d="M43 92h42"
        stroke="#DAA520"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 4"
      />
    </>
  );
}

function IconDongHanh() {
  return (
    <>
      <path
        d="M28 96c16-18 24-28 36-28s20 10 36 28"
        stroke="#F9C8CC"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 96c16-18 24-28 36-28s20 10 36 28"
        stroke="#B81425"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="5 6"
      />
      <path
        d="M52 62l12-10 12 10v22H52V62z"
        fill="#fff"
        stroke="#B81425"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="60" y="70" width="8" height="14" rx="1.5" fill="#DAA520" />
      <circle cx="36" cy="72" r="6" fill="#B81425" />
      <path d="M28 92c1.5-10 5.5-14 8-14s6.5 4 8 14" fill="#7A0E18" />
      <circle cx="92" cy="72" r="6" fill="#B81425" />
      <path d="M84 92c1.5-10 5.5-14 8-14s6.5 4 8 14" fill="#7A0E18" />
      <circle cx="64" cy="96" r="4" fill="#DAA520" />
    </>
  );
}

function IconSuMenh() {
  return (
    <>
      <path
        d="M28 98c14-22 26-34 36-34s22 12 36 34"
        stroke="#F9C8CC"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 98c14-22 26-34 36-34s22 12 36 34"
        stroke="#B81425"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 54l12-11 12 11v24H52V54z"
        fill="#fff"
        stroke="#B81425"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="60" y="64" width="8" height="14" rx="1.5" fill="#DAA520" />
      <circle cx="40" cy="78" r="7" fill="#B81425" />
      <path d="M40 72v12M34 78h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="56" cy="86" r="3.5" fill="#DAA520" />
      <circle cx="72" cy="90" r="3.5" fill="#7A0E18" />
      <circle cx="88" cy="96" r="3.5" fill="#7A0E18" />
    </>
  );
}

function IconTamNhin() {
  return (
    <>
      <path
        d="M86 52l10-8 10 8v16H86V52z"
        fill="#fff"
        stroke="#B81425"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="92" y="58" width="6" height="10" rx="1" fill="#DAA520" />
      <path
        d="M72 70c6-6 12-8 18-8s12 2 18 8"
        stroke="#F9C8CC"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42" cy="58" r="8" fill="#B81425" />
      <path d="M30 92c2-16 8-22 12-22s10 6 12 22" fill="#7A0E18" />
      <path d="M48 62l28-14" stroke="#5C0B12" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 62l28-14" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
      <rect
        x="72"
        y="42"
        width="14"
        height="10"
        rx="3"
        fill="#B81425"
        transform="rotate(-26 79 47)"
      />
      <circle cx="76" cy="48" r="2.5" fill="#fff" />
      <path
        d="M86 48h10"
        stroke="#F0959C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </>
  );
}
