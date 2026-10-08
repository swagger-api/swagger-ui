/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6369: Object model render of field: deprecated", () => {
  test.describe("OAS3", () => {
    test("should display row with td:deprecated when set to true", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/bugs/6369-oas3-display.yaml")
      await page.locator("#model-IdentificationProfile > .model-box").click()
      const table = page.locator(
        "#model-IdentificationProfile .model-box .model .inner-object table"
      )
      await expect(table.locator("tr")).toHaveCount(3)
      // cy.contains("td", text): case-sensitive, at least one matching td
      await expect(
        table.locator("td").filter({ hasText: /deprecated/ })
      ).not.toHaveCount(0)
    })
    test("should not display row with td:deprecated when set to false", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/bugs/6369-oas3-no-display.yaml")
      await page.locator("#model-IdentificationProfile > .model-box").click()
      const table = page.locator(
        "#model-IdentificationProfile .model-box .model .inner-object table"
      )
      await expect(table.locator("tr")).toHaveCount(2)
      await expect(
        table.locator("td").filter({ hasText: /deprecated/ })
      ).toHaveCount(0)
    })
  })
  test.describe("OAS2", () => {
    test("should display row with td:deprecated when set to true", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/bugs/6369-oas2-display.yaml")
      await page.locator("#model-IdentificationProfile > .model-box").click()
      // cy.contains("td", text): case-sensitive, at least one matching td
      await expect(
        page
          .locator(
            "#model-IdentificationProfile .model-box .model .inner-object"
          )
          .locator("td")
          .filter({ hasText: /deprecated/ })
      ).not.toHaveCount(0)
    })
    test("should not display row with td:deprecated when set to false", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/bugs/6369-oas2-no-display.yaml")
      await page.locator("#model-IdentificationProfile > .model-box").click()
      const table = page.locator(
        "#model-IdentificationProfile .model-box .model .inner-object table"
      )
      await expect(table.locator("tr")).toHaveCount(2)
      await expect(
        table.locator("td").filter({ hasText: /deprecated/ })
      ).toHaveCount(0)
    })
  })
})
