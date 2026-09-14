import { test, expect } from '@playwright/test'

test.describe('Home Page E2E', () => {
  test('loads home page with title, hero video, and H1', async ({ page }) => {
    await page.goto('/')

    // Page Title
    await expect(page).toHaveTitle(/JDAirNet/i)

    // Hero Video & Poster
    const video = page.locator('video')
    await expect(video).toBeAttached()
    await expect(video).toHaveAttribute('poster', '/hero-poster.jpg')

    // H1 Heading
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/Best Internet Services/i)
  })

  test('hero and preview action buttons link to correct targets', async ({ page }) => {
    await page.goto('/')

    // Hero View Plans CTA
    const heroPlansLink = page.locator('section[aria-label="Hero"]').getByRole('link', { name: /View Plans/i })
    await expect(heroPlansLink).toBeVisible()
    await expect(heroPlansLink).toHaveAttribute('href', '/plans/')

    // Plans preview view all plans link
    const previewAllLink = page.getByRole('link', { name: 'View All Plans →' })
    await expect(previewAllLink).toBeVisible()
    await expect(previewAllLink).toHaveAttribute('href', '/plans/')
  })

  test('FAQ accordion expands and collapses on click', async ({ page }) => {
    await page.goto('/')

    const firstQuestionBtn = page.getByRole('button', {
      name: /How fast can I get a new broadband connection installed\?/i,
    })
    await expect(firstQuestionBtn).toBeVisible()

    // Initially collapsed
    await expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'false')

    // Click to expand
    await firstQuestionBtn.click()
    await expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'true')
    await expect(
      page.getByText(/We typically complete installation within 24 to 48 hours/i)
    ).toBeVisible()

    // Click to collapse
    await firstQuestionBtn.click()
    await expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'false')
  })

  test('responsive mobile layout (375px) has zero horizontal overflow and sticky contact bar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Verify zero horizontal scroll
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1
    })
    expect(hasHorizontalOverflow).toBe(false)

    // Floating contact hub should be visible on 375px
    const contactHub = page.locator('button[aria-label="Contact Us"]')
    await expect(contactHub).toBeVisible()
  })

  test('Services section renders and links to plans and leased lines', async ({ page }) => {
    await page.goto('/')

    const servicesSection = page.locator('section[aria-label="Our Services & Solutions"]')
    await expect(servicesSection).toBeVisible()

    const homeBroadband = servicesSection.getByRole('heading', { level: 3, name: 'Home Broadband' })
    await expect(homeBroadband).toBeVisible()

    const illHeading = servicesSection.getByRole('heading', { level: 3, name: 'Internet Leased Line' })
    await expect(illHeading).toBeVisible()

    const exploreLink = servicesSection.getByRole('link', { name: /Explore Plans/i })
    await expect(exploreLink).toHaveAttribute('href', '/plans/')
  })

  test('Speed test section triggers benchmark and displays recommendation', async ({ page }) => {
    await page.goto('/')

    const speedSection = page.locator('section[aria-labelledby="speed-test-title"]')
    await expect(speedSection).toBeVisible()

    const startBtn = speedSection.getByRole('button', { name: /Start Speed Test/i })
    await expect(startBtn).toBeVisible()

    await startBtn.click()

    // Wait for the simulated test to finish and recommendation to appear
    await expect(speedSection.getByText(/Recommended: JDAirNet/i)).toBeVisible({ timeout: 10000 })
    await expect(speedSection.getByRole('link', { name: /Upgrade to/i })).toBeVisible()
  })
})


