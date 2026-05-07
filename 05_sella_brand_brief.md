# Sella Health — Brand Brief (v1)

> **Primary use:** briefing a logo designer.
> **Operative section:** §11 (Logo design direction). Sections 1–10 are the context that informs it — read them first, then read §11 with that context loaded.
> **Companion artifact:** the working prototype at the repo root (`index.html`, `style.css`, `app.js`). The prototype is the most authoritative existing reference for Sella's tone, voice, and visual identity. Where this brief and the prototype disagree, the prototype is closer to ground truth.
> **Status:** v1 (canonical). Iterated from v0.1 with the founder's answers folded in. Update this file in place when positioning shifts.

---

## 1. Snapshot

Sella Health builds calm, fast software for home health agencies. Our first and current product — also called **Sella Health** — lets field liaisons and intake staff respond to referrals in seconds instead of hours, applying the agency's business rules so the user gets a decision, not a data dump.

We are not a portal. Not a CRM. Not an EHR. We are the tool that handles the small, urgent, error-prone work that decides whether a referral becomes a patient.

> **A note on the prototype.** The clickable prototype in this repo currently uses the placeholder name "Verify." That's pre-rename — the product *is* Sella Health, and the prototype will be renamed in the next implementation pass. Read it for tone and behavior; ignore the wordmark.

---

## 2. Founding

Sella Health started as an idea in 2025 and launched in 2026, founded by three partners whose backgrounds bridge **technology, home health care, and business**. That mix is the company's strategic asset: a tech-only team would build a faster portal; a home-health-only team would build a sharper spreadsheet; a business-only team would build a deck. The combination produces something different — software with operator-level taste for what actually matters in the agency's day.

---

## 3. Why Sella exists

Home health agencies live and die by speed-to-response on referrals. The existing tooling — payer portals, faxes, internal spreadsheets, EHR add-ons — was built for the back office, not for someone standing in a hospital hallway with a phone in one hand. The cost of slow tooling shows up downstream: missed referrals, wrong-payer enrollments, episodes that overlap with other providers, denials that arrive weeks later.

**Sella exists to bring peace and serenity to one of the most chaotic parts of the home health agency's day.**

That is the mission. Everything else in this brief is in service of it.

---

## 4. What we believe

Four pillars, drawn directly from the way the product is built:

1. **Speed is a feature, not a side effect.** Every screen is judged against "did this help respond to the referral faster?"
2. **The right answer beats the complete answer.** A clear "Action Needed — open episode through 4/30" is more useful than a 12-page 271 dump. The data is the evidence; the verdict is the product.
3. **Trust comes from transparency, not authority.** Every result shows its work. Users can drop into raw data when they need to.
4. **Clinical context demands restraint.** We handle PHI and inform business decisions. Not a place for clever-but-opaque interactions.

---

## 5. The product

**Sella Health** (V1, mobile, iOS + Android) — eligibility checking across Medicare FFS, Medicare Advantage, Medicaid, and commercial payers, with the agency's business rules applied to produce one of three verdicts: **Eligible**, **Action Needed**, or **Not Eligible**. Failure states (system error, payer rejection) get distinct visual treatment so they can never be confused with a coverage decision.

The product is mobile-first because the user is mobile-first — a liaison standing in a hospital hallway, not at a desk.

---

## 6. Who Sella is for

### Buyer

Owner / Director of Operations / Director of Intake at a home health agency, typically 50–500 employees. Pain: revenue is bleeding through slow referral response, inconsistent eligibility checks, and episode collisions with competitors. Their existing stack is some combination of EHR, payer portals, spreadsheets, and tribal knowledge.

### Primary user

**The liaison / community marketing rep.** Field-based. Phone-first. Hospitals, SNFs, doctors' offices, and the car between visits. 5–10 checks a day. Average tech savvy. Often handling a phone in one hand while talking to a referral source. Their #1 job is to respond fast — agency revenue depends on it.

### Secondary user

**Office-based intake staff.** Desk-bound, tablet or laptop. Higher volume, denser workflow. Benefits from side-by-side history and active-check views.

---

## 7. What Sella is *not*

This list is as important as what we *are*.

We are not:
- A payer portal.
- A CRM (we don't track outreach to referral sources — yet).
- An EHR or clinical charting tool.
- A telephony or fax replacement.
- A general-purpose RCM platform — we focus on the front-of-funnel decisions.
- A clinical decision-support tool. The rules we encode are *business* logic (service area, contracted payers, MSP, hospice), not medical necessity.

Stylistically, we are not:
- Bureaucratic.
- Consumer-cute.
- Insurance-industry-clinical (i.e. "your portal session has expired").
- Generic SaaS-marketing.

---

## 8. Personality & voice

### Personality

Five adjectives, ordered by emphasis:

1. **Calm** — restraint over flash. Whitespace earns its keep.
2. **Fast** — every word and pixel is judged against speed-to-decision.
3. **Modern** — Sella looks like 2026, not 2012. We don't apologize for being software.
4. **Warm** — clinical doesn't have to mean cold. The warm-neutral palette with a single warm accent is intentional.
5. **Trustworthy** — we handle PHI. Every interaction reflects that we know it.

### Voice — concrete

We write the way a sharp, calm colleague talks. Short sentences. Plain English. No marketing puffery. We tell the user what's happening, not what we want them to feel about what's happening.

| Do say | Don't say |
|---|---|
| "Margaret Johnson is eligible for home health services." | "Empower your team to deliver world-class care." |
| "We couldn't reach the payer. This is not a coverage decision." | "An error has occurred. Please try again later." |
| "Manual verification is needed." | "Action items have been generated for your review." |
| "Eligibility checks, instantly." | "Robust, scalable, enterprise-grade eligibility intelligence." |
| "Open episode: Compassionate Care HHA, through 04/30/2026." | "Pre-existing care arrangement detected." |

The prototype is the canonical voice reference. When in doubt, copy a phrase pattern from there.

---

## 9. Visual identity (today)

These tokens are settled and in production use. A logo designer should treat them as fixed constraints.

- **Primary color:** warm orange `#E96424`. Used *sparingly* — primary CTAs, focused fields, brand moments. Never painted across surfaces.
- **Secondary color:** warm amber `#F7A337` for warnings, Action Needed surfaces.
- **Neutrals:** *two* grayscales — cool for text and dividers, warm for backgrounds and soft surfaces. The warm-canvas-with-cool-ink combination is a deliberate brand fingerprint.
- **Semantic palette:** green (success), red (error), amber (warning), blue (info / active episode).
- **Typography:** Inter — H1 28/SemiBold for screen titles; H2 22/SemiBold for section headers; 17 Body Large; 15 Body; 13 Subtle; 11 Caption (uppercase, 0.5px tracking).
- **Iconography:** Lucide. 20px in body, 24px in nav, 16px in badges.
- **Geometry:** 12px corner radius for buttons and fields; 16px for cards; 999px pill for badges and chips.
- **Motion:** subtle, purposeful, no bounce, no overshoot. 150ms ease-out for field focus; 280ms ease-out for bottom sheets; 400ms result reveal with 80ms stagger on fact lists.

**What does not exist yet:** a logo. That's what §11 is for.

---

## 10. Sella against the alternatives

We compete for attention against:

- **Payer portals.** Bureaucratic, slow, single-payer. We are cross-payer, fast, mobile-first.
- **Generic eligibility APIs.** Built for developers; agencies have to wrap them in their own UI. We ship a finished tool to the actual end user.
- **EHR-native eligibility modules.** Bolted onto a clinical product. Not designed for the field-based user. We are.
- **Spreadsheets, faxes, "I'll check Monday."** The actual incumbent — and the thing we displace day one.

**Differentiator (one sentence):**

> *The only eligibility tool designed for the person standing in a hospital hallway — with applied business rules for intelligent decisions, not raw payer data dumps.*

The two halves both matter: **mobile/field** is who we're for, **applied business rules** is what we do that the alternatives don't.

---

## 11. Logo design direction *(operative section)*

This is the section a logo designer should treat as their brief. Sections 1–10 are the context that justifies the choices below.

### 11.1 The word

**Sella** — five letters, two syllables, soft "S" opening, gentle "ah" close.

- **Etymology:** in Latin, *sella* means a saddle, a seat — a place where one rests. We didn't pick the name for the etymology, but the etymology is consistent with the brand. *A place to settle. To pause. To get the answer and move on.*
- **Phonetics:** the word is calming, not punchy. **SELL-uh.** Soft. The mark should feel the same way the word sounds.
- **Visual rhythm:** S-E-L-L-A — symmetric at the double-L. The doubled L is a gift to a designer (ligature opportunity, structural mirror, vertical anchor).

The full company / product name is **Sella Health**, but in the lockup the word "Health" is secondary — Sella carries the brand. "Health" is descriptor.

### 11.2 What the mark must *do* (functional requirements)

| Requirement | Why |
|---|---|
| **App icon at 60×60pt on a phone home screen** | Must be recognizable next to system apps. This is the most-seen surface. |
| **Reads at 16px (favicon) and 24px (nav)** | Must read as Sella, not as an ambiguous abstract shape. |
| **Wordmark + standalone mark variants** | Wordmark for sign-in screens and marketing. Standalone mark for app icon, social avatars, watermarks, the small Coastal-HH-style logo on the PDF header. |
| **Single-color version (light + dark backgrounds)** | Mandatory. Used on documents, invoices, fax cover sheets. |
| **Print-safe at 300dpi** | PDFs, business cards, signage. |
| **Works in monochrome at 1-bit** | For receipts, low-fidelity print, fax. |

### 11.3 What the mark must *embody* (in priority order)

1. **Calm.** Restraint. Not "energetic." Not "dynamic." Not loud.
2. **Quiet confidence.** Sella handles PHI; the mark should feel like it knows that.
3. **Modern but timeless.** A 2026 mark that won't look dated in 2030.
4. **Warmth without cuteness.** Soft geometry, not friendly mascot.
5. **Approachability.** Not corporate-cold. Not pharma-stark.

If a designer's draft scores high on speed-energy-dynamic and low on calm-quiet-warm, it is wrong for Sella regardless of how well-crafted it is.

### 11.4 Anti-patterns — what the mark must NOT be

- ❌ Caduceus, cross, heart, pulse line — generic healthcare iconography. We are deliberately not in that visual category.
- ❌ Stylized "S" that becomes a wave, a swoosh, a lightning bolt, or a gradient ribbon.
- ❌ Blue. We use warm orange + warm/cool neutrals deliberately to differentiate from the insurance/healthcare default.
- ❌ Negative-space tricks ("the white space spells SELLA," "the white space is a person"). Too 2015.
- ❌ Geometric isometric vector illustration aesthetic.
- ❌ Mascot, character, or any anthropomorphism.
- ❌ Anything that could also pass for a fintech, a wellness app, a meditation app, or a CBD brand.
- ❌ A mark that requires color to read. The single-color version must work as hard as the full-color one.

### 11.5 References (spirit, not literal)

These marks share the *attitude* — calm, modern, considered, slightly warm — that Sella should have. The designer should reference them for tone, not copy them for form.

- **Linear** (linear.app) — restraint, sharp geometry, single brand color. A reference for "modern, confident, no decoration."
- **Mercury** (mercury.com) — warm minimalism in a clinical-adjacent industry. A reference for "professional warmth."
- **Notion** — quiet confidence; mark works at every scale.
- **Stripe** — *tone* of the mark, not the form. Restrained modernism that's stayed relevant for 10+ years.
- **Brooklinen / Parachute / Open Spaces** — warmth-without-cuteness reference from outside tech.

We are explicitly **not** trying to look like:
- Most healthtech (Cerner, Epic, athenahealth) — too clinical, blue, stiff.
- Most insurance (Aetna, Humana, BCBS) — corporate, distant.
- Most consumer wellness (Calm, Headspace) — too playful, too soft.

### 11.6 Color rules for the logo

The logo can use:
- The warm orange `#E96424` (primary brand) — primary recommendation.
- Or any of the two neutral families (warm or cool).
- Or be palette-neutral (works in any color).

The logo should **not** introduce new colors not already in the brand system (§9). If the designer feels they need a third hue, that's a brand-system conversation, not a logo decision.

### 11.7 Deliverables expected from the designer

- **Wordmark** — color, single-color light, single-color dark.
- **Standalone mark** — color, single-color light, single-color dark.
- **Lockup** — mark + wordmark together, with clear-space rules and minimum-size guidance.
- **App icon** — iOS (1024×1024 source) and Android adaptive (foreground + background layers).
- **Favicon** — 32×32 and 16×16.
- **Social avatars** — 1:1 crop of the mark.
- **Source files** — Figma + SVG export.
- **Mini usage-guidelines doc** — clear-space, minimum sizes, what not to do, sample lockups on dark / light / orange / photographic backgrounds.

### 11.8 Process recommendation

- **Round 1:** 3–5 distinct directions, presented as concept boards (mood + sketch + 1-2 finished marks per direction). The brief above should constrain enough that all 3–5 are recognizably Sella; if they're wildly different in tone, the designer hasn't internalized the brief.
- **Pick one direction**, kill the others.
- **Round 2:** refinement of the chosen direction — 2-3 variations of execution.
- **Round 3:** final polish + deliverables.

Total: 2–3 weeks with a senior brand designer.

---

## 12. Anti-patterns to avoid in any Sella surface

A short list of things that will undermine the brand if they slip into anything we ship — not just the logo:

- **Healthcare-stock-photo aesthetics** — smiling clinicians in scrubs, blue-and-white gradients, generic "people pointing at screens."
- **Insurance-industry color palettes** — corporate blue plus gray.
- **AI-marketing-illustration aesthetics** — purple gradients, abstract isometric vectors, friendly mascots.
- **Buzzword density** — "AI-powered," "next-gen," "revolutionary," "unlock," "empower," "supercharge."
- **Quantitative claims without evidence** — "80% faster" or "$X saved per check" unless we have the data and the methodology to back them.
- **Casual language about PHI** — anything that suggests we're not entirely serious about what we're handling.

---

*End of v1. The next time this changes meaningfully, increment to v1.1 (typo / clarification), v1.5 (one section reshaped), or v2 (positioning shift) — and note the change at the top.*
