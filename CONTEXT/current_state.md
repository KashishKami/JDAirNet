# Current State: JDAirNet Website Implementation Tracker

This is the live phase-by-phase build tracker. Always check this file FIRST before writing any code. Mark items `[/]` when starting, `[x]` when done. Do not skip to a later phase until all items in the current phase are complete.

**Last Updated:** 2026-09-11
**Current Active Phase:** Phase 0

---

## Legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Completed

---

## Phase 0 — Project Foundation & Quality Infrastructure
> Goal: A running Next.js project with all tooling configured, CI pipeline working, and zero code written for the actual website yet. Every quality gate must be GREEN before Phase 1 begins.

### P0.1 — Initialize Next.js Project

- [ ] Run `npx create-next-app@latest ./ --typescript --app --no-tailwind --no-src-dir --import-alias "@/*"` inside the project root
  - Ensure `src/` directory IS used: re-run with `--src-dir` flag if needed
  - Choose: TypeScript ✅, App Router ✅, No Tailwind ✅
- [ ] Verify `package.json` has correct project name (`jdairnet`)
- [ ] Delete auto-generated boilerplate (`src/app/page.tsx` content, `src/app/globals.css` content) — keep the files, just empty them
- [ ] Move `Hero.mp4` from project root into `public/` folder

### P0.2 — Configure `next.config.mjs`

- [ ] Set `output: process.env.NODE_ENV === 'production' ? 'export' : undefined`
- [ ] Set `trailingSlash: true`
- [ ] Set `images: { unoptimized: true }`
- [ ] Verify: `npm run build` produces an `out/` folder with `index.html` at root

### P0.3 — Environment Files

- [ ] Create `.env.example` with all required variables (no real values, just keys + comments)
- [ ] Create `.env.local` from `.env.example` — fill in dev values
- [ ] Create `.env.test` from `.env.example` — fill in test values
- [ ] Add `.env.local` and `.env.test` to `.gitignore` (keep `.env.example` tracked)
- [ ] Verify: `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3007` in both `.env.local` and `.env.test`

### P0.4 — Dev Server Port & Host

- [ ] Update `package.json` dev script: `"dev": "next dev -p 3007 -H 127.0.0.1"`
- [ ] Verify: `npm run dev` starts server at `http://127.0.0.1:3007`
- [ ] Verify: Navigating to `http://127.0.0.1:3007` shows the (empty) Next.js page without error

### P0.5 — ESLint Configuration

- [ ] Verify `next lint` runs without error on the boilerplate
- [ ] Add custom ESLint rules to `.eslintrc.json` (or `eslint.config.mjs`):
  - No `any` types (`@typescript-eslint/no-explicit-any: 'error'`)
  - Enforce `'use client'` directive presence check
- [ ] Add `"lint": "next lint"` and `"lint:fix": "next lint --fix"` to `package.json`
- [ ] Verify: `npm run lint` exits 0

### P0.6 — TypeScript Strict Mode

- [ ] Ensure `tsconfig.json` has `"strict": true`
- [ ] Add `"typecheck": "tsc --noEmit"` to `package.json`
- [ ] Verify: `npm run typecheck` exits 0 on the boilerplate

### P0.7 — Vitest Unit Testing Setup

- [ ] Install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
- [ ] Create `vitest.config.ts` at project root (see `local_setup.md` for exact config)
- [ ] Create `src/tests/setup.ts` — import `@testing-library/jest-dom/vitest`
- [ ] Add scripts to `package.json`:
  ```json
  "test:unit": "vitest run",
  "test:unit:watch": "vitest",
  "test:unit:ui": "vitest --ui"
  ```
- [ ] Create a smoke test `src/tests/smoke.test.ts`:
  ```typescript
  // Loads .env.test — verify NEXT_PUBLIC_SITE_URL is set
  test('env is loaded', () => {
    expect(process.env.NEXT_PUBLIC_SITE_URL).toBe('http://127.0.0.1:3007')
  })
  ```
- [ ] Verify: `npm run test:unit` exits 0 and the smoke test passes

### P0.8 — Playwright E2E Testing Setup

- [ ] Install: `npm install -D @playwright/test dotenv`
- [ ] Run: `npx playwright install` (installs Chromium, Firefox, WebKit)
- [ ] Create `playwright.config.ts` at project root (see `local_setup.md` for exact config)
- [ ] Create `tests/` directory at project root
- [ ] Create `tests/smoke.spec.ts`:
  ```typescript
  import { test, expect } from '@playwright/test'
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/JDAirNet/)
  })
  ```
- [ ] Add scripts to `package.json`:
  ```json
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
  ```
- [ ] Verify: `npm run test:e2e` runs against `http://127.0.0.1:3007` (dev server starts automatically)

### P0.9 — Combined CI Quality Command

- [ ] Add to `package.json`:
  ```json
  "ci:quality": "npm run lint && npm run typecheck && npm run test:unit && npm run test:e2e"
  ```
- [ ] Add `"serve": "npx serve out"` for post-build preview
- [ ] Verify: `npm run ci:quality` exits 0 (all gates pass on clean boilerplate)

### P0.10 — GitHub Actions CI Pipeline

- [ ] Create `.github/workflows/ci.yml`
- [ ] Pipeline structure (individual steps — NOT calling `ci:quality`):
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    quality:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: '20', cache: 'npm' }
        - run: npm ci
        - name: Lint
          run: npm run lint
        - name: Type Check
          run: npm run typecheck
        - name: Unit Tests
          run: npm run test:unit
        - name: Install Playwright Browsers
          run: npx playwright install --with-deps chromium
        - name: E2E Tests
          run: npm run test:e2e
        - name: Build (Static Export)
          run: npm run build
  ```
- [ ] Push to GitHub and verify all steps appear individually in the Actions tab
- [ ] Verify all steps show green ✅ on a clean push

### P0.11 — Git Setup & Initial Commit

- [ ] Verify `.gitignore` includes: `.next/`, `out/`, `node_modules/`, `.env.local`, `.env.test`, `playwright-report/`, `test-results/`
- [ ] Initial commit: `git commit -m "chore: Phase 0 — project foundation and quality infrastructure"`
- [ ] Push to GitHub

**✅ Phase 0 DONE when:** All checkboxes above are checked AND `npm run ci:quality` exits 0 AND GitHub Actions shows green on all individual steps.

---

## Phase 1 — SEO Foundation & Global Layout
> Goal: Root layout, fonts, global CSS tokens, sitemap.ts, robots.ts, schemaGenerators.ts, Navbar, Footer, ContactBar — all wired up and SEO-verified. No page content yet.

- [ ] **P1.1** — `src/styles/globals.css` — CSS custom properties (colors, fonts, spacing, breakpoints)
- [ ] **P1.2** — `src/app/layout.tsx` — Fonts (Unbounded, Kanit, Poppins via `next/font`), root metadata, GA script placeholder, `<JsonLd>` for Organization schema
- [ ] **P1.3** — `src/lib/schemaGenerators.ts` — All schema generator functions (Organization, LocalBusiness, Service, FAQ, Article, Breadcrumb)
- [ ] **P1.4** — `src/components/seo/JsonLd.tsx` — Injects `<script type="application/ld+json">`
- [ ] **P1.5** — `src/data/contact.ts` — CONTACT_INFO constant (phone, WhatsApp, email, address)
- [ ] **P1.6** — `src/data/plans.ts` — BROADBAND_PLANS array (all 4 tiers with correct data)
- [ ] **P1.7** — `src/data/leaseLines.ts` — LEASE_LINE_FEATURES and USE_CASES arrays
- [ ] **P1.8** — `src/data/faqs.ts` — FAQ items for home page
- [ ] **P1.9** — `src/app/sitemap.ts` — All 8 pages + blog gated by `NEXT_PUBLIC_BLOG_ENABLED`
- [ ] **P1.10** — `src/app/robots.ts` — Allow all, disallow `/api/`, point to sitemap URL
- [ ] **P1.11** — `src/components/layout/Navbar.tsx` — Logo left, nav links center, phone CTA right. Mobile: hamburger menu.
- [ ] **P1.12** — `src/components/layout/Footer.tsx` — Links, contact info, WhatsApp link, copyright
- [ ] **P1.13** — `src/components/ui/ContactBar.tsx` — Sticky bottom mobile bar (Call / WhatsApp / Form)
- [ ] **P1.14** — Unit tests for `schemaGenerators.ts` functions
- [ ] **P1.15** — Unit tests for `plans.ts` data integrity (all 4 plans have required fields)
- [ ] **P1.16** — E2E test: Navbar renders on all pages, mobile hamburger opens, phone CTA links to `tel:`
- [ ] **P1.17** — Verify `npm run build` produces correct `sitemap.xml` and `robots.txt` in `out/`

---

## Phase 2 — Home Page
> Goal: Complete home page with all sections, pixel-matching the TelNet Home 08 hero, mobile-first throughout.

---

#### W-201 — Hero Section (Video Background + Overlay Card)

**Root cause:** The hero is the first thing every visitor sees. It must immediately communicate "fast internet" and drive users toward a CTA. The TelNet Home 08 design uses a full-screen video with a rounded card overlay — this exact treatment must be reproduced.

**Goal:** A full-screen video hero renders on the home page with the `Hero.mp4` playing, the city skyline visible, the rounded overlay card containing the H1, subtext, and two CTAs ("View Plans" + "Call Now"). On mobile, the poster image shows immediately.

**Approach:** `HeroSection.tsx` as a Client Component (for video events). `<video>` tag with `autoPlay muted loop playsInline poster="/hero-poster.jpg"`. Overlay card uses absolute positioning centered in the viewport. CSS uses `clamp()` for all font sizes and `--space-card` for padding.

---

- [ ] **RED — Component Test (`src/tests/HeroSection.test.tsx`):**
  - [ ] Test: Render `<HeroSection />` — assert `<video>` element is present with `autoPlay`, `muted`, `loop`, `playsInline` attributes set
  - [ ] Test: Assert `poster` attribute equals `/hero-poster.jpg`
  - [ ] Test: Assert H1 text is present and non-empty
  - [ ] Test: Assert "View Plans" link points to `/plans/`
  - [ ] Test: Assert "Call Now" link starts with `tel:`
  - [ ] **Run — confirm RED (component file doesn't exist yet)**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/components/sections/HeroSection.tsx` with video + overlay card
  - [ ] Create `src/components/sections/HeroSection.module.css` using CSS tokens from `globals.css`
  - [ ] Ensure `--font-display` used for H1, `--space-card` for card padding
  - [ ] Run component test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Dev server running — navigate to `http://127.0.0.1:3007/`
  - [ ] Desktop: video plays, city skyline visible, purple/pink gradient sky, rounded card centered
  - [ ] Card shows: badge pill → H1 → subtext → "View Plans" button → "Call Now" button
  - [ ] Mobile (375px DevTools): poster image shows, card fits without horizontal scroll, H1 ≤ 3 lines
  - [ ] Tap "View Plans" → navigates to `/plans/`
  - [ ] Tap "Call Now" → opens phone dialer
  - [ ] ✅ Done

---

#### W-202 — Home Page Metadata & JSON-LD

**Root cause:** Without per-page metadata, every page shows the same title and description in Google — killing SEO differentiation. The home page also needs FAQPage and WebPage schemas to qualify for rich results.

**Goal:** The home page `<head>` contains unique title, description, Open Graph tags, canonical URL, and inline JSON-LD scripts for `WebPage` and `FAQPage` schemas.

**Approach:** Export `metadata` object from `src/app/page.tsx`. Inject `<JsonLd>` components for WebPage and FAQPage schemas using functions from `schemaGenerators.ts`.

---

- [ ] **RED — Unit Test (`src/tests/schemaGenerators.test.ts`):**
  - [ ] Test: `generateWebPageSchema({ type: 'WebPage', ... })` returns object with `@type: 'WebPage'` and correct `url`
  - [ ] Test: `generateFAQSchema(faqs)` returns object with `@type: 'FAQPage'` and `mainEntity` array of correct length
  - [ ] **Run — confirm RED (functions don't exist yet in schemaGenerators.ts)**

- [ ] **GREEN — Implementation:**
  - [ ] Add `generateWebPageSchema()` to `src/lib/schemaGenerators.ts`
  - [ ] Add `generateFAQSchema()` to `src/lib/schemaGenerators.ts` (if not done in Phase 1)
  - [ ] Export `metadata` from `src/app/page.tsx` with title, description, OG, canonical
  - [ ] Inject `<JsonLd data={generateWebPageSchema(...)} />` and `<JsonLd data={generateFAQSchema(FAQS)} />` in page body
  - [ ] Run unit tests — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] `npm run build` → open `out/index.html` → inspect `<head>` for `<title>`, `<meta name="description">`, `<link rel="canonical">`
  - [ ] Inspect `<script type="application/ld+json">` blocks — verify WebPage and FAQPage JSON is valid
  - [ ] Paste page URL into [Google Rich Results Test](https://search.google.com/test/rich-results) → FAQPage detected ✅
  - [ ] ✅ Done

---

#### W-203 — Plans Preview Section (Home Page)

**Root cause:** Visitors need to see pricing options on the home page without navigating away. A 3-card preview (showing the 3 middle plans) with a "See All Plans" link converts browsers into clicks.

**Goal:** A plans preview section on the home page shows 3 plan cards from `BROADBAND_PLANS` data. Each card shows speed, price, and key features. "Most Popular" plan is visually highlighted.

**Approach:** Reuse `PlanCard.tsx` component (built in Phase 3). On home page, display plans at index 1, 2, 3 (skip the cheapest starter). CTA below links to `/plans/`.

---

- [ ] **RED — Component Test (`src/tests/PlansPreview.test.tsx`):**
  - [ ] Test: Render `<PlansPreview />` — assert exactly 3 plan cards render
  - [ ] Test: Assert the "Most Popular" badge is visible on the highlighted plan
  - [ ] Test: Assert "See All Plans" link points to `/plans/`
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/components/sections/PlansPreview.tsx` consuming `BROADBAND_PLANS` slice
  - [ ] Create `src/components/sections/PlansPreview.module.css` using `--plans-grid` layout tokens
  - [ ] Run component test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Home page renders 3 plan cards in a responsive grid
  - [ ] At 375px: cards stack in 1 column, no horizontal scroll
  - [ ] At 768px: 3 cards side by side
  - [ ] "Most Popular" card is elevated (border or scale treatment)
  - [ ] "See All Plans →" button visible and navigates to `/plans/`
  - [ ] ✅ Done

---

#### W-204 — Why Us Section + FAQ Section

**Root cause:** Trust signals ("Why JDAirNet?") reduce bounce rate. FAQs answer common objections before the user has to call.

**Goal:** A "Why Us" section with 4–6 feature icons and a FAQ accordion section with 5–7 questions. FAQ data comes from `src/data/faqs.ts`.

**Approach:** `WhyUsSection.tsx` with icon + label + description grid. `FaqSection.tsx` with a CSS-only accordion (no JS library) for performance.

---

- [ ] **RED — Component Test (`src/tests/FaqSection.test.tsx`):**
  - [ ] Test: Render `<FaqSection />` — assert correct number of FAQ items rendered
  - [ ] Test: Assert each question text is present in the DOM
  - [ ] Test: Assert answer is initially hidden (aria-expanded="false" or similar)
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/data/faqs.ts` with 6 FAQ entries (if not done in Phase 1)
  - [ ] Create `src/components/sections/WhyUsSection.tsx` + `.module.css`
  - [ ] Create `src/components/sections/FaqSection.tsx` + `.module.css`
  - [ ] Run component test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Why Us section renders 4–6 feature blocks in a responsive grid
  - [ ] FAQ section shows question list — click a question → answer expands
  - [ ] At 375px: FAQ items are full width, text doesn't overflow
  - [ ] ✅ Done

---

#### W-205 — Home Page E2E Test

- [ ] **E2E (`tests/home.spec.ts`):**
  - [ ] Test: Navigate to `/` — page title matches `JDAirNet`
  - [ ] Test: `<video>` element is present in the DOM
  - [ ] Test: H1 is visible and non-empty
  - [ ] Test: "View Plans" link is visible and href is `/plans/`
  - [ ] Test: "Call Now" link has `href` starting with `tel:`
  - [ ] Test (mobile 375px viewport): Sticky ContactBar is visible at bottom of page
  - [ ] Test (mobile 375px viewport): No horizontal scroll (`document.body.scrollWidth <= window.innerWidth`)
  - [ ] **Run `npm run test:e2e` — confirm all pass**

---

## Phase 3 — Plans Page (`/plans/`)
> Goal: Full pricing table with all 4 broadband tiers, GST note, add-ons section, and schemas.

---

#### W-301 — PlanCard Component

**Root cause:** Plan cards are the highest-conversion UI element on the site. They need a consistent, reusable component that scales correctly from 375px to 1440px.

**Goal:** A `PlanCard` component renders a single broadband plan with speed, price, features list, badge (if highlighted), and a CTA button linking to phone/WhatsApp.

**Approach:** Pure presentational component driven by `BroadbandPlan` type from `src/data/plans.ts`. Highlighted plan gets a visual elevation treatment (border accent + scale on desktop only).

---

- [ ] **RED — Component Test (`src/tests/PlanCard.test.tsx`):**
  - [ ] Test: Render `<PlanCard plan={BROADBAND_PLANS[0]} />` — assert plan name is visible
  - [ ] Test: Assert speed is displayed
  - [ ] Test: Assert all features in the plan's `features` array are rendered
  - [ ] Test: Assert "Most Popular" badge NOT rendered when `highlighted: false`
  - [ ] Test: Render with `highlighted: true` — assert badge IS rendered
  - [ ] Test: CTA button has `href` starting with `tel:` or `https://wa.me/`
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/types/index.ts` with `BroadbandPlan` interface
  - [ ] Create `src/components/ui/PlanCard.tsx` + `.module.css`
  - [ ] Ensure card uses `var(--space-card)`, `var(--font-h3)` for plan name, `var(--font-h2)` for price
  - [ ] Desktop-only scale: `.planCard--highlighted { transform: scale(1.04); }` inside `@media (min-width: 1024px)`
  - [ ] Run component test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Render all 4 plan cards side by side at 1024px — highlighted card is visually elevated
  - [ ] At 600px: 2 columns, cards equal height
  - [ ] At 375px: 1 column, highlighted card does NOT scale (correct — scale only on desktop)
  - [ ] ✅ Done

---

#### W-302 — Plans Page Layout & Schema

**Root cause:** The plans page is the primary conversion page — it must render the full pricing table with all 4 tiers, GST disclaimer, add-ons, and proper SEO schemas.

**Goal:** `/plans/` renders all 4 plan cards, GST note, add-ons section, and injects `Service` schema + `ItemList` schema.

---

- [ ] **RED — Unit Test:**
  - [ ] Test: `generatePlansItemListSchema(BROADBAND_PLANS)` returns `@type: 'ItemList'` with `numberOfItems: 4`
  - [ ] Test: Each item in `itemListElement` has `position`, `item.name`, `item.offers.price`
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Add `generatePlansItemListSchema()` to `schemaGenerators.ts`
  - [ ] Create `src/app/plans/page.tsx` with `metadata` export + 4 plan cards grid + GST note
  - [ ] Inject `<JsonLd>` for `Service` schema and `ItemList` schema
  - [ ] Add-ons section below the plans grid
  - [ ] Run unit test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Navigate to `/plans/` — all 4 plan cards visible
  - [ ] GST disclaimer visible below grid ("All prices exclude 18% GST")
  - [ ] At 375px: 1 column, stacked cards, no horizontal scroll
  - [ ] At 1024px: 4 columns, highlighted card elevated
  - [ ] Build `out/plans/index.html` — JSON-LD for ItemList present in `<head>`
  - [ ] ✅ Done

---

#### W-303 — Plans E2E Test

- [ ] **E2E (`tests/plans.spec.ts`):**
  - [ ] Test: Navigate to `/plans/` — 4 plan cards render
  - [ ] Test: "Most Popular" badge is visible on exactly 1 card
  - [ ] Test: No plan card has an empty price (data integrity)
  - [ ] Test: All CTA buttons have `href` starting with `tel:` or `https://wa.me/`
  - [ ] Test (mobile 375px): 1 column layout, no horizontal scroll
  - [ ] **Run `npm run test:e2e` — confirm all pass**

---

## Phase 4 — Lease Lines Page (`/lease-lines/`)
> Goal: Enterprise page with features, use cases, and quote CTA. Zero pricing.

---

#### W-401 — Lease Lines Page

**Root cause:** Enterprise clients need a dedicated page explaining the benefits of a dedicated line. Pricing must NOT appear — enterprise deals are custom quotes only. The page must have its own `Service` schema with no price data.

**Goal:** `/lease-lines/` renders with H1, 6 feature blocks, use-case chips, and a "Request a Quote" button that links to `/contact/`. No price anywhere on the page.

---

- [ ] **RED — Component + E2E Test:**
  - [ ] Unit test: `generateServiceSchema({ name: 'Enterprise Lease Line', ... })` — assert `@type: 'Service'`, assert no `offers` key (no pricing)
  - [ ] E2E test: Navigate to `/lease-lines/` — assert NO element contains `₹` or `price` text
  - [ ] E2E test: "Request a Quote" button is visible and links to `/contact/`
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/app/lease-lines/page.tsx` with metadata + hero H1 + features grid + use cases + CTA
  - [ ] Create `src/data/leaseLines.ts` with `LEASE_LINE_FEATURES` (if not done in Phase 1)
  - [ ] Inject `<JsonLd>` for `Service` schema (lease line) and `BreadcrumbList`
  - [ ] Run tests — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Navigate to `/lease-lines/` — H1 is "Enterprise Internet Lease Lines" (or similar)
  - [ ] 6 feature blocks visible in a responsive grid
  - [ ] No price text anywhere on page
  - [ ] "Request a Quote" button links to `/contact/`
  - [ ] At 375px: features stack in 1 column, no horizontal scroll
  - [ ] Breadcrumb schema visible in page source: Home > Lease Lines
  - [ ] ✅ Done

---

## Phase 5 — Coverage, About, Contact Pages

---

#### W-501 — Coverage Page (`/coverage/`)

**Root cause:** Prospective customers need to know if their area is served before they call.

**Goal:** `/coverage/` explains the service area in text, provides a feasibility contact CTA, and has `WebPage` + `BreadcrumbList` schemas.

---

- [ ] **RED — E2E Test (`tests/coverage.spec.ts`):**
  - [ ] Test: Navigate to `/coverage/` — page title includes "Coverage"
  - [ ] Test: At least one CTA linking to `/contact/` or `tel:` is present
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/app/coverage/page.tsx` with metadata + content + CTAs + `<JsonLd>`
  - [ ] Run E2E test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Navigate to `/coverage/` — content about service areas renders
  - [ ] Contact/feasibility CTA visible
  - [ ] ✅ Done

---

#### W-502 — About Page (`/about/`)

**Root cause:** Trust is built through story. An About page humanizes the brand for both residential and business customers.

**Goal:** `/about/` renders with company story, values, and an `AboutPage` + `BreadcrumbList` schema.

---

- [ ] **RED — Unit Test:**
  - [ ] Test: `generateWebPageSchema({ type: 'AboutPage', ... })` — assert `@type: 'AboutPage'`
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/app/about/page.tsx` with metadata + content + `<JsonLd>`
  - [ ] Run unit test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Navigate to `/about/` — content renders correctly at all viewports
  - [ ] ✅ Done

---

#### W-503 — Contact Page & Form (`/contact/`)

**Root cause:** The contact page is where all three channels converge. The form is the primary backend-touching element — it must submit to `contact.php` and show success/error feedback.

**Goal:** `/contact/` renders all 3 contact channels (call, WhatsApp, form) prominently. The form submits via `fetch('/contact.php')` and shows a success message on completion or an error message on failure.

**Approach:** `ContactForm.tsx` as a Client Component with `useState` for form fields and submission state. Playwright E2E test mocks the `/contact.php` POST endpoint using `page.route()`.

---

- [ ] **RED — Component Test (`src/tests/ContactForm.test.tsx`):**
  - [ ] Test: Render `<ContactForm />` — assert name, email, phone, message fields present
  - [ ] Test: Submit with empty fields — assert error state (form does not submit)
  - [ ] Test: Submit with valid data — mock `fetch` to return `{success: true}` — assert success message renders
  - [ ] Test: Submit with valid data — mock `fetch` to return `{success: false}` — assert error message renders
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/components/ui/ContactForm.tsx` (Client Component) with form state + fetch + success/error UI
  - [ ] Create `contact.php` (saved in project root as `contact.php`, deployed to Hostinger separately)
  - [ ] Create `src/app/contact/page.tsx` with metadata, all 3 channels, `<ContactForm />`, `LocalBusiness` schema, `ContactPage` schema
  - [ ] Run component tests — **confirm GREEN**

- [ ] **GREEN — E2E Test (`tests/contact.spec.ts`):**
  - [ ] Mock `POST /contact.php` to return `{success: true}` using `page.route()`
  - [ ] Test: Fill form fields → submit → success message appears
  - [ ] Test: Phone CTA visible and has `href` starting with `tel:`
  - [ ] Test: WhatsApp CTA visible and has `href` starting with `https://wa.me/`
  - [ ] Run E2E test — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] Navigate to `/contact/` — 3 contact channels displayed prominently
  - [ ] Fill form → submit → success message appears
  - [ ] On mobile: all 3 CTAs are tappable (44px+ touch targets)
  - [ ] ✅ Done

---

#### W-504 — Legal Pages & Custom 404

- [ ] **RED — E2E Test:**
  - [ ] Test: Navigate to `/privacy-policy/` — page renders, title contains "Privacy"
  - [ ] Test: Navigate to `/terms-of-service/` — page renders
  - [ ] Test: Navigate to `/this-does-not-exist/` — 404 page renders, contains link back to home
  - [ ] **Run — confirm RED**

- [ ] **GREEN — Implementation:**
  - [ ] Create `src/app/privacy-policy/page.tsx` with basic legal content + metadata
  - [ ] Create `src/app/terms-of-service/page.tsx` with basic legal content + metadata
  - [ ] Create `src/app/not-found.tsx` with branded 404 design + "Go Home" CTA
  - [ ] Run E2E tests — **confirm GREEN**

- [ ] **Verification chain:**
  - [ ] `/privacy-policy/` renders — breadcrumb shows Home > Privacy Policy
  - [ ] Navigate to a non-existent URL — custom 404 page shows (Apache serves `/404/index.html` per `.htaccess` `ErrorDocument 404` rule)
  - [ ] "Go Home" CTA on 404 page navigates to `/`
  - [ ] ✅ Done

---

## Phase 6 — Polish, Performance & Pre-Launch

---

#### W-601 — Hero Poster Image

- [ ] **Root cause:** iOS Safari will not autoplay video without `muted + playsInline`. Even with both set, slow connections on mobile need an instant visual. The poster image is the fallback.
- [ ] Extract still frame: `ffmpeg -i Hero.mp4 -ss 00:00:02 -frames:v 1 public/hero-poster.jpg`
- [ ] Verify `hero-poster.jpg` is visually compelling (good frame of the city skyline)
- [ ] Verify `poster="/hero-poster.jpg"` is set on the `<video>` tag

---

#### W-602 — Open Graph Image

- [ ] **Root cause:** When the site is shared on WhatsApp, LinkedIn, or Twitter, the OG image is what people see. A bad/missing OG image kills shareability.
- [ ] Create `public/og-image.jpg` — 1200×630px — branded JDAirNet graphic with logo + tagline
- [ ] Verify all pages reference this in their `openGraph.images` metadata

---

#### W-603 — Mobile Audit (Every Page)

- [ ] For EACH page, open Chrome DevTools → set viewport to 375px width:
  - [ ] No horizontal scroll
  - [ ] All text readable (min ~12px)
  - [ ] All CTAs ≥ 44px touch target
  - [ ] Cards don't overflow their grid
  - [ ] Plan card badge doesn't clip
  - [ ] Hero H1 ≤ 3 lines
  - [ ] Sticky ContactBar doesn't obscure content (body has enough `padding-bottom`)

---

#### W-604 — SEO Validation

- [ ] **Sitemap validation:** After `npm run build`, open `out/sitemap.xml` — verify all pages listed with correct URLs and trailing slashes
- [ ] **Robots validation:** Open `out/robots.txt` — verify `Sitemap:` line points to the real domain
- [ ] **JSON-LD validation:** For each page, run through [Google Rich Results Test](https://search.google.com/test/rich-results)
  - [ ] Home: FAQPage detected ✅
  - [ ] Plans: ItemList or Service detected ✅
  - [ ] Contact: LocalBusiness detected ✅
- [ ] **Core Web Vitals:** Run `npm run build && npm run serve`, then run Lighthouse on `http://127.0.0.1:3000` — target LCP < 2.5s, CLS < 0.1

---

#### W-605 — Final CI Gate & Build

- [ ] Run `npm run ci:quality` — all steps GREEN
- [ ] Run `npm run build` — `out/` folder generates without errors or warnings
- [ ] Run `npm run serve` — manually QA every page one final time
- [ ] Tag release: `git tag v1.0.0` and push
- [ ] Deploy to Hostinger (see `deployment_guide.md`)
- [ ] Complete post-deployment verification checklist in `deployment_guide.md`

---

## Phase 7 — Blog (Future — Not Started)
> Blocked until SEO team is ready and domain has established traffic.

- [ ] Set `NEXT_PUBLIC_BLOG_ENABLED=true` in Hostinger environment / rebuild
- [ ] Create `src/app/blog/page.tsx` — Blog hub with category filter
- [ ] Create `src/app/blog/[slug]/page.tsx` — Blog post with `generateArticleSchema()`
- [ ] Create `src/data/blogCategories.ts`
- [ ] Add dynamic blog routes to `sitemap.ts`
- [ ] Connect headless CMS (Sanity.io recommended — generous free tier)
- [ ] Write RED→GREEN tests for blog post rendering and schema generation

---

## Summary

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Project Foundation & Quality Infrastructure | 🔴 NOT STARTED |
| Phase 1 | SEO Foundation & Global Layout | ⏸️ BLOCKED (needs P0) |
| Phase 2 | Home Page | ⏸️ BLOCKED |
| Phase 3 | Plans Page | ⏸️ BLOCKED |
| Phase 4 | Lease Lines Page | ⏸️ BLOCKED |
| Phase 5 | Coverage, About, Contact Pages | ⏸️ BLOCKED |
| Phase 6 | Polish, Performance & Pre-Launch | ⏸️ BLOCKED |
| Phase 7 | Blog | 🔵 FUTURE |
