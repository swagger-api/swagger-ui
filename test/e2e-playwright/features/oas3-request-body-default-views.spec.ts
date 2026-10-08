/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("OAS3 default views", () => {
  test.describe("multipart/form-data", () => {
    test("should display calculated object string, when no examples provided (#7268)", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(
        "/?url=/documents/features/request-body/multipart/default-views.yaml"
      )
      await swaggerUi.toggleOperation("#operations-default-post_test")
      // Expand Try It Out
      await swaggerUi.tryItOut()
      await expect(
        page.locator(".parameters-col_description textarea")
      ).toContainText('"stuff": "string"')
    })
  })
})
