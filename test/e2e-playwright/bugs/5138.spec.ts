/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5138: unwanted `url`/`urls` interactions", () => {
  test("should stably render the first `urls` entry", async ({ page }) => {
    await page.goto("/pages/5138/")
    const title = page.locator("h1.title")
    await expect(title).toContainText("USPTO Data Set API")
    // replaces cy.wait(3000): let all spec/url loading settle, then re-check
    await page.waitForLoadState("networkidle")
    await expect(title).toContainText("USPTO Data Set API")
  })
})
