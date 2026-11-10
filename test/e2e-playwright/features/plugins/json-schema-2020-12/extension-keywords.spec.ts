/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("JSON Schema 2020-12 extension keywords", () => {
  test.describe("display extension keywords", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(
        "/?url=/documents/features/json-schema-2020-12-extension-keywords.yaml&showExtensions=true"
      )
    })

    test("should render `Extension Keywords` section", async ({ page }) => {
      await page.locator(".json-schema-2020-12-accordion").click()
      await expect(
        page.locator(".json-schema-2020-12-keyword--extension-keywords")
      ).toBeAttached()
    })

    test("should render extension keywords with primitive values", async ({
      page,
    }) => {
      await page.locator(".json-schema-2020-12-accordion").click()
      // cy.contains is case-sensitive, so use a RegExp instead of a string
      await page.getByText(/Extension Keywords/).click()

      const primitiveExtension = page
        .locator(".json-schema-2020-12-json-viewer-extension-keyword")
        .getByText(/primitiveExtension/)
      await expect(primitiveExtension).toBeAttached()

      // cy `.siblings(sel)` -> parent's children matching sel
      await expect(
        primitiveExtension
          .locator("xpath=..")
          .locator(":scope > .json-schema-2020-12-json-viewer__value")
          .getByText(/1/)
      ).toBeAttached()
    })

    test("should render extension keywords with array values", async ({
      page,
    }) => {
      await page.locator(".json-schema-2020-12-accordion").click()
      await page.getByText(/Extension Keywords/).click()

      await expect(
        page
          .locator(".json-schema-2020-12-json-viewer-extension-keyword")
          .getByText(/arrayExtension/)
      ).toBeAttached()

      // cy.contains yields the first match
      await page
        .getByText(/arrayExtension/)
        .first()
        .click()

      const arrayExtensionItem = page
        .locator(".json-schema-2020-12-json-viewer__children")
        .getByText(/#0/)
      await expect(arrayExtensionItem).toBeAttached()

      await expect(
        arrayExtensionItem
          .locator("xpath=..")
          .locator(":scope > .json-schema-2020-12-json-viewer__value")
          .getByText(/2/)
      ).toBeAttached()
    })

    test("should render extension keywords with object values", async ({
      page,
    }) => {
      await page.locator(".json-schema-2020-12-accordion").click()
      await page.getByText(/Extension Keywords/).click()

      await expect(
        page
          .locator(".json-schema-2020-12-json-viewer-extension-keyword")
          .getByText(/objectExtension/)
      ).toBeAttached()

      await page
        .getByText(/objectExtension/)
        .first()
        .click()

      const objectExtensionProperty = page
        .locator(".json-schema-2020-12-json-viewer__children")
        .getByText(/prop/)
      await expect(objectExtensionProperty).toBeAttached()

      await expect(
        objectExtensionProperty
          .locator("xpath=..")
          .locator(":scope > .json-schema-2020-12-json-viewer__value")
          .getByText(/3/)
      ).toBeAttached()
    })

    test("should not render OpenAPI 3.1.0 keywords as extension keywords", async ({
      page,
    }) => {
      await page.locator(".json-schema-2020-12-accordion").click()
      await page.getByText(/Extension Keywords/).click()

      const extensionKeywords = page.locator(
        ".json-schema-2020-12-keyword--extension-keywords"
      )
      // cy `.children()` implicitly requires the section to exist
      await expect(
        extensionKeywords.locator(":scope > *").first()
      ).toBeAttached()
      await expect(
        extensionKeywords.locator(":scope > *").getByText(/Default/)
      ).toHaveCount(0)
    })
  })

  test("shouldn't display extensions when showExtensions option is set to false", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-2020-12-extension-keywords.yaml"
    )

    await page.locator(".json-schema-2020-12-accordion").click()
    await expect(page.getByText(/Extension Keywords/)).toHaveCount(0)
  })
})
