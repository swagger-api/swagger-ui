/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Model collapse/expand feature", () => {
  test.describe("in Swagger 2", () => {
    const swagger2BaseUrl =
      "/?deepLinking=true&url=/documents/features/models.swagger.yaml"
    ModelCollapseTest(swagger2BaseUrl)
  })
  test.describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl =
      "/?deepLinking=true&url=/documents/features/models.openapi.yaml"
    ModelCollapseTest(openAPI3BaseUrl)
  })
})

function ModelCollapseTest(baseUrl: string) {
  test("Models section should be expanded on load", async ({
    page,
    schemaUi,
  }) => {
    await page.goto(baseUrl)
    await schemaUi.expectModelsOpen(true)
    await expect(schemaUi.model("Pet")).toBeAttached()
  })

  test("Models section should collapse and expand when toggled", async ({
    page,
    schemaUi,
  }) => {
    await page.goto(baseUrl)
    await schemaUi.modelsControl().click()
    await schemaUi.expectModelsOpen(false)
    await expect(schemaUi.model("Order")).toHaveCount(0)
    await schemaUi.modelsControl().click()
    await schemaUi.expectModelsOpen(true)
    await expect(schemaUi.model("Order")).toBeAttached()
  })

  test("Model should collapse and expand when toggled clicking button", async ({
    page,
    schemaUi,
  }) => {
    const user = schemaUi.model("User")
    await page.goto(baseUrl)
    await schemaUi.modelToggle(user, ".model-box .model-box-control").click()
    await expect(
      schemaUi.modelContent(user, ".model-box .model .inner-object")
    ).toBeAttached()
    await schemaUi
      .modelToggle(user, ".model-box .model-box-control")
      .first()
      .click()
    await expect(
      schemaUi.modelContent(user, ".model-box .model .inner-object")
    ).toHaveCount(0)
  })
}
