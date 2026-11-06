/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../support/fixtures"
import type { SchemaLocators } from "../support/fixtures"

const showsExtensions = (
  keyword: string,
  setup: (page: Page, schemaUi: SchemaLocators) => Promise<void>
) => {
  test("extensions are visible on keyword click", async ({
    page,
    schemaUi,
  }) => {
    await setup(page, schemaUi)
    const extensionName = (name: string) => schemaUi.jsonViewerName(name)

    // Cypress `not.be.visible` requires the element to exist but be hidden
    for (const name of [
      "x-primitiveExtension",
      "x-arrayExtension",
      "x-objectExtension",
    ]) {
      await expect(extensionName(name)).toBeAttached()
      await expect(extensionName(name)).not.toBeVisible()
    }

    await schemaUi.keywordName(keyword).click()

    for (const name of [
      "x-primitiveExtension",
      "x-arrayExtension",
      "x-objectExtension",
    ]) {
      await expect(extensionName(name)).toBeVisible()
    }
  })
}

test.describe("OpenAPI 3.1 extension keyword", () => {
  test.describe("displays extensions", () => {
    const url =
      "/?url=/documents/features/oas31-extension.yaml&showExtensions=true"

    test.describe("Discriminator extension", () => {
      showsExtensions("Discriminator", async (page, schemaUi) => {
        await page.goto(url)
        await schemaUi.schema().getByText("My Pet", { exact: true }).click()
      })
    })

    test.describe("External documentation extension", () => {
      showsExtensions("External documentation", async (page, schemaUi) => {
        await page.goto(url)
        await schemaUi.schema().getByText("Object", { exact: true }).click()
      })
    })

    test.describe("XML extension", () => {
      showsExtensions("XML", async (page, schemaUi) => {
        await page.goto(url)
        await schemaUi.schema().getByText("Book", { exact: true }).click()
      })
    })
  })

  test("should hide extensions if showExtensions option is set to false", async ({
    page,
    schemaUi,
  }) => {
    await page.goto(
      "/?url=/documents/features/oas31-extension.yaml&showExtensions=false"
    )
    await schemaUi.schema().getByText("Object", { exact: true }).click()
    await schemaUi.keywordName("External documentation").click()

    await expect(schemaUi.secondaryKeywordName("url")).toBeVisible()

    await expect(page.getByText("x-primitiveExtension")).toHaveCount(0)
    await expect(page.getByText("x-arrayExtension")).toHaveCount(0)
    await expect(page.getByText("x-objectExtension")).toHaveCount(0)
  })
})
