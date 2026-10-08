/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Render Contact and License in OAS 3.2.0", () => {
  const baseUrl = "/?url=/documents/oas32/contact-and-license.yaml"

  test("should render contact with all fields", async ({ page }) => {
    await page.goto(baseUrl)
    await expect(page.locator(".info__contact")).toBeAttached()
    const link = page.locator(".info__contact a").first()
    await expect(link).toContainText("API Support Team")
    await expect(link).toHaveAttribute(
      "href",
      "https://www.example.com/support"
    )
    await expect(link).toHaveAttribute("rel", /noopener/)
  })

  test("should render license with all fields", async ({ page }) => {
    await page.goto(baseUrl)
    await expect(page.locator(".info__license")).toBeAttached()
    await expect(page.locator(".info__license__url")).toContainText(
      "Apache 2.0"
    )
    const link = page.locator(".info__license__url a")
    await expect(link).toHaveAttribute(
      "href",
      "https://www.apache.org/licenses/LICENSE-2.0.html"
    )
    await expect(link).toHaveAttribute("rel", /noopener/)
  })
})
