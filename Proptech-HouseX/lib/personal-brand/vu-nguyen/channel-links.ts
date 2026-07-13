/**
 * Liên kết kênh Web · Mini App (Zalo OA) · Profile NFC — Vũ Nguyễn / House X.
 */

import {
  getVuNguyenProfileUrl,
  VU_NGUYEN_PROFILE_PATH,
} from "@/lib/personal-brand/vu-nguyen/profile-content";
import { getSiteUrl, getSocialChannels } from "@/lib/site-config";

export type VuNguyenQrTarget = "profile" | "profile-nfc" | "web" | "miniapp";

export function getHouseXWebUrl(): string {
  return getSiteUrl();
}

/** Trang Zalo OA — khách bấm «Mở House X» (Mini App) trên OA. */
export function getHouseXMiniAppEntryUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_ZALO_OA_PUBLIC_URL?.trim();
  if (fromEnv) return fromEnv;

  const social = getSocialChannels().find((c) => c.id === "zalo");
  if (social?.href) return social.href;

  const oaId = process.env.NEXT_PUBLIC_ZALO_OA_ID?.trim();
  if (oaId) return `https://zalo.me/${oaId}`;

  return "https://zalo.me/0826600800";
}

export function getVuNguyenProfileNfcUrl(): string {
  return getVuNguyenProfileUrl({ src: "nfc" });
}

export function resolveVuNguyenQrUrl(target: VuNguyenQrTarget): string {
  switch (target) {
    case "profile-nfc":
      return getVuNguyenProfileNfcUrl();
    case "web":
      return getHouseXWebUrl();
    case "miniapp":
      return getHouseXMiniAppEntryUrl();
    case "profile":
    default:
      return getVuNguyenProfileUrl();
  }
}

export function getVuNguyenQrImagePath(target: VuNguyenQrTarget): string {
  const host = encodeURIComponent(new URL(getSiteUrl()).hostname);
  return `/api/vu-nguyen/qr?target=${target}&v=${host}`;
}

/** QR trên digital name card — danh thiếp, web, Mini App. */
export const VU_NGUYEN_VISITOR_CHANNEL_IDS = [
  "profile-nfc",
  "web",
  "miniapp",
] as const;

/** Nút & QR in trên thẻ vật lý (gồm profile-nfc) — không render trên trang profile. */
export const VU_NGUYEN_CONNECT_CHANNELS = [
  {
    id: "profile-nfc" as const,
    label: "Profile · NFC",
    shortLabel: "Danh thiếp",
    openLabel: "Mở danh thiếp",
    description: "Chia sẻ hoặc quét để mở digital name card",
    href: getVuNguyenProfileNfcUrl,
    qrTarget: "profile-nfc" as const,
    buttonVariant: "primary" as const,
  },
  {
    id: "web" as const,
    label: "Web House X",
    shortLabel: "Web",
    openLabel: "Mở web House X",
    description: "Công cụ NOXH, dự án, tính vay trên trình duyệt",
    href: getHouseXWebUrl,
    qrTarget: "web" as const,
    buttonVariant: "brand" as const,
  },
  {
    id: "miniapp" as const,
    label: "Mini App Zalo",
    shortLabel: "Zalo App",
    openLabel: "Mở Mini App",
    description: "Mở House X trong Zalo — nút «Mở House X» trên OA",
    href: getHouseXMiniAppEntryUrl,
    qrTarget: "miniapp" as const,
    buttonVariant: "zalo" as const,
  },
] as const;

export function getVuNguyenConnectChannels() {
  return VU_NGUYEN_CONNECT_CHANNELS.map((ch) => ({
    ...ch,
    href: ch.href(),
    qrSrc: getVuNguyenQrImagePath(ch.qrTarget),
  }));
}

/** QR trên trang profile — danh thiếp + Web + Mini App. */
export function getVuNguyenVisitorConnectChannels() {
  const allowed = new Set<string>(VU_NGUYEN_VISITOR_CHANNEL_IDS);
  return getVuNguyenConnectChannels().filter((ch) => allowed.has(ch.id));
}

export const VU_NGUYEN_QR_PRINT_DIR = "public/brand/vu-nguyen/qr" as const;

export const VU_NGUYEN_PROFILE_CANONICAL_PATH = VU_NGUYEN_PROFILE_PATH;
