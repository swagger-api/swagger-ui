/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.0 spec with allOf containing a circular reference", () => {
  test("should render correct title and properties", async ({ page }) => {
    await page.goto("/?url=/documents/features/oas3-all-of-circular-ref.yaml")

    await page.locator("[id='model-OneOfParent'] button").click()
    // cy `.siblings()` -> all other children of the parent; the alias is re-resolved on each use
    const additionalData = page
      .locator(".property-row")
      .getByText(/additionalData/)
      .first()
      .locator("xpath=preceding-sibling::* | following-sibling::*")
    await additionalData.locator("button").click()
    // cy.contains prefers the closest `button` ancestor of the matched text (the matched
    // `.model-hint` span is display:none), so target the button that wraps the title
    const firstOneOf = additionalData
      .locator("span button")
      .filter({ hasText: /FirstOneOf/ })
      .first()
    await expect(firstOneOf).toBeAttached()
    await firstOneOf.click()
    await expect(
      additionalData
        .locator("span")
        .getByText(/numberProp/)
        .first()
    ).toBeAttached()
    await expect(
      additionalData
        .locator("span")
        .getByText(/additionalData/)
        .first()
    ).toBeAttached()
  })
})
