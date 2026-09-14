import { test, expect } from '@playwright/test'

test.describe('Plans Page E2E', () => {
  test('renders all 4 broadband plan cards with prices, speeds, and features', async ({ page }) => {
    await page.goto('/plans/')

    // Page title check
    await expect(page).toHaveTitle(/High-Speed Fiber Broadband Plans | JDAirNet/i)

    // H1 Heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Broadband Plans/i)

    // Verify all 4 tier names
    const planNames = ['Starter', 'Home', 'Power', 'Ultra']
    for (const name of planNames) {
      await expect(page.getByRole('heading', { level: 3, name })).toBeVisible()
    }

    // Verify speeds
    await expect(page.getByText('50 Mbps')).toBeVisible()
    await expect(page.getByText('100 Mbps')).toBeVisible()
    await expect(page.getByText('200 Mbps')).toBeVisible()
    await expect(page.getByText('500 Mbps')).toBeVisible()

    // Exactly 1 "Most Popular" badge
    const badges = page.locator('text=Most Popular')
    await expect(badges).toHaveCount(1)
  })

  test('CTA buttons on all plan cards provide Call Us, WhatsApp, and Send Message', async ({ page }) => {
    await page.goto('/plans/')

    const callLinks = page.locator('main a[aria-label*="Call Us for"]')
    expect(await callLinks.count()).toBe(4)

    const waLinks = page.locator('main a[aria-label*="WhatsApp for"]')
    expect(await waLinks.count()).toBe(4)

    const messageLinks = page.locator('main a[aria-label*="Send Message for"]')
    expect(await messageLinks.count()).toBe(4)

    for (let i = 0; i < 4; i++) {
      const callHref = await callLinks.nth(i).getAttribute('href')
      expect(callHref?.startsWith('tel:')).toBe(true)

      const waHref = await waLinks.nth(i).getAttribute('href')
      expect(waHref?.startsWith('https://wa.me/')).toBe(true)

      const msgHref = await messageLinks.nth(i).getAttribute('href')
      expect(msgHref?.startsWith('/contact/')).toBe(true)
    }
  })

  test('displays GST disclaimer and add-ons section', async ({ page }) => {
    await page.goto('/plans/')

    // GST notice
    await expect(page.getByText(/prices exclude 18% GST/i)).toBeVisible()

    // Add-ons heading and cards
    await expect(page.getByRole('heading', { level: 2, name: /Available Add-ons/i })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Watcho OTT' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Pioneer IPTV' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'Static IP' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3, name: 'HD Streaming' })).toBeVisible()

    // Lease lines cross-link banner
    const leaseLinesBtn = page.getByRole('link', { name: /Explore Lease Lines →/i })
    await expect(leaseLinesBtn).toBeVisible()
    await expect(leaseLinesBtn).toHaveAttribute('href', '/lease-lines/')
  })

  test('responsive mobile layout (375px) has zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/plans/')

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    expect(hasHorizontalOverflow).toBe(false)
  })
})
