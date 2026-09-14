import { test, expect } from '@playwright/test'

test.describe('Animations, Smooth Scroll & Floating Contact Hub E2E', () => {
  test('scrolls through sections smoothly and verifies all animated elements are visible', async ({ page }) => {
    await page.goto('/')

    // Hero is visible
    await expect(page.locator('h1')).toBeVisible()

    // Scroll down to Plans Preview
    const plansSection = page.locator('section[aria-labelledby="plans-preview-title"]')
    await plansSection.scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { level: 2, name: /Popular Broadband Plans/i })).toBeVisible()
    const planCards = plansSection.getByRole('heading', { level: 3 })
    const count = await planCards.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // Scroll down to Why Choose Us
    const whyUsSection = page.locator('section[aria-labelledby="why-us-title"]')
    await whyUsSection.scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { level: 2, name: /Why Choose Us/i })).toBeVisible()

    // Scroll down to FAQ section
    const faqSection = page.locator('section[aria-labelledby="faq-section-title"]')
    await faqSection.scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { level: 2, name: /Frequently Asked Questions/i })).toBeVisible()

    // Scroll down to Contact CTA
    const ctaSection = page.locator('section[aria-labelledby="cta-title"]')
    await ctaSection.scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { level: 2, name: /Ready for Blazing Fast Internet\?/i })).toBeVisible()
  })

  test('floating contact hub expands on click and displays 3 contact channels', async ({ page }) => {
    await page.goto('/')

    const hubTrigger = page.locator('button[aria-label="Contact Us"]')
    await expect(hubTrigger).toBeVisible()
    await expect(hubTrigger).toHaveAttribute('aria-expanded', 'false')

    // Click to open (force: true permits clicking continuously animating elements)
    await hubTrigger.click({ force: true })
    await expect(hubTrigger).toHaveAttribute('aria-expanded', 'true')


    // 3 channels are visible
    const callItem = page.locator('a[role="menuitem"][aria-label^="Call"]')
    const whatsappItem = page.locator('a[role="menuitem"][aria-label="Chat on WhatsApp"]')
    const formItem = page.locator('a[role="menuitem"][aria-label="Send Message through contact form"]')

    await expect(callItem).toBeVisible()
    await expect(callItem).toHaveAttribute('href', /^tel:/)

    await expect(whatsappItem).toBeVisible()
    await expect(whatsappItem).toHaveAttribute('href', /^https:\/\/wa\.me\//)

    await expect(formItem).toBeVisible()
    await expect(formItem).toHaveAttribute('href', '/contact/')

    // Press Escape to close
    await page.keyboard.press('Escape')
    await expect(hubTrigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('mobile 375px viewport handles animations and scrolling with zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Scroll down to trigger all animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(400)

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    expect(hasHorizontalOverflow).toBe(false)

    // Floating contact hub remains visible on mobile
    const hubTrigger = page.locator('button[aria-label="Contact Us"]')
    await expect(hubTrigger).toBeVisible()
  })
})
