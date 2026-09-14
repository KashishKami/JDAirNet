import { test, expect } from '@playwright/test'

test.describe('About Page', () => {
  test('loads about page and renders company story, values, and CTAs', async ({ page }) => {
    await page.goto('/about/')

    // Title & H1
    await expect(page).toHaveTitle(/About | JDAirNet/i)
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Gigabit Fiber/i)

    // Values section
    await expect(page.getByText(/Ultra-Low Latency/i)).toBeVisible()
    await expect(page.getByText(/Local On-Ground NOC/i)).toBeVisible()

    // CTA
    const cta = page.getByRole('link', { name: /Get in Touch/i }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /\/contact\/?/)
  })

  test('is mobile responsive at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/about/')

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})
