# Local Environment Setup Guide

This document describes how to configure and run the JDAirNet website locally after cloning the repository. Follow every step in the exact order shown.

---

## 1. Prerequisites

Ensure the following are installed before proceeding:

- **Node.js 20+** — Required for Next.js 15. Download from [nodejs.org](https://nodejs.org/).
- **npm 10+** — Ships with Node.js 20.
- **Git** — For version control.
- (Optional) **ffmpeg** — For extracting `hero-poster.jpg` from `Hero.mp4`. One-time task.

Verify versions:
```bash
node --version   # Should be >= 20.0.0
npm --version    # Should be >= 10.0.0
```

---

## 2. Installation & Setup Sequence

### Step 1: Navigate to Project Root
```bash
cd C:\Users\Administrator\Desktop\JDAirNet
# OR on Mac/Linux:
cd /path/to/JDAirNet
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env.local` (for development):
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Development base URL — ALWAYS use 127.0.0.1, NEVER localhost
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3007

# Contact form PHP endpoint (for local dev, this will 404 unless you run PHP locally)
NEXT_PUBLIC_CONTACT_ENDPOINT=/contact.php

# Blog feature flag (false until blog is built)
NEXT_PUBLIC_BLOG_ENABLED=false

# Google Analytics (leave empty during dev)
NEXT_PUBLIC_GA_ID=
```

Create `.env.test` (for all tests — Vitest and Playwright):
```bash
cp .env.example .env.test
```

Edit `.env.test`:
```env
# Test environment — mirrors dev URL exactly
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3007
NEXT_PUBLIC_CONTACT_ENDPOINT=/contact.php
NEXT_PUBLIC_BLOG_ENABLED=false
NEXT_PUBLIC_GA_ID=

# Playwright base URL — must match the dev server address
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3007
```

> **IMPORTANT:** `.env.test` is loaded by Vitest via `vitest.config.ts` and by Playwright via `playwright.config.ts`. Never reference `.env.local` in test configuration files.

### Step 4: Extract Hero Poster Image (One-Time)

Run this command ONCE to extract a still frame from `Hero.mp4` for mobile fallback:
```bash
# Requires ffmpeg installed
ffmpeg -i Hero.mp4 -ss 00:00:02 -frames:v 1 public/hero-poster.jpg

# If ffmpeg is not installed, manually create a hero-poster.jpg (1920x1080)
# and place it in the public/ folder
```

### Step 5: Start the Development Server
```bash
npm run dev
```

Open **http://127.0.0.1:3007** in your browser.

> ⚠️ Do NOT use `http://localhost:3007` — always use `http://127.0.0.1:3007` to match the test environment.

---

## 3. npm Scripts Reference

```bash
# ── Development ────────────────────────────────────────────────────
npm run dev           # Start dev server at http://127.0.0.1:3007

# ── Quality Gates (run individually) ───────────────────────────────
npm run lint          # ESLint — check for code quality issues
npm run lint:fix      # ESLint — auto-fix fixable issues
npm run typecheck     # TypeScript — check types without emitting files

# ── Unit Tests (Vitest) ─────────────────────────────────────────────
npm run test:unit         # Run all unit tests once (CI mode)
npm run test:unit:watch   # Run unit tests in watch mode (dev mode)
npm run test:unit:ui      # Open Vitest UI in browser

# ── E2E Tests (Playwright) ──────────────────────────────────────────
npm run test:e2e          # Run all Playwright E2E tests (headless)
npm run test:e2e:ui       # Open Playwright UI (interactive debugging)
npm run test:e2e:report   # Open last Playwright HTML report

# ── Combined CI Suite (local pre-push) ──────────────────────────────
npm run ci:quality    # Runs: lint → typecheck → test:unit → test:e2e

# ── Build & Export ──────────────────────────────────────────────────
npm run build         # Build production static export → out/ folder
npm run serve         # Serve the out/ folder locally (after build)
                      # Useful for testing the exact production output
```

---

## 4. Test Environment Configuration

### Unit Tests (Vitest)

Vitest is configured in `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    envDir: '.',          // Loads .env.test from project root
    envFiles: ['.env.test'], // Explicit — only .env.test, NOT .env.local
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
})
```

### E2E Tests (Playwright)

Playwright is configured in `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' }) // Loads .env.test explicitly

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3007',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3007',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
})
```

### What Gets Tested

| Test Type | Tool | What it covers |
|---|---|---|
| Unit | Vitest | Schema generator functions, plans data integrity, component rendering |
| E2E | Playwright | Navigation flow, contact form submission, mobile viewport, CTA buttons |

---

## 5. Development Commands Quick Reference

```bash
# Full quality check before pushing
npm run ci:quality

# Fix lint issues automatically
npm run lint:fix

# Check only types (faster than full build)
npm run typecheck

# Run E2E tests in headed mode (see the browser)
npm run test:e2e -- --headed

# Run a specific Playwright test file
npx playwright test tests/contact.spec.ts

# Run a specific Vitest test file
npx vitest run src/tests/schemaGenerators.test.ts

# Build the static export and preview it locally
npm run build && npm run serve
```

---

## 6. Troubleshooting

### Port 3007 Already in Use
```bash
# Find what's using port 3007 (Windows)
netstat -ano | findstr :3007

# Kill it by PID
taskkill /PID <PID> /F
```

### TypeScript Errors After Adding a New File
```bash
# Regenerate TypeScript types
npm run typecheck
```

### Playwright Browsers Not Installed
```bash
npx playwright install
```

### Hero Video Not Playing in Dev
- Ensure `Hero.mp4` is in the `public/` folder (not the `CONTEXT_sample/` folder)
- The file is large (11MB) — first load may be slow
- Check browser console for video errors

### Contact Form Returns 404 in Dev
This is expected behavior. The `contact.php` file only exists on the Hostinger server. In local dev, the form submit will fail with a network error. To test locally:
- Either set up a local PHP server (e.g., XAMPP)
- Or use the mock in Playwright E2E tests (Playwright intercepts the POST request)
