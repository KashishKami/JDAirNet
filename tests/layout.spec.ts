import { test, expect } from '@playwright/test'

test.describe('Global Layout & SEO Verification', () => {
  test('homepage renders Navbar with brand logo, links, and phone CTA', async ({ page }) => {
    await page.goto('/')

    // Brand logo
    const logo = page.locator('header a', { hasText: 'JDAirNet' })
    await expect(logo).toBeVisible()

    // Footer
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('JDAirNet')
    await expect(footer).toContainText('Quick Links')
  })

  test('phone CTA has valid tel: protocol link', async ({ page }) => {
    await page.goto('/')
    const telLinks = page.locator('a[href^="tel:"]')
    const count = await telLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('JSON-LD schema scripts are injected in HTML head', async ({ page }) => {
    await page.goto('/')
    const jsonLdScripts = page.locator('script[type="application/ld+json"]')
    const count = await jsonLdScripts.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // Verify Organization schema is present
    const firstSchemaContent = await jsonLdScripts.first().textContent()
    expect(firstSchemaContent).toContain('Organization')
    expect(firstSchemaContent).toContain('JDAirNet')
  })

  test('mobile navigation drawer opens on toggle click (on mobile viewports)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Only applicable for mobile viewports')

    await page.goto('/')
    const hamburger = page.locator('button[aria-label="Toggle navigation menu"]')
    await expect(hamburger).toBeVisible()

    // Click toggle to open menu
    await hamburger.click()
    const mobileMenu = page.locator('nav[aria-label="Mobile Navigation"]')
    await expect(mobileMenu).toBeVisible()

    // Verify nav links inside mobile menu
    await expect(mobileMenu.locator('a', { hasText: 'Plans' })).toBeVisible()
    await expect(mobileMenu.locator('a', { hasText: 'Lease Lines' })).toBeVisible()

    // Floating contact hub is visible
    const contactHub = page.locator('button[aria-label="Contact Us"]')
    await expect(contactHub).toBeVisible()
  })
})

