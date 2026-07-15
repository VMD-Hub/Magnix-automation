# -*- coding: utf-8 -*-
"""
Rebrand chứng thư mẫu nhà đất: Citics → House X.
1) Thay brand text (Citics / CITICS / citics.vn)
2) Che logo vector Citics.vn (góc phải) + gắn logo House X
3) Gắn logo House X trang bìa góc trái

Usage:
  python scripts/rebrand-chung-thu-pdf.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import fitz

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "docs/agent/td01-chung-thu/chung-thu-mau-nha-dat-SOURCE.pdf"
OUT = ROOT / "docs/agent/td01-chung-thu/chung-thu-mau-nha-dat-HOUSEX.pdf"
LOGO = ROOT / "public/brand/housex-header-logo.png"
MARK = ROOT / "public/brand/housex-mark-only.png"

FONT_CANDIDATES = [
    Path(r"C:\Windows\Fonts\arial.ttf"),
    Path(r"C:\Windows\Fonts\arialuni.ttf"),
    Path(r"C:\Windows\Fonts\tahoma.ttf"),
]

REPLACEMENTS: list[tuple[str, str]] = [
    ("CÔNG TY CỔ PHẦN CITICS", "CÔNG TY CỔ PHẦN HOUSE X"),
    ("Công ty Cổ phần Citics", "Công ty Cổ phần House X"),
    ("citics.vn", "timnhaxahoi.com"),
    ("Citics.vn", "House X"),
    ("CITICS", "HOUSEX"),
    ("Citics", "House X"),
    ("citics", "housex"),
]

# Góc phải header — logo Citics.vn + tagline (A4 595x842)
LOGO_TOP_RIGHT = fitz.Rect(448, 38, 590, 92)
# Trang bìa góc trái
LOGO_COVER_LEFT = fitz.Rect(32, 28, 200, 78)


def pick_fontfile() -> str | None:
    for p in FONT_CANDIDATES:
        if p.exists():
            return p.as_posix()
    return None


def replace_text_on_page(page: fitz.Page, fontfile: str | None) -> int:
    jobs: list[tuple[fitz.Rect, str, float]] = []
    for needle, repl in REPLACEMENTS:
        for rect in page.search_for(needle):
            r = fitz.Rect(rect)
            r.x0 -= 0.4
            r.y0 -= 0.2
            r.x1 += 0.8
            r.y1 += 0.2
            extra = max(0.0, (len(repl) - len(needle)) * (r.height * 0.45))
            r.x1 += extra
            fontsize = max(6.0, min(12.0, r.height * 0.82))
            jobs.append((r, repl, fontsize))
            page.add_redact_annot(r, fill=(1, 1, 1))

    if not jobs:
        return 0

    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)

    for r, repl, fontsize in jobs:
        box = fitz.Rect(r.x0, r.y0 - 0.5, r.x1 + 8, r.y1 + 0.5)
        kwargs = {
            "fontsize": fontsize,
            "color": (0.12, 0.12, 0.12),
            "align": fitz.TEXT_ALIGN_LEFT,
        }
        if fontfile:
            page.insert_textbox(box, repl, fontfile=fontfile, **kwargs)
        else:
            page.insert_textbox(box, repl, fontname="helv", **kwargs)
    return len(jobs)


def cover_and_stamp_logo(
    page: fitz.Page, cover: fitz.Rect, logo_path: Path
) -> None:
    """Che vùng logo cũ (white) rồi gắn logo House X."""
    shape = page.new_shape()
    shape.draw_rect(cover)
    shape.finish(color=(1, 1, 1), fill=(1, 1, 1), width=0)
    shape.commit()
    if logo_path.exists():
        # inset slightly so logo doesn't touch edges
        inset = fitz.Rect(cover.x0 + 2, cover.y0 + 4, cover.x1 - 2, cover.y1 - 4)
        page.insert_image(
            inset,
            filename=logo_path.as_posix(),
            keep_proportion=True,
            overlay=True,
        )


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source: {SRC}")

    fontfile = pick_fontfile()
    print("font:", fontfile or "(helv fallback)")
    logo_stamp = LOGO if LOGO.exists() else MARK
    print("stamp logo:", logo_stamp.name if logo_stamp.exists() else None)

    doc = fitz.open(SRC)
    total = 0
    for i, page in enumerate(doc):
        n = replace_text_on_page(page, fontfile)
        total += n

        # Cover: stamp left brand + wipe right panel? Keep decorative panel.
        if i == 0:
            if logo_stamp.exists():
                page.insert_image(
                    LOGO_COVER_LEFT,
                    filename=logo_stamp.as_posix(),
                    keep_proportion=True,
                    overlay=True,
                )
        else:
            # Internal pages: replace top-right Citics.vn lockup
            cover_and_stamp_logo(page, LOGO_TOP_RIGHT, logo_stamp)

        print(f"page {i + 1}: {n} text replacements + logo pass")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.save(OUT.as_posix(), garbage=4, deflate=True)
    doc.close()
    print(f"OK → {OUT} ({OUT.stat().st_size} bytes), text={total}")

    check = fitz.open(OUT)
    residual = 0
    for i, page in enumerate(check):
        t = page.get_text("text")
        for bad in ("Citics", "CITICS", "citics.vn"):
            if bad in t:
                residual += t.count(bad)
                print(f" residual {bad!r} on page {i + 1}")
    print("residual brand hits:", residual)

    for idx in (0, 1):
        pix = check[idx].get_pixmap(matrix=fitz.Matrix(1.4, 1.4))
        prev = OUT.parent / f"preview-housex-p{idx + 1}.png"
        pix.save(prev.as_posix())
    pix_tr = check[1].get_pixmap(
        matrix=fitz.Matrix(2.5, 2.5), clip=fitz.Rect(400, 30, 595, 120)
    )
    pix_tr.save((OUT.parent / "p2-top-right-HOUSEX.png").as_posix())
    print("updated previews")
    check.close()


if __name__ == "__main__":
    main()
