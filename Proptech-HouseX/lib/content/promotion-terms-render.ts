/** Render markdown thể lệ khuyến mãi (heading, bold, blockquote, bảng). */
export function renderPromotionTermsMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    const [head, ...body] = tableRows;
    if (!head) return;
    out.push('<div class="overflow-x-auto my-4"><table class="min-w-full text-sm border-collapse">');
    out.push("<thead><tr>");
    for (const cell of head) {
      out.push(`<th class="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-semibold">${inline(cell)}</th>`);
    }
    out.push("</tr></thead><tbody>");
    for (const row of body) {
      out.push("<tr>");
      for (const cell of row) {
        out.push(`<td class="border border-slate-200 px-3 py-2 align-top">${inline(cell)}</td>`);
      }
      out.push("</tr>");
    }
    out.push("</tbody></table></div>");
    tableRows = [];
    inTable = false;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
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

    if (!trimmed) continue;

    if (trimmed.startsWith("# ")) {
      out.push(`<h1 class="text-2xl font-extrabold text-slate-900 mb-4">${inline(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith("## ")) {
      out.push(`<h2 class="text-lg font-bold text-slate-900 mt-8 mb-3">${inline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("### ")) {
      out.push(`<h3 class="text-base font-bold text-slate-800 mt-5 mb-2">${inline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("> ")) {
      out.push(
        `<blockquote class="border-l-4 border-brand-300 bg-brand-50/60 px-4 py-3 my-4 text-sm text-slate-700">${inline(trimmed.slice(2))}</blockquote>`,
      );
      continue;
    }
    if (trimmed.startsWith("- ")) {
      out.push(`<li class="ml-4 list-disc text-sm leading-relaxed text-slate-700 mb-1">${inline(trimmed.slice(2))}</li>`);
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      out.push(`<li class="ml-4 list-decimal text-sm leading-relaxed text-slate-700 mb-2">${inline(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
      continue;
    }
    if (trimmed === "---") {
      out.push('<hr class="my-6 border-slate-200" />');
      continue;
    }

    out.push(`<p class="text-sm leading-relaxed text-slate-700 mb-2">${inline(trimmed)}</p>`);
  }

  if (inTable) flushTable();
  return out.join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
