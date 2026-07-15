import { Link, useNavigate } from "react-router-dom";
import { ShortcutGlyph } from "@/components/AppIcons";
import type { HomeNavItem } from "@/data/home-ia";
import { moEmbedHref } from "@/services/mo-embed";

function hrefOf(s: HomeNavItem): string {
  if (s.kind === "webview") return moEmbedHref(s.to);
  return s.to;
}

/** Hàng nút nhanh — kiểu be: nền sáng, chỉ icon tô ruby brand, chữ tối. */
export function ShortcutGrid({ items }: { items: HomeNavItem[] }) {
  const navigate = useNavigate();
  const gridClass =
    items.length === 3 ? "shortcut-grid shortcut-grid--n3" : "shortcut-grid";

  return (
    <div className={gridClass} aria-label="Thao tác nhanh">
      {items.map((s) => {
        const inner = (
          <>
            <span className="shortcut-icon">
              <ShortcutGlyph id={s.id} size={28} />
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
            onClick={() => navigate(hrefOf(s))}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
