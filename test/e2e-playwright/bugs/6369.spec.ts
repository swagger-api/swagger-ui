/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

const innerObject = ".model-box .model .inner-object"

test.describe("#6369: Object model render of field: deprecated", () => {
  test.describe("OAS3", () => {
    test("should display row with td:deprecated when set to true", async ({
      page,
      schemaUi,
    }) => {
      const model = schemaUi.model("IdentificationProfile")
      await page.goto("/?url=/documents/bugs/6369-oas3-display.yaml")
      await schemaUi.modelToggle(model, ":scope > .model-box").click()
      const table = schemaUi.modelContent(model, `${innerObject} table`)
      await expect(schemaUi.modelProperty(table, "tr")).toHaveCount(
        schemaUi.unified ? 2 : 3
      )
      // cy.contains("td", text): case-sensitive, at least one matching td
      await expect(
        schemaUi
          .deprecatedMarker(model, `${innerObject} table td`)
          .filter({ hasText: /deprecated/ })
      ).not.toHaveCount(0)
    })
    test("should not display row with td:deprecated when set to false", async ({
      page,
      schemaUi,
    }) => {
      const model = schemaUi.model("IdentificationProfile")
      await page.goto("/?url=/documents/bugs/6369-oas3-no-display.yaml")
      await schemaUi.modelToggle(model, ":scope > .model-box").click()
      const table = schemaUi.modelContent(model, `${innerObject} table`)
      await expect(schemaUi.modelProperty(table, "tr")).toHaveCount(2)
      await expect(
        schemaUi
          .deprecatedMarker(model, `${innerObject} table td`)
          .filter({ hasText: /deprecated/ })
      ).toHaveCount(0)
    })
  })
  test.describe("OAS2", () => {
    test("should display row with td:deprecated when set to true", async ({
      page,
      schemaUi,
    }) => {
      const model = schemaUi.model("IdentificationProfile")
      await page.goto("/?url=/documents/bugs/6369-oas2-display.yaml")
      await schemaUi.modelToggle(model, ":scope > .model-box").click()
      // cy.contains("td", text): case-sensitive, at least one matching td
      const deprecated = schemaUi
        .deprecatedMarker(model, `${innerObject} td`)
        .filter({ hasText: /deprecated/ })
      if (schemaUi.unified) {
        await expect(schemaUi.modelContent(model, innerObject)).toBeAttached()
        await expect(deprecated).toHaveCount(0)
      } else {
        await expect(deprecated).not.toHaveCount(0)
      }
    })
    test("should not display row with td:deprecated when set to false", async ({
      page,
      schemaUi,
    }) => {
      const model = schemaUi.model("IdentificationProfile")
      await page.goto("/?url=/documents/bugs/6369-oas2-no-display.yaml")
      await schemaUi.modelToggle(model, ":scope > .model-box").click()
      const table = schemaUi.modelContent(model, `${innerObject} table`)
      await expect(schemaUi.modelProperty(table, "tr")).toHaveCount(2)
      await expect(
        schemaUi
          .deprecatedMarker(model, `${innerObject} table td`)
          .filter({ hasText: /deprecated/ })
      ).toHaveCount(0)
    })
  })
})
