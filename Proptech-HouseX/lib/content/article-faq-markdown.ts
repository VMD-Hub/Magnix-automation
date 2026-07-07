const HEADING2_RE = /^##\s+(.+)$/;
const HEADING3_RE = /^###\s+(.+)$/;
const FAQ_HEADING_PREFIX = "Câu hỏi thường gặp";

export type ParsedArticleFaq = {
  heading: string;
  items: { q: string; a: string }[];
  endIndex: number;
};

function isFaqHeadingBlock(block: string): string | null {
  const match = HEADING2_RE.exec(block.trim());
  if (!match) return null;
  const title = match[1]!.trim();
  if (!title.startsWith(FAQ_HEADING_PREFIX)) return null;
  return title;
}

function isTerminalHeading(block: string): boolean {
  const trimmed = block.trim();
  const h2 = HEADING2_RE.exec(trimmed);
  if (h2) return true;
  const h3 = HEADING3_RE.exec(trimmed);
  if (h3 && !h3[1]!.trim().endsWith("?")) return true;
  return false;
}

function sanitizeFaqAnswer(answer: string): string {
  const idx = answer.search(/\n##\s+/);
  if (idx === -1) return answer.trim();
  return answer.slice(0, idx).trim();
}

function extractQuestion(block: string): { q: string; inlineAnswer?: string } | null {
  const trimmed = block.trim();

  const h3 = HEADING3_RE.exec(trimmed);
  if (h3?.[1]?.trim().endsWith("?")) {
    return { q: h3[1]!.trim() };
  }

  const boldOnly = /^\*\*(.+?)\*\*\s*$/.exec(trimmed);
  if (boldOnly?.[1]?.trim().endsWith("?")) {
    return { q: boldOnly[1]!.trim() };
  }

  const boldWithAnswer = /^\*\*(.+?)\*\*\s*\n+([\s\S]+)$/.exec(trimmed);
  if (boldWithAnswer?.[1]?.trim().endsWith("?")) {
    return {
      q: boldWithAnswer[1]!.trim(),
      inlineAnswer: sanitizeFaqAnswer(boldWithAnswer[2]!),
    };
  }

  return null;
}

/** Parse khối FAQ markdown (`## Câu hỏi thường gặp` + Q&A) từ danh sách block. */
export function parseArticleFaqSection(
  blocks: string[],
  startIndex: number,
): ParsedArticleFaq | null {
  const heading = isFaqHeadingBlock(blocks[startIndex] ?? "");
  if (!heading) return null;

  const items: { q: string; a: string }[] = [];
  let i = startIndex + 1;

  while (i < blocks.length) {
    const block = blocks[i]!.trim();
    if (!block) {
      i += 1;
      continue;
    }

    const question = extractQuestion(block);
    if (!question) {
      if (isTerminalHeading(block)) break;
      break;
    }

    if (question.inlineAnswer) {
      items.push({ q: question.q, a: question.inlineAnswer });
      i += 1;
      continue;
    }

    const answerParts: string[] = [];
    i += 1;
    while (i < blocks.length) {
      const next = blocks[i]!.trim();
      if (!next) {
        i += 1;
        continue;
      }
      if (extractQuestion(next) || isTerminalHeading(next)) break;
      answerParts.push(next);
      i += 1;
    }

    if (answerParts.length === 0) break;
    items.push({ q: question.q, a: sanitizeFaqAnswer(answerParts.join("\n\n")) });
  }

  if (items.length === 0) return null;

  return {
    heading,
    items,
    endIndex: i - 1,
  };
}
