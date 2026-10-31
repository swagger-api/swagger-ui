/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("OpenAPI 3.0 Schema rendering", () => {
  test("should render the Schema tab in Try it out mode for request body", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/features/oas3-xml.json")
    await swaggerUi.toggleOperation("#operations-default-post_foo")
    await page.locator(".btn.try-out__btn").click()

    const requestBody = page.locator(".opblock-section-request-body")
    const schemaButton = requestBody
      .locator("button")
      .filter({ hasText: "Schema" })
    await expect(schemaButton).toBeAttached()
    await expect(schemaButton).toBeVisible()
    await schemaButton.click()

    await expect(requestBody.locator('[data-name="modelPanel"]')).toBeVisible()
    await expect(requestBody.locator('[data-name="examplePanel"]')).toHaveCount(
      0
    )
  })
})
