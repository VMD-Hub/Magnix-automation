import {
  getVuNguyenProfile,
  getVuNguyenProfileUrl,
} from "@/lib/personal-brand/vu-nguyen/profile-content";
import { getBrandName, getSiteUrl } from "@/lib/site-config";

function escapeVcard(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/** vCard 3.0 — tách họ tên Việt (họ = token cuối). */
function splitDisplayName(name: string): { family: string; given: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { family: parts[0] ?? name, given: "" };
  }
  return {
    family: parts[parts.length - 1]!,
    given: parts.slice(0, -1).join(" "),
  };
}

function vcardLine(key: string, value: string): string {
  return `${key};CHARSET=UTF-8:${escapeVcard(value)}`;
}

/** vCard 3.0 — tương thích iOS / Android (SĐT, email, web, Zalo). */
export function buildVuNguyenVcard(): string {
  const p = getVuNguyenProfile();
  const { family, given } = splitDisplayName(p.name);
  const siteUrl = getSiteUrl();
  const profileUrl = getVuNguyenProfileUrl();
  const zaloUrl = p.contact.zaloUrl;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    vcardLine("FN", p.name),
    `N;CHARSET=UTF-8:${escapeVcard(family)};${escapeVcard(given)};;;`,
    vcardLine("TITLE", p.jobTitle),
    vcardLine("ORG", `${getBrandName()} — ${p.organizationRole}`),
    `EMAIL;TYPE=INTERNET,WORK:${p.contact.email}`,
    `TEL;TYPE=CELL,VOICE:${p.contact.phoneTel}`,
    `URL;TYPE=WORK:${siteUrl}`,
    `URL;TYPE=HOME:${profileUrl}`,
    `item1.URL:${zaloUrl}`,
    "item1.X-ABLabel:Zalo",
    vcardLine("NOTE", p.tagline),
    "END:VCARD",
  ];
  return `${lines.join("\r\n")}\r\n`;
}
