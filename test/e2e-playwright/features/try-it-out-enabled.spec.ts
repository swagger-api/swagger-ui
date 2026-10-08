/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Try it out enabled configuration", () => {
  test("should enable the try it out section when true", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-enabled.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_")
    await expect(page.locator(".try-out__btn")).toHaveText("Cancel")
  })

  test("should disable the try it out section when false", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(
      "?tryItOutEnabled=false&url=/documents/features/try-it-out-enabled.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_")
    // regex keeps the exact trailing space (a string would be whitespace-normalized)
    await expect(page.locator(".try-out__btn")).toHaveText(/^Try it out $/)
  })
})
