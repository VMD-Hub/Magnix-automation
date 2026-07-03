import type { FaqContentBlock } from "@/lib/content/faq-content";
import { plainTextToFaqBlocks } from "@/lib/content/faq-content";

export function FaqAnswerBody({ blocks }: { blocks: FaqContentBlock[] }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-600">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return <p key={i}>{block.text}</p>;
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-brand-500">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "legal") {
          const lines = block.text.split("\n").filter(Boolean);
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {block.cite}
              </p>
              <div className="mt-2 space-y-2 font-mono text-[13px] leading-relaxed text-slate-700">
                {lines.map((line) => (
                  <p key={line} className="whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

/** Hiển thị câu trả lời FAQ từ plain text (• bullet, đoạn cách dòng trống). */
export function FaqAnswerText({ text }: { text: string }) {
  return <FaqAnswerBody blocks={plainTextToFaqBlocks(text)} />;
}
