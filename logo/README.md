# Sella — logo asset suite

The Sella mark is **three orange dots stacked vertically**, fading from
soft (top) to fully saturated (bottom). The bottom dot is the "answer" —
the moment the verdict resolves.

Every file in this folder is a working **SVG vector** — open natively in
Illustrator, Figma, Affinity Designer, Inkscape, or any modern browser.

For convenience, **PDF and PNG exports** of every asset are pre-rendered
in `exports/` (PDFs are vector, PNGs at 256–3000px sweeps). Inter is
loaded from Google Fonts during PNG rendering so the wordmark looks
correct without any fonts installed locally.

To regenerate exports after editing an SVG:

```sh
python scripts/export_logo.py
```

(One-time setup: `pip install --user playwright svglib reportlab` then
`python -m playwright install chromium`.)

---

## File inventory

| File | What it is | When to use |
|---|---|---|
| `mark.svg` | Mark only, full color | The default mark. Avatar, app icon, signatures. |
| `mark-mono-dark.svg` | Mark only, single-color cool ink | Documents, fax, anywhere color isn't available. On light surfaces. |
| `mark-mono-light.svg` | Mark only, single-color warm canvas | Same as above, on dark surfaces. |
| `wordmark.svg` | "sella" type only | When you only need the name and the mark would be redundant. |
| `wordmark-light.svg` | "sella" in warm canvas | Wordmark for use on dark backgrounds. |
| `lockup.svg` | Mark + wordmark together | Default for headers, signatures, presentations. |
| `favicon.svg` | Mark inside a rounded warm-canvas square | Browser tabs, mobile bookmarks, anywhere under 32px. |
| `og-image.svg` | 1200×630 social share asset | Twitter cards, LinkedIn previews, link unfurls. |
| `specimen.svg` | All variants on one page | The handoff sheet — open this first to see the full system. |
| `exports/pdf/` | PDF version of every SVG above | Open natively in Illustrator. Vector. |
| `exports/png/` | PNG renders at multiple sizes | For platforms that don't accept SVG (slide decks, email signatures). |

---

## Brand colors

| Role | Hex | RGB | Notes |
|---|---|---|---|
| Brand orange | `#E96424` | 233 100 36 | The dots. The only orange on any surface — never paint sections orange. |
| Cool ink | `#2D2942` | 45 41 66 | Body text, primary type. |
| Warm canvas | `#F2EFEC` | 242 239 236 | Default page surface. |
| Surface white | `#FFFFFF` | 255 255 255 | Cards, sheets, modal panels. |

Dot opacity values used in the mark: top **0.22**, middle **0.50**, bottom **1.00**.
Pre-computed equivalents from the brand palette: `#FCDCC8`, `#F4B58D`, `#E96424`.

---

## Typography

The wordmark is **Inter, weight 600 (SemiBold)**, letter-spacing **-0.036em** (-3 at font-size 84).
Free download: https://rsms.me/inter or https://fonts.google.com/specimen/Inter.

> **A note for designers re-rendering:** the text in `wordmark.svg`,
> `lockup.svg`, `og-image.svg`, and `specimen.svg` is set as live `<text>`
> elements with `font-family="Inter"`. If Inter isn't installed on your
> machine, those files will fall back to a system font. Either install
> Inter (free, 30 seconds) or open the file in Illustrator and run
> `Type → Create Outlines` to convert "sella" to outlined paths.

---

## Clear-space and minimum sizes

- **Clear-space:** keep at least **1× the diameter of the bottom dot**
  empty on every side of the mark.
- **Minimum mark size:** **16px** tall when standalone. Use `favicon.svg`
  for anything smaller — it has retuned proportions.
- **Minimum lockup width:** **120px**. Below that, drop the wordmark and
  use the mark alone.

---

## Don't

- Don't recolor the dots outside the brand palette.
- Don't outline, drop-shadow, or distort the dots.
- Don't separate the dots — they read as one mark.
- Don't change the opacity ramp (top → bottom must always go light → saturated).
- Don't add a tagline below the wordmark in the lockup. Use a separate
  caption element if you need supporting copy.

---

## Where this lives in the wild

- Production landing page: https://sellahealth.com
- Page metadata + nav use this exact mark (inline SVG) and these exact tokens.
- The `og-image.svg` is what shows up in social-share previews when
  `sellahealth.com` is linked anywhere.
