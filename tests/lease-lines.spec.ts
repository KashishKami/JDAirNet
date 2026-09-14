import { test, expect } from '@playwright/test'

test.describe('Lease Lines Page E2E', () => {
  test('renders lease lines page with H1, 6 features, and zero pricing', async ({ page }) => {
    await page.goto('/lease-lines/')

    // Page title check
    await expect(page).toHaveTitle(/Enterprise Internet Lease Lines | JDAirNet/i)

    // H1 Heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Enterprise Internet Lease Lines/i)

    // 6 Feature cards
    const featureLabels = [
      'Symmetric Speeds',
      'Dedicated Bandwidth',
      '99.9% Uptime SLA',
      'Enhanced Security & Static IPs',
      '24/7 Local NOC Support',
      'Scalable Bandwidth',
    ]

    for (const label of featureLabels) {
      await expect(page.getByRole('heading', { level: 3, name: label })).toBeVisible()
    }

    // Use cases chips
    await expect(page.getByText('Corporate Offices & Co-working Spaces')).toBeVisible()
    await expect(page.getByText('Hospitals & Healthcare Facilities')).toBeVisible()

    // Assert zero pricing text on the entire page
    const pageContent = await page.content()
    expect(pageContent).not.toContain('₹')
  })

  test('conversion buttons link to contact page, phone dialer, and WhatsApp', async ({ page }) => {
    await page.goto('/lease-lines/')

    // Send Message buttons link to /contact/
    const messageBtns = page.getByRole('link', { name: /Send Message/i })
    const msgCount = await messageBtns.count()
    expect(msgCount).toBeGreaterThanOrEqual(2)

    for (let i = 0; i < msgCount; i++) {
      await expect(messageBtns.nth(i)).toHaveAttribute('href', '/contact/')
    }

    // Phone CTA (Call Us)
    const phoneCtas = page.getByRole('link', { name: /Call Us/i })
    const phoneCount = await phoneCtas.count()
    expect(phoneCount).toBeGreaterThanOrEqual(2)
    for (let i = 0; i < phoneCount; i++) {
      const phoneHref = await phoneCtas.nth(i).getAttribute('href')
      expect(phoneHref?.startsWith('tel:')).toBe(true)
    }

    // WhatsApp CTA
    const waCtas = page.getByRole('link', { name: /WhatsApp/i })
    const waCount = await waCtas.count()
    expect(waCount).toBeGreaterThanOrEqual(2)
    for (let i = 0; i < waCount; i++) {
      const waHref = await waCtas.nth(i).getAttribute('href')
      expect(waHref?.startsWith('https://wa.me/')).toBe(true)
    }
  })

  test('responsive mobile layout (375px) has zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/lease-lines/')

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    expect(hasHorizontalOverflow).toBe(false)
  })
})
