"""
Export every SVG in logo/ to PDF and a sweep of PNG sizes.

Run from the repo root:
    python scripts/export_logo.py

Outputs:
    logo/exports/pdf/<name>.pdf
    logo/exports/png/<name>-<width>.png

The wordmark and lockup files use Inter (loaded inline via Google Fonts in
the HTML wrapper) so the type renders correctly even if Inter isn't
installed on this machine.
"""

from pathlib import Path
import re
import sys

# --- Setup -----------------------------------------------------------------

REPO = Path(__file__).resolve().parent.parent
SRC_DIR = REPO / "logo"
OUT_DIR = REPO / "logo" / "exports"
PNG_DIR = OUT_DIR / "png"
PDF_DIR = OUT_DIR / "pdf"
PNG_DIR.mkdir(parents=True, exist_ok=True)
PDF_DIR.mkdir(parents=True, exist_ok=True)

# Per-file render config.
# - "png_widths": sweep of pixel widths for raster output (height auto-computed).
# - "transparent": render PNG over transparent background (for marks meant to overlay).
# - "background": override page background (used for mono-light mark on dark).
EXPORTS = {
    "mark.svg":              {"png_widths": [256, 512, 1024, 2048], "transparent": True},
    "mark-mono-dark.svg":    {"png_widths": [256, 512, 1024, 2048], "transparent": True},
    "mark-mono-light.svg":   {"png_widths": [256, 512, 1024, 2048], "transparent": False, "background": "#2D2942"},
    "wordmark.svg":          {"png_widths": [512, 1024, 2048],      "transparent": True},
    "wordmark-light.svg":    {"png_widths": [512, 1024, 2048],      "transparent": False, "background": "#2D2942"},
    "lockup.svg":            {"png_widths": [512, 1024, 2048, 3000], "transparent": True},
    "favicon.svg":           {"png_widths": [16, 32, 64, 128, 180], "transparent": True},
    "og-image.svg":          {"png_widths": [1200, 2400],           "transparent": False},
    "specimen.svg":          {"png_widths": [1200, 2400],           "transparent": False, "background": "#F2EFEC"},
}


# --- PDF (vector) via svglib + reportlab -----------------------------------

def export_pdfs() -> None:
    from svglib.svglib import svg2rlg
    from reportlab.graphics import renderPDF

    for name in EXPORTS:
        src = SRC_DIR / name
        if not src.exists():
            print(f"  [skip] {name} not found")
            continue
        dst = PDF_DIR / f"{src.stem}.pdf"
        try:
            drawing = svg2rlg(str(src))
            renderPDF.drawToFile(drawing, str(dst))
            print(f"  PDF  {dst.relative_to(REPO)}  ({dst.stat().st_size:,} bytes)")
        except Exception as e:
            print(f"  [fail-pdf] {name}: {e}")


# --- PNG (raster) via Playwright + Chromium --------------------------------

HTML_TEMPLATE = """<!doctype html>
<html><head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  html, body {{ margin:0; padding:0; background: {bg}; }}
  body {{ display:flex; align-items:flex-start; justify-content:flex-start; }}
  svg {{ display:block; width: {w}px; height: {h}px; }}
</style>
</head><body>
{svg}
</body></html>
"""


def parse_viewbox(svg_text: str):
    m = re.search(r'viewBox\s*=\s*"([\d.\-\s]+)"', svg_text)
    if not m:
        return None
    parts = [float(x) for x in m.group(1).split()]
    if len(parts) != 4:
        return None
    return parts  # [min-x, min-y, w, h]


def export_pngs() -> None:
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, cfg in EXPORTS.items():
            src = SRC_DIR / name
            if not src.exists():
                print(f"  [skip] {name} not found")
                continue
            svg_text = src.read_text(encoding="utf-8")
            vb = parse_viewbox(svg_text)
            if not vb:
                print(f"  [fail-png] {name}: no viewBox")
                continue
            _, _, vw, vh = vb
            ratio = vh / vw

            for width in cfg["png_widths"]:
                height = max(1, round(width * ratio))
                bg = cfg.get("background", "transparent")
                html = HTML_TEMPLATE.format(svg=svg_text, w=width, h=height, bg=bg)

                page = browser.new_page(viewport={"width": width, "height": height})
                page.set_content(html, wait_until="networkidle")
                # extra beat for Google Fonts to settle
                page.wait_for_timeout(150)

                dst = PNG_DIR / f"{src.stem}-{width}.png"
                page.locator("svg").screenshot(
                    path=str(dst),
                    omit_background=cfg["transparent"],
                )
                page.close()
                print(f"  PNG  {dst.relative_to(REPO)}  ({dst.stat().st_size:,} bytes)")
        browser.close()


# --- Main ------------------------------------------------------------------

if __name__ == "__main__":
    print("Generating PDFs…")
    export_pdfs()
    print("\nGenerating PNGs (Chromium-rendered, Inter loaded via Google Fonts)…")
    export_pngs()
    print("\nDone. Output:", OUT_DIR.relative_to(REPO))
