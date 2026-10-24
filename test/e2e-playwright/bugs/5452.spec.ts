/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

const selectSelector =
  ".parameters > tbody > tr > .parameters-col_description > select"

test.describe("#5452: <Select /> crashing in Parameters", () => {
  test.describe("in OpenAPI 3", () => {
    test("should not result in a render error", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/5452/openapi.yaml")
      await swaggerUi.toggleOperation("#operations-default-get_endpoint")
      await swaggerUi.tryItOut()
      await page.locator(selectSelector).selectOption("")
      await expect(page.locator(selectSelector)).toBeAttached()
      await page.locator(selectSelector).selectOption("fruit")
      await expect(page.locator(selectSelector)).toBeAttached()
    })
  })

  test.describe("in Swagger 2", () => {
    test("should not result in a render error", async ({ page, swaggerUi }) => {
      await page.goto("/?url=/documents/bugs/5452/swagger.yaml")
      await swaggerUi.toggleOperation("#operations-default-get_endpoint")
      await swaggerUi.tryItOut()
      await page.locator(selectSelector).selectOption("")
      await expect(page.locator(selectSelector)).toBeAttached()
      await page.locator(selectSelector).selectOption("fruit")
      await expect(page.locator(selectSelector)).toBeAttached()
    })
  })
})
