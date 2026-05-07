# Sella Health — Brand Brief (Draft v0.1)

> **Status:** starter draft. Propositional, not declarative. Sections and statements marked **`[TBD]`** need founder input before this becomes the canonical brand document.
> **Drafted from:** the Verify product spec ([`03_verify_spec_merged.md`](./03_verify_spec_merged.md)), the prototype work, and the home-health agency context I've been working in.
> **Intended use:** internal alignment for design, copy, marketing, and product decisions. Not investor-facing in this state.

---

## 1. Snapshot

Sella Health builds calm, fast software for home health agencies — starting with **Verify**, an eligibility-checking app that lets field liaisons and intake staff respond to referrals in seconds instead of hours.

We're not a portal. We're not a CRM. We're not an EHR. We're the tool that handles the small, urgent, error-prone work that decides whether a referral becomes a patient.

`[TBD: founder to confirm or rewrite in own words.]`

---

## 2. Why Sella exists

*Working hypothesis — review and revise.*

Home health agencies live and die by speed-to-response on referrals. The existing tooling — payer portals, faxes, internal spreadsheets, EHR add-ons — was built for the back office, not for someone standing in a hospital hallway with a phone in one hand. The cost of slow tooling shows up downstream: missed referrals, wrong-payer enrollments, episodes that overlap with other providers, denials that arrive weeks later.

Sella exists to put a single, opinionated, modern tool in the hands of the people who actually own that response time.

**What we believe** *(four pillars, drawn from the product spec):*

1. **Speed is a feature, not a side effect.** Every screen is judged against "did this help respond to the referral faster?"
2. **The right answer beats the complete answer.** A clear "Action Needed — open episode through 4/30" is more useful than a 12-page 271 dump. The data is the evidence; the verdict is the product.
3. **Trust comes from transparency, not authority.** Every result shows its work. Users can drop into raw data when they need to.
4. **Clinical context demands restraint.** This handles PHI and informs business decisions. Not a place for clever-but-opaque interactions.

`[TBD: founder to confirm, edit, or replace these pillars. They're inferred from the spec's UX principles — they may match how you think about the company, or they may not.]`

---

## 3. Where we're going

**V1 (now):** Verify — eligibility checking across Medicare FFS, Medicare Advantage, Medicaid, and commercial payers.

**V2 and beyond `[TBD]`** — likely candidates if the company thesis is "fast, opinionated tools for home health front-of-funnel work":

- Referral intake and triage
- Clinical eligibility / medical-necessity pre-check
- Authorization tracking
- Episode and recheck management
- Referral-source CRM (lightweight, mobile-first)

The strategic question for this section: **is Sella the eligibility company, or the home-health-agency-front-office company that started with eligibility?** The answer changes the brief. The doc currently leans toward the second framing.

`[TBD: founder to confirm V2 direction, or strike if Verify-only positioning is intentional.]`

---

## 4. Who Sella is for

### Buyer

Owner, Director of Operations, or Director of Intake at a home health agency. Typical agency size: 50–500 employees. Their pain: revenue is bleeding through slow referral response, inconsistent eligibility checks, and episode collisions with competitors. Their existing stack is some combination of EHR, payer portals, spreadsheets, and tribal knowledge.

`[TBD: confirm agency size, specialty mix (HHA only? hospice? skilled nursing?), geography (NJ-focused, regional, national?).]`

### Primary user (V1)

**The liaison / community marketing rep.** Field-based. Phone-first. Hospitals, SNFs, doctors' offices, and the car between visits. 5–10 checks a day. Average tech savvy. Often handling a phone in one hand while talking to a referral source. Their #1 job is to respond fast — agency revenue depends on it.

### Secondary user (V1)

**Office-based intake staff.** Desk-bound, tablet or laptop. Higher volume, denser workflow. Benefits from side-by-side history and active-check views.

---

## 5. What Sella is *not*

This list is as important as what we *are*. We are not:

- A payer portal.
- A CRM (we don't track outreach to referral sources — yet).
- An EHR or clinical charting tool.
- A telephony or fax replacement.
- A general-purpose RCM platform — we focus on the front-of-funnel decisions.
- A clinical decision support tool — the rules we encode are *business* logic (service area, contracted payers, MSP), not medical necessity.

Stylistically, we are not:
- Bureaucratic.
- Consumer-cute.
- Insurance-industry-clinical (i.e. "your portal session has expired").
- Generic SaaS-marketing.

`[TBD: anything to add or strike?]`

---

## 6. Personality & voice

### Personality

Five adjectives, ordered by emphasis:

1. **Calm** — restraint over flash. Whitespace earns its keep.
2. **Fast** — every word and pixel is judged against speed-to-decision.
3. **Modern** — Sella looks like 2026, not 2012. We don't apologize for being software.
4. **Warm** — clinical doesn't have to mean cold. The warm-neutral palette with a single warm accent is intentional.
5. **Trustworthy** — we handle PHI. Every interaction reflects that we know it.

### Voice

We write the way a sharp, calm colleague talks. Short sentences. Plain English. No marketing puffery. We use "we," not "the platform." We tell the user what's happening, not what we want them to feel about what's happening.

### Voice — concrete

| Do say | Don't say |
|---|---|
| "Margaret Johnson is eligible for home health services." | "Empower your team to deliver world-class care." |
| "We couldn't reach the payer. This is not a coverage decision." | "An error has occurred. Please try again later." |
| "Manual verification is needed." | "Action items have been generated for your review." |
| "Eligibility checks, instantly." | "Robust, scalable, enterprise-grade eligibility intelligence." |
| "Open episode: Compassionate Care HHA, through 04/30/2026." | "Pre-existing care arrangement detected." |

`[TBD: confirm — any existing copy (deck, website, pitch) that should anchor this section, or that I should reconcile against?]`

---

## 7. Visual identity

### Settled (from Verify product work)

- **Primary color:** warm orange `#E96424`. Used *sparingly* — primary CTAs, focused fields, brand moments. We don't paint result screens with it.
- **Secondary color:** warm amber `#F7A337` for warnings, Action Needed surfaces.
- **Neutrals:** *two* grayscales — cool for text and dividers, warm for backgrounds and soft surfaces. The warm-canvas-with-cool-ink combination is a deliberate brand fingerprint.
- **Semantic palette:** green (success), red (error), amber (warning), blue (info / active episode).
- **Typography:** Inter — H1 28/SemiBold (screen titles), H2 22/SemiBold (section heads), 17 Body Large, 15 Body, 13 Subtle, 11 Caption (uppercase, 0.5px tracking).
- **Iconography:** Lucide. 20px in body, 24px in nav, 16px in badges.
- **Geometry:** 12px corner radius for buttons and fields; 16px for cards; 999px pill for badges and chips.
- **Motion:** subtle, purposeful, no bounce, no overshoot. 150ms ease-out for field focus; 280ms ease-out for bottom sheets; 400ms result reveal with 80ms stagger on fact lists.

### Open at the company level `[TBD]`

| Element | Status |
|---|---|
| Verify product wordmark | ✅ Settled (used in sign-in, share artifacts) |
| Verify product tagline ("Eligibility checks, instantly.") | ✅ Settled |
| Sella corporate wordmark | `[TBD]` |
| Sella corporate logo / mark | `[TBD]` |
| Sella corporate tagline | `[TBD]` |
| Brand-architecture decision: unified (Sella = Verify's master brand) or endorsed (Sella as parent, Verify as one of several products with shared-but-distinct marks) | `[TBD]` — biggest open question in this section |
| Photography / illustration direction | `[TBD]` |
| Color extensions for charts, marketing | `[TBD]` |

The brand-architecture decision is the highest-leverage one. If Sella is a one-product company in 2026, "Sella = Verify's master brand" is fine — keep them visually identical, the company brand is the product brand. If V2 is on a 12-month horizon, you want a clean Sella mark now, used at sign-in and on marketing surfaces, while products get their own wordmarks.

---

## 8. Sella against the alternatives

We compete for attention against:

- **Payer portals.** Bureaucratic, slow, single-payer. We're cross-payer, fast, mobile-first.
- **Generic eligibility APIs.** Built for developers; agencies have to wrap them in their own UI. We ship a finished tool to the actual end user.
- **EHR-native eligibility modules.** Bolted onto a clinical product. Not designed for the field-based user. We are.
- **Spreadsheets, faxes, "I'll check Monday."** The actual incumbent. The thing we displace day one.

**Working differentiator (one sentence):**

> *The only eligibility tool designed for the person standing in a hospital hallway — not the person at a desk.*

`[TBD: confirm or replace. The hallway-vs-desk framing is a working hypothesis from the spec. If your real wedge is something else (price, integration, contract terms, business model), we should center on that.]`

---

## 9. Anti-patterns to avoid in any Sella surface

A short list of things that will undermine the brand if they slip in:

- **Healthcare-stock-photo aesthetics** — smiling clinicians in scrubs, blue-and-white gradients, generic "people pointing at screens."
- **Insurance-industry color palettes** — corporate blue + gray.
- **Marketing-AI-illustration aesthetics** — purple gradients, abstract isometric vector illustrations, friendly mascots.
- **Buzzword density** — "AI-powered," "next-gen," "revolutionary," "unlock," "empower," "supercharge."
- **Quantitative claims without evidence** — "80% faster" or "$X saved per check" unless we have the data and the methodology.
- **Cute language about PHI** — anything that suggests we're casual about what we're handling.

---

## 10. Things I'd need from you to take this from v0.1 → canonical

1. **Founding story** — when did Sella start, why, what was the inflection point?
2. **Mission, in your words** — does §2 land? If not, what's the one-sentence version?
3. **Beyond Verify** — is Sella a one-product company in 2026, or are V2/V3 products in plan? (Answer reshapes §3, §7's brand-architecture decision, and the differentiator in §8.)
4. **Audience confirmation** — does §4's persona description match who you're actually selling to? Specialty mix, geography, agency size?
5. **Voice references** — any existing copy (pitch deck, landing page, sales script) that I should reconcile against?
6. **Visual direction** — does Verify's identity = Sella's identity, or are we defining a separate corporate brand mark? Any logo work in flight to reconcile against?
7. **Competitive narrative** — does the §8 differentiator match how you pitch Sella, or do you have a sharper one-liner?
8. **Use case for this brief** — internal team alignment? Onboarding new hires? Investor deck appendix? Design-contractor onboarding? All of the above? That changes polish vs. depth.

The fastest way to iterate: edit this file in place with your answers, or just paste them back in chat and I'll fold them in.

---

*End of v0.1. This is a substrate, not a position.*
