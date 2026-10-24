/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Authorization popup", () => {
  test("closes the Available authorizations dialog when Escape is pressed", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await page.locator("button.btn.authorize").click()
    await expect(page.locator(".dialog-ux")).toBeAttached()

    // Dispatch on document (what the popup actually listens on), as the Cypress
    // spec did, instead of pressing a key against the focused element.
    await page.evaluate(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      )
    })

    await expect(page.locator(".dialog-ux")).toHaveCount(0)
  })

  test("closes the Available authorizations dialog when the backdrop is clicked", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await page.locator("button.btn.authorize").click()
    await expect(page.locator(".dialog-ux")).toBeAttached()
    // Cypress's `click({ force: true })` dispatched straight onto the backdrop.
    // A real click at the element center would hit the dialog stacked above it,
    // so click the top-left corner of the backdrop instead.
    await page.locator(".backdrop-ux").click({ position: { x: 5, y: 5 } })
    await expect(page.locator(".dialog-ux")).toHaveCount(0)
  })
})
