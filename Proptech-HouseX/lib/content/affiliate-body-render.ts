/**
 * Render markdown gọn cho landing dịch vụ affiliate (/vay-mua-nha, /dinh-gia…).
 * Hỗ trợ: ##/###, **bold**, [link](href), >, •/− list, 1. list, bảng |.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

function safeHref(href: string): string {
  const h = href.trim();
  if (h.startsWith("/") || h.startsWith("https://") || h.startsWith("http://")) {
    return h;
  }
  return "#";
}

function formatInlineMarks(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-slate-900">$1</strong>',
  );
  s = s.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return s;
}

/** Inline: link rồi bold/em; escape text. */
export function renderAffiliateInline(text: string): string {
  const parts: string[] = [];
  const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(formatInlineMarks(text.slice(last, match.index)));
    }
    const label = match[1];
    const href = safeHref(match[2]);
    parts.push(
      `<a href="${escapeAttr(href)}" class="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-900">${formatInlineMarks(label)}</a>`,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(formatInlineMarks(text.slice(last)));
  }
  return parts.join("");
}

export function renderAffiliateServiceMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let listBuf: { type: "ul" | "ol"; items: string[] } | null = null;

  function flushList() {
    if (!listBuf || listBuf.items.length === 0) {
      listBuf = null;
      return;
    }
    const tag = listBuf.type;
    out.push(
      `<${tag} class="my-3 ml-1 space-y-1.5 ${tag === "ul" ? "list-disc" : "list-decimal"} pl-5 text-sm leading-relaxed text-slate-700">`,
    );
    for (const item of listBuf.items) {
      out.push(`<li>${item}</li>`);
    }
    out.push(`</${tag}>`);
    listBuf = null;
  }

  function flushTable() {
    if (tableRows.length === 0) return;
    const [head, ...body] = tableRows;
    if (!head) return;
    out.push(
      '<div class="overflow-x-auto my-4"><table class="min-w-full text-sm border-collapse">',
    );
    out.push("<thead><tr>");
    for (const cell of head) {
      out.push(
        `<th class="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold text-slate-900">${renderAffiliateInline(cell)}</th>`,
      );
    }
    out.push("</tr></thead><tbody>");
    for (const row of body) {
      out.push("<tr>");
      for (const cell of row) {
        out.push(
          `<td class="border border-slate-200 px-3 py-2 align-top text-slate-700">${renderAffiliateInline(cell)}</td>`,
        );
      }
      out.push("</tr>");
    }
    out.push("</tbody></table></div>");
    tableRows = [];
    inTable = false;
  }

  function pushListItem(type: "ul" | "ol", html: string) {
    if (!listBuf || listBuf.type !== type) {
      flushList();
      listBuf = { type, items: [] };
    }
    listBuf.items.push(html);
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      if (trimmed.match(/^\|[\s\-:|]+\|$/)) continue;
      inTable = true;
      tableRows.push(
        trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim()),
      );
      continue;
    }

    if (inTable) flushTable();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      out.push(
        `<h2 class="text-lg font-bold text-slate-900 mb-3">${renderAffiliateInline(trimmed.slice(3))}</h2>`,
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushList();
      out.push(
        `<h3 class="text-base font-bold text-slate-800 mt-2 mb-2">${renderAffiliateInline(trimmed.slice(4))}</h3>`,
      );
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushList();
      out.push(
        `<blockquote class="border-l-4 border-brand-300 bg-brand-50/60 px-4 py-3 my-3 text-sm text-slate-700">${renderAffiliateInline(trimmed.slice(2))}</blockquote>`,
      );
      continue;
    }
    if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      pushListItem("ul", renderAffiliateInline(content));
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      pushListItem("ol", renderAffiliateInline(trimmed.replace(/^\d+\.\s/, "")));
      continue;
    }
    if (trimmed === "---") {
      flushList();
      out.push('<hr class="my-6 border-slate-200" />');
      continue;
    }

    flushList();
    out.push(
      `<p class="text-sm leading-relaxed text-slate-700 mb-2">${renderAffiliateInline(trimmed)}</p>`,
    );
  }

  if (inTable) flushTable();
  flushList();
  return out.join("\n");
}
