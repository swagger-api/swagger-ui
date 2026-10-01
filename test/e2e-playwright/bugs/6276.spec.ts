/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6276: Query parameter filter=true is filtering by the value 'true'", () => {
  test.describe("With filter=true", () => {
    test("should display the filter bar", async ({ page }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml&filter=true")
      const filterInput = page.locator(".operation-filter-input")
      await expect(filterInput).toBeAttached()
      // Cypress `be.empty` is `:empty`, which is trivially true for <input>; toBeEmpty checks the value
      await expect(filterInput).toBeEmpty()
      await expect(page.locator(".opblock-tag[data-tag='pet']")).toBeAttached()
      await expect(
        page.locator(".opblock-tag[data-tag='store']")
      ).toBeAttached()
      await expect(page.locator(".opblock-tag[data-tag='user']")).toBeAttached()
    })
  })
  test.describe("With filter=false", () => {
    test("should not display the filter bar", async ({ page }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml&filter=false")
      await expect(page.locator(".operation-filter-input")).toHaveCount(0)
      await expect(page.locator(".opblock-tag[data-tag='pet']")).toBeAttached()
      await expect(
        page.locator(".opblock-tag[data-tag='store']")
      ).toBeAttached()
      await expect(page.locator(".opblock-tag[data-tag='user']")).toBeAttached()
    })
  })
  test.describe("With filter=pet", () => {
    test("should display the filter bar and only show the operations tagged with pet", async ({
      page,
    }) => {
      await page.goto("/?url=/documents/petstore.swagger.yaml&filter=pet")
      const filterInput = page.locator(".operation-filter-input")
      await expect(filterInput).toBeAttached()
      await expect(filterInput).toHaveValue("pet")
      await expect(page.locator(".opblock-tag[data-tag='pet']")).toBeAttached()
      await expect(page.locator(".opblock-tag[data-tag='store']")).toHaveCount(
        0
      )
      await expect(page.locator(".opblock-tag[data-tag='user']")).toHaveCount(0)
    })
  })
})
