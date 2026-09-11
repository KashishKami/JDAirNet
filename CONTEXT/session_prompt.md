# Session Prompt: JDAirNet Website

Use this prompt at the start of every new development session to orient the AI assistant before writing any code.

---

## Prompt

I am building the **JDAirNet** marketing website — a multi-page static-exported Next.js site for a broadband and lease-line ISP serving homes and offices. The website gives users three contact channels: direct phone call, WhatsApp chat, and a contact form (sent via PHP mailer on shared hosting).

All planning and architecture is complete. Before you do anything, read these files in this exact order:

1. **CONTEXT/project_data.md**
   → Brand identity, tech stack, sitemap with URL slugs, SEO/schema rules, broadband plans data, contact channels, design reference, and all business content.

2. **CONTEXT/decision_log.md**
   → All architectural decisions already made. Read these before proposing any design change — if your proposal contradicts a logged decision, you must flag it and ask.

3. **CONTEXT/local_setup.md**
   → How to run the project locally, dev server port, environment variables, test setup, and available npm scripts.

4. **CONTEXT/current_state.md**
   → The phase-by-phase implementation tracker. This is your source of truth for what is done and what is next. Always check this FIRST before writing any code.

5. **CONTEXT/deployment_guide.md**
   → Step-by-step guide for building, exporting, and deploying to Hostinger shared hosting via FTP/File Manager. Includes PHP mailer setup.

After reading all five files:
- Confirm you understand the site is a **Next.js Static Export** (`output: 'export'`) deployed to Hostinger shared hosting — no Node.js server at runtime.
- Confirm you understand the **three contact channels**: phone call, WhatsApp, and PHP-handled contact form.
- Confirm you understand the **SEO architecture**: per-page metadata exports, `sitemap.ts`, `robots.ts`, JSON-LD schema via `schemaGenerators.ts`, and `trailingSlash: true`.
- Confirm you understand the **hero section** uses `Hero.mp4` with a `<video>` tag (poster image fallback for mobile).
- Check `CONTEXT/current_state.md` to identify the first PENDING phase.
- Begin executing that phase's checklist exactly as described.
- As you complete checklist items, update `CONTEXT/current_state.md` to mark them `[x]` done.
- Do not skip ahead to a later phase until all items in the current phase are checked off.

**Key constraints to always keep in mind:**
- `output: 'export'` in production — no Next.js API routes, no SSR, no `next/image` optimization. Use `unoptimized: true` for images.
- `trailingSlash: true` in `next.config.mjs` — every page exports as `/slug/index.html`.
- Contact form POSTs to `/contact.php` (a PHP file deployed alongside the `out/` folder on Hostinger). The Next.js frontend uses `fetch()` to hit this endpoint.
- Dev server runs on port **3007** at `127.0.0.1` (not localhost) to avoid DNS latency and port collisions.
- All tests use `.env.test` — never `.env.local`. The test base URL is `http://127.0.0.1:3007`.
- JSON-LD schemas are injected per-page via `<JsonLd />` component and `schemaGenerators.ts`.
- The `sitemap.ts` file is the single source of truth for all indexed URLs. When a new page is added, it must be added to `sitemap.ts`.
- Hero section visual: full-screen video background (city skyline, purple/pink/magenta gradient sky) matching the TelNet Home 08 theme at https://themexriver.com/wp/telnet-wp/home-08/
- Navbar format: logo left, nav links center, phone CTA right — matching the rawatbroadband.net navbar pattern.

---
