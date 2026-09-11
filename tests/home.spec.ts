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

    // Sticky mobile contact bar should be visible on 375px
    const contactBar = page.locator('aside[aria-label="Quick Contact Actions"]')
    await expect(contactBar).toBeVisible()
  })
})
