/** Khối nội dung FAQ — hỗ trợ bố cục AIO (đoạn, danh sách, trích dẫn pháp lý). */
export type FaqContentBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "legal"; cite: string; text: string };

export type RichFaqItem = {
  q: string;
  blocks: FaqContentBlock[];
};

/** Chuyển plain text (• bullet, đoạn cách nhau bởi dòng trống) sang khối hiển thị. */
export function plainTextToFaqBlocks(text: string): FaqContentBlock[] {
  return text.split(/\n\n+/).map((part) => {
    const lines = part.split("\n").filter((l) => l.trim());
    if (lines.length > 0 && lines.every((l) => /^•\s/.test(l.trim()))) {
      return {
        type: "ul" as const,
        items: lines.map((l) => l.replace(/^•\s+/, "")),
      };
    }
    return { type: "p" as const, text: part };
  });
}

/** Chuyển khối FAQ sang plain text cho JSON-LD FAQPage. */
export function faqBlocksToPlainText(blocks: FaqContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "p") return b.text;
      if (b.type === "ul") return b.items.map((i) => `• ${i}`).join("\n");
      if (b.type === "legal") {
        return b.cite ? `${b.cite}\n${b.text}` : b.text;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}
