/**
 * @prettier
 */
// http://github.com/swagger-api/swagger-ui/issues/5458
import { test, expect } from "../support/fixtures"

const expectedValue = `{
  "foo": "custom value"
}`

test.describe("#5458: Swagger 2.0 `Response.examples` mappings", () => {
  test("should render a custom example when a schema is not defined", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/5458.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_foo1")
    await expect(page.locator(".model-example .highlight-code")).toContainText(
      expectedValue
    )
  })
  test("should render a custom example when a schema is defined", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/5458.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_foo2")
    await expect(page.locator(".model-example .highlight-code")).toContainText(
      expectedValue
    )
  })
})
