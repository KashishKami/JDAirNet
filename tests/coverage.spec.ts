import { test, expect } from '@playwright/test'

test.describe('Coverage Page', () => {
  test('loads coverage page and renders key sections and CTAs', async ({ page }) => {
    await page.goto('/coverage/')

    // Title & H1
    await expect(page).toHaveTitle(/Coverage | JDAirNet/i)
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Coverage/i)

    // Feasibility CTA
    const cta = page.getByRole('link', { name: /Check Feasibility/i }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /\/contact\/?/)

    // Direct Call CTA
    const callCta = page.getByRole('link', { name: /Call Support/i }).first()
    await expect(callCta).toBeVisible()
    await expect(callCta).toHaveAttribute('href', /^tel:/)
  })

  test('is mobile responsive at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/coverage/')

    // Ensure no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})
