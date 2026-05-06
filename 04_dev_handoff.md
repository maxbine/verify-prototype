# Verify — Mobile App Development Handoff (V1)

> **Audience:** the React Native mobile team building the V1 of Verify for iOS and Android.
> **Status:** ready to start. Open items called out in §13.
> **Companion artifacts:** [`03_verify_spec_merged.md`](./03_verify_spec_merged.md) (UX/visual spec — source of truth for screens), and the clickable HTML prototype at the repo root (`index.html`, `style.css`, `app.js`, `data.js` — source of truth for interactions, motion, and edge cases).

---

## 1. Overview

You're building a React Native mobile app — iOS + Android — for a home health agency liaison who needs to run an eligibility check on a referral and respond fast. The merged spec describes the screens and behaviors. The prototype demonstrates the *feel*: live-result form, distinct failure-state language, branded PDF, two-step share confirmation. Build this faithfully — the visual design is settled. Most of your judgment work is on:

- **Network resilience** — flaky hospital Wi-Fi, queued checks, retry UX.
- **Form-driven live result** — the new-check screen auto-runs the check the moment minimum fields are met.
- **Share flow** — pre-share confirmation sheet (you build this), then native OS share sheet (the OS gives you).
- **PDF rendering** — see §9.

The agency name "Coastal Home Health" and user "Sarah Martinez" in the prototype are placeholders — the real app pulls agency + user identity from the auth session. Brand in V1 is fixed Verify branding; per-agency theming is out of scope (see §5).

---

## 2. Source of truth

When the spec, the prototype, and this doc disagree, the priority order is:

1. **The merged spec** ([`03_verify_spec_merged.md`](./03_verify_spec_merged.md)) — for layout, copy, color, type, business rule semantics. If you read one document, read this one.
2. **The HTML prototype** — for interaction sequences, motion timing, failure-state language, edge cases the spec didn't enumerate. The CSS file (`style.css`) is the canonical token set; the JS file (`app.js`) is the canonical screen behavior.
3. **This doc** — for tech stack guidance, integration boundaries, and decisions made during prototyping that aren't in the spec.

If you find a contradiction between the prototype and the spec, the spec wins — but ping product before changing anything, because in some cases the prototype encodes a later decision that didn't make it back to the spec.

---

## 3. Stack recommendations

| Concern | Recommendation | Rationale |
|---|---|---|
| Framework | **Expo (managed workflow) on the latest SDK** | Fastest onboarding, OTA updates via EAS Update (very useful for an internal tool), all native modules we need are covered, ejecting later is cheap if you ever need it. |
| Navigation | **React Navigation v7** w/ native stack | Standard, native-feel transitions, integrates with deep links if/when you need them. |
| State | **Zustand** | App is small enough that Redux Toolkit is overkill. Zustand keeps state code roughly equivalent to the prototype's vanilla `State` object. |
| Forms | **React Hook Form** + **Zod** for validation | Hand-rolled refs get unwieldy with adaptive payer-specific fields. RHF + Zod gives you typed validation and clean conditional fields. |
| Styling | **Restyle** (Shopify) **or** Tamagui, *or* `StyleSheet.create` with a tokens module | The prototype's `style.css` defines exact tokens — port them to a single TS module and consume them everywhere. Don't reach for inline styles. |
| Icons | **lucide-react-native** | Same icon set the prototype uses. Drop-in. |
| Fonts | Inter via **expo-font** | Same as prototype. Bundle, don't fetch. |
| Native share | **react-native-share** | Wraps iOS UIActivityViewController and Android Intent picker. Supports file sharing (PDF). |
| Biometric unlock | **expo-local-authentication** | Face ID, Touch ID, Android BiometricPrompt — one API. |
| Secure storage (tokens) | **expo-secure-store** | Keychain on iOS, EncryptedSharedPreferences on Android. Don't use AsyncStorage for tokens. |
| MS Entra auth | **react-native-msal** *or* **expo-auth-session** | See §8. |
| PDF render (if client-side) | **expo-print** | See §9 — but the recommendation is server-side. |
| Network | **fetch** + a small wrapper, or **TanStack Query** | TanStack Query if you want caching/retry semantics for the eligibility-check call out of the box. |
| Linting / TS | TypeScript strict, ESLint with the standard Expo config, Prettier | Standard. |
| Testing | Jest for units, **Maestro** for E2E flows | Maestro is friendlier than Detox for the share/biometric flows we have. |

**Out-of-the-box "nope" list** (don't bother evaluating):
- Web-only design tooling (Figma plugins, Storybook web). Use react-native-storybook if you want a component playground.
- React Native Web. The prototype runs on web; the app is mobile-only.
- Redux. Overkill for this app size.

---

## 4. Architecture — what this team owns vs. talks to

```
                                 ┌─────────────────────────────┐
                                 │   This team's React Native  │
                                 │   app (iOS + Android)       │
                                 └──┬───────┬──────────┬───────┘
                                    │       │          │
                          auth      │       │ HTTPS    │ native APIs
                          (MSAL)    │       │ (JSON)   │ (share, biometric,
                                    │       │          │  secure storage)
                                    ▼       ▼          ▼
                          ┌──────────────────────────┐
                          │   Agency backend API     │   ← owned by another team
                          │   (the "BFF" for Verify) │
                          └──┬───┬─────────┬─────────┘
                             │   │         │
                  ┌──────────┘   │         └─────────────┐
                  ▼              ▼                       ▼
           ┌────────────┐  ┌─────────┐    ┌─────────────────────────┐
           │ CMS HETS   │  │ Stedi   │    │ Business-rules engine   │
           │ (Medicare) │  │ (commercial │ │ (service area, episodes,│
           └────────────┘  │  + Medicaid │ │  MSP, hospice — owned   │
                           │  via 270/271)│ │  by another team)       │
                           └─────────┘    └─────────────────────────┘
                                                       │
                                                       ▼
                                          ┌─────────────────────────┐
                                          │ PDF generation service  │
                                          │ (recommendation: server │
                                          │  side — see §9)         │
                                          └─────────────────────────┘
```

**You own:** everything in the top box. The mobile app speaks JSON to the agency backend. You don't talk to CMS, Stedi, or the rules engine directly.

**You consume:** the agency backend's eligibility-check endpoint, which returns a fully-resolved result (the rules have already been applied, the verdict is `eligible | action | not_eligible | system_error | rejected`, and the supporting evidence is structured into the same sections the prototype displays).

**The contract for that endpoint is one of the §13 open items** — coordinate with backend before scoping work week 1.

---

## 5. Scope

### In scope (this team builds)

- All screens in spec §6 and the prototype, for both iOS and Android, in light mode.
- Adaptive forms — the field set changes based on selected payer (spec §3.C).
- Live-result UX on the new-check screen (spec §3.B). This is the most important UX pattern in the app — get it right.
- Pre-share confirmation sheet w/ PDF preview thumbnail and patient confirmation row (spec §6.13).
- Native share flow (iOS UIActivityViewController / Android intent) for the PDF (§10 below).
- PDF rendering (server-side recommended — see §9).
- MS Entra sign-in (§8).
- Biometric unlock w/ 5-minute idle auto-lock.
- Offline banner + queued-checks UX (spec §6.9).
- Patient-grouped history list w/ search and filter chips (§6.10).
- Notes (private, per-patient, local to user) — V1 can be locally stored encrypted; backend persistence is a §13 open item.
- Localization scaffolding (en-US only for V1, but wrap user-facing strings in `t(...)` from day one).
- Accessibility (spec §10) — VoiceOver + TalkBack, AA contrast, ≥44pt tap targets, status conveyed by color + icon + text.

### Out of scope for this team / this release

| Item | Where it lives |
|---|---|
| Eligibility request itself (270 generation, CMS HETS / Stedi calls) | Agency backend |
| Business rules (service area, open episode, MSP, hospice) | Separate rules-engine codebase (already exists) |
| Identity provider configuration (tenants, app registration) | Whoever runs MS Entra for the agency |
| PDF template generation | Server-side service (recommended, §9) |
| Multi-tenant agency switching | V2 |
| Admin panel (managing payer lists, ZIP exclusions, rule config) | Separate web app |
| Analytics dashboards / reporting | Separate web app |
| Voice entry, SMS sharing, CRM/EMR export, in-app email composer | Out of scope per spec §11 |
| Per-agency white-labeling / theming | V1.5+ (see §13 open items) |
| Dark mode | V1.5+ |
| Real PHI in production builds | Production launch readiness (HIPAA BAA, audit logging, etc. — agency's compliance team) |

---

## 6. Design system handoff

The prototype's [`style.css`](./style.css) is the canonical token set. Port these into a single TS module — don't redefine them in component files.

**Suggested file:** `src/theme/tokens.ts`

```ts
export const colors = {
  // Primary — warm orange, brand
  primary50:  '#FBFAF9', primary100: '#FBF1EC', primary200: '#FCDCC8',
  primary300: '#F4B58D', primary400: '#EC8D52', primary500: '#E96424',
  primary600: '#D54E0E', primary700: '#B23E08', primary800: '#8A2F04',

  // Secondary — warm amber (warnings, action-needed)
  secondary50:  '#FFFCF7', secondary100: '#FAF1DF', secondary200: '#F5E0BF',
  secondary300: '#FACE91', secondary400: '#FAB85F', secondary500: '#F7A337',
  secondary600: '#F09110', secondary700: '#C77A0E',

  // Cool neutrals — text, dividers
  cool50: '#F0F0F2', cool100: '#DDDDE1', cool200: '#BEBDC4',
  cool300: '#8A8893', cool400: '#58566A', cool500: '#3D3A55',
  cool600: '#2D2A45', cool700: '#2D2942',

  // Warm neutrals — surfaces, backgrounds
  warm50: '#FFFFFF', warm100: '#F2EFEC', warm200: '#DDDAD4',
  warm300: '#BAB6AE', warm400: '#8A857B', warm500: '#5C5851',
  warm600: '#423D36', warm700: '#312D27',

  // Semantic
  success500: '#2E9667', success100: '#DEF5EA',
  error500:   '#E94B4B', error100:   '#FBE5E5',
  info500:    '#4B6CE9', info100:    '#E5EAFB',
};

export const radii = { button: 12, card: 16, pill: 999 };

export const typography = {
  h1:         { fontSize: 28, fontWeight: '600', letterSpacing: -0.6 },
  h2:         { fontSize: 22, fontWeight: '600', letterSpacing: -0.2 },
  bodyLarge:  { fontSize: 17, fontWeight: '400' },
  body:       { fontSize: 15, fontWeight: '400' },
  bodyStrong: { fontSize: 15, fontWeight: '600' },
  subtle:     { fontSize: 13, fontWeight: '400' },
  caption:    { fontSize: 11, fontWeight: '500', letterSpacing: 0.5,
                textTransform: 'uppercase' },
};

export const motion = {
  // Match the prototype's timings — these were tuned, don't reinvent.
  fieldFocus: 150,        // ms, ease-out
  resultCardTransition: 250,
  pendingShimmer: 1200,
  resultReveal: 400,
  bottomSheetOpen: 280,
  pageTransition: 'native', // standard iOS/Android push
};
```

**Components to extract first:**

1. `Button` — primary / secondary / ghost / ghost-cool, w/ `full`, `lg`, `sm` size variants. See `.btn` family in style.css.
2. `Field` — floating-label input that animates the label up on focus/fill, w/ filled / focused / error / disabled states. See `.field` family.
3. `Badge` — pill, semantic variants (eligible, action, not-eligible, episode, system-error, payer-unverified, accepted, denied, lost). See `.badge` family.
4. `Card` — w/ `compact` and `elevated` variants.
5. `ResultCard` — empty / pending / result states, w/ outcome-specific theming. See §6.4–§6.7 of the spec and `renderResultCardForPatient()` in `app.js`.
6. `BottomSheet` — used by the payer picker and the pre-share confirmation. Use `@gorhom/bottom-sheet` or Expo's modal — don't roll your own.

**Do not** rebuild the iOS share sheet UI — `react-native-share` invokes the real OS share sheet. The prototype mocked it because the web doesn't have one. (See §10.)

---

## 7. Screen-by-screen build notes

This is supplementary — read the spec for full requirements. Notes here cover decisions made during prototyping that aren't obvious from the spec, plus React-Native-specific gotchas.

### 7.1 Sign-in (§6.1)
- The "Continue" button after entering email kicks off the MS Entra OAuth flow (§8). Treat the email field as a hint, not a required value — Entra will collect/confirm it.
- The "Sign in with SSO" button can be a duplicate path or removed if your Entra config makes the email field redundant. Confirm w/ product.
- HIPAA footer is real, not decorative. Keep it.

### 7.2 Biometric unlock (§6.2)
- Triggered on cold start when an unexpired session exists.
- Use `expo-local-authentication` w/ `authenticateAsync({ promptMessage: 'Unlock Verify' })`.
- Auto-lock policy: after **5 min of inactivity** (foregrounded but no touches) or **on backgrounding** for >30s, route to this screen. Use `AppState` listeners.
- "Sign in with password instead" routes back to the Entra flow (full re-auth).

### 7.3 Home (§6.3)
- The "Recent checks" list and the stat-tile counts come from the agency backend. Cache the last response locally (encrypted) so the home screen has something to render offline.
- The notification bell is decorative in V1 — wire to a no-op route.

### 7.4 New eligibility check (§6.4)
**This is the hero screen and the one most likely to leak performance issues.** Read spec §3.B and §6.4 carefully.

- The result card lives **on the same screen** as the form. It is not a navigation destination. Use a single screen component with a `resultState: 'empty' | 'pending' | 'result'` field.
- Auto-run the check the moment minimum fields are met. Debounce input by ~300ms so users typing fast don't kick off three checks. Once `pending`, ignore further input changes until resolution.
- The persistent "Check Eligibility" button does the same thing as auto-run. Don't duplicate state — both paths go through one `runCheck()` action.
- Handle keyboard dismissal: tapping the result card area should *not* dismiss focus mid-typing. Use `keyboardShouldPersistTaps="handled"` on the ScrollView.
- The photo-shortcut card simulates OCR in the prototype (1.5s loading then form auto-fills). For V1, you can either ship a working camera + OCR (probably overkill) or stub it as the prototype does. Talk to product. If shipping working OCR, use Apple's Vision framework on iOS / ML Kit on Android — both are free and fast for face-sheet OCR.
- The payer picker bottom sheet should be search-by-keyboard friendly. The list isn't huge but it's not tiny either.

### 7.5–7.7 Result variants (§6.5–§6.7)
- Three theming variants: `eligible` (green), `action` (amber), `not` (red). One component, three themed instances.
- **Manual verification line.** From tester round-1 feedback: when status is "Action Needed," show a strong "Manual verification is needed." pill directly under the title (and in the result-detail header, under the badge). Already added in the prototype — see commit `3df6611`. Don't drop this on the way to production.
- The "Mark as Accepted / Mark as Lost" buttons are *flags only* — they update the local check record. They don't trigger downstream workflows in V1.

### 7.8 Result detail (§6.8)
- Segmented control for "Plain English" vs "Detailed" — Detailed shows the parsed 271 segments. Use a monospace font (JetBrains Mono is what the prototype uses) for the values to give it a "data" feel.
- The Share icon in the top-right opens the pre-share confirmation sheet (§7.13 below). Same affordance pattern as the share-on-row in the patient-detail screen.

### 7.9 Failure states (§6.9)
- **Critical principle:** system errors must look distinct from "Not Eligible." Different icon, different color, different copy, different action button. The prototype's PDF rendering also enforces this — failure-state PDFs use a cool-50 or amber header band and a "this is not a coverage decision" body opener. Keep it.
- Offline banner: a sticky top banner that appears when network is unreachable. Use `@react-native-community/netinfo` to detect. The banner is dismissible *for the session* but reappears on the next route while still offline.
- Queued-checks: when offline, "Check Eligibility" should save the form to a local outbox, show a confirmation toast, and the home screen's banner should swap to "✓ Back online — running queued checks…" briefly when connection returns.

### 7.10 History (§6.10)
- Patient-grouped, not check-grouped. If Patricia Williams has 3 checks, the list shows one row "Williams, P. · 3 checks" with the most-recent badge.
- Filter chips are local state, not URL params. No deep-linking required for V1.

### 7.11 Patient detail (§6.11)
- Notes are private to the marketer and don't sync across users. Local secure storage is fine for V1; backend sync is a §13 open item.
- The Share icon on each check-history row is a **direct shortcut** to the pre-share confirmation sheet — bypasses the result detail screen. This matters for the "Sarah re-sending yesterday's check first thing in the morning" use case. Don't route through result-detail.

### 7.12 Profile (§6.12)
- Most settings are read-only display in V1. The toggles (in-app alerts, email digest, hide patient names) flip local prefs.
- "Hide patient names" toggle should globally replace `firstName lastName` with `Patient #ABC123` (deterministic from patient ID) wherever a name is rendered. Implement once via a `usePatientLabel(p)` hook so you don't sprinkle conditionals.
- Sign out clears the secure store and routes to sign-in.

### 7.13 Share flow (§6.13)
- **Two-step flow.** Step 1 = your custom pre-share confirmation sheet (bottom sheet on phone, centered modal on tablet). Step 2 = the OS native share sheet, which you do NOT build — it's `react-native-share`.
- The PDF preview thumbnail in step 1 should be a real preview, not a placeholder. Easiest way: have the backend generate a 240×320 JPEG thumbnail alongside the PDF, fetch it via signed URL.
- HIPAA confirmation row in step 1 is non-negotiable — moving PHI off-device requires explicit user re-confirmation. Don't auto-skip the sheet even if the user has shared this exact check before.

### 7.14 PDF deliverable (§6.14)
- See §9 — the recommendation is to render server-side. The mobile app fetches an existing PDF, doesn't generate it.
- Failure-state PDFs (system error / payer rejection) get distinct visual treatment per spec §6.14. The backend is responsible for branching the template — the mobile app just shares whatever bytes come back.

---

## 8. Auth — Microsoft Entra (formerly Azure AD)

### Recommendation: **`expo-auth-session` w/ MS Entra**

Why over `react-native-msal`:
- Pure-JS, no native module rebuild required if you stay on Expo managed.
- Well-supported flow for Microsoft providers. There's an [Expo example](https://docs.expo.dev/guides/authentication/#microsoft) you can crib.
- MSAL is more powerful (token caching, automatic refresh, broker integration) but adds bare-workflow ejection cost. If/when the agency's IT requires conditional access policies that depend on MSAL broker support, switch then.

### Flow

```
[Sign-in screen]
    ↓ tap Continue
expo-auth-session opens system browser → Entra login → consent
    ↓ redirect with code
exchange code for access_token + refresh_token + id_token
    ↓ store tokens in expo-secure-store, decode id_token for user info
[Home screen]
```

### What you need from whoever runs Entra

- **Tenant ID**
- **Client ID** for a registered mobile app (one registration covers iOS and Android)
- **Redirect URIs** — for Expo: `<scheme>://auth` where `<scheme>` is your app scheme. Add to the app registration.
- **Scopes** — at minimum `openid profile email`. If the agency backend is also Entra-protected (likely), add the backend's exposed scope (e.g. `api://<backend-client-id>/Verify.Read`).

This is on the §13 open-items list — flag it on day one with the customer's IT contact.

### Don'ts

- Don't store tokens in AsyncStorage. Use `expo-secure-store` (Keychain / EncryptedSharedPreferences).
- Don't decode access tokens client-side for authorization decisions — they're for the backend. ID token is fine for displaying user info.
- Don't put refresh logic in every component. Wrap fetch in an interceptor that handles 401 → silent refresh → retry once.

---

## 9. PDF generation — recommendation: server-side

### TL;DR

**Render PDFs server-side, not in the app.** The mobile app fetches the PDF as bytes via a signed URL and shares the file. This is the boring, right answer.

### Why server-side

| Concern | Server-side | Client-side (`expo-print`) |
|---|---|---|
| Rendering fidelity (fonts, complex layouts) | Identical across users — Chromium/Puppeteer renders the same template every time | Varies: device fonts, RN paint differences, occasional clipped text |
| Audit/compliance (PHI tracking) | Generated and logged within agency boundary | Generated on-device, then transmitted off-device — harder audit story |
| Failure-state branching (cool-50 header, etc.) | Trivial — server applies template variant | Forces template duplication: web admin's PDF vs mobile's PDF can drift |
| Reuse for email / web / print | Same template, one source of truth | Mobile-only |
| Mobile app size + complexity | Tiny — fetch bytes | Bundles a renderer + template HTML |
| Offline | Need to fetch first; cache last result | Could generate offline (small win) |

The only real argument for client-side is offline PDF generation. For a marketer in a hospital basement, that's a niche scenario — the eligibility check itself requires connectivity, so by the time you can generate a PDF you already have the result and can fetch the PDF too. Cache the last 10 PDFs locally for re-share-without-recheck.

### Recommended pipeline

1. Backend generates PDF on demand from a server-rendered HTML template (Puppeteer / `wkhtmltopdf` / Gotenberg).
2. PDF stored in agency-controlled object storage (S3 + bucket policies, or Azure Blob if you're staying in the MS ecosystem).
3. Backend exposes `GET /eligibility-checks/{id}/pdf` returning a 5-minute signed URL.
4. Mobile app: fetch the PDF bytes (via `expo-file-system` `downloadAsync` to a temp file), then pass that file path to `react-native-share`.

### If for some reason you must do this client-side

Use `expo-print` w/ a string of HTML that mirrors `renderPdfPage()` from the prototype. Maintain the template in a single file. Generate to a temp file. Share via `react-native-share`. Test on a wide variety of Android devices — text rendering is where it'll hurt.

---

## 10. Native share flow

The spec called for the iOS share sheet specifically. On Android you'll get the Android intent picker — same UX role, same lib handles both.

```ts
import Share from 'react-native-share';

async function shareEligibilityCheck(check) {
  const pdf = await downloadPdf(check.id); // returns local file path
  await Share.open({
    title: `Eligibility check — ${check.patient.firstName} ${check.patient.lastName}`,
    url: `file://${pdf.path}`,           // iOS + Android both want a URL
    type: 'application/pdf',
    filename: `Verify_${check.patient.lastName}_${check.payer.id}_${check.dateISO}.pdf`,
    failOnCancel: false,                 // user pressing cancel shouldn't throw
  });
}
```

Things to verify:
- Filename is preserved when the user shares to Mail (some Android apps replace it).
- On iOS 17+, the share sheet shows the PDF preview thumbnail above the recipient row. Confirm it renders our PDF correctly.
- Print works on both platforms (it's a built-in share extension).

The two-step flow is **your** pre-share confirmation sheet (step 1) → call `Share.open()` (step 2 — the OS surfaces its own sheet). Don't try to inject behavior between OS sheet and the recipient — you don't get those hooks.

After a successful share, return to the originating screen with a `Shared` toast. After cancel (`failOnCancel: false`), do nothing — no toast, no error.

---

## 11. Offline behavior

Spec §6.9 lays out the UX. The implementation:

1. **Detection.** `@react-native-community/netinfo` listener sets `isConnected` in your state store.
2. **Banner.** A sticky top banner shows when offline. Dismissible (per session) but reappears on next route while still offline.
3. **Queued check.** If the user fills in a check while offline and taps "Check Eligibility":
   - Append the form payload to a local `outbox` (encrypted secure store).
   - Show a "Queued — will run when online" toast.
   - Result card moves to a "Queued" state (use the same shimmer treatment as `pending`, but with a clock icon and "Queued" copy).
4. **Drain on reconnect.** When `isConnected` flips to true, dequeue and run each pending check. Show a brief "✓ Back online — running queued checks…" banner replacement.
5. **Cache last result.** Cache the last 30 days of resolved checks locally so History has something offline. Encrypt at rest.

V1 doesn't need full offline-first sync — just enough to handle the hospital-basement case.

---

## 12. Tester round-1 lessons (worth internalizing)

We ran the live HTML prototype past testers and got 3 fixes back. Two of the three had the same root cause, and the lesson generalizes.

**The bugs.**
1. Cancel button "did nothing." 2. Share via… button "did nothing." 3. Action Needed result needed clearer "manual verification is needed" copy.

**Root cause** of bugs 1 + 2: a CSS rule (`.modal-root { pointer-events: none }`) intended to be paired with a `.modal-host` exception class that was never applied. Modal contents inherited the dead state, so neither button received clicks. Identical-looking bug, identical root cause.

**Why we didn't catch it earlier:** during development we tested modal logic by *calling functions directly* via the dev console, not by *clicking the actual buttons*. The buttons looked fine, the logic worked, but the input layer between user-finger-and-click-handler was broken.

**Takeaways for V1 build:**
- **Test with real touches, not function calls.** Maestro flow tests are cheap insurance. One "tap Cancel from share sheet" Maestro test would have caught both bugs immediately.
- **Be skeptical of "shouldn't matter" CSS-equivalent abstractions in RN.** `pointerEvents: 'none'` on Views, `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"` — these silently break interaction layers. Audit them when adding modals/overlays.
- **Action-Needed needs strong copy, not just a badge.** Marketers were unsure whether they should *act* or *wait* on Action Needed. The fix was a one-line "Manual verification is needed." pill under the badge. Keep that exact copy unless a tester tells you otherwise.

---

## 13. Open questions for the team

These need answers before or during the kickoff. Most are blocking on people outside this team.

| # | Question | Owner | Blocks |
|---|---|---|---|
| 1 | **Backend API contract.** What's the exact request/response shape for the eligibility-check endpoint? In particular: how is the result evidence structured (matches our `plainEnglish` + `detailed` shape, or different)? What error codes for system-error vs payer-rejection? | Backend team | Live result card, result detail screen |
| 2 | **Entra app registration details.** Tenant ID, Client ID, redirect URIs configured. | Customer IT | Sign-in screen (week 1) |
| 3 | **PDF service ownership.** Who's building the server-side PDF service? When? If not on the critical path, ship V1 with client-side `expo-print` and migrate later. | Backend team / product | PDF generation, share flow |
| 4 | **Notes persistence.** Local-only for V1, or backend-synced? If backend, what's the endpoint? | Product | Patient detail screen |
| 5 | **OCR for face-sheet capture.** Ship working OCR (Apple Vision / ML Kit) or stub w/ a "coming soon" toast? | Product | Photo-shortcut on new-check screen |
| 6 | **Per-agency theming.** V1 fixed Verify branding, V1.5+ per-agency colors/logos? Confirm so we can structure the theme provider correctly. | Product | Theme tokens module |
| 7 | **Audit logging requirements.** Does the mobile app need to emit specific events (check-run, check-shared, sign-in) to a logging endpoint? HIPAA audit trail expectations? | Compliance / agency | Network layer |
| 8 | **Analytics & telemetry.** Mixpanel / Amplitude / Segment / nothing for V1? | Product | Network layer |
| 9 | **Localization.** en-US only for V1 confirmed? | Product | i18n scaffolding |
| 10 | **Distribution.** TestFlight + Play internal for pilot, or production App Store from launch? Who owns the developer accounts? | Ops | Release plan |
| 11 | **Push notifications.** In scope for V1 (notification bell on home suggests yes) or V1.5? | Product | APNs / FCM setup |
| 12 | **Idle session timeout exact behavior.** 5min idle → biometric unlock — does this also clear the navigation stack, or just gate it behind unlock? | Product | Auto-lock implementation |
| 13 | **Real PHI in lower environments.** Are dev / staging using real or synthetic PHI? Affects what we can put in screenshots, debug logs, Sentry. | Compliance | Logging, error reporting |

**Recommendation:** book a 60-minute kickoff with backend, product, and customer IT. Walk through this table. Most of these have one-line answers; getting them in writing now saves a week of context-switching later.

---

## 14. Acceptance criteria — definition of done per screen

A screen is "done" when:

- [ ] Renders identically to the prototype on iPhone 14 + Pixel 7 reference devices.
- [ ] All design tokens come from the shared `tokens.ts` module — no inline hex values.
- [ ] All user-facing strings are wrapped in `t(...)` (even if there's no second locale yet).
- [ ] All tap targets are ≥44×44 pt.
- [ ] All interactive elements have `accessibilityRole` and `accessibilityLabel`.
- [ ] All status is conveyed by color **and** icon **and** text — never by color alone.
- [ ] Has at least one Maestro flow test that exercises the happy path.
- [ ] Loading, error, empty, and offline states are explicitly designed (or explicitly N/A — call it out).
- [ ] PII / PHI is not logged. Sensitive fields are not present in Sentry breadcrumbs / debug output.
- [ ] Screen is reachable from at least one entry point in production navigation (no orphans).

---

## 15. Weeks 1–2 suggested order of work

Optional, but if you're picking what to do first:

1. **Theme module + base components** (Button, Field, Badge, Card) — gates everything else.
2. **App shell + navigation** — bottom nav, sign-in route, biometric route, home route.
3. **Entra sign-in** — the moment you have tenant/client IDs from §13.2, build this and verify end-to-end. Don't let it slip to week 4.
4. **Home screen** — easy win, gives the team something to demo.
5. **New-check screen w/ adaptive form** — bulk of the work. Get the live-result UX right early.
6. **Result card variants** — straightforward once the new-check shell is in place.
7. **Result detail + Plain English / Detailed** — depends on backend response shape (§13.1).
8. **Share flow** — pre-share sheet → `react-native-share`. Defer real PDF integration if §13.3 is unanswered.
9. **History + patient detail** — straightforward, mostly list UI.
10. **Profile + offline + auto-lock** — polish week.

Plan for ~6 working weeks of one engineer, or ~3 weeks of two engineers in parallel, plus a week of QA and store submission.

---

*End of handoff. Ping me with anything ambiguous — easier to fix this doc than to debug a misunderstanding 4 weeks in.*
