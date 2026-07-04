import Link from "next/link";
import {
  FOUNDER_PORTRAIT,
  getFounderPortraitSrc,
} from "@/lib/content/founder-portrait";
import { cn } from "@/lib/ui/cn";

export type FounderNoteContent = {
  title: string;
  greeting: string;
  paragraphs: readonly string[];
  signOff: string;
  name: string;
  role: string;
};

function FounderPortrait({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const src = getFounderPortraitSrc();

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl ring-2 ring-white shadow-md",
        "h-36 w-28 sm:h-44 sm:w-32",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={FOUNDER_PORTRAIT.alt}
          className="h-full w-full object-cover object-[center_20%]"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white"
          role="img"
          aria-label={`${name} — Người sáng lập`}
        >
          <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {FOUNDER_PORTRAIT.initials}
          </span>
          <span className="mt-1 px-2 text-center text-[10px] font-medium uppercase tracking-wider text-brand-100/90">
            Founder
          </span>
        </div>
      )}
    </div>
  );
}

/** Khối lời Founder — dùng About (teaser) và trang Câu chuyện (đầy đủ). */
export function FounderNoteBlock({
  note,
  teaserParagraphs,
  className,
  id,
}: {
  note: FounderNoteContent;
  /** Số đoạn hiển thị; undefined = tất cả. */
  teaserParagraphs?: number;
  className?: string;
  id?: string;
}) {
  const paragraphs =
    teaserParagraphs != null
      ? note.paragraphs.slice(0, teaserParagraphs)
      : note.paragraphs;
  const truncated = teaserParagraphs != null && note.paragraphs.length > teaserParagraphs;

  return (
    <section
      id={id}
      className={cn(
        "not-prose rounded-2xl border border-silver-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <FounderPortrait name={note.name} className="mx-auto sm:mx-0" />

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-slate-900">{note.title}</h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-slate-800">
            {note.greeting}
          </p>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
          {!truncated && (
            <p className="mt-6 text-sm leading-relaxed text-slate-700">{note.signOff}</p>
          )}
          <footer className="mt-6 border-t border-silver-200 pt-4">
            <p className="font-bold text-slate-900">{note.name}</p>
            <p className="text-sm text-slate-500">{note.role}</p>
          </footer>
          {truncated && (
            <Link
              href="/gioi-thieu/cau-chuyen#founder"
              className="mt-4 inline-block text-sm font-semibold text-brand-700 underline"
            >
              Đọc toàn bộ lời phát biểu →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function StoryPullQuote({
  text,
  attribution,
  className,
}: {
  text: string;
  attribution?: string;
  className?: string;
}) {
  return (
    <blockquote
      className={cn(
        "not-prose my-8 rounded-2xl border-l-4 border-gold-500 bg-brand-50/40 px-6 py-5",
        className,
      )}
    >
      <p className="text-base italic leading-relaxed text-slate-800">&ldquo;{text}&rdquo;</p>
      {attribution && (
        <footer className="mt-3 text-sm font-medium text-slate-500">— {attribution}</footer>
      )}
    </blockquote>
  );
}
