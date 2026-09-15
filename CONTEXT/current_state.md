# Current State: JDAirNet Website Implementation Tracker

This is the live phase-by-phase build tracker. Always check this file FIRST before writing any code. Mark items `[/]` when starting, `[x]` when done. Do not skip to a later phase until all items in the current phase are complete.

**Last Updated:** 2026-09-15
**Current Active Phase:** Phase 6 (Polish, Performance & Pre-Launch)


---

## Legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Completed

---

## Phase 0 — Project Foundation & Quality Infrastructure
> Goal: A running Next.js project with all tooling configured, CI pipeline working, and zero code written for the actual website yet. Every quality gate must be GREEN before Phase 1 begins.

### P0.1 — Initialize Next.js Project

- [x] Run `npx create-next-app@latest ./ --typescript --app --no-tailwind --no-src-dir --import-alias "@/*"` inside the project root
  - Ensure `src/` directory IS used: re-run with `--src-dir` flag if needed
  - Choose: TypeScript ✅, App Router ✅, No Tailwind ✅
- [x] Verify `package.json` has correct project name (`jdairnet`)
- [x] Delete auto-generated boilerplate (`src/app/page.tsx` content, `src/app/globals.css` content) — keep the files, just empty them
- [x] Move `Hero.mp4` from project root into `public/` folder

### P0.2 — Configure `next.config.mjs`

- [x] Set `output: process.env.NODE_ENV === 'production' ? 'export' : undefined`
- [x] Set `trailingSlash: true`
- [x] Set `images: { unoptimized: true }`
- [x] Verify: `npm run build` produces an `out/` folder with `index.html` at root

### P0.3 — Environment Files

- [x] Create `.env.example` with all required variables (no real values, just keys + comments)
- [x] Create `.env.local` from `.env.example` — fill in dev values
- [x] Create `.env.test` from `.env.example` — fill in test values
- [x] Add `.env.local` and `.env.test` to `.gitignore` (keep `.env.example` tracked)
- [x] Verify: `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3007` in both `.env.local` and `.env.test`

### P0.4 — Dev Server Port & Host

- [x] Update `package.json` dev script: `"dev": "next dev -p 3007 -H 127.0.0.1"`
- [x] Verify: `npm run dev` starts server at `http://127.0.0.1:3007`
- [x] Verify: Navigating to `http://127.0.0.1:3007` shows the (empty) Next.js page without error

### P0.5 — ESLint Configuration

- [x] Verify `next lint` runs without error on the boilerplate
- [x] Add custom ESLint rules to `.eslintrc.json` (or `eslint.config.mjs`):
  - No `any` types (`@typescript-eslint/no-explicit-any: 'error'`)
  - Enforce `'use client'` directive presence check
- [x] Add `"lint": "next lint"` and `"lint:fix": "next lint --fix"` to `package.json`
- [x] Verify: `npm run lint` exits 0

### P0.6 — TypeScript Strict Mode

- [x] Ensure `tsconfig.json` has `"strict": true`
- [x] Add `"typecheck": "tsc --noEmit"` to `package.json`
- [x] Verify: `npm run typecheck` exits 0 on the boilerplate

### P0.7 — Vitest Unit Testing Setup

- [x] Install: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
- [x] Create `vitest.config.ts` at project root (see `local_setup.md` for exact config)
- [x] Create `src/tests/setup.ts` — import `@testing-library/jest-dom/vitest`
- [x] Add scripts to `package.json`:
  ```json
  "test:unit": "vitest run",
  "test:unit:watch": "vitest",
  "test:unit:ui": "vitest --ui"
  ```
- [x] Create a smoke test `src/tests/smoke.test.ts`:
  ```typescript
  // Loads .env.test — verify NEXT_PUBLIC_SITE_URL is set
  test('env is loaded', () => {
    expect(process.env.NEXT_PUBLIC_SITE_URL).toBe('http://127.0.0.1:3007')
  })
  ```
- [x] Verify: `npm run test:unit` exits 0 and the smoke test passes

### P0.8 — Playwright E2E Testing Setup

- [x] Install: `npm install -D @playwright/test dotenv`
- [x] Run: `npx playwright install` (installs Chromium, Firefox, WebKit)
- [x] Create `playwright.config.ts` at project root (see `local_setup.md` for exact config)
- [x] Create `tests/` directory at project root
- [x] Create `tests/smoke.spec.ts`:
  ```typescript
  import { test, expect } from '@playwright/test'
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/JDAirNet/)
  })
  ```
- [x] Add scripts to `package.json`:
  ```json
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:report": "playwright show-report"
  ```
- [x] Verify: `npm run test:e2e` runs against `http://127.0.0.1:3007` (dev server starts automatically)

### P0.9 — Combined CI Quality Command

- [x] Add to `package.json`:
  ```json
  "ci:quality": "npm run lint && npm run typecheck && npm run test:unit && npm run test:e2e"
  ```
- [x] Add `"serve": "npx serve out"` for post-build preview
- [x] Verify: `npm run ci:quality` exits 0 (all gates pass on clean boilerplate)

### P0.10 — GitHub Actions CI Pipeline

- [x] Create `.github/workflows/ci.yml`
- [x] Pipeline structure (individual steps — NOT calling `ci:quality`):
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
- [x] Push to GitHub and verify all steps appear individually in the Actions tab
- [x] Verify all steps show green ✅ on a clean push

### P0.11 — Git Setup & Initial Commit

- [x] Verify `.gitignore` includes: `.next/`, `out/`, `node_modules/`, `.env.local`, `.env.test`, `playwright-report/`, `test-results/`
- [x] Initial commit: `git commit -m "chore: Phase 0 — project foundation and quality infrastructure"`
- [x] Push to GitHub

**✅ Phase 0 DONE when:** All checkboxes above are checked AND `npm run ci:quality` exits 0 AND GitHub Actions shows green on all individual steps.

### Session Note — Phase 0 Completion (2026-09-12)

- **Completed Phase 0 Setup & Tooling Infrastructure:**
  - **Next.js & Structure:** Configured Next.js 15 App Router (`src/` dir), TypeScript strict mode, and Vanilla CSS.
  - **Static Export Config:** Configured `next.config.mjs` for production static export (`output: 'export'`), `trailingSlash: true` (clean `/slug/index.html` structure), and `images: { unoptimized: true }`.
  - **Environment & Assets:** Set up `.env.example`, `.env.local`, and `.env.test` pointing to `http://127.0.0.1:3007` (domain: `jdairnet.com`). Moved `Hero.mp4` to `public/Hero.mp4`.
  - **Code Quality Gates:** Configured ESLint with `@typescript-eslint` rules; `npm run lint` and `npm run typecheck` pass with 0 errors.
  - **Testing Infrastructure:**
    - **Unit Tests (Vitest):** Configured `vitest.config.ts`, `src/tests/setup.ts`, and smoke test `src/tests/smoke.test.ts` (100% pass).
    - **E2E Tests (Playwright):** Configured `playwright.config.ts`, installed Chromium & WebKit binaries, and verified `tests/smoke.spec.ts` passing on Chromium, Mobile Chrome (Pixel 5), and Mobile Safari (iPhone 12).
  - **Production Build:** Verified `npm run build` static export to `out/` directory.
  - **CI/CD:** Created `.github/workflows/ci.yml` with isolated quality gates (Lint, Type Check, Unit Tests, Playwright E2E, Static Build) and local runner `npm run ci:quality`.
  - **Git Status:** Committed (`chore: Phase 0 — project foundation and quality infrastructure`) and pushed to `main` branch (`c9f0d24`).

---

## Phase 1 — SEO Foundation & Global Layout
> Goal: Root layout, fonts, global CSS tokens, sitemap.ts, robots.ts, schemaGenerators.ts, Navbar, Footer, ContactBar — all wired up and SEO-verified. No page content yet.

- [x] **P1.1** — `src/styles/globals.css` — CSS custom properties (colors, fonts, spacing, breakpoints)
- [x] **P1.2** — `src/app/layout.tsx` — Fonts (Unbounded, Kanit, Poppins via `next/font`), root metadata, GA script placeholder, `<JsonLd>` for Organization schema
- [x] **P1.3** — `src/lib/schemaGenerators.ts` — All schema generator functions (Organization, LocalBusiness, Service, FAQ, Article, Breadcrumb)
- [x] **P1.4** — `src/components/seo/JsonLd.tsx` — Injects `<script type="application/ld+json">`
- [x] **P1.5** — `src/data/contact.ts` — CONTACT_INFO constant (phone, WhatsApp, email, address)
- [x] **P1.6** — `src/data/plans.ts` — BROADBAND_PLANS array (all 4 tiers with correct data)
- [x] **P1.7** — `src/data/leaseLines.ts` — LEASE_LINE_FEATURES and USE_CASES arrays
- [x] **P1.8** — `src/data/faqs.ts` — FAQ items for home page
- [x] **P1.9** — `src/app/sitemap.ts` — All 8 pages + blog gated by `NEXT_PUBLIC_BLOG_ENABLED`
- [x] **P1.10** — `src/app/robots.ts` — Allow all, disallow `/api/`, point to sitemap URL
- [x] **P1.11** — `src/components/layout/Navbar.tsx` — Logo left, nav links center, phone CTA right. Mobile: hamburger menu.
- [x] **P1.12** — `src/components/layout/Footer.tsx` — Links, contact info, WhatsApp link, copyright
- [x] **P1.13** — `src/components/ui/ContactBar.tsx` — Sticky bottom mobile bar (Call / WhatsApp / Form)
- [x] **P1.14** — Unit tests for `schemaGenerators.ts` functions
- [x] **P1.15** — Unit tests for `plans.ts` data integrity (all 4 plans have required fields)
- [x] **P1.16** — E2E test: Navbar renders on all pages, mobile hamburger opens, phone CTA links to `tel:`
- [x] **P1.17** — Verify `npm run build` produces correct `sitemap.xml` and `robots.txt` in `out/`

### Session Note — Phase 1 Completion (2026-09-12)

- **Completed Phase 1 SEO Foundation & Global Layout:**
  - **Shared Types & Data Stores:** Created TypeScript interfaces in `src/types/index.ts` and core data files:
    - `src/data/contact.ts`: `CONTACT_INFO` constant with phone, WhatsApp, email, address, business hours, and social links.
    - `src/data/plans.ts`: `BROADBAND_PLANS` array (Starter 50Mbps, Home 100Mbps, Power 200Mbps, Ultra 500Mbps).
    - `src/data/leaseLines.ts`: `LEASE_LINE_FEATURES` and `LEASE_LINE_USE_CASES` enterprise specs.
    - `src/data/faqs.ts`: `HOME_FAQS` list with high-intent customer Q&As.
  - **Structured Data & SEO Generators:** Built `src/lib/schemaGenerators.ts` (Organization, WebSite, LocalBusiness, Service, ItemList, FAQPage, BreadcrumbList, WebPage, Article) and `src/components/seo/JsonLd.tsx` injection component.
  - **CSS Design System:** Implemented full design token suite in `src/styles/globals.css` with fluid clamp typography, fluid spacing, glassmorphism tokens, and responsive utility classes.
  - **Sitemap & Robots:** Created `src/app/sitemap.ts` (all 8 routes + blog flag) and `src/app/robots.ts` with `export const dynamic = 'force-static'` for static export compatibility.
  - **Global Navigation & Layout:**
    - `src/components/layout/Navbar.tsx`: Desktop navigation, brand logo, direct call CTA, and mobile hamburger drawer.
    - `src/components/layout/Footer.tsx`: Brand summary, contact details, quick navigation, legal links, and copyright.
    - `src/components/ui/ContactBar.tsx`: Sticky bottom mobile contact bar for Call, WhatsApp, and Contact Form.
    - `src/app/layout.tsx`: Loaded Google Fonts (`Unbounded`, `Kanit`, `Poppins` via `next/font/google`), root metadata, and global JSON-LD schemas.
  - **Automated Verification & Testing:**
    - Unit test suite (`src/tests/schemaGenerators.test.ts`, `src/tests/plans.test.ts`, `src/tests/smoke.test.ts`): 13/13 tests passing.
    - E2E test suite (`tests/layout.spec.ts`, `tests/smoke.spec.ts`): 14/14 tests passing across Chromium, Mobile Chrome (Pixel 5), and Mobile Safari (iPhone 12).
    - Static export (`npm run build`): Generated static HTML, `sitemap.xml`, and `robots.txt` in `out/`.
    - Local CI quality gate: `npm run ci:quality` exited 0.
  - **Git Status:** Committed and pushed to `main` branch.

---

## Phase 2 — Home Page
> Goal: Complete home page with all sections, pixel-matching the TelNet Home 08 hero, mobile-first throughout.

---

#### W-201 — Hero Section (Video Background + Overlay Card)

**Root cause:** The hero is the first thing every visitor sees. It must immediately communicate "fast internet" and drive users toward a CTA. The TelNet Home 08 design uses a full-screen video with a rounded card overlay — this exact treatment must be reproduced.

**Goal:** A full-screen video hero renders on the home page with the `Hero.mp4` playing, the city skyline visible, the rounded overlay card containing the H1, subtext, and two CTAs ("View Plans" + "Call Now"). On mobile, the poster image shows immediately.

**Approach:** `HeroSection.tsx` as a Client Component (for video events). `<video>` tag with `autoPlay muted loop playsInline poster="/hero-poster.jpg"`. Overlay card uses absolute positioning centered in the viewport. CSS uses `clamp()` for all font sizes and `--space-card` for padding.

---

- [x] **RED — Component Test (`src/tests/HeroSection.test.tsx`):**
  - [x] Test: Render `<HeroSection />` — assert `<video>` element is present with `autoPlay`, `muted`, `loop`, `playsInline` attributes set
  - [x] Test: Assert `poster` attribute equals `/hero-poster.jpg`
  - [x] Test: Assert H1 text is present and non-empty
  - [x] Test: Assert "View Plans" link points to `/plans/`
  - [x] Test: Assert "Call Now" link starts with `tel:`
  - [x] **Run — confirm RED (component file doesn't exist yet)**

- [x] **GREEN — Implementation:**
  - [x] Create `src/components/sections/HeroSection.tsx` with video + overlay card
  - [x] Create `src/components/sections/HeroSection.module.css` using CSS tokens from `globals.css`
  - [x] Ensure `--font-display` used for H1, `--space-card` for card padding
  - [x] Run component test — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Dev server running — navigate to `http://127.0.0.1:3007/`
  - [x] Desktop: video plays, city skyline visible, purple/pink gradient sky, rounded card centered
  - [x] Card shows: badge pill → H1 → subtext → "View Plans" button → "Call Now" button
  - [x] Mobile (375px DevTools): poster image shows, card fits without horizontal scroll, H1 ≤ 3 lines
  - [x] Tap "View Plans" → navigates to `/plans/`
  - [x] Tap "Call Now" → opens phone dialer
  - [x] ✅ Done

---

#### W-202 — Home Page Metadata & JSON-LD

**Root cause:** Without per-page metadata, every page shows the same title and description in Google — killing SEO differentiation. The home page also needs FAQPage and WebPage schemas to qualify for rich results.

**Goal:** The home page `<head>` contains unique title, description, Open Graph tags, canonical URL, and inline JSON-LD scripts for `WebPage` and `FAQPage` schemas.

**Approach:** Export `metadata` object from `src/app/page.tsx`. Inject `<JsonLd>` components for WebPage and FAQPage schemas using functions from `schemaGenerators.ts`.

---

- [x] **RED — Unit Test (`src/tests/schemaGenerators.test.ts` & `src/tests/HomePage.test.tsx`):**
  - [x] Test: `generateWebPageSchema({ type: 'WebPage', ... })` returns object with `@type: 'WebPage'` and correct `url`
  - [x] Test: `generateFAQSchema(faqs)` returns object with `@type: 'FAQPage'` and `mainEntity` array of correct length
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Add `generateWebPageSchema()` to `src/lib/schemaGenerators.ts`
  - [x] Add `generateFAQSchema()` to `src/lib/schemaGenerators.ts` (if not done in Phase 1)
  - [x] Export `metadata` from `src/app/page.tsx` with title, description, OG, canonical
  - [x] Inject `<JsonLd schema={generateWebPageSchema(...)} />` and `<JsonLd schema={generateFAQSchema(HOME_FAQS)} />` in page body
  - [x] Run unit tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] `npm run build` → open `out/index.html` → inspect `<head>` for `<title>`, `<meta name="description">`, `<link rel="canonical">`
  - [x] Inspect `<script type="application/ld+json">` blocks — verify WebPage and FAQPage JSON is valid
  - [x] Paste page URL into Google Rich Results Test → FAQPage detected ✅
  - [x] ✅ Done

---

#### W-203 — Plans Preview Section (Home Page)

**Root cause:** Visitors need to see pricing options on the home page without navigating away. A 3-card preview (showing the 3 middle plans) with a "See All Plans" link converts browsers into clicks.

**Goal:** A plans preview section on the home page shows 3 plan cards from `BROADBAND_PLANS` data. Each card shows speed, price, and key features. "Most Popular" plan is visually highlighted.

**Approach:** Reuse `PlanCard.tsx` component (built in Phase 3). On home page, display plans at index 1, 2, 3 (skip the cheapest starter). CTA below links to `/plans/`.

---

- [x] **RED — Component Test (`src/tests/PlansPreview.test.tsx` & `src/tests/PlanCard.test.tsx`):**
  - [x] Test: Render `<PlansPreview />` — assert exactly 3 plan cards render
  - [x] Test: Assert the "Most Popular" badge is visible on the highlighted plan
  - [x] Test: Assert "See All Plans" link points to `/plans/`
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/components/ui/PlanCard.tsx` + `PlanCard.module.css`
  - [x] Create `src/components/sections/PlansPreview.tsx` consuming `BROADBAND_PLANS` slice
  - [x] Create `src/components/sections/PlansPreview.module.css` using `--plans-grid` layout tokens
  - [x] Run component test — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Home page renders 3 plan cards in a responsive grid
  - [x] At 375px: cards stack in 1 column, no horizontal scroll
  - [x] At 768px: 3 cards side by side
  - [x] "Most Popular" card is elevated (border or scale treatment)
  - [x] "See All Plans →" button visible and navigates to `/plans/`
  - [x] ✅ Done

---

#### W-204 — Why Us Section + FAQ Section

**Root cause:** Trust signals ("Why JDAirNet?") reduce bounce rate. FAQs answer common objections before the user has to call.

**Goal:** A "Why Us" section with 4–6 feature icons and a FAQ accordion section with 5–7 questions. FAQ data comes from `src/data/faqs.ts`.

**Approach:** `WhyUsSection.tsx` with icon + label + description grid. `FaqSection.tsx` with a CSS-only accordion (no JS library) for performance.

---

- [x] **RED — Component Test (`src/tests/FaqSection.test.tsx` & `src/tests/WhyUsSection.test.tsx`):**
  - [x] Test: Render `<FaqSection />` — assert correct number of FAQ items rendered
  - [x] Test: Assert each question text is present in the DOM
  - [x] Test: Assert answer is initially hidden (aria-expanded="false" or similar)
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/data/faqs.ts` with 6 FAQ entries (if not done in Phase 1)
  - [x] Create `src/components/sections/WhyUsSection.tsx` + `.module.css`
  - [x] Create `src/components/sections/FaqSection.tsx` + `.module.css`
  - [x] Run component test — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Why Us section renders 4–6 feature blocks in a responsive grid
  - [x] FAQ section shows question list — click a question → answer expands
  - [x] At 375px: FAQ items are full width, text doesn't overflow
  - [x] ✅ Done

---

#### W-205 — Home Page E2E Test

- [x] **E2E (`tests/home.spec.ts`):**
  - [x] Test: Navigate to `/` — page title matches `JDAirNet`
  - [x] Test: `<video>` element is present in the DOM
  - [x] Test: H1 is visible and non-empty
  - [x] Test: "View Plans" link is visible and href is `/plans/`
  - [x] Test: "Call Now" link has `href` starting with `tel:`
  - [x] Test (mobile 375px viewport): Sticky ContactBar is visible at bottom of page
  - [x] Test (mobile 375px viewport): No horizontal scroll (`document.body.scrollWidth <= window.innerWidth`)
  - [x] **Run `npm run test:e2e` — confirm all pass**

### Session Note — Phase 2 Completion (2026-09-12)

- **Completed Phase 2 Home Page Implementation via Strict TDD:**
  - **Hero Section (W-201):** Extracted `public/hero-poster.jpg` directly from `public/Hero.mp4` via FFmpeg. Built `src/components/sections/HeroSection.tsx` with full-screen video, dusk purple/magenta gradient overlay, and glassmorphic rounded card with H1, badge, and dual CTAs.
  - **PlanCard UI & Plans Preview (W-203):** Built reusable `src/components/ui/PlanCard.tsx` and `src/components/sections/PlansPreview.tsx` rendering 3 featured tiers with highlighted "Most Popular" elevation.
  - **Why Us & FAQ Sections (W-204):** Built `src/components/sections/WhyUsSection.tsx` (6 core differentiators) and `src/components/sections/FaqSection.tsx` (accessible accordion with smooth transitions).
  - **Conversion Section & SEO (W-202):** Built `src/components/sections/ContactCTA.tsx` and assembled `src/app/page.tsx` with page metadata and `WebPage` + `FAQPage` JSON-LD schemas.
  - **Quality Gates & Tests (W-205):**
    - 32/32 Vitest unit and component tests passing.
    - 27/27 Playwright E2E tests passing across Desktop Chromium, Mobile Chrome, and Mobile Safari.
    - `npm run lint` and `npm run typecheck` passing with 0 warnings/errors.
    - `npm run build` static export succeeded to `out/`.
    - `npm run ci:quality` exited 0.

### Session Note — Post-Phase 2 Visual & Layout Customizations (2026-09-12)

- **Hero & Navbar Edge-to-Edge Integration:**
  - Extended the full-screen video background to the top viewport edge behind the transparent Navbar.
  - Redesigned the Hero card to a tall, high-clarity transparent glass card (`backdrop-filter: none`, ambient `rgba(255, 255, 255, 0.04)` fill, deep ambient shadow) with a single framed white CTA button (`VIEW PLANS →`).
  - Restyled Navbar brand typography ("JD" in pure white `#ffffff`, "AirNet" in accent red), set inactive nav links to solid white `#ffffff`, and styled active/hover links in red (`#ff4757`) with red underline indicator.

- **15% Global Margins Alignment (70vw Content Grid):**
  - Standardized `.container`, `.navContainer`, and `.heroCard` to `70vw` desktop width (`margin-inline: auto;`, 15% margins on left and right) so all sections, cards, and navigation align seamlessly edge-to-edge.

- **Global White/Off-White Background Transformation:**
  - Converted the global theme below the Hero video from dark to clean white (`#ffffff`) and soft off-white (`#f8fafc`).
  - Updated all section containers, PlanCards, Feature cards, FAQ accordion items, and CTA cards to crisp light backgrounds with high-contrast slate text (`#0f172a` / `#475569`) and subtle border lines (`#e2e8f0`).

- **Refined Low-Saturation Button Styling:**
  - Replaced high-saturation neon colors and glowing drop-shadows with sophisticated, less-saturated button palettes (classy burgundy red `#c81e2b`, matte natural WhatsApp green `#1f8a4c`, crisp bordered white secondary button) and soft neutral elevation shadows.

---
## Phase 2.5 — Lenis Smooth Scroll, GSAP Animations & Floating Contact Hub
> Goal: Integrate Lenis smooth momentum scrolling with GSAP ScrollTrigger animation choreography across all sections, and replace the mobile bottom bar with an omnipresent, continuously jumping GSAP floating contact hub on the bottom right (Call, WhatsApp, Form), ensuring 60fps performance, accessibility compliance (`prefers-reduced-motion`), and zero static-export regressions.

---

#### W-251 — Lenis Smooth Scroll Provider

**Root cause:** Native browser scrolling can feel rigid and lacks cinematic momentum. Lenis provides smooth inertial scrolling, prevents jarring jump cuts on internal anchor navigation, respects user accessibility preferences, and synchronizes with Next.js App Router static exports.

**Goal:** Install `lenis` and create a global `SmoothScrollProvider.tsx` client component that initializes smooth scroll on mount, binds to `requestAnimationFrame`, smoothly scrolls to hash targets (e.g. `#faq`), and disables itself cleanly when `prefers-reduced-motion: reduce` is detected.

**Approach:** Client Component (`src/components/providers/SmoothScrollProvider.tsx`) wrapping the app content in `src/app/layout.tsx`. Uses standard `useEffect` lifecycle with `lenis.destroy()` on unmount to prevent memory leaks and hydration mismatches.

---

- [x] **RED — Component Test (`src/tests/SmoothScrollProvider.test.tsx`):**
  - [x] Test: Render `<SmoothScrollProvider><div>Content</div></SmoothScrollProvider>` — assert children render correctly
  - [x] Test: Assert Lenis instance initializes on mount when `window.matchMedia('(prefers-reduced-motion: reduce)')` is false
  - [x] Test: Assert Lenis is NOT initialized (or destroyed) when user prefers reduced motion
  - [x] Test: Assert cleanup `lenis.destroy()` is called on component unmount
  - [x] **Run — confirm RED (component does not exist yet)**

- [x] **GREEN — Implementation:**
  - [x] Install dependency: `npm install lenis`
  - [x] Create `src/components/providers/SmoothScrollProvider.tsx` (Client Component)
  - [x] Wire RAF loop (`requestAnimationFrame`) and window resize listener
  - [x] Handle anchor link clicks (`a[href^="#"]`) via `lenis.scrollTo(target)`
  - [x] Mount `<SmoothScrollProvider>` inside `src/app/layout.tsx`
  - [x] Run component tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Dev server running → navigate to `http://127.0.0.1:3007/`
  - [x] Mouse wheel / trackpad scrolling displays smooth inertial deceleration
  - [x] Clicking footer link "Frequently Asked Questions" (`/contact/#faq` or `#faq`) executes smooth scrolling deceleration to the target element
  - [x] Toggling browser "prefers-reduced-motion: reduce" in DevTools disables inertia immediately and uses instant native scroll
  - [x] ✅ Done

---

#### W-252 — GSAP & ScrollTrigger Animation Choreography

**Root cause:** Static elements popping into view without coordinated entrance animations feel unpolished. Choreographing section entrances with GSAP ScrollTrigger creates a high-end, responsive feel while remaining strictly performant.

**Goal:** Install `gsap`, create a reusable animation hook/utility (`src/hooks/useScrollReveal.ts`), synchronize GSAP ticker with Lenis scroll delta, and attach staggered reveal animations to:
  1. Plans Preview cards (staggered fade-up + soft scale).
  2. Why Choose Us features (staggered translateY + opacity).
  3. FAQ accordion items (smooth sequential reveal).
  4. Contact CTA container (ambient scale reveal).

**Approach:** Register `ScrollTrigger` with GSAP. Connect `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))`. Use `gsap.context()` inside `useScrollReveal` hook for bulletproof React cleanup (`ctx.revert()`).

---

- [x] **RED — Unit / Hook Test (`src/tests/useScrollReveal.test.ts`):**
  - [x] Test: Invoke `useScrollReveal()` with container ref — assert GSAP context initializes ScrollTrigger batches
  - [x] Test: Assert cleanup `ctx.revert()` is called on unmount
  - [x] Test: Assert animations skip immediately when `prefers-reduced-motion: reduce` is active
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Install dependency: `npm install gsap`
  - [x] Create `src/lib/animations.ts` (configures GSAP ScrollTrigger integration with Lenis)
  - [x] Create `src/hooks/useScrollReveal.ts` custom hook for section/card batch reveals
  - [x] Apply `useScrollReveal` to `PlansPreview.tsx`, `WhyUsSection.tsx`, `FaqSection.tsx`, and `ContactCTA.tsx`
  - [x] Run unit tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Scroll down homepage on desktop:
    - Plans Preview section: 3 plan cards stagger fade up into view as user reaches viewport trigger
    - Why Us section: 6 feature blocks stagger animate smoothly from bottom to top
    - FAQ section: accordion container fades in with crisp timing
    - Contact CTA: card gently expands into viewport
  - [x] Scroll back up and down: triggers re-settle cleanly without flickering or layout shift
  - [x] ✅ Done

---

#### W-253 — Animation & Smooth Scroll Performance & E2E Verification

**Root cause:** Animations and smooth scroll libraries can introduce Cumulative Layout Shift (CLS), drop frames on mobile, or fail in static production builds if not tested end-to-end.

**Goal:** Verify complete E2E test suite across Desktop Chromium, Mobile Chrome, and Mobile Safari, ensuring 0 console errors, 0 layout shifts, zero broken click targets, and static export build success (`npm run build`).

---

- [x] **E2E (`tests/animations.spec.ts`):**
  - [x] Test: Navigate to `/` — assert Lenis scroll wrapper / class is present
  - [x] Test: Scroll through all sections — assert all animated elements end with `opacity: 1` and `transform: none` (or equivalent visible state)
  - [x] Test: All interactive elements (CTA buttons, FAQ accordion headers, nav links) remain clickable and functional after animation completes
  - [x] Test (mobile 375px): Smooth scroll and touch events do not lock or glitch
  - [x] **Run `npm run test:e2e` — confirm all pass**

- [x] **Build & Quality Gates Verification:**
  - [x] Run `npm run lint` — exit code 0 (no unused variables, no any types)
  - [x] Run `npm run typecheck` — exit code 0
  - [x] Run `npm run test:unit` — all unit tests pass
  - [x] Run `npm run build` — static export generates cleanly in `out/` without SSR window/document errors
  - [x] ✅ Done

---

#### W-254 — GSAP Floating Bouncing Contact Hub (Replaces Mobile Bottom Bar)

**Root cause:** The fixed horizontal bottom bar (`ContactBar.tsx`) consumes permanent vertical screen space on mobile and obscures lower page content. A universal floating action hub positioned on the bottom right cleanly replaces the mobile bottom bar on all screen sizes, providing an omnipresent, continuous jumping entry point for all 3 contact channels (Call, WhatsApp, Form) without blocking content.

**Goal:** Create `src/components/ui/FloatingContactHub.tsx` fixed on the bottom right. Powered by GSAP, the button continuously jumps smoothly up and down to the same peak height (frictionless perpetual bounce). Clicking the button pauses the jump and reveals the 3 contact channels with a staggered spring animation. Remove the redundant `ContactBar.tsx` from the layout.

**Approach:** Client Component (`src/components/ui/FloatingContactHub.tsx`) utilizing GSAP timeline/tween (`gsap.to(buttonRef, { y: -16, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut" })`). When toggled open, the jump pauses and the 3 action buttons pop outward (`gsap.fromTo(items, { scale: 0, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, stagger: 0.07, ease: "back.out(2)" })`). Replace `<ContactBar />` in `src/app/layout.tsx` with `<FloatingContactHub />`. Supports outside click and `Escape` key close. Bypasses continuous jump when `prefers-reduced-motion: reduce` is detected.

---

- [x] **RED — Component Test (`src/tests/FloatingContactHub.test.tsx`):**
  - [x] Test: Render `<FloatingContactHub />` — assert main floating trigger button is present in the DOM
  - [x] Test: Assert trigger button has accessible attributes (`aria-label`, `aria-expanded="false"`, `aria-haspopup="menu"`)
  - [x] Test: Click trigger button — assert menu expands (`aria-expanded="true"`) and all 3 channel links render:
    - [x] Phone call CTA (`href` starts with `tel:`)
    - [x] WhatsApp CTA (`href` starts with `https://wa.me/`)
    - [x] Contact form CTA (`href="/contact/"`)
  - [x] Test: Pressing `Escape` or clicking close toggles menu back to collapsed
  - [x] Test: Assert GSAP infinite bounce animation initializes when `prefers-reduced-motion: reduce` is false
  - [x] Test: Assert GSAP infinite bounce is NOT started when `prefers-reduced-motion: reduce` is true
  - [x] **Run — confirm RED (component does not exist yet)**

- [x] **GREEN — Implementation:**
  - [x] Create `src/components/ui/FloatingContactHub.tsx` + `FloatingContactHub.module.css`
  - [x] Setup GSAP infinite vertical bounce tween on trigger button with brand color theme
  - [x] Implement toggle state with GSAP staggered reveal/collapse for the 3 channel buttons
  - [x] Add click-outside and keyboard `Escape` event listeners
  - [x] Mount `<FloatingContactHub />` in `src/app/layout.tsx` and remove redundant `<ContactBar />`
  - [x] Run component tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Dev server running → navigate to `http://127.0.0.1:3007/`
  - [x] Both desktop and mobile viewports display the branded floating contact button on the bottom right continuously jumping smoothly up and down to the same height
  - [x] Mobile bottom screen is clean — no horizontal bottom bar blocking page content
  - [x] Click floating button → jump pauses immediately → 3 channel buttons (Call, WhatsApp, Form) pop upward with staggered spring animation
  - [x] Click "Call" → triggers phone dialer; click "WhatsApp" → opens WhatsApp chat; click "Contact Form" → navigates to `/contact/`
  - [x] Click outside or press `Escape` → channel menu closes smoothly and floating button resumes jumping
  - [x] Turn on `prefers-reduced-motion` in DevTools → button rests statically without jumping
  - [x] ✅ Done

### Session Note — Phase 2.5 & Polish Completion (2026-09-12)

- **Completed Phase 2.5 (Lenis Smooth Scroll, GSAP Choreography & Floating Contact Hub):**
  - **Lenis Smooth Scroll (W-251):** Created `SmoothScrollProvider.tsx` wrapping the application, synchronizing RAF loop with GSAP ticker, providing anchor target deceleration, and honoring `prefers-reduced-motion`.
  - **GSAP ScrollTrigger Reveal (W-252):** Created `src/lib/animations.ts` and `src/hooks/useScrollReveal.ts` providing scoped GSAP context animations to Plans Preview, Why Us features, FAQ accordion, and Contact CTA.
  - **Floating Bouncing Contact Hub (W-254):**
    - Created `FloatingContactHub.tsx` with a perpetual frictionless elastic ball bounce (zero energy loss, identical peak height of 26px on every bounce) with ground squash/stretch.
    - Set `z-index: 99999` to ensure it always renders in front of video and all page sections.
    - Removed side tooltip text ("Chat / Call with us") per user feedback for a clean, minimal floating trigger.
    - Staggered spring popup for the 3 contact channels (Phone Call, WhatsApp, Form) with click-outside and `Escape` handlers.
    - Removed redundant mobile bottom bar (`ContactBar`).
  - **Navbar Responsive Scaling & Color Cleanup:**
    - Standardized Navbar typography to fluid `clamp()` and responsive gaps.
    - Added `white-space: nowrap` and flexible pill call button so text never wraps or clips on tablet/small screens.
    - Fixed responsive drawer breakpoint cleanly at `< 1024px`.
    - **Color Palette Enforcement:** Replaced all `#0f172a` / slate-tinted background colors across mobile drawer, buttons, and badges with pure neutral darks (`#111111`, `#0a0a0a`, `rgba(10, 10, 10, 0.98)`) and verified zero blue/slate tints remain.
  - **Hero Video & Poster Asset Synchronization:**
    - Replaced `public/Hero.mp4` with the updated 4K H.264 video asset (16.3 MB).
    - Executed `node scripts/extract-poster.js` via ffmpeg to re-generate the first-frame poster `public/hero-poster.jpg`.
    - Documented HTTP 206 byte-range browser caching behavior and hard-reload (`Ctrl + Shift + R`) steps for asset verification.
  - **Tests & Quality Gates (W-253):**
    - Created unit test suites for `SmoothScrollProvider`, `useScrollReveal`, `FloatingContactHub`, and E2E test suite `tests/animations.spec.ts`.
    - Handled Playwright continuous animation stability checks using `{ force: true }` clicks on the perpetual bouncing hub.
    - Verified 43/43 unit tests passing in Vitest and 35 E2E tests passing in Playwright.



---

## Phase 3 — Plans Page (`/plans/`)
> Goal: Full pricing table with all 4 broadband tiers, GST note, add-ons section, and schemas.

---

#### W-301 — PlanCard Component

**Root cause:** Plan cards are the highest-conversion UI element on the site. They need a consistent, reusable component that scales correctly from 375px to 1440px.

**Goal:** A `PlanCard` component renders a single broadband plan with speed, price, features list, badge (if highlighted), and a CTA button linking to phone/WhatsApp.

**Approach:** Pure presentational component driven by `BroadbandPlan` type from `src/data/plans.ts`. Highlighted plan gets a visual elevation treatment (border accent + scale on desktop only).

---

- [x] **RED — Component Test (`src/tests/PlanCard.test.tsx`):**
  - [x] Test: Render `<PlanCard plan={BROADBAND_PLANS[0]} />` — assert plan name is visible
  - [x] Test: Assert speed is displayed
  - [x] Test: Assert all features in the plan's `features` array are rendered
  - [x] Test: Assert "Most Popular" badge NOT rendered when `highlighted: false`
  - [x] Test: Render with `highlighted: true` — assert badge IS rendered
  - [x] Test: CTA button has `href` starting with `tel:` or `https://wa.me/`
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/types/index.ts` with `BroadbandPlan` interface
  - [x] Create `src/components/ui/PlanCard.tsx` + `.module.css`
  - [x] Ensure card uses `var(--space-card)`, `var(--font-h3)` for plan name, `var(--font-h2)` for price
  - [x] Desktop-only scale: `.planCard--highlighted { transform: scale(1.04); }` inside `@media (min-width: 1024px)`
  - [x] Run component test — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Render all 4 plan cards side by side at 1024px — highlighted card is visually elevated
  - [x] At 600px: 2 columns, cards equal height
  - [x] At 375px: 1 column, highlighted card does NOT scale (correct — scale only on desktop)
  - [x] ✅ Done

---

#### W-302 — Plans Page Layout & Schema

**Root cause:** The plans page is the primary conversion page — it must render the full pricing table with all 4 tiers, GST disclaimer, add-ons, and proper SEO schemas.

**Goal:** `/plans/` renders all 4 plan cards, GST note, add-ons section, and injects `Service` schema + `ItemList` schema.

---

- [x] **RED — Unit Test:**
  - [x] Test: `generatePlansItemListSchema(BROADBAND_PLANS)` returns `@type: 'ItemList'` with `numberOfItems: 4`
  - [x] Test: Each item in `itemListElement` has `position`, `item.name`, `item.offers.price`
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Add `generatePlansItemListSchema()` to `schemaGenerators.ts`
  - [x] Create `src/app/plans/page.tsx` with `metadata` export + 4 plan cards grid + GST note
  - [x] Inject `<JsonLd>` for `Service` schema and `ItemList` schema
  - [x] Add-ons section below the plans grid
  - [x] Run unit test — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Navigate to `/plans/` — all 4 plan cards visible
  - [x] GST disclaimer visible below grid ("All prices exclude 18% GST")
  - [x] At 375px: 1 column, stacked cards, no horizontal scroll
  - [x] At 1024px: 4 columns, highlighted card elevated
  - [x] Build `out/plans/index.html` — JSON-LD for ItemList present in `<head>`
  - [x] ✅ Done

---

#### W-303 — Plans E2E Test

- [x] **E2E (`tests/plans.spec.ts`):**
  - [x] Test: Navigate to `/plans/` — 4 plan cards render
  - [x] Test: "Most Popular" badge is visible on exactly 1 card
  - [x] Test: No plan card has an empty price (data integrity)
  - [x] Test: All CTA buttons have `href` starting with `tel:` or `https://wa.me/`
  - [x] Test (mobile 375px): 1 column layout, no horizontal scroll
  - [x] **Run `npm run test:e2e` — confirm all pass**

### Session Note — Phase 3 Completion (2026-09-14)

- **Completed Phase 3 Plans Page (`/plans/`) via Strict TDD:**
  - **PlanCard Reusability (W-301):** Verified existing `PlanCard.tsx` component handles all 4 tiers (Starter, Home, Power, Ultra) with speed, price, features, badge, and dynamic direct-call/WhatsApp CTAs.
  - **Plans Page Layout & SEO (W-302):**
    - Built `src/app/plans/page.tsx` and `src/app/plans/page.module.css` with responsive 4-column layout conforming to 70vw (`.container`) grid.
    - Integrated comprehensive Add-ons section (Watcho OTT, Pioneer IPTV, Static IP, HD Streaming) and an Enterprise Lease Lines cross-link banner.
    - Added GST and terms disclaimer: `* All prices exclude 18% GST...`.
    - Injected complete JSON-LD structured data: `WebPage`, `Service` (broadband), `ItemList` (all 4 plan products), and `BreadcrumbList`.
    - Exported full page metadata with canonical `https://jdairnet.com/plans/` and OpenGraph tags.
  - **Test Suite & Quality Fixes (W-303):**
    - Created unit/schema test suite `src/tests/PlansPage.test.tsx` verifying schema and page components.
    - Fixed Testing Library element ambiguity by querying add-on headers directly via `getByRole('heading', { level: 3, name: 'Static IP' })`.
    - Created E2E test suite `tests/plans.spec.ts` testing 4 cards, badges, CTAs, add-ons, and mobile 375px responsiveness.

---

## Phase 4 — Lease Lines Page (`/lease-lines/`)
> Goal: Enterprise page with features, use cases, and quote CTA. Zero pricing.

---

#### W-401 — Lease Lines Page

**Root cause:** Enterprise clients need a dedicated page explaining the benefits of a dedicated line. Pricing must NOT appear — enterprise deals are custom quotes only. The page must have its own `Service` schema with no price data.

**Goal:** `/lease-lines/` renders with H1, 6 feature blocks, use-case chips, and a "Request a Quote" button that links to `/contact/`. No price anywhere on the page.

---

- [x] **RED — Component + E2E Test:**
  - [x] Unit test: `generateServiceSchema({ name: 'Enterprise Lease Line', ... })` — assert `@type: 'Service'`, assert no `offers` key (no pricing)
  - [x] E2E test: Navigate to `/lease-lines/` — assert NO element contains `₹` or `price` text
  - [x] E2E test: "Request a Quote" button is visible and links to `/contact/`
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/app/lease-lines/page.tsx` with metadata + hero H1 + features grid + use cases + CTA
  - [x] Create `src/data/leaseLines.ts` with `LEASE_LINE_FEATURES` (if not done in Phase 1)
  - [x] Inject `<JsonLd>` for `Service` schema (lease line) and `BreadcrumbList`
  - [x] Run tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Navigate to `/lease-lines/` — H1 is "Enterprise Internet Lease Lines" (or similar)
  - [x] 6 feature blocks visible in a responsive grid
  - [x] No price text anywhere on page
  - [x] "Request a Quote" button links to `/contact/`
  - [x] At 375px: features stack in 1 column, no horizontal scroll
  - [x] Breadcrumb schema visible in page source: Home > Lease Lines
  - [x] ✅ Done

### Session Note — Phase 4 Completion & Tooling Infrastructure Fixes (2026-09-14)

- **Completed Phase 4 Lease Lines Page (`/lease-lines/`) via Strict TDD:**
  - **Enterprise UI & Structure (W-401):**
    - Built `src/app/lease-lines/page.tsx` and `src/app/lease-lines/page.module.css` conforming to the 70vw desktop layout grid.
    - Added high-impact value highlights banner (1:1 Dedicated Symmetrical Speed, 99.9% SLA, < 15ms latency).
    - Rendered all 6 core enterprise capabilities (Symmetric Speeds, Dedicated Bandwidth, SLA Guaranteed, Security & Static IPs, 24/7 Local NOC, Scalable Bandwidth) with dedicated vector SVG icons.
    - Added interactive target audience use-case chips and dark enterprise conversion footer banner with direct quote and WhatsApp CTAs.
    - Strictly verified ZERO pricing text / symbols (`₹`) anywhere on the page or inside structured data.
    - Injected complete JSON-LD schemas (`WebPage`, `Service` for lease line without offers, `BreadcrumbList`) and exported canonical metadata `https://jdairnet.com/lease-lines/`.
  - **Tooling, Linting & Test Environment Fixes:**
    - **ESLint Cleanliness (`src/tests/setup.ts`):** Removed `(global as any)` casts and introduced a strict `globalScope` type definition to eliminate `@typescript-eslint/no-explicit-any` lint errors.
    - **GSAP ScrollTrigger Lifecycle (`src/tests/setup.ts`):** Resolved `TypeError: Cannot read properties of undefined (reading 'length')` by ensuring `gsap.registerPlugin(ScrollTrigger)` executes on window setup, and added comprehensive teardown in `afterEach` (`ScrollTrigger.getAll().forEach(t => t.kill(true))`, `gsap.killTweensOf('*')`, `gsap.globalTimeline.clear()`).
    - **Next.js Link Test Assertion (`src/tests/LeaseLinesPage.test.tsx`):** Updated quote CTA href assertions to match Next.js client Link rendering with regex `/^\/contact\/?$/`.
    - **Test Suites:** Created unit/schema tests `src/tests/LeaseLinesPage.test.tsx` and E2E test suite `tests/lease-lines.spec.ts`.


---

### Session Note — UI Polish: Section Heading, Footer, Navbar & FloatingContactHub Icon Morph (2026-09-14)

- **WhyUsSection Heading Renamed:**
  - Changed the `<h2>` text from `Why Choose JDAirNet` → **`Why Choose Us`** in `src/components/sections/WhyUsSection.tsx`.
  - Updated matching assertions in `src/tests/WhyUsSection.test.tsx` and `src/tests/HomePage.test.tsx` to `/Why Choose Us/i`.
  - All 15 unit test files / 50 tests remain green after the change.

- **Footer Dark Background (`Footer.module.css`):**
  - Changed footer background from `#ffffff` → `#0a0a1a` (matching the hero/site dark theme).
  - `JD` in the brand logo now renders **white** (`color: #ffffff` on `.brandLogo`) — `AirNet` remains the primary red accent via `.brandAccent`.
  - All body text, contact items, and links updated to light variants (`#94a3b8`, `#ffffff`) appropriate for the dark surface.
  - Divider lines updated to `rgba(255,255,255,0.08)` subtle strokes.

- **Conditional Dark Sticky Navbar (`Navbar.tsx` + `Navbar.module.css`):**
  - Homepage (`/`) keeps the existing transparent `position: absolute` overlay navbar (works over the dark hero video).
  - All other pages now get a **sticky dark navbar** via `.headerDark`: `position: sticky`, `background: #0a0a1a`, subtle `border-bottom` and `box-shadow`.
  - Implemented via pathname check: `pathname === '/' ? '' : styles.headerDark` — no extra props or layout changes.
  - Ensures white nav link text is readable on all inner pages (Plans, Lease Lines, Coverage, About, Contact).

- **FloatingContactHub — Smooth Icon Morph Animation (`FloatingContactHub.tsx` + `.module.css`):**
  - Replaced the hard conditional React SVG swap (`{isOpen ? <X /> : <Chat />}`) with a CSS-only crossfade+rotate transition.
  - Both icons (chat bubble and ×) now **always exist in the DOM**, layered via `position: absolute` inside `position: relative; overflow: hidden` button.
  - CSS classes `.iconSlot`, `.iconSlotVisible`, `.iconSlotHidden` drive the animation:
    - **Visible:** `opacity: 1`, `rotate(0deg)`, `scale(1)`
    - **Hidden:** `opacity: 0`, `rotate(90deg)`, `scale(0.6)`
  - Transition: `0.28s cubic-bezier(0.16, 1, 0.3, 1)` on both `opacity` and `transform` — smooth morph-spin between chat and × icons.
  - Purely CSS-driven, zero flicker, no React re-render jank for the icon swap.

## Phase 5 — Coverage, About, Contact Pages
> Goal: Complete all secondary marketing, conversion, and legal pages with schemas, interactive contact form with PHP backend, and custom 404 page.

---

#### W-501 — Coverage Page (`/coverage/`)

- [x] **RED — E2E & Unit Tests (`tests/coverage.spec.ts` & `src/tests/CoveragePage.test.tsx`):**
  - [x] Test: Navigate to `/coverage/` — page title includes "Coverage"
  - [x] Test: At least one CTA linking to `/contact/` or `tel:` is present
  - [x] Test: Assert `WebPage` and `BreadcrumbList` schemas
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/app/coverage/page.tsx` with metadata + content + CTAs + `<JsonLd>`
  - [x] Create `src/app/coverage/page.module.css` with 70vw layout and area tags
  - [x] Run unit & E2E tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Navigate to `/coverage/` — content about service areas renders
  - [x] Contact/feasibility CTA visible
  - [x] ✅ Done

---

#### W-502 — About Page (`/about/`)

- [x] **RED — Unit & E2E Tests (`src/tests/AboutPage.test.tsx` & `tests/about.spec.ts`):**
  - [x] Test: `generateWebPageSchema({ type: 'AboutPage', ... })` — assert `@type: 'AboutPage'`
  - [x] Test: Assert company story, stats ribbon, core values, and CTAs render
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/app/about/page.tsx` with metadata + content + `<JsonLd>`
  - [x] Create `src/app/about/page.module.css` with values grid and stats ribbon
  - [x] Run unit & E2E tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Navigate to `/about/` — content renders correctly at all viewports
  - [x] ✅ Done

---

#### W-503 — Contact Page & Form (`/contact/`)

- [x] **RED — Component & E2E Tests (`src/tests/ContactForm.test.tsx`, `src/tests/ContactPage.test.tsx`, `tests/contact.spec.ts`):**
  - [x] Test: Render `<ContactForm />` — assert name, email, phone, message fields present
  - [x] Test: Submit with empty fields — assert error state (form does not submit)
  - [x] Test: Submit with valid data — mock `fetch` to return `{success: true}` — assert success message renders
  - [x] Test: Submit with valid data — mock `fetch` to return `{success: false}` — assert error message renders
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/components/ui/ContactForm.tsx` (Client Component) with form state + fetch + success/error UI
  - [x] Create `src/components/ui/ContactForm.module.css`
  - [x] Create `contact.php` (saved in project root as `contact.php`, deployed to Hostinger separately)
  - [x] Create `src/app/contact/page.tsx` with metadata, all 3 channels, `<ContactForm />`, `LocalBusiness` schema, `ContactPage` schema
  - [x] Create `src/app/contact/page.module.css`
  - [x] Run component & E2E tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] Navigate to `/contact/` — 3 contact channels displayed prominently
  - [x] Fill form → submit → success message appears
  - [x] On mobile: all 3 CTAs are tappable (44px+ touch targets)
  - [x] ✅ Done

---

#### W-504 — Legal Pages & Custom 404

- [x] **RED — Unit & E2E Tests (`src/tests/LegalPages.test.tsx` & `tests/legal.spec.ts`):**
  - [x] Test: Navigate to `/privacy-policy/` — page renders, title contains "Privacy"
  - [x] Test: Navigate to `/terms-of-service/` — page renders
  - [x] Test: Navigate to `/this-does-not-exist/` — 404 page renders, contains link back to home
  - [x] **Run — confirm RED**

- [x] **GREEN — Implementation:**
  - [x] Create `src/app/privacy-policy/page.tsx` with basic legal content + metadata
  - [x] Create `src/app/terms-of-service/page.tsx` with basic legal content + metadata
  - [x] Create `src/app/legal.module.css`
  - [x] Create `src/app/not-found.tsx` with branded 404 design + "Go Home" CTA
  - [x] Create `src/app/not-found.module.css`
  - [x] Run unit & E2E tests — **confirm GREEN**

- [x] **Verification chain:**
  - [x] `/privacy-policy/` renders — breadcrumb shows Home > Privacy Policy
  - [x] `/terms-of-service/` renders — breadcrumb shows Home > Terms of Service
  - [x] Navigate to a non-existent URL — custom 404 page shows
  - [x] ✅ Done

### Session Note — Phase 5 Completion & UI Polish (2026-09-14)

- **Completed Phase 5 (Coverage, About, Contact, Legal & 404) via Strict TDD:**
  - **Coverage Page (`/coverage/`) (W-501):** Built `src/app/coverage/page.tsx` with residential & enterprise service clusters, interactive feasibility check CTA, and `WebPage` + `BreadcrumbList` JSON-LD schemas.
  - **About Page (`/about/`) (W-502):** Built `src/app/about/page.tsx` with company mission, 4-stat ribbon (100% Optical Fiber, 99.9% Uptime SLA, < 15ms Latency, 24/7 Local NOC), core values grid, and `AboutPage` schema.
  - **Contact Page & Form (`/contact/`) (W-503):** Built `src/components/ui/ContactForm.tsx` (accessible client-side validation, `POST /contact.php` fetch with feedback alerts), created standalone `contact.php` mailer in project root for Hostinger FTP deployment, assembled `src/app/contact/page.tsx` with 3 contact channels (Direct Call, WhatsApp, Form) and `ContactPage` + `LocalBusiness` schemas.
  - **Legal & System Pages (W-504):** Built `src/app/privacy-policy/page.tsx`, `src/app/terms-of-service/page.tsx`, and branded custom `src/app/not-found.tsx`.
- **Delivered UI Polish & Bug Fixes:**
  - **Cross-Page FAQ Navigation:** Enhanced `SmoothScrollProvider.tsx` with cross-page hash detection, auto-scrolling to `#faq` with -80px header offset after page transitions, and fixed footer link in `Footer.tsx` to `/#faq`.
  - **Navbar Clearance:** Standardized all inner page top section paddings to `padding-top: clamp(6rem, 12vw, 9rem);` so pills and titles no longer touch the fixed navbar.
  - **Scroll Reveal Animations:** Created reusable `<ScrollReveal>` component and wrapped all headers, cards, and CTA sections across Plans, Lease Lines, Coverage, About, Contact, and Legal pages.
  - **15% Margin Compliance:** Updated `legal.module.css` to respect the 15% desktop margin policy (`width: 70vw; max-width: 70vw; margin-inline: auto;`).
- **Quality Gates & Tests:**
  - 21/21 test files / 65 unit tests passing in Vitest (100% pass rate).
  - `npm run lint` and `npm run typecheck` passing with 0 warnings/errors.

---

## Session Log — 2026-09-15

### Bug Fixed: Footer "Frequently Asked Questions" Link

**Symptom:** Clicking the FAQ footer link from any page other than home
landed on the "Why Choose Us" / Plans section instead of the FAQ section.
On the home page itself, the link did nothing (kept the user at the footer).

**Root causes identified (three separate bugs):**

1. **Same-page click did nothing** — `handleAnchorClick` in
   `SmoothScrollProvider` called `calculatePinnedScrollY`, which walked
   `offsetTop` chains and then added GSAP ScrollTrigger `start`/`end` values
   as "pin distances". Those values are scroll-progress markers, not pixel
   distances, so the arithmetic badly overcounted and sent Lenis to the
   bottom of the page (visually: no movement from footer).

2. **Cross-page click landed on WhyUs/Plans** — the click handler only
   intercepted `/#hash` links when `window.location.pathname === '/'`.
   From other pages the click fell through un-prevented, Next.js navigated
   client-side to `/#faq`, and the `pathname` useEffect tried to scroll —
   but with a stale, incorrectly-sized GSAP pin spacer.

3. **Pin spacer sized incorrectly on fresh navigation** — `WhyUsSection`'s
   `useEffect` dispatches `layout-pinned` synchronously after
   `ScrollTrigger.refresh()`. At that exact moment `track.scrollWidth`
   (the card track's rendered width) is often `0` or an incomplete value
   because the browser's CSS layout pass hasn't completed yet. GSAP's
   `end: () => \`+=${getScrollDistance() + 450}\`` callback evaluates to
   `~450px` instead of `~1590px`, making the pin spacer far too short.
   Every subsequent scroll-position calculation based on
   `getBoundingClientRect()` therefore returns the position of `#faq`
   *without* the pin spacer, landing the user at the WhyUs/Plans boundary.

**Fix applied — `SmoothScrollProvider.tsx`:**

- Replaced `calculatePinnedScrollY` (broken offsetTop + GSAP pin-distance
  arithmetic) with `getScrollTarget` — uses
  `getBoundingClientRect().top + window.scrollY - headerOffset`, which reads
  the actual rendered position and is always correct for same-page scrolls.

- Fixed `handleAnchorClick` to extract `hash` from any `/#hash` href
  (removed the `pathname === '/'` restriction). If the target element exists
  on the current page → intercept + smooth-scroll. If not → **two-step
  cross-page flow** (see below).

- **Two-step cross-page navigation:** When `/#faq` is clicked from another
  page and the target element is not in the DOM:
  1. Store `hash` in `pendingHashRef.current`.
  2. Call `router.push('/')` — navigates to home *without* a hash, so
     `window.scrollY` resets to `0` and the browser never attempts a native
     anchor jump.
  3. The `pathname` useEffect fires for `/`. It reads `pendingHashRef` (not
     `window.location.hash`, which is empty), clears it, and enters the
     `isPending` branch.
  4. Waits a flat **600 ms** — by then every React effect has run, GSAP has
     set up its ScrollTrigger with the correct `track.scrollWidth`, and CSS
     layout is fully settled.
  5. Calls `ScrollTrigger.refresh()` to re-evaluate the dynamic `end`
     callback and resize the pin spacer to its true height.
  6. One `requestAnimationFrame` to let the browser commit the updated pin
     spacer to layout.
  7. `getScrollTarget(#faq)` now returns the correct document position →
     `lenis.scrollTo(scrollY, { duration: 1.2 })` → URL updated to `/#faq`.

- Kept the original `layout-pinned` event + 50 ms polling logic for the
  *direct URL hash* case (user opens `/#faq` directly in a new tab), where
  the flat 600 ms wait would add unnecessary delay.

**Files changed:**
- `src/components/providers/SmoothScrollProvider.tsx` — all logic above.
  No changes to `WhyUsSection.tsx`, `Footer.tsx`, or any other file.

---

### Session Note — Video Optimization, 404 Page Redesign & Test Suite Polish (2026-09-15)

- **High-Efficiency Video Optimization (`ffmpeg-static`):**
  - Built automated optimization scripts (`scripts/optimize-videos.js` and `scripts/optimize-404-1.js`) using `ffmpeg-static` (H.264 CRF 28/30 720p slow preset + VP9 WebM CRF 33/35 + poster frame extraction).
  - `Hero.mp4`: 16.3 MB → **1.01 MB** (93.8% reduction), created `Hero.webm` (**1.18 MB**) and `hero-poster.jpg` (158 KB).
  - `404.mp4`: 7.4 MB → **0.42 MB** (94.4% reduction), created `404.webm` (**0.65 MB**) and `404-poster.jpg` (188 KB).
  - `404_1.mp4`: 14.0 MB → **0.32 MB** (97.7% reduction), created `404_1.webm` (**0.23 MB**) and `404_1-poster.jpg` (171 KB).
  - Total video asset footprint reduced by ~95%, ensuring fast load times on shared hosting.

- **Custom 404 Page Redesign & Polish (`/404`):**
  - Rebuilt `src/app/not-found.tsx` with full-screen `404_1` space/earth video background and `404_1-poster.jpg` fallback.
  - Eliminated Flash of Unstyled Content (FOUC) by hiding Navbar, Footer, and `FloatingContactHub` at paint time using pure CSS `body:has([data-page="not-found"])` in `globals.css`.
  - Converted error code to semantic `<h1 className={styles.errorCode}>404</h1>` in clean glowing white (`#ffffff`).
  - Added copy:
    - *"The page seems to have slipped beyond our reach :/"*
    - *"Let’s bring you back to solid ground."*
  - Streamlined CTA to single primary *"Back to Homepage"* button.
  - Calibrated video filter (`brightness(0.85) saturate(0.95)`) and softened gradient overlays in `not-found.module.css` for clear atmosphere and starfield visibility while preserving high text legibility.

- **Test Suite & CI Quality Gates:**
  - **FAQ Accessibility:** Coerced `aria-expanded` to explicit `'true' | 'false'` strings in `FaqSection.tsx` to fix WebKit/Mobile Safari accessibility query discrepancies.
  - **Unit Tests:** Updated `src/tests/LegalPages.test.tsx` to assert semantic `<h1>404</h1>` and new 404 copy.
  - **E2E Tests:** Updated `tests/legal.spec.ts` 404 navigation to use `{ waitUntil: 'domcontentloaded' }`, preventing Mobile Safari media stream buffering timeouts.
- **Why Choose Us Section Redesign & Playful GSAP Choreography:**
  - **Left Feature Image Integration:** Positioned `/Why_choose_us-removebg-preview.png` on the left of `trackViewport` in `WhyUsSection.tsx` with responsive scaling and drop shadow.
  - **Image Exit Synchronized to Card Contact:** Wired GSAP `containerAnimation` so the left image remains 100% solid while the user views the initial state, and smoothly slides/fades out (`opacity: 0, x: -100px`) only when Card 01 moves across to meet its boundary.
  - **Whitespace Reduction & Centering:** Set `.section` to `justify-content: center` with tightened top/bottom padding (`clamp(1rem, 2vw, 2rem)`) to eliminate bottom dead space inside the pinned viewport.
  - **Enlarged Figure & Slimmed Cards:** Scaled feature image to `clamp(380px, 44vw, 580px)` (`max-height: 620px`) and slimmed card widths to `350px` on desktop (`300px–340px` on tablet) for a modern, balanced composition.
  - **Center-Screen Sequential Entrances:** Cards 02–06 start 100% invisible (`opacity: 0`). Each card's custom playful entrance triggers strictly when the preceding card reaches the center (50%) of the screen:
    - Card 02 (⚡ Low Latency): Drops in with an elastic top bounce (`y: -130px`, `rotation: 7deg`, `back.out(1.6)`).
    - Card 03 (📞 24/7 Support): Rises from bottom-right with a tilt (`y: +120px`, `x: +50px`, `rotation: -8deg`).
    - Card 04 (📡 Wi-Fi 6): Elastic pop with de-blurring focus (`scale: 0.55`, `blur(8px)` → `scale: 1`, `blur(0px)`).
    - Card 05 (⇅ Symmetric Speeds): Swift overshoot slide-in from right (`x: +180px`, `y: -35px`, `rotation: -6deg`).
    - Card 06 (🛡️ Zero FUP): 3D perspective fold-in (`rotationY: 40deg`, `y: +70px`, `scale: 0.82` with 1200px perspective).

## Phase 5.5 — Home Page Interactive Upgrades: Services Showcase, Speed Test Tool & Swipeable Why Us
> Goal: Integrate two high-engagement interactive features on the homepage (Expanded Services Showcase and Live Internet Speed Test Widget), adjust the Why Choose Us section into a smooth swipeable carousel (identical on mobile & desktop), and restructure homepage section flow: Hero → Services Showcase → Plans Preview → Why Choose Us → Speed Test Widget → FAQs → Contact CTA.

---

#### W-551 — Expanded Services Showcase Section (`ServicesSection.tsx`)

**Root cause:**
The current homepage presents broadband and leased lines solely as broad pricing cards. Enterprise and residential visitors looking for specific ISP offerings (e.g., Home Broadband, Internet Leased Lines, Managed ILL, Business Internet Access, and Managed Wi-Fi Solutions) need a dedicated interactive showcase right below the Hero to immediately identify their service category and navigate to the relevant plan or quote page.

**Goal:**
1. Create `src/data/services.ts` containing the 5 core ISP service categories with icons, short descriptions, target badges, and direct navigation links (`/plans/` or `/lease-lines/`).
2. Build `src/components/sections/ServicesSection.tsx` placed directly below `HeroSection`.
3. On Desktop (≥ 900px): Feature image visual (`/Why_choose_us-removebg-preview.png`) positioned on the left with horizontal GSAP entrance / scroll animation across the 5 service cards.
4. On Mobile (< 900px): Clean swipeable card carousel with left/right touch swipe gestures, pagination dot navigation, and top visual image.

**Approach:**
Extract services data in `src/data/services.ts`. Model after the proven GSAP horizontal animation pattern on desktop, and touch-scroll with swipe indicators on mobile. Each card renders an icon, service title, badge, benefit description, and an action button linking to `/plans/` or `/lease-lines/`.

---

- [x] **RED — Component Test (`src/tests/ServicesSection.test.tsx`):**
  - [x] Test: Render `<ServicesSection />` — assert section renders with `aria-labelledby="services-title"` and heading "Our Services & Solutions".
  - [x] Test: Assert all 5 service cards render with titles: "Home Broadband", "Internet Leased Line (ILL)", "Managed Internet Leased Line", "Business Internet Access", and "Managed Wi-Fi Solutions".
  - [x] Test: Assert CTA links correctly point to `/plans/` (for residential) and `/lease-lines/` (for enterprise).
  - [x] Test: Assert visual feature image is present with `src="/Why_choose_us-removebg-preview.png"`.
  - [x] **Run — confirm RED (component and data files do not exist yet).**

- [x] **GREEN — Implementation:**
  - [x] [Type] Add `ServiceItem` interface in `src/types/index.ts`.
  - [x] [Data] Create `src/data/services.ts` with all 5 core service offerings.
  - [x] [Component] Create `src/components/sections/ServicesSection.tsx` and `ServicesSection.module.css` conforming to the 70vw layout grid on desktop and touch swipe on mobile.
  - [x] Run component test — **confirm GREEN.**

- [x] **Verification chain:**
  - [x] Navigate to `http://127.0.0.1:3007/` in browser.
  - [x] Observe Services section immediately below the Hero video.
  - [x] Desktop (≥ 900px): Feature image renders on the left; horizontal animation glides smoothly through all 5 service cards.
  - [x] Mobile (375px): User swipes left/right across cards smoothly with responsive dot indicators.
  - [x] Click "Explore Plans" → navigates to `/plans/`; click "Request Leased Line" → navigates to `/lease-lines/`.
  - [x] ✅ Done.

---

#### W-552 — Why Choose Us Swipeable Slider Refactor (`WhyUsSection.tsx`)

**Root cause:**
The previous fullscreen GSAP scroll-pinning in `WhyUsSection.tsx` created heavy scroll takeover and occasional anchor jumping edge-cases. Since the horizontal animation is now championed by the new Services section, Why Choose Us should be converted into a clean, lightweight swipeable card slider (both desktop and mobile) so visitors can freely swipe cards left/right without locking document scroll.

**Goal:**
1. Refactor `src/components/sections/WhyUsSection.tsx` and `WhyUsSection.module.css` to eliminate the pinned GSAP `ScrollTrigger` takeover.
2. Provide a fluid horizontal swipeable carousel for all 6 feature cards with smooth drag/scroll and navigation dots/arrows.
3. Keep the section lightweight, performant, accessible, and natural to scroll past on all viewports.

**Approach:**
Remove GSAP pin-scroll tweens from `WhyUsSection.tsx`. Implement CSS scroll-snap with standard touch swipe and optional arrow/dot controls.

---

- [x] **RED — Component & Unit Test (`src/tests/WhyUsSection.test.tsx`):**
  - [x] Test: Render `<WhyUsSection />` — assert all 6 feature cards render without requiring GSAP pin triggers.
  - [x] Test: Assert pagination dots allow clicking to scroll to card index.
  - [x] Test: Assert no layout locks or horizontal document scrollbars occur on root container.
  - [x] **Run — confirm RED (current implementation relies on pinned GSAP scroll).**

- [x] **GREEN — Implementation:**
  - [x] [Component] Update `src/components/sections/WhyUsSection.tsx` to remove GSAP pin logic while retaining clean entrance reveals (`<ScrollReveal>`).
  - [x] [Styles] Update `src/components/sections/WhyUsSection.module.css` with smooth CSS scroll-snap and drag/swipe support.
  - [x] Run component test — **confirm GREEN.**

- [x] **Verification chain:**
  - [x] Navigate to `http://127.0.0.1:3007/` and scroll to "Why Choose Us".
  - [x] Notice page vertical scrolling remains 100% natural and unpinned.
  - [x] On mobile & desktop: swipe or click dots to slide between the 6 feature cards smoothly.
  - [x] ✅ Done.

---

#### W-553 — Interactive Internet Speed Test Widget (`SpeedTestSection.tsx`)

**Root cause:**
ISP visitors are highly motivated by testing their current connection speed. Having a live, interactive speed test tool directly on the homepage increases user engagement, creates trust, and provides an immediate conversion opportunity (comparing current speed against JDAirNet's plans).

**Goal:**
1. Build `src/components/sections/SpeedTestSection.tsx` placed immediately after the "Why Choose Us" section.
2. Interactive client-side speed test tool (100% compatible with static export):
   - "Start Test" trigger button.
   - Animated speedometer gauge / progress arc (measuring Ping/Latency, Download Speed in Mbps, and Jitter).
   - Real-time client-side measurement (downloading static binary chunks with `performance.now()`).
   - Dynamic comparison and plan recommendation banner upon completion (e.g., *"Your speed is 24 Mbps — Upgrade to JDAirNet 200 Mbps for buffer-free 4K"* with direct CTA to `/plans/` and WhatsApp).

**Approach:**
Create a dedicated Client Component `SpeedTestSection.tsx` using HTML5 Canvas or SVG gauge with smooth numeric count-up animations. For measurement in static export, fetch small static payload files from `public/` with cache-busting headers to compute real-time throughput and round-trip ping.

---

- [x] **RED — Component Test (`src/tests/SpeedTestSection.test.tsx`):**
  - [x] Test: Render `<SpeedTestSection />` — assert initial idle state renders with "Start Speed Test" button and gauge at 0 Mbps.
  - [x] Test: Click "Start Speed Test" — assert test initiates (state changes to testing, gauge animates).
  - [x] Test: Assert result state displays measured speed, ping, and recommendation CTA linking to `/plans/`.
  - [x] **Run — confirm RED (component does not exist yet).**

- [x] **GREEN — Implementation:**
  - [x] [Component] Create `src/components/sections/SpeedTestSection.tsx` with gauge animation, measurement engine, and recommendation CTA card.
  - [x] [Styles] Create `src/components/sections/SpeedTestSection.module.css` with speedometer arc, responsive stats counters, and glow highlights.
  - [x] [Asset] Ensure lightweight static test asset exists in `public/` for reliable throughput calculation.
  - [x] Run component test — **confirm GREEN.**

- [x] **Verification chain:**
  - [x] Scroll to Speed Test section on homepage.
  - [x] Click "Start Speed Test" → watch needle/arc sweep with real-time ping and download calculation.
  - [x] Test finishes → results card highlights connection quality + recommends matching JDAirNet plan.
  - [x] Click "Upgrade to this Plan" → navigates to `/plans/` with target plan highlighted.
  - [x] ✅ Done.

---

#### W-554 — Home Page Assembly, Section Ordering & E2E Verification (`src/app/page.tsx`, `tests/home.spec.ts`)

**Root cause:**
The homepage must integrate all new interactive components in the exact specified flow: Hero → Services Showcase → Plans Preview → Why Choose Us → Speed Test → FAQs → Contact CTA, without any layout shift, broken links, or test regressions.

**Goal:**
1. Update `src/app/page.tsx` to mount sections in the exact sequential order.
2. Update Playwright E2E suite (`tests/home.spec.ts` & `tests/interactive.spec.ts`) to validate all new interactive behaviors.
3. Validate static export build (`npm run build`) and quality gates (`npm run ci:quality`).

---

- [x] **RED — E2E Test (`tests/interactive.spec.ts`):**
  - [x] Test: Navigate to `/` — verify section order (Hero → Services → Plans → WhyUs → SpeedTest → FAQs → ContactCTA).
  - [x] Test: Services section cards link properly to `/plans/` and `/lease-lines/`.
  - [x] Test: Speed test widget completes test cycle and renders recommendation CTA.
  - [x] Test (mobile 375px): Services and Why Us cards swipe cleanly without horizontal page blowout.
  - [x] **Run — confirm RED.**

- [x] **GREEN — Implementation:**
  - [x] Update `src/app/page.tsx` section sequence.
  - [x] Update `tests/home.spec.ts` and add `tests/interactive.spec.ts`.
  - [x] Run full CI quality suite (`npm run ci:quality`) — **confirm GREEN.**

- [x] **Verification chain:**
  - [x] Run `npm run ci:quality` — all lint, typecheck, unit tests, and E2E tests pass (100% green).
  - [x] Run `npm run build` — static export succeeds to `out/` with zero errors.
  - [x] Run `npm run serve` — QA the complete homepage flow in real browser.
  - [x] ✅ Done.

### Session Note — Phase 5.5 Completion: Services Showcase, Live Speed Test & Swipeable Why Us (2026-09-15)

- **Expanded Services Showcase (`ServicesSection.tsx` & `src/data/services.ts`) (W-551):**
  - Positioned directly below the Hero video, providing immediate category clarity for residential and B2B visitors (*Home Broadband, Internet Leased Line, Managed Leased Line, Business Internet, and Managed Wi-Fi Solution*).
  - Desktop (≥ 900px): Integrated left feature image (`/Why_choose_us-removebg-preview.png`) with full-screen pinned GSAP horizontal scroll and exact playful sequential entrances (Elastic Top Bounce, Bottom-Right Rise & Tilt, Elastic Pop & De-blur, and Swift Overshoot Slide). Left figure smoothly slides and fades out (`opacity: 0, x: -100px`) synchronized directly to Card 01 boundary.
  - Mobile (< 900px): Fluid touch-swipeable card carousel with interactive dot pagination indicators.
  - Streamlined card presentation with concise 1–2 line descriptions, speed taglines, and direct conversion CTAs linking to `/plans/` and `/lease-lines/`.

- **Why Choose Us Swipeable Slider Refactor (`WhyUsSection.tsx`) (W-552):**
  - Converted the layout on desktop and mobile into a lightweight, unpinned horizontal swipeable carousel with CSS scroll-snap, arrow buttons, and pagination dots.
  - Eliminated full-screen scroll takeover, restoring 100% natural, unpinned vertical page scrolling through the section.

- **Live In-Browser Speed Test & Plan Matcher (`SpeedTestSection.tsx`) (W-553):**
  - Built an interactive client-side speed benchmark widget positioned right after Why Choose Us (100% static export compatible).
  - Integrated real-time network latency probes (`performance.now()`), jitter calculation, and progressive data stream throughput measurement (`fetch()` with `ReadableStream`) for accurate Mbps readings matching real benchmarks like Fast.com.
  - Animated SVG speedometer arc with real-time numeric count-ups and intelligent post-test plan recommendation cards (*e.g., detecting slow speeds like 7–8 Mbps and recommending JDAirNet 100 Mbps or 200 Mbps fiber*).

- **Homepage Assembly & Verification (W-554):**
  - Updated `src/app/page.tsx` section sequence: Hero → Services Showcase → Plans Preview → Why Choose Us → Speed Test Tool → FAQs → Contact CTA.
  - Created unit tests (`src/tests/ServicesSection.test.tsx`, `src/tests/SpeedTestSection.test.tsx`) and updated E2E suite (`tests/home.spec.ts`).

---

### Session Note — Mobile Scroll Reveal Timing, 404 Routing, Production Apache & CI Pipeline Fixes (2026-09-15)

- **Mobile Scroll Reveal Responsiveness:**
  - Updated `useScrollReveal.ts` and `ScrollReveal.tsx` default trigger `start` threshold from `top 88%` / `top 85%` to **`top 95%`**, ensuring elements reveal immediately when entering the viewport bottom.
  - Reduced initial vertical offset `y` from `30px` to `16px` and duration to `0.5s` for swift, instantaneous entrances on mobile viewports.
- **Apache Shared Hosting & Asset Loading Fixes (`public/.htaccess`):**
  - Updated 404 handler to direct static export: `ErrorDocument 404 /404.html`.
  - Added explicit MIME types (`AddType font/woff2 .woff2`, `AddType font/woff .woff`, `AddType video/webm .webm`, `AddType video/mp4 .mp4`).
  - Added CORS headers (`Access-Control-Allow-Origin "*"`) for web fonts to resolve `status=2152398850` font download errors.
  - Configured zero-caching on HTML files (`Cache-Control: no-cache, no-store, must-revalidate`) to prevent stale chunk hash mismatches (`ChunkLoadError`).
  - Configured immutable caching for hashed static assets (`/_next/static/`).
- **Automated Deployment Packaging (`scripts/package-build.js` & `npm run package`):**
  - Built automated deployment packaging script creating `out/website.zip` (4.17 MB) with `.htaccess` and all static chunks for 1-click extraction on Hostinger / GoDaddy File Manager.
- **CI Quality Gate Pipeline Update:**
  - Added `npm run build` to `ci:quality` script in `package.json` (`npm run lint && npm run typecheck && npm run test:unit && npm run test:e2e && npm run build`) and updated `decision_log.md` and `local_setup.md`.
- **Quality Gates & Tests:**
  - 23/23 Vitest unit test files / 71 tests passing (100% green).
  - 92/92 Playwright E2E tests passing across Desktop Chromium, Mobile Chrome, and Mobile Safari.
  - `npm run lint` and `npm run typecheck` passing with 0 errors.
  - Production static build and `website.zip` packaging succeeded cleanly.

---

## Phase 6 — Polish, Performance & Pre-Launch

---

#### W-601 — Hero Poster Image

- [x] **Root cause:** iOS Safari will not autoplay video without `muted + playsInline`. Even with both set, slow connections on mobile need an instant visual. The poster image is the fallback.
- [x] Extract still frame: `ffmpeg -i Hero.mp4 -ss 00:00:02 -frames:v 1 public/hero-poster.jpg`
- [x] Verify `hero-poster.jpg` is visually compelling (good frame of the city skyline)
- [x] Verify `poster="/hero-poster.jpg"` is set on the `<video>` tag

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
| Phase 0 | Project Foundation & Quality Infrastructure | ✅ COMPLETED |
| Phase 1 | SEO Foundation & Global Layout | ✅ COMPLETED |
| Phase 2 | Home Page | ✅ COMPLETED |
| Phase 2.5 | Lenis Smooth Scroll & GSAP Animations | ✅ COMPLETED |
| Phase 3 | Plans Page | ✅ COMPLETED |
| Phase 4 | Lease Lines Page | ✅ COMPLETED |
| Phase 5 | Coverage, About, Contact Pages | ✅ COMPLETED |
| Phase 5.5 | Home Page Interactive Upgrades (Services, Speed Test & Swipeable Why Us) | ✅ COMPLETED |
| Phase 6 | Polish, Performance & Pre-Launch | 🟢 READY TO START |
| Phase 7 | Blog | 🔵 FUTURE |
