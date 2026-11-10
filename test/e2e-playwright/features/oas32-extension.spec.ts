/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../support/fixtures"

const showsExtensions = (
  keyword: string,
  setup: (page: Page) => Promise<void>
) => {
  test("extensions are visible on keyword click", async ({ page }) => {
    await setup(page)
    const extensionName = (name: string) =>
      page
        .locator(".json-schema-2020-12-json-viewer__name")
        .filter({ hasText: name })

    // Cypress `not.be.visible` requires the element to exist but be hidden
    for (const name of [
      "x-primitiveExtension",
      "x-arrayExtension",
      "x-objectExtension",
    ]) {
      await expect(extensionName(name)).toBeAttached()
      await expect(extensionName(name)).not.toBeVisible()
    }

    await page
      .locator(".json-schema-2020-12-keyword__name")
      .filter({ hasText: keyword })
      .click()

    for (const name of [
      "x-primitiveExtension",
      "x-arrayExtension",
      "x-objectExtension",
    ]) {
      await expect(extensionName(name)).toBeVisible()
    }
  })
}

test.describe("OpenAPI 3.2 extension keyword", () => {
  test.describe("displays extensions", () => {
    const url =
      "/?url=/documents/features/oas32-extension.yaml&showExtensions=true"

    test.describe("Discriminator extension", () => {
      showsExtensions("Discriminator", async (page) => {
        await page.goto(url)
        await page
          .locator(".json-schema-2020-12")
          .getByText("My Pet", { exact: true })
          .click()
      })
    })

    test.describe("External documentation extension", () => {
      showsExtensions("External documentation", async (page) => {
        await page.goto(url)
        await page
          .locator(".json-schema-2020-12")
          .getByText("Object", { exact: true })
          .click()
      })
    })

    test.describe("XML extension", () => {
      showsExtensions("XML", async (page) => {
        await page.goto(url)
        await page
          .locator(".json-schema-2020-12")
          .getByText("Book", { exact: true })
          .click()
      })
    })
  })

  test("should hide extensions if showExtensions option is set to false", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/features/oas32-extension.yaml&showExtensions=false"
    )
    await page
      .locator(".json-schema-2020-12")
      .getByText("Object", { exact: true })
      .click()
    await page
      .locator(".json-schema-2020-12-keyword__name")
      .filter({ hasText: "External documentation" })
      .click()

    await expect(
      page
        .locator(".json-schema-2020-12-keyword__name--secondary")
        .filter({ hasText: "url" })
    ).toBeVisible()

    await expect(page.getByText("x-primitiveExtension")).toHaveCount(0)
    await expect(page.getByText("x-arrayExtension")).toHaveCount(0)
    await expect(page.getByText("x-objectExtension")).toHaveCount(0)
  })
})
