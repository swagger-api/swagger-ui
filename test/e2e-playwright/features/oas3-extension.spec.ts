/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { SchemaLocators } from "../support/fixtures"
import type { Page } from "@playwright/test"

// Cypress `.get(a).contains(text)` yields the first (deepest) element inside
// `a` containing the case-sensitive text; regex + `.first()` mirrors that.
const openUser = async (page: Page, schemaUi: SchemaLocators) => {
  await schemaUi
    .nestedModelToggle(page, ".model-box-control")
    .getByText(/User/)
    .first()
    .click()
  await schemaUi.collapsedPropertyToggle().click()
}

const openExtensionKeywords = async (schemaUi: SchemaLocators) => {
  const extensionKeywords = schemaUi.keyword("extensionKeywords")
  await expect(extensionKeywords).toHaveCount(2)
  for (const keyword of await extensionKeywords.all()) {
    await schemaUi.accordion(keyword).click()
  }
}

test.describe("OpenAPI 3.0 extensions", () => {
  test.describe("displays extensions", () => {
    test.beforeEach(async ({ page, schemaUi }) => {
      await page.goto(
        "/?url=/documents/features/oas3-extension.yaml&showExtensions=true"
      )

      await openUser(page, schemaUi)
      if (schemaUi.unified) await openExtensionKeywords(schemaUi)
    })

    test("object extensions are visible", async ({ schemaUi }) => {
      await expect(schemaUi.extension(/x-object-extension/)).toBeVisible()
      await expect(schemaUi.extension(/x-object-objectExtension/)).toBeVisible()
    })

    test("primitive extensions are visible", async ({ schemaUi }) => {
      await expect(schemaUi.extension(/x-primitive-extension/)).toBeVisible()
      await expect(
        schemaUi.extension(/x-primitive-objectExtension/)
      ).toBeVisible()
    })
  })

  test("should hide extensions if showExtensions option is set to false", async ({
    page,
    schemaUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-extension.yaml")
    await openUser(page, schemaUi)

    await expect(page.getByText(/x-primitive-extension/)).toHaveCount(0)
    await expect(page.getByText(/x-primitive-objectExtension/)).toHaveCount(0)
    await expect(page.getByText(/x-object-extension/)).toHaveCount(0)
    await expect(page.getByText(/x-object-objectExtension/)).toHaveCount(0)
  })
})
