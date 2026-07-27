/** Phần tử inline sau khi tách markdown link `[label](href)`. */
export type InlineMdPart =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

const MD_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Tách plain text có markdown link nội bộ / URL thành các phần render. */
export function splitInlineMdLinks(text: string): InlineMdPart[] {
  const parts: InlineMdPart[] = [];
  let last = 0;
  for (const match of text.matchAll(MD_LINK_RE)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push({ type: "text", value: text.slice(last, index) });
    }
    parts.push({ type: "link", label: match[1]!, href: match[2]! });
    last = index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

/** Bỏ cú pháp markdown link → chỉ giữ label (JSON-LD / plain text). */
export function stripInlineMdLinks(text: string): string {
  return text.replace(MD_LINK_RE, "$1");
}
