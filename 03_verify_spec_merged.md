# Claude Design Prompt — "Verify" Eligibility App (Merged Spec, V1 + Rev 02)

> **App name is a placeholder.** Rename throughout if you have a different one.
>
> This document is the consolidated spec: V1 (`01_claude_design_prompt.md`) with the Rev 02 share-as-PDF changes (`02_claude_design_prompt_share_pdf.md`) applied on top. Where the two disagreed, Rev 02 wins for the items it explicitly addresses; for everything else V1 stands.

---

## 1. What you're building

A high-fidelity, interactive mobile + tablet prototype for **Verify**, an eligibility-checking app used by marketers and intake staff at home health agencies. The app lets a user enter a patient's insurance information, runs an eligibility check against the payer, applies the agency's business rules to the response, and returns a clear, actionable status: **Eligible**, **Action Needed**, or **Not Eligible** — with the supporting evidence behind that decision. Completed checks can be **shared as a PDF via the native iOS share sheet** to internal teammates or back to referral sources.

Build this as a **clickable, navigable prototype** with realistic sample data populating every screen. Treat it as if it were a real product going to demo, not a wireframe.

Primary platform: **iPhone (390×844) and iPad (1024×768 landscape)**. Phone is the hero; tablet is the second-priority adaptation.

Theme: **Light mode only** for V1.

---

## 2. Who uses this app and where

**Primary user: the liaison / community marketing rep.**
- Works in the field — hospitals, skilled nursing facilities (SNFs), doctors' offices, and the car between visits.
- Receives referrals via email throughout the day. Their #1 job is to respond fast — agency revenue depends on speed-to-response.
- Average tech savvy. They want low-friction, obvious affordances. No clever-but-opaque interactions.
- Often handling a phone in one hand while talking to a referral source. Glove-friendly tap targets.
- Connectivity is usually fine but not guaranteed (hospital basements, parking garages).

**Secondary user: office-based intake staff.**
- Doing checks at a desk on a tablet or larger phone. Higher volume per day. Benefits from a denser layout (history + active check side-by-side on tablet).

**Volume:** 5–10 checks per user per day for marketers; more for intake.

**The vibe to design for:** professional, calm, fast, trustworthy. This handles PHI and informs business decisions — it should feel like a serious tool, not a consumer app. But it should also feel modern and warm, not bureaucratic. Think: well-designed clinical tool, not insurance portal.

---

## 3. Core UX principles — read these first, design every screen against them

**A. Speed beats everything.** Every screen, every tap, every keystroke is judged against: "did this help the marketer respond to the referral faster?"

**B. Result-first entry.** The new-check screen does NOT use a traditional "fill form → submit → loading → result" flow. Instead, the form and a result card live on the same screen:
- Top zone: adaptive payer form.
- Bottom zone: a result card that starts in a "Not enough info yet" state.
- As the user fills in fields, the card live-updates. The moment we have minimum fields for the selected payer, the check auto-runs and the card animates to the result.
- A persistent "Check Eligibility" button is also visible at the bottom for users who want explicit control. Both paths work.
- This is the single most important pattern in the app. Get it right.
- Sharing is strictly a *post-result* action and does not affect the input flow.

**C. Adaptive forms.** The form changes based on selected payer:
- Traditional Medicare: MBI, Last Name, DOB.
- NJ Medicaid (NJ FamilyCare): Member ID, Last Name, DOB.
- Medicare Advantage (Aetna MA, BCBS MA, UHC MA, Humana MA, Cigna MA): Member ID, Last Name, DOB, Plan name (auto-detected after lookup).
- Commercial (Aetna, BCBS, UHC, Humana, Cigna): Member ID, First Name, Last Name, DOB, Group # (optional).
- Never show fields the selected payer doesn't need.

**D. Photo-as-shortcut, not photo-as-primary.** Above the form is an "📎 Attach face sheet or insurance card" entry point. Tapping it opens the device camera/files picker, simulates an OCR pass (use a 1.5s loading state), and auto-populates the form fields. The manual form remains the default — the photo is a power-user shortcut. Show this prominently but not dominantly.

**E. System failures must never look like coverage failures.** A timeout, a malformed response, or a payer rejection has its own visual treatment that is clearly distinct from "Not Eligible." Different icon, different language, different action button. **This rule extends to the shared PDF** — failure-state PDFs must signal "this is not a coverage decision" before the reader reaches the body. This is non-negotiable.

**F. Trust through transparency.** Every result shows *why*. The user can toggle between a clean parsed view ("Plain English") and the raw response data ("Detailed view") on every result.

---

## 4. Brand & design system

### Color tokens (use exact hex values)

**Primary (warm orange — confidence, action, brand).** Use sparingly — primary CTAs, focused fields, key brand moments. Don't paint result screens with it.
- `--primary-50: #FBFAF9`
- `--primary-100: #FBF1EC`
- `--primary-200: #FCDCC8`
- `--primary-300: #F4B58D`
- `--primary-400: #EC8D52`
- `--primary-500: #E96424` ← brand primary
- `--primary-600: #D54E0E`
- `--primary-700: #B23E08`
- `--primary-800: #8A2F04`

**Secondary (warm amber).** For warning badges, "Action Needed" status surfaces.
- `--secondary-50: #FFFCF7`
- `--secondary-100: #FAF1DF`
- `--secondary-200: #F5E0BF`
- `--secondary-300: #FACE91`
- `--secondary-400: #FAB85F`
- `--secondary-500: #F7A337`
- `--secondary-600: #F09110`
- `--secondary-700: #C77A0E`

**Cool neutrals (text, surfaces, dividers).**
- `--cool-50: #F0F0F2`
- `--cool-100: #DDDDE1`
- `--cool-200: #BEBDC4`
- `--cool-300: #8A8893`
- `--cool-400: #58566A`
- `--cool-500: #3D3A55`
- `--cool-600: #2D2A45`
- `--cool-700: #2D2942`

**Warm neutrals (backgrounds, soft surfaces).**
- `--warm-50: #FFFFFF`
- `--warm-100: #F2EFEC`
- `--warm-200: #DDDAD4`
- `--warm-300: #BAB6AE`
- `--warm-400: #8A857B`
- `--warm-500: #5C5851`
- `--warm-600: #423D36`
- `--warm-700: #312D27`

**Black:** `#000000`

**Semantic colors (add these — they're not in the existing system).**
- Success / Eligible: `--success-500: #2E9667`, `--success-100: #DEF5EA` (badge bg)
- Warning / Action Needed: use `--secondary-500` and `--secondary-100`
- Error / Not Eligible / System error: `--error-500: #E94B4B`, `--error-100: #FBE5E5`
- Info / Active episode: `--info-500: #4B6CE9`, `--info-100: #E5EAFB`

### Typography

**Font: Inter** (Regular 400, Medium 500, SemiBold 600, Bold 700). All weights via Google Fonts or system fallback.

| Style | Size / Weight | Use |
|---|---|---|
| H1 | 28px / SemiBold | Screen titles |
| H2 | 22px / SemiBold | Section headers |
| Body Large | 17px / Regular | Result cards, key info |
| Body Base | 15px / Regular | Default body, form values |
| Body Strong | 15px / SemiBold | Field labels, list item titles |
| Body Subtle | 13px / Regular | Helper text, timestamps |
| Caption | 11px / Medium uppercase, letter-spacing 0.5px | Section eyebrows, badges |

### Component library — build all of these

**Buttons.**
- Primary: orange `--primary-500` background, white text, 16px text, 14px vertical padding, 12px corner radius, full-width on mobile screens by default. Pressed state: `--primary-600`. Disabled: `--cool-100` background, `--cool-300` text.
- Secondary: `--cool-50` background, `--cool-600` text, same dimensions as primary.
- Ghost (link-style): orange text, no background, used for inline actions like "Review eligibility response →".

**Form fields.**
- 14px vertical padding, 16px horizontal, 12px corner radius.
- Default: `--warm-100` background, no border, `--cool-300` placeholder.
- Focused: `--warm-50` background, 2px `--primary-500` border, `--cool-700` text.
- Filled: `--warm-50` background, `--cool-100` 1px border, `--cool-700` text.
- Error: `--error-100` background, 2px `--error-500` border, error message below in `--error-500` 13px.
- Disabled: `--cool-50` background, `--cool-300` text.
- Floating-label pattern: label sits inside the field, animates to a smaller version above the value when focused or filled. This is a key polish detail.

**Status badges.** Pill shape, 6px vertical / 12px horizontal padding, 12px text SemiBold, 999px corner radius. Filled with the semantic 100-tone background, text in the 500-tone.
- Eligible (green), Action Needed (amber), Not Eligible (red), Active Episode (blue), Out of Network (red), No Coverage (red), Medicare Secondary Payer (amber), Out of Service Area (red).
- Pipeline status badges (lower priority, used in history): Accepted (green), Denied (red), Lost (red).
- **System Error (neutral gray)** and **Payer Could Not Verify (amber)** — used in the shared PDF for failure states (see §6.14).

**Cards.** White (`--warm-50`) background, 1px `--cool-100` border, 16px corner radius, 16px internal padding. Subtle shadow on elevated cards: `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)`.

**Result card** (the live-updating one — special component). Three states:
1. **Empty** — `--warm-100` background, dashed border in `--cool-200`, centered text "Enter patient info to check eligibility" with a subtle illustration.
2. **Pending / running** — animated shimmer on the card surface, "Checking eligibility…" text, the most recent payer logo or name visible.
3. **Result** — full-color treatment based on outcome (see Section 6).

**Bottom navigation (mobile).** 3 tabs: Home, History, Profile. 56px tall, white background, 1px top divider in `--cool-100`. Active tab: orange icon + label. Inactive: `--cool-300`.

**Side navigation (tablet).** 240px wide left rail, white background, 1px right divider. Same icons and labels.

### Iconography

**Lucide icons** throughout. Common ones: `bell`, `circle-alert`, `message-square`, `chevron-right`, `camera`, `paperclip`, `search`, `filter`, `check-circle`, `x-circle`, `clock`, `wifi-off`, `refresh-cw`, `eye`, `eye-off`, `home`, `clock` (history), `user`. Use 20px in body, 24px in nav, 16px in badges. The Share affordance uses the iOS share glyph (`square.and.arrow.up` style) rather than a Lucide equivalent — 24px in headers, 20px inline in lists.

---

## 5. Information architecture

**Mobile (bottom tab nav):**
- **Home** — entry point. Primary CTA "New Eligibility Check," recent checks list, account/agency context.
- **History** — searchable, filterable list of all this user's checks, grouped by patient.
- **Profile** — user info, agency context, settings, sign out.

**Tablet (side nav):** Same three sections, but the content area is split:
- Home: left pane = "New Check" form, right pane = result.
- History: left pane = patient list, right pane = selected patient's checks + detail.

---

## 6. Screen-by-screen specs

### 6.1 Sign-in screen
- Full-bleed background, top half a soft `--warm-100` field with the Verify wordmark and tagline ("Eligibility checks, instantly.").
- Center: "Sign in" heading, an email field, a "Continue" primary button.
- Below: "Use Touch ID / Face ID" ghost button with a fingerprint icon.
- Below that: "Sign in with SSO" secondary button.
- Footer: tiny "Protected. HIPAA compliant." line with a small lock icon.

### 6.2 Biometric unlock screen (returning user)
- After the first sign-in, returning users see this on app open.
- App logo centered, "Unlock to continue," a circular Face ID / Touch ID prompt button.
- "Sign in with password instead" ghost link below.

### 6.3 Home screen
- **Greeting bar:** "Good morning, Sarah" + agency name underneath in caption style. Right side: notification bell with unread dot.
- **Primary CTA:** big orange "New Eligibility Check" button — the dominant element on the screen. Full-width, ~60px tall, with a `+` icon.
- **Quick stats row** (3 small tiles): "Today: 4 checks" / "This week: 23" / "Action needed: 2". Tapping the third filters History. Use cool-neutral cards with body-strong numbers and body-subtle labels.
- **Recent checks** section header with a "See all →" link.
- **Recent check cards (3-4):** each shows patient first-name + last-initial (HIPAA-friendly), payer name, status badge, timestamp ("12 min ago"). Tap to open detail.
- Bottom nav.

### 6.4 New eligibility check (the hero screen)

**Layout (top to bottom):**

1. **Header bar** — "New Check" title, ← back button, X close button on right.
2. **Photo shortcut card** — a horizontal card with a camera icon, "Attach face sheet or insurance card" label, and a small "OR enter manually below" subtext. Subtle dashed border, `--warm-100` background. Tappable.
3. **Payer picker** — a single field labeled "Payer." Tap to open a bottom sheet with:
   - Search field at top.
   - "Recent" section (last 3 used).
   - "Medicare" section pinned at top with: Traditional Medicare (FFS), Medicare Advantage plans (Aetna MA, BCBS NJ MA, UHC MA, Humana Gold Plus, Cigna MA).
   - "Medicaid" section: NJ FamilyCare.
   - "Commercial" section: Aetna, BCBS NJ, UnitedHealthcare, Humana, Cigna.
   - The list scrolls; a "Can't find your payer?" link at the bottom.
4. **Adaptive form fields** appear once a payer is selected. Field set changes based on payer (see Section 3.C).
5. **Live result card** — sits below the form, always visible.
   - Initial state: dashed border, `--warm-100` background, illustration of a clipboard, text "Enter patient info to check eligibility." Subtle.
   - As the user types, when minimum fields are met (e.g., MBI + Last Name + DOB for Medicare), the card transitions to "Checking…" with a 1.5s shimmer, then animates to the result state.
   - Result state: see 6.5–6.7 below.
6. **Persistent "Check Eligibility" button** at the bottom of the screen (above the keyboard when active). Disabled until min fields are met; enabled state is orange. Tapping it short-circuits to the result if not already running.

**Sample data to populate prototype:**
- Default selected: Traditional Medicare.
- MBI placeholder: "1EG4-TE5-MK73"
- DOB picker uses MM/DD/YYYY US format, default empty.

### 6.5 Result: Eligible

When the result resolves to Eligible, the result card transitions:
- Background: `--success-100` (light green).
- Top-left: a green check-circle icon, ~32px.
- Heading: "Eligible" in H2, success-500 green.
- Body: "Margaret Johnson is eligible for home health services." Body Large.
- Key facts list (4-6 items, 2 columns on phone):
  - Coverage: Active
  - Plan: Medicare Part A & B
  - Effective: 03/01/2007
  - Service area: Within Ocean County
  - Open episodes: None
  - Network status: In-network
- "Review eligibility response →" link in orange ghost style.
- Two buttons at the bottom of the card: "Add Note" (secondary), "Mark as Accepted" (primary).
- Below the card: a sticky bar with "← New Check" and "Done" actions.

### 6.6 Result: Action Needed

- Background: `--secondary-100` (warm amber).
- Top-left: amber alert-triangle icon.
- Heading: "Action Needed" in H2, secondary-700.
- Body: "Robert Chen has an open home health episode with another provider."
- **Key fact:** clearly highlighted block — "Open Episode: Compassionate Care HHA, through 04/30/2026 (5 days remaining)." Use a `--secondary-50` callout box with a stronger left border in secondary-500.
- Other facts list as in 6.5.
- **Recommended actions** section: bulleted list (use the action-required pattern, not a generic bullet) — "Contact current provider to confirm discharge date" / "Schedule recheck after 04/30/2026." These are *flags only* — no action buttons that perform the action.
- "Review eligibility response →" link.
- Buttons: "Add Note" (secondary), "Set Reminder for Recheck" (primary).

### 6.7 Result: Not Eligible

- Background: `--error-100` (light red).
- Top-left: red x-circle icon.
- Heading: "Not Eligible" in H2, error-500.
- Body: "Patricia Williams is outside our service area."
- Key fact callout: "Address: 1247 Ridge Rd, Toms River, NJ 08753 — within Ocean County, but ZIP 08753 is excluded from coverage."
- Other facts list (coverage details still shown — they're useful context).
- "Review eligibility response →" link.
- Buttons: "Add Note" (secondary), "Mark as Lost" (ghost).

### 6.8 Result detail / 271 toggle screen

- Tapping "Review eligibility response →" pushes a full screen.
- Header: patient name + payer + result badge. **A Share icon (`square.and.arrow.up` style, 24px, `--cool-600`, 44×44 tap target) sits in the top-right of the header.** Available on **all** result variants — Eligible, Action Needed, Not Eligible, *and* both failure states from §6.9 (timeout, payer rejection). Tapping it opens the pre-share sheet (§6.13).
- A segmented control at top: **"Plain English" | "Detailed"** (toggle).
- **Plain English view:** organized sections (Coverage, Plan Details, Network Status, Service Area Check, Open Episode Check, MSP Check, Hospice Check) — each with the relevant facts in human-readable form, plus the rule outcome ("✓ In-network" / "⚠ Open episode found").
- **Detailed view:** structured but technical — the parsed 271 fields shown as labeled key-value pairs, grouped by 271 segment (EB, DTP, REF, etc.). Use a monospace touch on the values for a "data" feel without going full code-block.
- "Back to result" button at top.

### 6.9 Failure states (separate visual language from "Not Eligible")

**Connection / timeout failure:**
- Result card background: `--cool-50` (NOT red).
- Icon: gray `wifi-off` or `clock`.
- Heading: "We couldn't reach the payer."
- Body: "This is not a coverage decision. Please try again."
- Primary button: "Retry" (orange).
- Secondary button: "Save and check later" (saves draft, queues for retry when online).

**Payer rejection (member not found, name mismatch):**
- Result card background: `--secondary-100`.
- Icon: amber alert-circle.
- Heading: "Payer couldn't find this member."
- Body: "Double-check the info below or try alternate spellings."
- The form fields above the card highlight in error state with the specific reason ("MBI format may be off").
- Primary button: "Edit and Retry."

**Offline:**
- Persistent banner at the top of the screen, dark cool-neutral background, white text: "⚡ Offline — your check will run when you're back online." Banner is dismissable but reappears if still offline on next screen.
- Form entry continues to work; tapping "Check Eligibility" queues the check.
- Banner replaced with "✓ Back online — running queued checks…" briefly when connection restores.

### 6.10 History list

- Header: "History" + search icon + filter icon.
- Search field (collapses by default; expands on tap).
- Filter chips row: "All" / "Eligible" / "Action Needed" / "Not Eligible" / "This week" / "This month".
- **List grouped by patient.** Each row:
  - Patient name (last name, first initial).
  - Most recent check status badge.
  - Payer name + last check date + check count ("3 checks").
  - Right side: chevron.
- Tap to open patient detail.

### 6.11 Patient detail (history)

- Header with patient name, DOB, primary payer.
- "Recheck" button at top right (re-runs eligibility with the most recent info).
- Section: "Notes" (private to the marketer). List of timestamped text notes with a "+ Add note" inline action.
- Section: "Check history" — chronological list of all checks for this patient, each row showing date/time, status badge, "View →".
  - **Each row also gets a small Share icon (20px, `--cool-600`) on the right edge, just inside the existing chevron.** Tapping it goes **directly** to the pre-share sheet (§6.13) — does NOT route through the result detail screen first. Marketers re-sending a check the next morning shouldn't have to click through.
- Tap a check to open the result detail (6.8).

### 6.12 Profile / settings

- Avatar + name + role + agency.
- Sections:
  - Account: email, password, biometric toggle.
  - Agency: name, your role, branch (read-only).
  - Notifications: in-app, email (toggles).
  - About: version, terms, HIPAA notice, support contact.
  - Sign out.

### 6.13 Share flow (pre-share sheet + post-share toast)

A two-step flow, not one. The intermediate confirmation step is required because we're moving PHI off-device.

**Step 1 — User taps Share** (from the result-detail header in §6.8 or from a check row in §6.11). A pre-share confirmation **bottom sheet** slides up (280ms ease-out, matching the existing motion spec):

- Heading: "Share eligibility check" (H2).
- PDF preview thumbnail, ~120×160px, 1px `--cool-100` border, 8px shadow. Tappable — expanding it opens a full-page preview with a "Done" button.
- Underneath the thumbnail, a single-line summary row: **patient name · payer · result badge.** This is the visual confirmation of what is leaving the device.
- HIPAA reminder line in `--cool-400` 13px: *"This document contains PHI. Only share with authorized recipients."*
- Two buttons, stacked, full-width:
  - Primary (orange): **"Share via…"** → triggers the native iOS share sheet with the PDF attached.
  - Ghost: **"Cancel"** → dismisses the sheet.

**Step 2 — Native iOS share sheet.** Standard system component, do not restyle. Mail is the expected primary target but all share extensions work (Messages, AirDrop, Save to Files, Print, etc.).

**After share completes:** return to the originating screen with a 2-second toast at the top — `--success-100` background, `--success-500` text, "✓ Shared."

### 6.14 PDF deliverable

Treat the PDF as a polished, branded deliverable — not a screen capture or print stylesheet. It will be read by office staff, referral sources, and potentially auditors. Single page where possible; allow a second page only when the Plain English supporting evidence overflows.

**Layout (US Letter, 8.5×11, 0.5" margins).**

*Header band* (top ~1.25", `--warm-100` background):
- Left: a placeholder Coastal Home Health logo mark (simple geometric shape in `--primary-500` is fine) + agency name in 14pt SemiBold.
- Right: "Eligibility Verification" Caption-style eyebrow + check date and time (e.g. "Apr 29, 2026 · 2:14 PM").

*Patient & result block* (next ~1.5"):
- Patient name in 24pt SemiBold, DOB, masked member ID (last 4 visible only), payer name.
- Result badge — same visual language as in-app — anchored top-right of this block.
- One-line plain-English summary directly under: e.g. "Eligible for home health services as of Apr 29, 2026."

*Supporting evidence section* (bulk of page):
- Mirrors the Plain English view from §6.8: Coverage, Plan Details, Network Status, Service Area Check, Open Episode Check, MSP Check, Hospice Check.
- Each section: 13pt SemiBold uppercase header, 11pt Regular facts, rule-outcome marker at the end (✓ / ⚠ / ✗) in the matching semantic color.
- Skip sections that didn't run for this payer (e.g. don't render "Open Episode Check" on a commercial result if the rule wasn't applicable).

*Footer band* (bottom ~0.75"):
- Left: "Checked by Sarah Martinez, Liaison · Coastal Home Health" in 9pt.
- Center: page number ("1 of 1") in 9pt.
- Right: HIPAA notice in 9pt `--cool-400`: *"Confidential — Protected Health Information. Unauthorized disclosure prohibited."*

**Failure-state PDFs (preserves Principle E).** If the underlying check was not a real coverage decision, the PDF must signal that visually before the reader gets to the body:
- *Timeout / connection failure:* header band uses `--cool-50` instead of `--warm-100`. Result badge replaced with a neutral gray "System Error" pill. Body opens with: *"We couldn't reach the payer at the time of this check. This is not a coverage decision. Please re-run the check."*
- *Payer rejection (member not found / name mismatch):* header band `--secondary-100`. Amber "Payer Could Not Verify" pill. Body explains the specific reason from the response.

**Filename convention.** `Verify_[LastName]_[Payer]_[YYYY-MM-DD].pdf` — e.g. `Verify_Johnson_TraditionalMedicare_2026-04-29.pdf`.

---

## 7. Sample data — populate the prototype with these

Use these specific patients across screens so the prototype tells a coherent story:

| # | Patient | DOB | Payer | Outcome |
|---|---|---|---|---|
| 1 | Margaret Johnson | 03/15/1942 | Traditional Medicare | **Eligible** |
| 2 | Robert Chen | 07/22/1938 | Traditional Medicare | **Action Needed** — open episode with Compassionate Care HHA through 04/30/2026 |
| 3 | Patricia Williams | 11/08/1955 | NJ FamilyCare | **Not Eligible** — address in excluded ZIP 08753 |
| 4 | James Rodriguez | 01/30/1948 | Aetna Medicare Advantage | **Not Eligible** — Aetna MA not contracted with this agency |
| 5 | Linda Brown | 09/12/1944 | Humana | **Eligible** |
| 6 | Frank Sullivan | 02/18/1939 | Traditional Medicare | **System error** — payer timeout (use this for the failure state demo) |
| 7 | Dorothy Mitchell | 06/05/1947 | UnitedHealthcare | **Action Needed** — Medicare Secondary Payer scenario |

Use "Coastal Home Health" as the agency name. User: "Sarah Martinez, Liaison."

The share flow should be navigable from at least three of these to demonstrate variation:
- **Margaret Johnson** (Eligible) — happy-path PDF.
- **Robert Chen** (Action Needed) — open-episode flag visible in PDF body.
- **Frank Sullivan** (System error / timeout) — failure-state PDF demonstrating the distinct visual treatment.

---

## 8. Tablet adaptation (iPad landscape)

**Home tab:** two columns. Left (40%): the New Eligibility Check form. Right (60%): the live result card. Recent checks become a horizontal-scrolling row above the split.

**History tab:** two columns. Left (35%): patient list. Right (65%): selected patient detail + check history.

**Profile tab:** centered single column, max-width 600px.

Bottom nav becomes a left rail (240px wide) with icon + label.

**Pre-share confirmation:** on iPad, render as a centered modal (max-width 480px) rather than a bottom sheet, matching iPadOS conventions. The PDF itself is identical across phone and tablet.

Type sizes scale up ~10% on tablet. All other tokens (color, radii, padding) stay the same.

---

## 9. Interaction & motion notes

Keep motion subtle and purposeful. The design system can suggest:
- Field focus: 150ms ease-out border + label transition.
- Result card state changes: 250ms ease-in-out cross-fade between Empty → Pending → Result.
- Pending shimmer: a soft horizontal gradient sweep, 1.2s loop.
- Result reveal: 400ms ease-out, with an 80ms stagger on the key-facts list items.
- Bottom-sheet open/close: 280ms ease-out spring (applies to both the payer picker and the pre-share confirmation sheet).
- Page transitions: standard iOS push (right-to-left).
- Avoid bounce. Avoid overshoot. This is a clinical tool.

---

## 10. Accessibility & HIPAA UX requirements

- All tap targets ≥ 44×44 pt.
- Color contrast: text against backgrounds meets WCAG AA. Status badges meet AA Large.
- All form fields have visible labels (floating labels OK; label is always visible when filled or focused).
- All icons have accessible labels — including the Share icon in §6.8 and §6.11.
- Status conveyed by **color + icon + text** — never by color alone.
- HIPAA-aware UX (note in design but don't necessarily build):
  - Auto-lock after 5 min idle (reverts to biometric unlock screen).
  - No PHI in lock-screen notifications — generic "You have a new alert in Verify."
  - "Hide patient names" toggle in profile that replaces names with "Patient #ABC123" globally.
  - The pre-share sheet's confirmation row + HIPAA reminder is part of this posture — moving PHI off-device requires explicit user re-confirmation.

---

## 11. Out of scope for this prototype (do NOT build these)

- Real authentication backend (mock SSO and biometric flows are fine).
- Multi-tenancy / agency switching UI.
- Admin panel for managing payer lists, eligible counties, ZIP exclusions, business rules.
- Reports / analytics / dashboards.
- Sharing-result subset that is **still** out of scope: dedicated SMS flow, CRM/EMR export, in-app email composer, share analytics or audit log UI. *(PDF generation + native iOS share sheet are now in scope — see §6.13–§6.14.)*
- Voice entry.
- True offline persistence (visual offline banner is enough).
- Light/dark mode toggle (light only).
- Settings beyond the basics in 6.12.
- The full universe of business rule outcomes — the 7 sample patients cover what we need.

---

## 12. Deliverable

A working, navigable prototype with all screen specs (and sub-states) implemented, populated with the sample data above.

**Primary hero flow that should work end-to-end:**

> Sarah opens app → unlocks with Face ID → home → taps "New Eligibility Check" → selects Traditional Medicare (already default) → enters MBI 1EG4-TE5-MK73 + Last Name "Johnson" + DOB 03/15/1942 → result card auto-runs → "Eligible" appears with full supporting info → taps "Review eligibility response" → toggles to Detailed view → returns → taps "Add Note" → adds "Referred from Ocean Medical Center, ready for SOC Monday." → **taps the Share icon in the header → pre-share sheet appears with PDF preview and patient confirmation row → taps "Share via…" → native iOS share sheet appears with Mail as the suggested target → done.**

**Other flows that should also be navigable:**
- Same flow but with Robert Chen → Action Needed result.
- Same flow but with Patricia Williams → Not Eligible result.
- Same flow but with Frank Sullivan → System error (timeout) result with Retry — and demonstrate the distinct failure-state PDF when shared.
- History tab → tap a patient → see their check history → tap "Recheck."
- Photo shortcut: tap "Attach face sheet" → simulate OCR → form auto-fills.
- **History tab → tap Patricia Williams' row → tap the Share icon directly on the most recent check row → pre-share sheet → share.**

---

**One last thing:** if any decision isn't specified above, default to whatever makes the marketer faster. Speed > polish > novelty.
