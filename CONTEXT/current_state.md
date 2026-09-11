# Current State: JDAirNet Website Implementation Tracker

This is the live phase-by-phase build tracker. Always check this file FIRST before writing any code. Mark items `[/]` when starting, `[x]` when done. Do not skip to a later phase until all items in the current phase are complete.

**Last Updated:** 2026-09-12
**Current Active Phase:** Phase 3 (Plans Page `/plans/`)


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
| Phase 2.5 | Lenis Smooth Scroll & GSAP Animations | 🟢 READY TO START |
| Phase 3 | Plans Page | ⏸️ BLOCKED (needs P2.5) |
| Phase 4 | Lease Lines Page | ⏸️ BLOCKED (needs P3) |
| Phase 5 | Coverage, About, Contact Pages | ⏸️ BLOCKED |
| Phase 6 | Polish, Performance & Pre-Launch | ⏸️ BLOCKED |
| Phase 7 | Blog | 🔵 FUTURE |
