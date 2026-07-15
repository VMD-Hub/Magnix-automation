# -*- coding: utf-8 -*-
"""Inspect chứng thư PDF (find by size) and report embedded images / text brands."""
from __future__ import annotations

import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import fitz  # pymupdf

SIZE = 4024345
SRC_DIR = Path("D:/")
OUT_DIR = Path(r"c:\Users\nguye\Magnix-automation\Proptech-HouseX\docs\agent\td01-chung-thu")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def find_pdf() -> Path:
    for p in SRC_DIR.glob("*.pdf"):
        if abs(p.stat().st_size - SIZE) < 50:
            return p
    raise SystemExit("PDF not found by size")


def main() -> None:
    pdf_path = find_pdf()
    print(f"PDF: {pdf_path.name}")
    print(f"Size: {pdf_path.stat().st_size}")

    # Copy into repo with ASCII name for further processing
    dest = OUT_DIR / "chung-thu-mau-nha-dat-SOURCE.pdf"
    dest.write_bytes(pdf_path.read_bytes())
    print(f"Copied → {dest}")

    doc = fitz.open(dest)
    print(f"Pages: {doc.page_count}")

    for i, page in enumerate(doc):
        print(f"\n--- Page {i + 1} ---")
        print(f"Size: {page.rect.width:.0f} x {page.rect.height:.0f} pt")
        text = page.get_text("text") or ""
        for brand in ("Citics", "CITICS", "citics", "House"):
            if brand in text:
                print(f"  Text contains: {brand}")
        imgs = page.get_images(full=True)
        print(f"  Embedded images: {len(imgs)}")
        for j, img in enumerate(imgs):
            xref = img[0]
            info = doc.extract_image(xref)
            w, h = info["width"], info["height"]
            print(
                f"    [{j}] xref={xref} {w}x{h} {info['ext']} "
                f"smask={img[1]} size={len(info['image'])}"
            )
            # save small/logo-like images (<= 800px width) for review
            if w <= 900 and h <= 400:
                out = OUT_DIR / f"p{i + 1}_img{j}_xref{xref}.{info['ext']}"
                out.write_bytes(info["image"])
                print(f"      saved {out.name}")

        # raster first page preview at low dpi for visual QA
        if i == 0:
            pix = page.get_pixmap(matrix=fitz.Matrix(1.2, 1.2))
            preview = OUT_DIR / "preview-p1.png"
            pix.save(preview.as_posix())
            print(f"  Preview: {preview}")

    # search for image xrefs used on multiple pages (typical logo)
    xref_pages: dict[int, list[int]] = {}
    for i, page in enumerate(doc):
        for img in page.get_images(full=True):
            xref_pages.setdefault(img[0], []).append(i + 1)
    shared = {k: v for k, v in xref_pages.items() if len(v) > 1}
    print("\nImages reused across pages (logo candidates):")
    for xref, pages in shared.items():
        info = doc.extract_image(xref)
        print(f"  xref={xref} {info['width']}x{info['height']} pages={pages}")
        out = OUT_DIR / f"shared_xref{xref}.{info['ext']}"
        out.write_bytes(info["image"])
        print(f"    saved {out.name}")

    doc.close()


if __name__ == "__main__":
    main()
