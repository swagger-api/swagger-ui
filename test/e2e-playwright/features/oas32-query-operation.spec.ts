/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("OpenAPI 3.2 QUERY operation rendering", () => {
  const baseUrl = "/?url=/documents/features/oas32-query-operation.yaml"

  test("should render QUERY operation with all fields", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(baseUrl)
    const operation = page.locator("#operations-Search-searchWithQuery")
    await expect(operation).toBeAttached()
    await expect(operation.locator(".opblock-summary-method")).toContainText(
      "QUERY"
    )
    await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
    await expect(operation).toHaveClass(/(^|\s)is-open(\s|$)/)
    await expect(operation.locator(".opblock-body")).toBeAttached()
  })

  test("should render multiple operations including QUERY", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await expect(
      page.locator("#operations-Search-searchProducts")
    ).toBeAttached()
    await expect(
      page.locator("#operations-Search-advancedSearchProducts")
    ).toBeAttached()
    await expect(
      page.locator("#operations-Search-searchWithQuery")
    ).toBeAttached()
  })
})
