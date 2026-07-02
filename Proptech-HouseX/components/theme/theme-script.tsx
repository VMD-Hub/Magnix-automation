import { THEME_STORAGE_KEY } from "@/lib/theme/constants";

/** Chống flash theme — chạy trước paint. */
export function ThemeScript() {
  const script = `(function(){try{var p=new URLSearchParams(location.search);var q=p.get("theme");var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=q==="dark"||q==="light"?q:(s==="dark"||s==="light"?s:"light");document.documentElement.classList.toggle("dark",t==="dark");document.documentElement.dataset.theme=t;}catch(e){}})();`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
