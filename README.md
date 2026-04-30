# Verify — Eligibility Prototype

A high-fidelity, navigable prototype of **Verify**, an eligibility-checking app for home-health intake & marketing. Static SPA — no build step, no backend.

Built from [03_verify_spec_merged.md](03_verify_spec_merged.md).

## Run locally

Just open `index.html` in any modern browser.

If your browser blocks `file://` JS modules, run a local server instead:

```sh
# Python (any 3.x)
python -m http.server 5189

# Node (npx)
npx serve .
```

Then open [http://localhost:5189](http://localhost:5189).

## Deploy to Vercel

This is a static site, so deployment is one click.

**Option A — Vercel dashboard:**
1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Other**. Root directory: `.`. Build command: *(empty)*. Output directory: *(empty)*.
4. Deploy. You'll get `your-project.vercel.app`.

**Option B — Vercel CLI:**
```sh
npm i -g vercel
vercel        # follow prompts, accept defaults
```

Every push to `main` redeploys automatically. PRs get preview URLs you can share.

## Demo navigation

The left drawer (desktop) gives you:
- **Hero flow** jumps that pre-fill the new-check form for a specific patient outcome (Margaret · Eligible, Robert · Action Needed, Patricia · Not Eligible, Frank · System Error).
- **Screens** — jump to any individual screen.
- **Demo controls** — toggle the offline banner, reset state.

On smaller viewports the drawer collapses; tap the panel icon (bottom-right) to open it.

## Collecting feedback

The dark **Send feedback** pill at the bottom-right of the desktop view (and the matching link in the drawer) opens whatever URL you set. Default: a `mailto:` to the maintainer.

To swap it for a Tally form, Google Form, or anything else, edit the constant at the top of [`app.js`](app.js):

```js
const FEEDBACK_URL = 'https://tally.so/r/abc123';
```

Suggested setups:
- **Quick reactions:** `mailto:` (default) — replies come straight to your inbox.
- **Structured:** [Tally](https://tally.so) or Google Forms with 3–5 specific questions.
- **Usability data:** [Maze.co](https://maze.co) — set tasks like *"run an eligibility check on Margaret"* and watch where users get stuck.

## File map

| File | Purpose |
|---|---|
| `index.html` | Phone-frame shell, demo drawer, mounts modals/toasts. |
| `style.css` | Design tokens (§4) and all components. |
| `data.js` | Sample data — 7 patients, payer list, agency info. |
| `app.js` | State, router, every screen renderer, modals, share + PDF flow. |
| `03_verify_spec_merged.md` | The source spec. |

## Out of scope (per spec §11)

This is a UX prototype. There's no real auth, no payer integration, no persistence beyond in-memory state. Everything is mocked with deterministic sample data.
