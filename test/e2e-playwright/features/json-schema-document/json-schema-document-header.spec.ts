/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"

const documents = "/documents/json-schema-document"

/**
 * The header (title, dialect stamp, base and retrieval URIs) and the Schemas ($defs) section of a
 * standalone JSON Schema document.
 */
test.describe("Standalone JSON Schema 2020-12: header and $defs section", () => {
  test.describe("header", () => {
    test("shows the title, the dialect and the URIs", async ({ page }) => {
      await page.goto(`/?url=${documents}/person.yaml`)
      const info = page.locator(".information-container .info")

      await expect(info.locator("h1.title")).toContainText("Person")
      await expect(info.locator("h1 small").first()).toHaveText("2020-12")
      await expect(info.locator(".version-stamp .version")).toHaveText(
        "JSON Schema"
      )
      await expect(info.locator("tr").nth(0).locator("td").nth(0)).toHaveText(
        "Retrieval URI"
      )
      await expect(info.locator("tr").nth(0)).toContainText(
        `${documents}/person.yaml`
      )
      await expect(info.locator("tr").nth(1)).toContainText("Base URI")
      await expect(info.locator("tr").nth(1)).toContainText(
        "https://example.com/schemas/person"
      )
    })
  })

  test.describe("Schemas ($defs) section", () => {
    const url = `/?url=${documents}/definitions.yaml`

    test("lists the root $defs below the root schema", async ({ page }) => {
      await page.goto(url)
      const section = page.locator(".json-schema-document__definitions")

      await expect(section.locator("h4 button")).toHaveText("Schemas ($defs)")
      await expect(section.locator("h4 button")).toHaveAttribute(
        "aria-expanded",
        "true"
      )
      await expect(
        section.locator(".json-schema-2020-12__title").first()
      ).toHaveText("Currency")
      // the root schema doesn't repeat them
      await expect(
        page
          .locator(".json-schema-document .json-schema-2020-12")
          .first()
          .locator(":scope > .json-schema-2020-12-body")
          .locator(":scope > .json-schema-2020-12-keyword--\\$defs")
      ).toHaveCount(0)
    })

    test("collapses and expands", async ({ page }) => {
      await page.goto(url)
      const section = page.locator(".json-schema-document__definitions")
      const button = section.locator("h4 button")

      await button.click()
      await expect(button).toHaveAttribute("aria-expanded", "false")
      await expect(section.locator(".json-schema-2020-12")).toHaveCount(0)

      await button.click()
      await expect(button).toHaveAttribute("aria-expanded", "true")
      await expect(section.locator(".json-schema-2020-12")).toHaveCount(1)
    })

    test("starts collapsed with defaultModelsExpandDepth=0", async ({
      page,
    }) => {
      await page.goto(`${url}&defaultModelsExpandDepth=0`)

      await expect(
        page.locator(".json-schema-document__definitions h4 button")
      ).toHaveAttribute("aria-expanded", "false")
    })

    test("is hidden with defaultModelsExpandDepth=-1", async ({ page }) => {
      await page.goto(`${url}&defaultModelsExpandDepth=-1`)

      await expect(page.locator(".json-schema-document")).toBeVisible()
      await expect(
        page.locator(".json-schema-document__definitions")
      ).toHaveCount(0)
    })

    test("is absent for a document without $defs", async ({ page }) => {
      await page.goto(`/?url=${documents}/person.yaml`)

      await expect(page.locator(".json-schema-document")).toBeVisible()
      await expect(
        page.locator(".json-schema-document__definitions")
      ).toHaveCount(0)
    })
  })
})
