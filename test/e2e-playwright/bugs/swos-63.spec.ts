/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("SWOS-63: Schema/Model labeling", () => {
  test.describe("SchemaS/Models section", () => {
    test("should render `Schemas` for OpenAPI 3", async ({ page }) => {
      await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
      await expect(page.locator("section.models > h4")).toContainText("Schemas")
    })
    test("should render `Models` for OpenAPI 2", async ({ page }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml")
      await expect(page.locator("section.models > h4")).toContainText("Models")
    })
  })
  test.describe("ModelExample within Operation", () => {
    test("should render `Schemas` for OpenAPI 3", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
      await swaggerUi.toggleOperation("#operations-default-findPets")
      // several operations/tabs match; cy.contains passes if any of them contains the text (case-sensitive)
      await expect(
        page
          .locator("button.tablinks[data-name=model]")
          .filter({ hasText: /Schema/ })
      ).not.toHaveCount(0)
    })
    test("should render `Models` for OpenAPI 2", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml")
      // cy.get without assertion still fails when the element is missing
      await expect(page.locator("section.models > h4")).toBeAttached()
      await swaggerUi.toggleOperation("#operations-pet-addPet")
      await expect(
        page.locator("button.tablinks[data-name=model]")
      ).toContainText("Model")
    })
  })
})
