import { test, expect } from '@playwright/test'

test('homepage loads and displays title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/JDAirNet/)
})
