# Project Data: JDAirNet Website

This document is the single source of truth for all project metadata, business content, technical stack decisions, SEO rules, sitemap, plans data, and design references for the JDAirNet marketing website.

---

## 1. Core Metadata

- **Project Name:** JDAirNet Website
- **Company:** JDAirNet
- **Business Type:** Internet Service Provider (ISP) — Broadband (home & office) and Enterprise Lease Lines
- **Target Market:** Homes and offices (residential + B2B)
- **Timezone:** IST (Indian Standard Time, UTC+5:30)
- **Architecture:** Next.js (App Router), TypeScript, Static Export (`output: 'export'`)
- **Hosting Target:** Hostinger Shared Hosting (or GoDaddy shared hosting — same deployment method)
- **Repository Root:** `C:\Users\Administrator\Desktop\JDAirNet\`
- **Domain (production):** TBD — update this when the domain is registered
- **Dev Server:** `http://127.0.0.1:3007`

> ⚠️ UPDATE REQUIRED: Replace all instances of `https://jdairnet.com` with the actual domain once confirmed.

---

## 2. Business Contact Information

> ⚠️ PLACEHOLDER — Replace with real JDAirNet contact info before coding begins.

| Field | Value |
|---|---|
| Phone (call) | TBD |
| WhatsApp | TBD |
| Email (contact form destination) | TBD |
| Address | TBD |
| Business Hours | TBD |
| Google Maps URL | TBD |
| Instagram | TBD |
| Facebook | TBD |

---

## 3. Three Contact Channels

The entire website is built around converting visitors through exactly three channels. Every CTA on every page must point to one of these:

1. **Direct Call** — `tel:+91XXXXXXXXXX` — Opens phone dialer
2. **WhatsApp Chat** — `https://wa.me/91XXXXXXXXXX` — Opens WhatsApp chat with pre-filled message
3. **Contact Form** — POSTs to `/contact.php` via `fetch()` — PHP mailer sends email to company inbox

All three channels must be visible and accessible from every page on mobile (sticky footer bar or floating buttons).

---

## 4. Technical Stack & Architecture

### Core Framework
- **Next.js 15 (App Router)** — Static export in production, dynamic dev mode
- **TypeScript (strict mode)** — All files `.tsx` or `.ts`, no `any` types
- **Vanilla CSS (CSS Modules)** — No Tailwind, no CSS-in-JS. One `.module.css` per component.
- **`next/font`** — Google Fonts loaded via Next.js font system (zero FOUT)

### Key Next.js Config Rules
```javascript
// next.config.mjs
{
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,          // /contact/ → contact/index.html
  images: { unoptimized: true } // Required for static export
}
```

### What Static Export CANNOT Do
- No `next/image` optimization (use `<img>` tags directly with `unoptimized`)
- No API Routes (`src/app/api/`) — Contact form is handled by `contact.php` on the server
- No Server Components that fetch data at runtime
- No middleware
- No server actions

### Dev & Test Tooling
| Tool | Purpose |
|---|---|
| ESLint | Linting — `npm run lint` |
| TypeScript | Type checking — `npm run typecheck` |
| Vitest | Unit tests — `npm run test:unit` |
| Playwright | E2E tests — `npm run test:e2e` |
| `ci:quality` | Runs all of the above in sequence |

### Fonts
- **Display / Headings:** Unbounded or Kanit (bold, modern — matching TelNet theme aesthetic)
- **Body:** Poppins (clean, readable at all sizes)
- Both loaded via `next/font/google` in `src/app/layout.tsx`

---

## 5. Site Map & URL Slugs

All URLs use `trailingSlash: true`. Every page listed here must be added to `src/app/sitemap.ts`.

| Page | URL Slug | Priority | Notes |
|---|---|---|---|
| Home | `/` | 1.0 | Hero video, plans preview, why us, contact CTA |
| Plans | `/plans/` | 0.95 | Full broadband pricing table |
| Lease Lines | `/lease-lines/` | 0.9 | No pricing — only "Get a Quote" CTA |
| Coverage | `/coverage/` | 0.85 | Service area information |
| About | `/about/` | 0.75 | Company story, team, values |
| Contact | `/contact/` | 0.9 | All three channels + contact form |
| Privacy Policy | `/privacy-policy/` | 0.3 | Legal — noindex optional |
| Terms of Service | `/terms-of-service/` | 0.3 | Legal — noindex optional |
| Blog (future) | `/blog/` | 0.85 | NOT built yet — placeholder in sitemap.ts |
| Blog Post (future) | `/blog/[slug]/` | 0.8 | NOT built yet — schema ready |
| 404 | `not-found.tsx` | — | Custom 404 page |

### Navbar Link Order (matching rawatbroadband.net pattern)
```
[Logo]    Home  |  Plans  |  Lease Lines  |  Coverage  |  About  |  Contact    [📞 Call Now Button]
```

---

## 6. Broadband Plans Data

Source: www.rawatbroadband.net/en/plans — adapted for JDAirNet.
All prices are monthly, EXCLUDING 18% GST.

> ⚠️ PLACEHOLDER — Replace with actual JDAirNet plan prices once confirmed.

```typescript
// src/data/plans.ts
export const BROADBAND_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    speed: '50 Mbps',              // UPDATE with real speed
    price: 0,                      // UPDATE with real price (₹ per month excl. GST)
    priceDisplay: 'TBD',
    highlighted: false,
    badge: null,
    features: [
      'Unlimited Data',
      'Standard Support',
      'Basic Router Provided',
      '₹1,000 Installation Charge',
    ],
    addons: ['Watcho OTT', 'Pioneer IPTV'],
    ctaLabel: 'Get This Plan',
    ctaType: 'call',               // 'call' | 'whatsapp' | 'form'
  },
  {
    id: 'home',
    name: 'Home',
    speed: '100 Mbps',             // UPDATE
    price: 0,                      // UPDATE
    priceDisplay: 'TBD',
    highlighted: true,             // "Most Popular" badge
    badge: 'Most Popular',
    features: [
      'Unlimited Data',
      'Priority Support',
      'Dual-Band Router',
      'Free Installation',
    ],
    addons: ['Watcho OTT', 'Pioneer IPTV', 'Static IP'],
    ctaLabel: 'Get This Plan',
    ctaType: 'call',
  },
  {
    id: 'power',
    name: 'Power',
    speed: '200 Mbps',             // UPDATE
    price: 0,                      // UPDATE
    priceDisplay: 'TBD',
    highlighted: false,
    badge: null,
    features: [
      'Unlimited Data',
      'Priority Support',
      'Mesh-Compatible Router',
      'Free Installation',
    ],
    addons: ['Watcho OTT', 'Pioneer IPTV', 'Static IP'],
    ctaLabel: 'Get This Plan',
    ctaType: 'call',
  },
  {
    id: 'ultra',
    name: 'Ultra',
    speed: '500 Mbps',             // UPDATE
    price: 0,                      // UPDATE
    priceDisplay: 'TBD',
    highlighted: false,
    badge: 'Best Value',
    features: [
      'Unlimited Data',
      '24/7 VIP Support',
      'Premium Gigabit Router',
      'Free Installation',
      'Add-ons Available',
    ],
    addons: ['Watcho OTT', 'Pioneer IPTV', 'Static IP', 'HD Streaming'],
    ctaLabel: 'Get This Plan',
    ctaType: 'call',
  },
]
```

### Add-ons Available
| Add-on | Description |
|---|---|
| Watcho OTT | Stream 15+ OTT platforms (SonyLIV, Zee5, etc.) |
| Pioneer IPTV | 300+ Live TV channels |
| Static IP | Dedicated IP for gaming, remote access |
| HD Streaming | Buffer-free 4K across all devices |

---

## 7. Lease Lines Data

**No pricing displayed.** Lease lines are an enterprise product with custom quotes.

```typescript
// src/data/leaseLines.ts
export const LEASE_LINE_FEATURES = [
  { icon: 'symmetric', label: 'Symmetric Speeds', description: 'Equal upload & download for video conferencing and bulk transfers.' },
  { icon: 'dedicated', label: 'Dedicated Bandwidth', description: 'Uncontended 1:1 bandwidth — zero speed drops guaranteed.' },
  { icon: 'sla', label: 'SLA Guaranteed', description: '99.9% uptime Service Level Agreement with priority resolution.' },
  { icon: 'security', label: 'Enhanced Security', description: 'Private network with optional static IPs and advanced routing.' },
  { icon: 'noc', label: 'Local NOC Support', description: 'On-ground support team — not a call centre.' },
  { icon: 'scalable', label: 'Scalable Bandwidth', description: 'Start with what you need, scale as your business grows.' },
]

export const LEASE_LINE_USE_CASES = ['Businesses', 'Hostels', 'Colleges', 'Residential Societies', 'Hospitals', 'Hotels']
```

---

## 8. Design Reference & Visual Identity

### Theme Reference
- **Primary design reference:** https://themexriver.com/wp/telnet-wp/home-08/
- The hero section must match this visually: full-screen video with rounded card overlay, city skyline visible through the video, gradient sky (purple → pink → magenta → dark at horizon).

### Hero Section Specs
- Background: `Hero.mp4` (full-screen `<video>` tag, `autoPlay muted loop playsInline`)
- Mobile fallback: `hero-poster.jpg` (single extracted frame from Hero.mp4, used as `poster` attribute)
- Overlay: A rounded card/container centered on screen (as seen in theme) containing:
  - Small eyebrow badge: "BEST BROADBAND SOLUTION" (uppercase, bordered pill)
  - H1: "Best Internet Services In Your Region" (large, bold, white)
  - Subtext: Brief tagline
  - Two CTAs: Primary "View Plans →" + Secondary "Call Now"
- On mobile: video does NOT autoplay by default on iOS without `muted` + `playsInline` — both must always be set.

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#E10419` | Brand red (from TelNet theme) — CTAs, accents |
| `--color-primary-dark` | `#b80014` | Hover state for primary red |
| `--color-bg-dark` | `#0a0a1a` | Dark page sections |
| `--color-bg-medium` | `#12122a` | Slightly lighter dark sections |
| `--color-text-white` | `#ffffff` | Primary text on dark |
| `--color-text-muted` | `#a0a0b8` | Secondary text on dark |
| `--color-accent-purple` | `#6c3fc8` | Gradient accent |
| `--color-accent-magenta` | `#d4007f` | Gradient accent (hero sky) |
| `--color-border` | `rgba(255,255,255,0.1)` | Subtle borders on dark bg |

### Typography
| Role | Font | Weight | Source |
|---|---|---|---|
| Display / H1 | Unbounded | 700, 800 | Google Fonts via `next/font` |
| Headings H2-H4 | Kanit | 600, 700 | Google Fonts via `next/font` |
| Body / UI | Poppins | 400, 500, 600 | Google Fonts via `next/font` |

### Mobile-First Breakpoints
```css
/* Mobile first — base styles are for 320px+ */
/* Tablet */  @media (min-width: 768px)  { }
/* Desktop */ @media (min-width: 1024px) { }
/* Wide */    @media (min-width: 1280px) { }
```

---

## 9. SEO Architecture

### Per-Page Metadata Pattern
Every `page.tsx` exports a `metadata` object:
```typescript
export const metadata: Metadata = {
  title: 'Page Title',                              // Appended: "| JDAirNet"
  description: 'Page-specific description...',
  alternates: { canonical: 'https://jdairnet.com/slug/' },
  openGraph: {
    title: 'Page Title | JDAirNet',
    description: '...',
    url: 'https://jdairnet.com/slug/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}
```

### Root Layout Metadata (src/app/layout.tsx)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://jdairnet.com'),
  title: {
    default: 'JDAirNet | Fast Broadband & Lease Lines',
    template: '%s | JDAirNet',
  },
  description: 'JDAirNet provides high-speed broadband for homes and dedicated lease lines for offices and businesses.',
}
```

### JSON-LD Schemas (src/lib/schemaGenerators.ts)
| Schema | Page |
|---|---|
| `Organization` | Root layout (every page) |
| `LocalBusiness` | Contact page |
| `Service` (Broadband) | Plans page |
| `Service` (Lease Line) | Lease Lines page |
| `FAQPage` | Home page FAQ section |
| `BreadcrumbList` | Every inner page |
| `BlogPosting` | Ready but dormant — activates when blog is built |

### Sitemap & Robots
- `src/app/sitemap.ts` → generates `/sitemap.xml` at build time
- `src/app/robots.ts` → generates `/robots.txt` at build time
- All pages use `trailingSlash: true` — URLs end in `/`

---

## 10. File Structure

```
JDAirNet/
├── CONTEXT/                    ← All context files live here
│   ├── session_prompt.md
│   ├── project_data.md
│   ├── decision_log.md
│   ├── current_state.md
│   ├── local_setup.md
│   └── deployment_guide.md
├── Hero.mp4                    ← Hero video asset (11MB)
├── public/
│   ├── hero-poster.jpg         ← Extracted still from Hero.mp4 (mobile fallback)
│   ├── logo.svg                ← JDAirNet logo
│   ├── og-image.jpg            ← 1200×630 Open Graph image
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── layout.tsx           ← Root layout: fonts, global metadata, JsonLd org schema
    │   ├── page.tsx             ← Home /
    │   ├── plans/page.tsx       ← /plans/
    │   ├── lease-lines/page.tsx ← /lease-lines/
    │   ├── coverage/page.tsx    ← /coverage/
    │   ├── about/page.tsx       ← /about/
    │   ├── contact/page.tsx     ← /contact/
    │   ├── privacy-policy/page.tsx
    │   ├── terms-of-service/page.tsx
    │   ├── not-found.tsx        ← Custom 404
    │   ├── sitemap.ts           ← Auto-generates /sitemap.xml
    │   └── robots.ts            ← Auto-generates /robots.txt
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   ├── sections/
    │   │   ├── HeroSection.tsx  ← Video hero
    │   │   ├── PlansSection.tsx
    │   │   ├── WhyUsSection.tsx
    │   │   └── ContactCTA.tsx
    │   ├── ui/
    │   │   ├── PlanCard.tsx
    │   │   ├── JsonLd.tsx       ← Injects JSON-LD <script> tag
    │   │   └── ContactChannels.tsx ← Phone + WhatsApp + Form buttons
    │   └── seo/
    │       └── JsonLd.tsx
    ├── data/
    │   ├── plans.ts             ← BROADBAND_PLANS array
    │   ├── leaseLines.ts        ← LEASE_LINE_FEATURES array
    │   ├── contact.ts           ← CONTACT_INFO constant
    │   └── faqs.ts              ← FAQ items for home page
    ├── lib/
    │   └── schemaGenerators.ts  ← All JSON-LD schema generator functions
    ├── styles/
    │   └── globals.css          ← CSS custom properties, resets, typography scale
    └── types/
        └── index.ts             ← Shared TypeScript types
```

---

## 11. Missing Schemas — Full JSON-LD Coverage

These schemas were identified as missing from the initial plan and must be added to `src/lib/schemaGenerators.ts`.

### 11.1 `WebSite` Schema (Root Layout)
Enables Google Sitelinks Search Box. Goes in `src/app/layout.tsx` alongside Organization schema.
```typescript
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JDAirNet',
    url: 'https://jdairnet.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jdairnet.com/plans/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
```

### 11.2 `ItemList` Schema — Plans Page
Allows Google to surface plan cards (with speed/price) directly in search snippets.
```typescript
export function generatePlansItemListSchema(plans: BroadbandPlan[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'JDAirNet Broadband Plans',
    description: 'High-speed broadband plans for homes and offices',
    url: 'https://jdairnet.com/plans/',
    numberOfItems: plans.length,
    itemListElement: plans.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `JDAirNet ${plan.name} Plan`,
        description: `${plan.speed} broadband — ${plan.features.join(', ')}`,
        offers: {
          '@type': 'Offer',
          price: plan.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'JDAirNet' },
        },
      },
    })),
  }
}
```

### 11.3 `WebPage` Type Per Page
Each page should declare its specific WebPage type so Google classifies it correctly.

| Page | `@type` value |
|---|---|
| Home | `WebPage` |
| Plans | `WebPage` |
| Lease Lines | `WebPage` |
| Coverage | `WebPage` |
| About | `AboutPage` |
| Contact | `ContactPage` |
| Blog Post | `BlogPosting` (already planned) |

```typescript
export function generateWebPageSchema(input: {
  type: 'WebPage' | 'AboutPage' | 'ContactPage'
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    name: input.name,
    description: input.description,
    url: input.url,
    isPartOf: { '@type': 'WebSite', url: 'https://jdairnet.com/' },
    publisher: { '@type': 'Organization', name: 'JDAirNet' },
  }
}
```

### 11.4 `ContactPoint` on Every Page
Reinforces the phone number across all pages, not just the Contact page.
Goes in `generateOrganizationSchema()` (already in root layout):
```typescript
contactPoint: [
  {
    '@type': 'ContactPoint',
    telephone: '+91XXXXXXXXXX',        // UPDATE with real number
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
    contactOption: 'TollFree',
  },
  {
    '@type': 'ContactPoint',
    telephone: '+91XXXXXXXXXX',        // WhatsApp number
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
]
```

### 11.5 Complete Schema-Per-Page Reference

| Page | Schemas Injected | Location |
|---|---|---|
| All pages (root layout) | `Organization`, `WebSite`, `ContactPoint` | `layout.tsx` |
| Home `/` | `WebPage`, `FAQPage`, `BreadcrumbList` (root = no breadcrumb) | `page.tsx` |
| Plans `/plans/` | `WebPage`, `Service` (Broadband), `ItemList` (plans) | `plans/page.tsx` |
| Lease Lines `/lease-lines/` | `WebPage`, `Service` (Lease Line), `BreadcrumbList` | `lease-lines/page.tsx` |
| Coverage `/coverage/` | `WebPage`, `BreadcrumbList` | `coverage/page.tsx` |
| About `/about/` | `AboutPage`, `BreadcrumbList` | `about/page.tsx` |
| Contact `/contact/` | `ContactPage`, `LocalBusiness`, `BreadcrumbList` | `contact/page.tsx` |
| Blog Post `/blog/[slug]/` | `BlogPosting`, `BreadcrumbList` | `blog/[slug]/page.tsx` |

---

## 12. CSS Design System

This section defines the complete CSS system that must be implemented in `src/styles/globals.css` and enforced across all components. No ad-hoc pixel values — every spacing, font, and color value must use these tokens.

### 12.1 Fluid Typography Scale — `clamp()`

Font sizes scale **continuously** between the min viewport (320px) and max viewport (1280px). No jarring snap at breakpoints.

```css
:root {
  /* Display — Hero H1 */
  --font-display:      clamp(2rem, 5vw + 1rem, 4.5rem);     /* ~32px → 72px */

  /* H1 — Page heroes */
  --font-h1:           clamp(1.75rem, 4vw + 0.75rem, 3.5rem); /* ~28px → 56px */

  /* H2 — Section headings */
  --font-h2:           clamp(1.375rem, 2.5vw + 0.75rem, 2.5rem); /* ~22px → 40px */

  /* H3 — Card titles, subsections */
  --font-h3:           clamp(1.125rem, 1.5vw + 0.625rem, 1.75rem); /* ~18px → 28px */

  /* H4 — Labels, feature names */
  --font-h4:           clamp(1rem, 1vw + 0.75rem, 1.25rem);  /* ~16px → 20px */

  /* Body — Paragraphs, descriptions */
  --font-body:         clamp(0.9rem, 1vw + 0.5rem, 1.0625rem); /* ~14.4px → 17px */

  /* Small — Captions, disclaimers, badges */
  --font-small:        clamp(0.75rem, 0.5vw + 0.625rem, 0.875rem); /* ~12px → 14px */

  /* Nav links */
  --font-nav:          clamp(0.875rem, 0.75vw + 0.625rem, 1rem); /* ~14px → 16px */

  /* CTA Buttons */
  --font-cta:          clamp(0.875rem, 1vw + 0.5rem, 1rem);   /* ~14px → 16px */
}
```

### 12.2 Fluid Spacing Scale — `clamp()`

```css
:root {
  /* Section vertical padding — large breathing room */
  --space-section:     clamp(3rem, 8vw, 7rem);          /* ~48px → 112px */

  /* Section inner content padding */
  --space-section-sm:  clamp(2rem, 5vw, 4rem);          /* ~32px → 64px */

  /* Component gap (between cards, between items) */
  --space-gap-lg:      clamp(1.5rem, 3vw, 2.5rem);      /* ~24px → 40px */
  --space-gap-md:      clamp(1rem, 2vw, 1.75rem);        /* ~16px → 28px */
  --space-gap-sm:      clamp(0.5rem, 1vw, 1rem);         /* ~8px → 16px */

  /* Horizontal page padding (keeps content away from screen edges) */
  --space-page-x:      clamp(1rem, 5vw, 4rem);           /* ~16px → 64px */

  /* Card internal padding */
  --space-card:        clamp(1.25rem, 3vw, 2rem);        /* ~20px → 32px */

  /* Button padding */
  --space-btn-y:       clamp(0.625rem, 1.5vw, 0.875rem); /* ~10px → 14px */
  --space-btn-x:       clamp(1.25rem, 3vw, 2rem);        /* ~20px → 32px */
}
```

### 12.3 Container & Max-Width System

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-page-x);
}

.container--wide  { max-width: 1400px; }  /* Hero, full-bleed sections */
.container--narrow { max-width: 800px; }  /* Blog posts, privacy page */
.container--tight  { max-width: 640px; }  /* Contact form, CTA sections */
```

### 12.4 Plan Card Grid — Responsive Behavior

```css
.plans-grid {
  display: grid;
  gap: var(--space-gap-md);

  /* Mobile (320px+): 1 column, cards stack */
  grid-template-columns: 1fr;

  /* Tablet (600px+): 2 columns */
  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Desktop (1024px+): 4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Card scaling rules (non-negotiable):**
- On 375px: card is full width, font sizes use `--font-h3` for plan name, `--font-h2` for price
- On 768px: 2 columns side by side, equal height via `align-items: stretch`
- On 1024px+: 4 columns — "Most Popular" card is visually elevated (`transform: scale(1.04)` on desktop only, not mobile)
- Card internal padding always uses `var(--space-card)` — never hardcoded

### 12.5 Hero Section Responsive Behavior

```css
.hero-overlay-card {
  /* Mobile: full width, minimal padding, text is compact */
  width: 92%;
  max-width: 720px;
  padding: var(--space-card);
  border-radius: 16px;

  /* Tablet+ */
  @media (min-width: 768px) {
    border-radius: 24px;
  }
}

.hero-badge {
  font-size: var(--font-small);
  /* Badge hides or shrinks below 360px if needed */
}

.hero-h1 {
  font-size: var(--font-display);
  /* Never exceeds 2 lines on mobile. If text is too long → reduce copy */
}

/* Video: always covers full viewport */
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

### 12.6 Breakpoints Reference

```css
/* Mobile first — base styles target 320px+ */
/* Small mobile */ @media (min-width: 360px)  { }
/* Tablet */       @media (min-width: 600px)  { } /* 2-col grids start */
/* Tablet large */ @media (min-width: 768px)  { } /* Navbar switches to desktop */
/* Desktop */      @media (min-width: 1024px) { } /* 4-col grids, hero card max size */
/* Wide */         @media (min-width: 1280px) { } /* Max content width capped */
```

### 12.7 Touch Target Minimum Sizes (Mobile)

All interactive elements (buttons, nav links, contact bar items) must meet:
- Minimum touch target: **44px × 44px** (Apple HIG / WCAG 2.5.5)
- Contact bar items on mobile: minimum height `56px`
- CTA buttons: minimum height `48px`

```css
.btn {
  min-height: 48px;
  padding: var(--space-btn-y) var(--space-btn-x);
  font-size: var(--font-cta);
  /* Never smaller than 44px touch target */
}
```

### 12.8 Graceful Degradation Checklist (verify at each phase)

Before marking any phase complete, verify these at **375px width** in browser DevTools:
- [ ] No horizontal scroll (use `overflow-x: hidden` on `body` only as last resort — fix the root cause instead)
- [ ] All text is readable (no font smaller than `--font-small` = ~12px)
- [ ] All CTAs are tappable (min 44px height)
- [ ] Cards do not overflow their grid column
- [ ] Plan card "Most Popular" badge does not clip or wrap awkwardly
- [ ] Hero H1 does not exceed 3 lines
- [ ] Navbar hamburger menu is visible and functional
- [ ] Sticky ContactBar does not hide important page content (body has enough `padding-bottom`)
