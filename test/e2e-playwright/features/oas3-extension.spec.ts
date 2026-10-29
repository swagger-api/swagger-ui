/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Page } from "@playwright/test"

// Cypress `.get(a).contains(text)` yields the first (deepest) element inside
// `a` containing the case-sensitive text; regex + `.first()` mirrors that.
const containing = (page: Page, selector: string, text: RegExp) =>
  page.locator(selector).getByText(text).first()

test.describe("OpenAPI 3.0 extensions", () => {
  test.describe("displays extensions", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        "/?url=/documents/features/oas3-extension.yaml&showExtensions=true"
      )

      await containing(page, ".model-box-control", /User/).click()
      await containing(page, ".property-row", /\[\.\.\.\]/).click()
    })

    test("object extensions are visible", async ({ page }) => {
      await expect(
        containing(page, ".extension", /x-object-extension/)
      ).toBeVisible()
      await expect(
        containing(page, ".extension", /x-object-objectExtension/)
      ).toBeVisible()
    })

    test("primitive extensions are visible", async ({ page }) => {
      await expect(
        containing(page, ".extension", /x-primitive-extension/)
      ).toBeVisible()
      await expect(
        containing(page, ".extension", /x-primitive-objectExtension/)
      ).toBeVisible()
    })
  })

  test("should hide extensions if showExtensions option is set to false", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/features/oas3-extension.yaml")
    await containing(page, ".model-box-control", /User/).click()
    await containing(page, ".property-row", /\[\.\.\.\]/).click()

    await expect(page.getByText(/x-primitive-extension/)).toHaveCount(0)
    await expect(page.getByText(/x-primitive-objectExtension/)).toHaveCount(0)
    await expect(page.getByText(/x-object-extension/)).toHaveCount(0)
    await expect(page.getByText(/x-object-objectExtension/)).toHaveCount(0)
  })
})
