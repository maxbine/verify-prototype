# Verify Design Prompt — Revision 02: Share Result as PDF

> This is a **revision brief** that layers on top of `01_claude_design_prompt.md`. Treat the original prompt as authoritative for everything not modified or added below. Do not rebuild from scratch — this is additive. Where this document is silent, the original wins.

---

## 1. What's changing

Add the ability for a user (marketer or intake staff) to share a completed eligibility check as a **PDF via the native iOS share sheet**. This was the #1 piece of feedback from the V1 walkthrough. The use case runs both directions:

- **Internal:** marketer in the field forwards a result to their office or supervisor.
- **External:** marketer sends the result back to the referral source (hospital, SNF, doctor's office) to confirm acceptance.

The PDF needs to look polished enough that either audience can read it without context. Email is the headline target, but the share sheet exposes Messages, AirDrop, Save to Files, Print, etc. for free.

---

## 2. Override to Section 11 (Out of Scope) of the original prompt

The original prompt listed *"Sharing results externally (email/text/CRM export)"* as out of scope. **This is now partially in scope.** Specifically:

- ✅ **In scope now:** PDF generation + native iOS share sheet.
- ❌ **Still out of scope:** dedicated SMS flow, CRM/EMR export, in-app email composer, share analytics or audit log UI.

Everything else in Section 11 stays as written.

---

## 3. Where the Share entry point lives

Add a Share affordance in two places:

### 3.1 Result detail screen (extends Section 6.8 of original)

- Add a Share icon in the top-right of the screen header. Use the iOS share glyph (`square.and.arrow.up` style), 24px, `--cool-600`, 44×44 tap target.
- Available on **all** result variants: Eligible, Action Needed, Not Eligible, **and** the failure states from Section 6.9 (timeout, payer rejection). The voice and visual treatment of the PDF must preserve **Principle E** from the original — system failures must never look like coverage failures, even on paper.

### 3.2 Patient detail / history (extends Section 6.11 of original)

- Each row in the "Check history" list gets a small Share icon on the right edge, just inside the existing chevron. 20px, same color.
- Tapping it goes **directly** to the pre-share sheet (Section 4 below) — does NOT navigate into the result detail screen first. Marketers re-sending a check the next morning shouldn't have to click through.

---

## 4. The share flow

A two-step flow, not one. The intermediate confirmation step is required because we're moving PHI off-device.

**Step 1 — User taps Share.** A pre-share confirmation bottom sheet slides up (280ms ease-out, matching the existing motion spec for bottom sheets):

- Heading: "Share eligibility check" (H2).
- PDF preview thumbnail, ~120×160px with a subtle 1px `--cool-100` border and 8px shadow. Tappable — expanding it opens a full-page preview with a "Done" button.
- Underneath the thumbnail, a single-line summary row: patient name · payer · result badge. So the user visually re-confirms what's being sent before it leaves the device.
- A HIPAA reminder line in `--cool-400` 13px: *"This document contains PHI. Only share with authorized recipients."*
- Two buttons, stacked, full-width:
  - Primary (orange): **"Share via…"** → triggers the native iOS share sheet with the PDF attached.
  - Ghost: **"Cancel"** → dismisses the sheet.

**Step 2 — Native iOS share sheet.** Standard system component, do not restyle. Mail is the expected primary target but all share extensions work.

**After share completes:** return to the originating screen with a 2-second toast at the top — `--success-100` background, `--success-500` text, "✓ Shared."

---

## 5. The PDF itself

Treat the PDF as a polished, branded deliverable — not a screen capture or print stylesheet. It will be read by office staff, referral sources, and potentially auditors. Single page where possible; allow a second page only when the Plain English supporting evidence overflows.

### 5.1 Layout (US Letter, 8.5×11, 0.5" margins)

**Header band** (top ~1.25", `--warm-100` background):
- Left: a placeholder Coastal Home Health logo mark (simple geometric shape in `--primary-500` is fine) + agency name in 14pt SemiBold.
- Right: a "Eligibility Verification" Caption-style eyebrow + check date and time (e.g. "Apr 29, 2026 · 2:14 PM").

**Patient & result block** (next ~1.5"):
- Patient name in 24pt SemiBold, DOB, masked member ID (last 4 visible only), payer name.
- The result badge — same visual language as in-app — anchored top-right of this block.
- One-line plain-English summary directly under: e.g. "Eligible for home health services as of Apr 29, 2026."

**Supporting evidence section** (bulk of page):
- Mirrors the Plain English view from Section 6.8 of the original: Coverage, Plan Details, Network Status, Service Area Check, Open Episode Check, MSP Check, Hospice Check.
- Each section: section header in 13pt SemiBold uppercase, facts in 11pt Regular, rule outcome marker at the end of the section (✓ / ⚠ / ✗) in the matching semantic color.
- Skip sections that didn't run for this payer (e.g. don't show "Open Episode Check" on a commercial result if the rule wasn't applicable).

**Footer band** (bottom ~0.75"):
- Left: "Checked by Sarah Martinez, Liaison · Coastal Home Health" in 9pt.
- Center: page number ("1 of 1") in 9pt.
- Right: HIPAA notice in 9pt `--cool-400`: *"Confidential — Protected Health Information. Unauthorized disclosure prohibited."*

### 5.2 Failure-state PDFs (preserves Principle E)

If the underlying check was not a real coverage decision, the PDF must communicate that visually before the reader gets to the body:

- **Timeout / connection failure:** header band uses `--cool-50` instead of `--warm-100`. Result badge replaced with a neutral gray "System Error" pill. Body opens with: *"We couldn't reach the payer at the time of this check. This is not a coverage decision. Please re-run the check."*
- **Payer rejection (member not found / name mismatch):** header band `--secondary-100`. Amber "Payer Could Not Verify" pill. Body explains the specific reason from the response.

### 5.3 Filename convention

`Verify_[LastName]_[Payer]_[YYYY-MM-DD].pdf` — e.g. `Verify_Johnson_TraditionalMedicare_2026-04-29.pdf`. Keeps things scannable in an email inbox or Files app.

---

## 6. Tablet adaptation

The pre-share confirmation sheet on iPad should appear as a centered modal (max-width 480px) rather than a bottom sheet, matching iPadOS conventions. The PDF itself is identical across phone and tablet.

---

## 7. Sample data

No new patients needed. The prototype should make the share flow navigable from at least three of the existing sample results to show the variations:

- **Margaret Johnson** (Eligible) — happy-path PDF.
- **Robert Chen** (Action Needed) — open-episode flag visible in PDF body.
- **Frank Sullivan** (System error / timeout) — failure-state PDF demonstrating the distinct visual treatment.

---

## 8. Hero flow update

Append to the end of the hero flow in Section 12 of the original prompt:

> *…taps "Add Note" → adds "Referred from Ocean Medical Center, ready for SOC Monday." → **taps the Share icon in the header → pre-share sheet appears with PDF preview and patient confirmation row → taps "Share via…" → native iOS share sheet appears with Mail as the suggested target → done.***

Also add a secondary navigable flow:

> *History tab → tap Patricia Williams' row → tap the Share icon directly on the most recent check row → pre-share sheet → share.*

---

## 9. What stays exactly the same

- All color tokens, typography, component library, motion notes, and accessibility rules from the original.
- Principle B (result-first entry). Sharing is strictly a post-result action and does not affect the input flow.
- The 7 sample patients.
- Light mode only.
- Section 11 except for the single override in Section 2 above.

---

**Reminder:** if any detail in this document conflicts with the original prompt, this document wins **only** for items it explicitly addresses. For everything else, the original is the source of truth.
