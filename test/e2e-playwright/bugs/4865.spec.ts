/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#4865: multiple invocations + OAS3 plugin", () => {
  test("control: should render the OAS3 badge correctly", async ({ page }) => {
    // This is a sanity check to make sure the badge is present.
    // If this is failing, it's probably not related to #4865.
    await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
    await expect(
      page.locator("pre.version").filter({ hasText: /OAS 3\.0/ })
    ).toBeVisible()
  })

  test("test: should render the OAS3 badge correctly after re-initializing the UI", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
    // re-initializes Swagger UI by invoking the page's onload handler again
    await page.evaluate(() => {
      window.onload?.call(window, new Event("load"))
    })
    await expect(
      page.locator("pre.version").filter({ hasText: /OAS 3\.0/ })
    ).toBeVisible()
  })
})
