import Link from "next/link";
import type { ReactNode } from "react";
import type { ArticleCardData } from "@/lib/data/article-types";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;
const HEADING2_RE = /^##\s+(.+)$/;
const HEADING3_RE = /^###\s+(.+)$/;
const IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const CAPTION_RE = /^\*([^*]+)\*$/;
const BLOCKQUOTE_RE = /^>\s?(.+)$/;
const LIST_ITEM_RE = /^-\s+(.+)$/;
const TABLE_ROW_RE = /^\|.+\|$/;
const TABLE_SEP_RE = /^\|[-:\s|]+\|$/;

/** Canh đều hai lề — chỉ áp dụng cho khối văn bản (p, li, blockquote). */
const PROSE_JUSTIFY =
  "text-justify text-pretty hyphens-auto [text-align-last:left]";

function renderLinks(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const label = match[1];
    const href = match[2];
    if (href.startsWith("/")) {
      parts.push(
        <Link
          key={`${keyPrefix}-l-${match.index}`}
          href={href}
          className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-900"
        >
          {label}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={`${keyPrefix}-l-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-900"
        >
          {label}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderInline(text: string, keyPrefix: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  BOLD_RE.lastIndex = 0;
  while ((match = BOLD_RE.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(...renderLinks(text.slice(last, match.index), `${keyPrefix}-t-${last}`));
    }
    nodes.push(
      <strong
        key={`${keyPrefix}-b-${match.index}`}
        className="font-semibold text-slate-900"
      >
        {renderLinks(match[1], `${keyPrefix}-bs-${match.index}`)}
      </strong>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(...renderLinks(text.slice(last), `${keyPrefix}-t-${last}`));
  }
  if (nodes.length === 0) return text;
  if (nodes.length === 1) return nodes[0];
  return nodes;
}

function isListBlock(block: string): boolean {
  const lines = block.trim().split("\n");
  return lines.length > 0 && lines.every((line) => LIST_ITEM_RE.test(line.trim()));
}

function renderList(block: string, key: string) {
  const items = block
    .trim()
    .split("\n")
    .map((line) => LIST_ITEM_RE.exec(line.trim())?.[1] ?? "")
    .filter(Boolean);
  return (
    <ul
      key={key}
      className={`my-4 list-disc space-y-2 pl-6 text-base leading-[1.75] text-slate-700 ${PROSE_JUSTIFY}`}
    >
      {items.map((item, i) => (
        <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
      ))}
    </ul>
  );
}

function renderFigure(
  alt: string,
  src: string,
  caption: string | null,
  key: string,
) {
  return (
    <figure
      key={key}
      className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || "Minh họa bài viết"}
        className="aspect-[16/10] w-full object-cover"
        loading="lazy"
      />
      {caption && (
        <figcaption className={`border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 ${PROSE_JUSTIFY}`}>
          {renderInline(caption, `${key}-cap`)}
        </figcaption>
      )}
    </figure>
  );
}

function renderParagraph(text: string, key: string) {
  const trimmed = text.trim();
  const heading3 = HEADING3_RE.exec(trimmed);
  if (heading3) {
    return (
      <h3
        key={key}
        className="mt-7 scroll-mt-24 text-lg font-semibold leading-snug text-slate-900 sm:text-xl"
      >
        {renderInline(heading3[1], key)}
      </h3>
    );
  }
  const heading2 = HEADING2_RE.exec(trimmed);
  if (heading2) {
    return (
      <h2
        key={key}
        className="mt-10 scroll-mt-24 border-t border-slate-100 pt-8 text-xl font-bold text-slate-900 first:mt-0 first:border-t-0 first:pt-0 sm:text-2xl"
      >
        {renderInline(heading2[1], key)}
      </h2>
    );
  }
  const quote = BLOCKQUOTE_RE.exec(trimmed);
  if (quote) {
    return (
      <blockquote
        key={key}
        className={`my-6 border-l-4 border-brand-500 bg-brand-50/40 px-5 py-4 text-base italic leading-relaxed text-slate-800 ${PROSE_JUSTIFY}`}
      >
        {renderInline(quote[1], key)}
      </blockquote>
    );
  }
  return (
    <p key={key} className={`text-base leading-[1.75] text-slate-700 ${PROSE_JUSTIFY}`}>
      {renderInline(trimmed, key)}
    </p>
  );
}

function renderTable(rows: string[], key: string) {
  const cells = rows
    .filter((row) => !TABLE_SEP_RE.test(row))
    .map((row) =>
      row
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim()),
    );
  if (cells.length === 0) return null;
  const [header, ...body] = cells;
  return (
    <div key={key} className="my-8 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {header.map((cell, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-slate-900"
              >
                {renderInline(cell.replace(/\*\*/g, ""), `${key}-h-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-3 text-slate-700 ${PROSE_JUSTIFY}`}>
                  {renderInline(cell.replace(/\*\*/g, ""), `${key}-${ri}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/).filter(Boolean);
  const nodes: ReactNode[] = [];
  let tableBuffer: string[] = [];
  let blockIndex = 0;

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    nodes.push(renderTable(tableBuffer, `table-${blockIndex}`));
    tableBuffer = [];
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!;
    const lines = block.split("\n");
    const isTable = lines.every(
      (line) => TABLE_ROW_RE.test(line.trim()) || TABLE_SEP_RE.test(line.trim()),
    );
    if (isTable) {
      tableBuffer.push(...lines.map((l) => l.trim()));
      continue;
    }
    flushTable();

    const trimmed = block.trim();
    if (isListBlock(trimmed)) {
      nodes.push(renderList(trimmed, `ul-${blockIndex}`));
      blockIndex += 1;
      continue;
    }

    const image = IMAGE_RE.exec(trimmed);
    if (image) {
      const next = blocks[i + 1]?.trim();
      const capMatch = next ? CAPTION_RE.exec(next) : null;
      const caption = capMatch ? capMatch[1] : null;
      nodes.push(
        renderFigure(image[1], image[2], caption, `fig-${blockIndex}`),
      );
      if (capMatch) i += 1;
      blockIndex += 1;
      continue;
    }

    nodes.push(renderParagraph(trimmed, `p-${blockIndex}`));
    blockIndex += 1;
  }
  flushTable();

  return (
    <div className="article-body space-y-5 text-slate-700">{nodes}</div>
  );
}

export function ArticleTagList({
  tags,
  className = "",
}: {
  tags: ArticleCardData["tags"];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((t) => (
        <li key={t.slug}>
          <a
            href={`/tin-tuc/chu-de/${t.slug}`}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 hover:bg-brand-100"
          >
            {t.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
