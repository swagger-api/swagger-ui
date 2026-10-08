/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5070: Required field not highlighted on click of Execute button (second time)", () => {
  test("should not clear error class=invalid on input field (Swagger)", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await swaggerUi.toggleOperation("#operations-pet-getPetById")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    // Execute without user input
    await page.locator(".execute.opblock-control__btn").click()
    const input = page.locator(".parameters-col_description input")
    await expect(input).toHaveCount(1)
    await expect(input).toHaveClass(/invalid/i)
    // Cancel Try It Out
    await page.locator(".cancel").click()
    // Expand Try It Out (Again)
    await swaggerUi.tryItOut()
    await expect(input).toHaveCount(1)
    await expect(input).toHaveClass(/invalid/i)
  })
})
