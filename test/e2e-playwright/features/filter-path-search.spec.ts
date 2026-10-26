/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Filter: search by tag and path", () => {
  test.describe("petstore", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml&filter=true")
    })

    test("filters by tag name case-insensitively", async ({ page }) => {
      await page.locator(".operation-filter-input").fill("STORE")
      await expect(page.locator(".opblock-tag")).toHaveCount(1)
      await expect(page.locator(".opblock-tag").first()).toContainText("store")
    })

    test("filters operations by path", async ({ page }) => {
      await page.locator(".operation-filter-input").fill("findbystatus")
      await expect(page.locator(".opblock")).toHaveCount(1)
      await expect(page.locator(".opblock-summary-path")).toContainText(
        "/pet/findByStatus"
      )
    })

    test("shows nothing when there is no match", async ({ page }) => {
      await page.locator(".operation-filter-input").fill("doesnotexist")
      await expect(page.locator(".opblock")).toHaveCount(0)
    })
  })

  test.describe("virtualized definition", () => {
    test("finds and renders an operation initially outside the viewport", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/perf/many-operations.yaml&filter=true")

      const operation = page.locator("#operations-perfTag24-perfOp24_22")
      await expect(page.locator(".operation-filter-input")).toBeVisible()
      await expect(operation).toHaveCount(0)
      await page
        .locator(".operation-filter-input")
        .fill("/perf/tag24/resource22")
      await expect(operation).toBeAttached()
    })
  })
})
