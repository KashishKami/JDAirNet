import { test, expect } from '@playwright/test'

test.describe('Contact Page & Form', () => {
  test('loads contact page and verifies all 3 contact channels', async ({ page }) => {
    await page.goto('/contact/')

    // Title & H1
    await expect(page).toHaveTitle(/Contact | JDAirNet/i)
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // 1. Direct Call CTA
    const callCta = page.locator('main a[href^="tel:"]').first()
    await expect(callCta).toBeVisible()

    // 2. WhatsApp CTA
    const waCta = page.locator('main a[href^="https://wa.me/"]').first()
    await expect(waCta).toBeVisible()

    // 3. Contact Form
    const nameInput = page.getByLabel(/Full Name/i)
    await expect(nameInput).toBeVisible()
  })

  test('submits contact form with mock backend endpoint and shows success state', async ({ page }) => {
    // Intercept POST /contact.php
    await page.route('**/contact.php', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Thank you! Your message has been sent successfully.',
        }),
      })
    })

    await page.goto('/contact/')
    await page.waitForLoadState('domcontentloaded')

    const nameInput = page.locator('#name')
    await expect(nameInput).toBeVisible()
    await nameInput.click()
    await nameInput.fill('Amit Patel')
    await page.locator('#email').fill('amit@example.com')
    await page.locator('#phone').fill('9876543210')
    await page.locator('#message').fill('Need broadband for residential apartment.')

    const submitBtn = page.getByRole('button', { name: /Send Message|Submit Inquiry/i })
    await submitBtn.click({ force: true })

    await expect(
      page.getByText(/Thank you! Your message has been sent/i)
    ).toBeVisible()
  })

  test('is mobile responsive at 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/contact/')

    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const innerWidth = await page.evaluate(() => window.innerWidth)
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})
