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
  test("Models section should be expanded on load", async ({ page }) => {
    await page.goto(baseUrl)
    await expect(page.locator(".models")).toHaveClass(/(^|\s)is-open(\s|$)/)
    await expect(page.locator("#model-Pet")).toBeAttached()
  })

  test("Models section should collapse and expand when toggled", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await page.locator(".models h4 .models-control").click()
    await expect(page.locator(".models")).not.toHaveClass(/(^|\s)is-open(\s|$)/)
    await expect(page.locator("#model-Order")).toHaveCount(0)
    await page.locator(".models h4 .models-control").click()
    await expect(page.locator(".models")).toHaveClass(/(^|\s)is-open(\s|$)/)
    await expect(page.locator("#model-Order")).toBeAttached()
  })

  test("Model should collapse and expand when toggled clicking button", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await page.locator("#model-User .model-box .model-box-control").click()
    await expect(
      page.locator("#model-User .model-box .model .inner-object")
    ).toBeAttached()
    await page
      .locator("#model-User .model-box .model-box-control")
      .first()
      .click()
    await expect(
      page.locator("#model-User .model-box .model .inner-object")
    ).toHaveCount(0)
  })
}
