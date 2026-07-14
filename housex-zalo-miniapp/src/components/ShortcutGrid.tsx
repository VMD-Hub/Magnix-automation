import { Link, useNavigate } from "react-router-dom";
import { ShortcutGlyph } from "@/components/AppIcons";
import type { HomeShortcut } from "@/data/home-content";

function shortcutHref(s: HomeShortcut): string {
  if (s.kind === "webview") {
    return `/mo?p=${encodeURIComponent(s.to)}`;
  }
  return s.to;
}

export function ShortcutGrid({ items }: { items: HomeShortcut[] }) {
  const navigate = useNavigate();

  return (
    <div className="shortcut-grid" aria-label="Tiện ích nhanh">
      {items.map((s) => {
        const inner = (
          <>
            <span
              className="shortcut-icon"
              style={{ background: `${s.tone}28`, borderColor: `${s.tone}55` }}
            >
              <ShortcutGlyph id={s.id} size={22} />
            </span>
            <span className="shortcut-label">{s.label}</span>
          </>
        );

        if (s.kind === "scroll" && s.scrollTarget) {
          return (
            <button
              key={s.id}
              type="button"
              className="shortcut-item"
              onClick={() => {
                document
                  .getElementById(s.scrollTarget!)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {inner}
            </button>
          );
        }

        if (s.kind === "route") {
          return (
            <Link key={s.id} to={s.to} className="shortcut-item">
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={s.id}
            type="button"
            className="shortcut-item"
            onClick={() => navigate(shortcutHref(s))}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
