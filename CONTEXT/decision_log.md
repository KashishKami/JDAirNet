# Architecture & Design Decisions Log

This document records every significant design decision, its rationale, and its trade-offs for the JDAirNet website. Every architectural deviation or non-obvious choice must be logged here before implementation begins. If a proposal contradicts a logged decision, flag it and ask before proceeding.

---

### Decision 1: Next.js Static Export (`output: 'export'`) for Shared Hosting

**Date:** 2026-09-11
**Status:** Accepted

#### Context
The website must be hosted on Hostinger (or GoDaddy) shared hosting, which does not provide a Node.js process manager. This rules out running Next.js in server mode. Options considered: pure HTML/CSS/JS, WordPress, or Next.js static export.

#### Decision
Use **Next.js App Router with `output: 'export'`** in production. This compiles the entire site into static HTML/CSS/JS files in the `out/` folder, deployable to any shared host via FTP.

In development mode, static export is NOT active — the dev server runs normally, which enables:
- Fast Refresh (HMR)
- Proper error overlays
- Dynamic rewrites for PHP mailer proxy (if needed)

```javascript
// next.config.mjs
output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
```

#### Consequences
- No Next.js API routes in production. Contact form is handled by a separate `contact.php` file.
- No `next/image` optimization. All images use `<img>` with `unoptimized: true`.
- No SSR, no middleware, no server actions.
- Build output is `out/` — this folder contents are what get uploaded to Hostinger `public_html/`.

---

### Decision 2: `trailingSlash: true` — Mandatory for Shared Hosting

**Date:** 2026-09-11
**Status:** Accepted

#### Context
Shared hosting Apache servers resolve `/contact/` to `contact/index.html` natively. Without trailing slashes, `/contact` (without slash) would require an `.htaccess` rewrite rule to resolve. With `trailingSlash: true`, Next.js exports each page as `slug/index.html`, which works out of the box on Apache.

#### Decision
`trailingSlash: true` is permanently set in `next.config.mjs`. All internal links use `<Link href="/contact/">` (with trailing slash). All canonical URLs in metadata end in `/`.

#### Consequences
- Every sitemap URL ends in `/`
- All canonical tags end in `/`
- All `<Link>` hrefs end in `/`
- `.htaccess` needs only a basic HTTPS redirect rule, not slug rewrite rules

---

### Decision 3: PHP Mailer for Contact Form (No Third-Party Service)

**Date:** 2026-09-11
**Status:** Accepted

#### Context
The contact form must submit to something server-side. Options: (a) third-party service like Formspree/Web3Forms, (b) PHP mailer using Hostinger's built-in SMTP.

#### Decision
Use a **`contact.php`** file deployed alongside the exported `out/` folder on Hostinger. The PHP file uses PHPMailer + Hostinger SMTP credentials to send form submissions to the company inbox.

The Next.js frontend submits via `fetch('/contact.php', { method: 'POST', body: formData })`.

#### Consequences
- One additional PHP file to maintain
- Zero third-party service dependency or monthly cost
- Must configure SMTP credentials in Hostinger hPanel (Email Accounts section)
- In local dev: PHP is not available natively. Local testing of the form requires either a local PHP server or mock the fetch response. Playwright E2E tests mock the PHP endpoint.
- `contact.php` file must be manually updated on Hostinger when changed (it is NOT part of the `out/` folder — it lives separately in `public_html/`)

---

### Decision 4: Port 3007 + IPv4 127.0.0.1 for Dev Server

**Date:** 2026-09-11
**Status:** Accepted

#### Context
Common ports (3000, 3001, 8080) frequently collide with other projects on the same machine. Using `localhost` introduces DNS resolution latency and IPv6 vs IPv4 ambiguity on Windows. The eleven_eleven_decor project uses similar patterns.

#### Decision
- Dev server runs on **port 3007** (uncommon, project-specific)
- All references use **`127.0.0.1`** (not `localhost`)
- Set in `package.json`: `"dev": "next dev -p 3007 -H 127.0.0.1"`
- `.env.local` contains `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3007`
- `.env.test` contains `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3007` and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007`

#### Consequences
- Dev URL is always `http://127.0.0.1:3007` — team must bookmark this
- All Playwright tests use `PLAYWRIGHT_BASE_URL` from `.env.test`
- Vitest unit tests do not need the dev server (pure component/function tests)

---

### Decision 5: Vanilla CSS Modules — No Tailwind, No CSS-in-JS

**Date:** 2026-09-11
**Status:** Accepted

#### Context
Options: Tailwind CSS, CSS-in-JS (styled-components), or vanilla CSS Modules. Tailwind was rejected because (a) user did not explicitly request it, (b) the TelNet theme is built with vanilla CSS and requires precise control over gradient layers, video positioning, and responsive card layouts that are cleaner in plain CSS.

#### Decision
- One `.module.css` file per component or page
- Global CSS custom properties in `src/styles/globals.css` (color tokens, font variables, spacing scale)
- No utility-class framework

#### Consequences
- More CSS to write, but full control over the pixel-perfect TelNet hero replication
- CSS Modules provide automatic class scoping — no naming conflicts
- Animations and gradient effects are expressed in vanilla CSS keyframes

---

### Decision 6: Three Contact Channels — Always Visible on Mobile

**Date:** 2026-09-11
**Status:** Accepted

#### Context
The core product goal of the website is converting visitors into leads through three channels: call, WhatsApp, contact form. On mobile, these must never be hidden behind a menu.

#### Decision
A **sticky bottom bar** on mobile (fixed position, `bottom: 0`) contains all three contact actions: [📞 Call] [💬 WhatsApp] [✉️ Email Form]. This bar is hidden on desktop (where the navbar CTA and inline section CTAs are sufficient).

#### Consequences
- `ContactBar.tsx` component rendered in root layout, visible on all pages
- `z-index` management: contact bar sits above all content, below modals
- Mobile body needs `padding-bottom` to prevent content being hidden behind the bar

---

### Decision 7: Hero Video — Use as-is with Poster Fallback for Mobile

**Date:** 2026-09-11
**Status:** Accepted

#### Context
`Hero.mp4` is ~11MB. On mobile, iOS Safari does not autoplay video unless `muted` and `playsInline` are both set. Question was: use video as-is, extract frames for slideshow, or use a static image on mobile.

#### Decision
- **Desktop:** `<video autoPlay muted loop playsInline>` — full video
- **Mobile (< 768px):** Video still loads but with `preload="none"` — the `poster` image (a single extracted still from Hero.mp4) displays immediately. Video plays if bandwidth allows. This is the optimal balance of performance and visual quality.
- **Extraction:** Run `ffmpeg -i Hero.mp4 -ss 00:00:02 -frames:v 1 hero-poster.jpg` to extract the best still frame for the poster.

#### Consequences
- `hero-poster.jpg` must be created and placed in `public/` before the hero section is built
- On very slow connections, mobile users see the poster image (which is intentional)
- `Hero.mp4` should be placed in `public/` folder — it will be served statically

---

### Decision 8: SEO Infrastructure from Day 1 — Blog-Ready but Not Blog-Built

**Date:** 2026-09-11
**Status:** Accepted

#### Context
A future SEO team may add a blog. Setting up proper `sitemap.ts`, `robots.ts`, `schemaGenerators.ts`, and per-page metadata NOW costs almost nothing extra but saves a full migration later.

#### Decision
- Build the complete SEO infrastructure in Phase 1 (foundation phase)
- `sitemap.ts` includes a blog URL section that is gated by an env flag (`NEXT_PUBLIC_BLOG_ENABLED`)
- `schemaGenerators.ts` includes a `generateArticleSchema()` function — dormant but present
- Blog pages (`/blog/`, `/blog/[slug]/`) are NOT built — but their URL patterns are documented in `project_data.md`
- When blog is ready: create the page files, flip the env flag, rebuild and redeploy

#### Consequences
- Zero additional complexity now
- When blog launches: (1) create page files, (2) set `NEXT_PUBLIC_BLOG_ENABLED=true`, (3) rebuild, (4) upload
- The SEO team's pages automatically appear in sitemap on next build

---

### Decision 9: Hostinger as Primary Hosting Target

**Date:** 2026-09-11
**Status:** Accepted (GoDaddy remains a valid fallback — same deployment method)

#### Context
Both Hostinger and GoDaddy support the same Apache shared hosting model. Hostinger was chosen for: lower cost, cleaner hPanel interface, better PHP 8.x support, and free SSL via Let's Encrypt.

#### Decision
All deployment documentation targets Hostinger. If GoDaddy is used instead, the only difference is the control panel UI for creating email accounts and uploading files. The code does not change.

#### Consequences
- `contact.php` uses Hostinger SMTP (`smtp.hostinger.com`, port 465 or 587)
- If switching to GoDaddy: update SMTP host in `contact.php` to `smtpout.secureserver.net`

---

### Decision 10: CSS Font Loading via `next/font/google` — No External `<link>` Tags

**Date:** 2026-09-11
**Status:** Accepted

#### Context
Google Fonts can be loaded via `<link rel="stylesheet">` in `<head>` or via `next/font/google`. The `next/font` approach downloads the fonts at build time, self-hosts them alongside the static export, and eliminates the Google Fonts network request at runtime.

#### Decision
All fonts (Unbounded, Kanit, Poppins) are loaded via `next/font/google` in `src/app/layout.tsx`. The fonts are included in the `out/` folder and served from the same domain.

#### Consequences
- Zero FOUT (Flash of Unstyled Text)
- No Google Fonts request from the visitor's browser — better privacy and performance
- Font files are included in the `out/` folder and uploaded to Hostinger with everything else

---

### Decision 11: Linting, Type-Checking, and Testing Toolchain

**Date:** 2026-09-11
**Status:** Accepted

#### Context
Even for a marketing website, quality gates prevent regressions and ensure the static export is always clean. The CI pipeline must run on GitHub Actions on every push.

#### Decision

**Individual commands in `package.json`:**
```json
{
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test:unit": "vitest run",
  "test:unit:watch": "vitest",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "ci:quality": "npm run lint && npm run typecheck && npm run test:unit && npm run test:e2e"
}
```

**GitHub Actions CI (`.github/workflows/ci.yml`):**
- Separate job steps (NOT calling `ci:quality`) so each step appears individually in the GitHub Actions UI
- Steps: `lint` → `typecheck` → `test:unit` → `test:e2e` → `build`
- E2E tests run against the built `out/` folder served by `npx serve`

#### Consequences
- Each CI step is independently visible in GitHub — failures are instantly identified
- `ci:quality` is for local pre-push validation only
- Vitest for unit tests (component logic, schema generator functions, data integrity)
- Playwright for E2E (contact form submission flow, navigation, mobile viewport tests)

---

### Decision 12: Global Light / White Theme & 15% Margins Content Grid (`70vw`)

**Date:** 2026-09-12
**Status:** Accepted

#### Context
The user requested a clean, modern white background across all page sections below the video hero, along with strict 15% left and right margins (`70vw` desktop width) across all sections, aligning the Navbar, Hero Card, Plan Cards, Why Us, FAQs, and Footer.

#### Decision
- Global CSS tokens in `globals.css` set body background to clean white (`#ffffff`) and off-white (`#f8fafc`) with dark high-contrast typography (`#0f172a` headings, `#475569` body text).
- `.container`, `.navContainer`, and `.heroCard` enforce `width: 70vw; max-width: 70vw; margin-inline: auto;` on desktop (`@media (min-width: 768px)` / `1024px`).
- Button colors updated to refined low-saturation tones (burgundy red `#c81e2b`, matte WhatsApp green `#1f8a4c`, bordered white secondary CTA) with soft neutral shadows.

#### Consequences
- Consistent edge-to-edge 15% margin alignment on all desktop screen sizes.
- Crisp readability with optimal WCAG contrast across all sections.

---

### Decision 13: High-Clarity Transparent Hero Overlay & Single Framed CTA

**Date:** 2026-09-12
**Status:** Accepted

#### Context
The user requested maximum clarity for the background video through the hero card, extending the video to the very top behind a transparent navbar, and replacing dual CTAs with a single framed white pill button (`VIEW PLANS →`).

#### Decision
- Removed backdrop blur and heavy dark overlays (`backdrop-filter: none`, ambient `rgba(255, 255, 255, 0.04)` fill, deep ambient shadow `box-shadow: 0 40px 110px rgba(0,0,0,0.85)`).
- Navbar is transparent (`background: transparent`), extending the video behind the top bar.
- Navbar logo "JD" in pure white (`#ffffff`) and nav links in solid white (`#ffffff`) with active/hover highlight in red (`#ff4757`).
- Single framed white button with primary arrow icon links to `/plans/`.

#### Consequences
- Visually striking hero with natural video fidelity.
- Clear single conversion path to the plans page.
