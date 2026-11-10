/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("Loading specs by url.primaryName param", () => {
  test.describe("with no param", () => {
    test("should load the default spec", async ({ page }) => {
      await page.goto("/pages/multiple-urls/index.html")

      await expect(page.locator("span.url")).toContainText(
        "/documents/petstore-expanded.openapi.yaml"
      )
    })
  })
  test.describe("with an invalid param", () => {
    test("should fall back to the default spec", async ({ page }) => {
      await page.goto(
        "/pages/multiple-urls/index.html?urls.primaryName=undefinedUrlName"
      )

      await expect(page.locator("span.url")).toContainText(
        "/documents/petstore-expanded.openapi.yaml"
      )
    })
  })
  test.describe("with a valid url.primaryName param", () => {
    test("should render the requested spec", async ({ page }) => {
      await page.goto(
        "/pages/multiple-urls/index.html?urls.primaryName=Petstore Swagger"
      )

      await expect(page.locator("span.url")).toContainText(
        "/documents/petstore.swagger.yaml"
      )
    })
  })
})
