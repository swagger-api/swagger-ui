/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Render Webhooks Component", () => {
  test.describe("OpenAPI 3.1.x", () => {
    const baseUrl = "/?url=/documents/features/webhooks-openAPI31.yaml"
    test("should render a heading", async ({ page }) => {
      await page.goto(baseUrl)
      const webhooks = page.locator(".webhooks")
      await expect(webhooks).toBeAttached()
      await expect(webhooks).toContainText("Webhooks")
    })
    test("should render an operation component", async ({ page }) => {
      await page.goto(baseUrl)
      const summary = page.locator(
        ".webhooks #operations-webhooks-postnewPet > .opblock-summary"
      )
      await expect(summary).toBeAttached()
      await expect(summary).toContainText("POST")
      await expect(summary).toContainText("newPet")
    })
  })
  test.describe("OpenAPI 3.0.x", () => {
    const baseUrl = "/?url=/documents/features/webhooks-openAPI30.yaml"
    test("should render nothing", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#swagger-ui .information-container")
      ).toBeAttached()
      await expect(page.locator(".webhooks")).toHaveCount(0)
    })
  })
})
