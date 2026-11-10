/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Try It Out: schema required properties can be overridden", () => {
  test("should execute", async ({ page, swaggerUi }) => {
    await page.goto(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-required-override-allowed.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-setDeliveryLocation")
    const bodyParam = page.locator(".body-param__text")
    await expect(bodyParam).toHaveValue(/testProperty/)
    // swagger-ui will auto insert "{}" into textarea
    await bodyParam.fill("")
    await page.locator(".execute-wrapper > .btn").click()
    await expect(page.locator(".curl-command")).toBeAttached()
  })
})
