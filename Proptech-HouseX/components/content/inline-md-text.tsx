import Link from "next/link";
import { splitInlineMdLinks } from "@/lib/content/inline-md-links";

const linkClassName =
  "font-medium text-brand-600 underline-offset-2 hover:underline";

/** Render plain text + markdown links `[label](href)` thành Link / a. */
export function InlineMdText({ text }: { text: string }) {
  return (
    <>
      {splitInlineMdLinks(text).map((part, i) => {
        if (part.type === "text") {
          return <span key={i}>{part.value}</span>;
        }
        const { href, label } = part;
        if (href.startsWith("/") || href.startsWith("#")) {
          return (
            <Link key={i} href={href} className={linkClassName}>
              {label}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={href}
            className={linkClassName}
            rel="noopener noreferrer"
            target="_blank"
          >
            {label}
          </a>
        );
      })}
    </>
  );
}
