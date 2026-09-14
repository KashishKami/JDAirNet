import { test, expect } from '@playwright/test'

test.describe('Legal Pages & Custom 404', () => {
  test('renders privacy policy page', async ({ page }) => {
    await page.goto('/privacy-policy/')
    await expect(page).toHaveTitle(/Privacy Policy | JDAirNet/i)
    await expect(page.locator('h1')).toContainText(/Privacy Policy/i)
  })

  test('renders terms of service page', async ({ page }) => {
    await page.goto('/terms-of-service/')
    await expect(page).toHaveTitle(/Terms of Service | JDAirNet/i)
    await expect(page.locator('h1')).toContainText(/Terms of Service/i)
  })

  test('renders branded 404 page for missing URL', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-at-all/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('h1')).toContainText(/404/i)
    const homeLink = page.getByRole('link', { name: /Back to Homepage|Go Home/i })
    await expect(homeLink).toBeVisible()
    await expect(homeLink).toHaveAttribute('href', '/')
  })
})
