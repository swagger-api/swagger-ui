/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("MutualTLS Authorization", () => {
  test("should open authorization popup", async ({ page }) => {
    await page.goto("/?url=/documents/security/mutual-tls.yaml")
    await page.locator("button.authorize").click()
    // cy.contains is case-sensitive, hence the regex filter
    await expect(
      page
        .locator(".auth-container h4")
        .filter({ hasText: /mutual \(mutualTLS\)/ })
        .first()
    ).toBeAttached()
  })
  test("should have description given by user", async ({ page }) => {
    await page.goto("/?url=/documents/security/mutual-tls.yaml")
    await page.locator("button.authorize").click()
    await expect(
      page
        .locator(".auth-container p:nth-of-type(2)")
        .filter({ hasText: /Mutual TLS description/ })
        .first()
    ).toBeAttached()
  })
  test("should not display Authorize or Logout buttons", async ({ page }) => {
    await page.goto("/?url=/documents/security/mutual-tls.yaml")
    await page.locator("button.authorize").click()
    await expect(page.locator(".auth-container")).toBeAttached()
    await expect(page.locator(".auth-button-wrapper")).toHaveCount(0)
  })
})
