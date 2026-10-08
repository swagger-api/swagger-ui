/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5138: unwanted `url`/`urls` interactions", () => {
  test("should stably render the first `urls` entry", async ({ page }) => {
    await page.goto("/pages/5138/")
    const title = page.locator("h1.title")
    await expect(title).toContainText("USPTO Data Set API")
    // same fixed wait as the Cypress test (cy.wait(3000)): the bug was a
    // delayed re-render swapping the title, which no event signals
    await page.waitForTimeout(3000)
    await expect(title).toContainText("USPTO Data Set API")
  })
})
