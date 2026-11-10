/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"

// Cypress `cy.contains(text)` inside `.within()` is a case-sensitive substring
// search of the scope; `toContainText` with a string behaves the same way.
const hasClass = (name: string) => new RegExp(`(^|\\s)${name}(\\s|$)`)

test.describe("OAS 3.2 QUERY Operation Support", () => {
  const baseUrl = "/?url=/documents/features/oas32-query-operation.yaml"

  test.describe("QUERY Operation Rendering", () => {
    test("should render QUERY operation in the operations list", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#operations-Search-searchWithQuery")
      ).toBeAttached()
    })

    test("should display QUERY method with correct styling", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#operations-Search-searchWithQuery")
      ).toHaveClass(hasClass("opblock-query"))
    })

    test("should render QUERY operation summary", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(
        page
          .locator("#operations-Search-searchWithQuery")
          .locator(".opblock-summary-description")
      ).toContainText("Search with complex query payload")
    })

    test("should display QUERY badge/label", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(
        page
          .locator("#operations-Search-searchWithQuery")
          .locator(".opblock-summary-method")
      ).toContainText("QUERY")
    })
  })

  test.describe("QUERY Operation Expansion", () => {
    test("should expand QUERY operation when clicked", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      await expect(
        page.locator("#operations-Search-searchWithQuery")
      ).toHaveClass(hasClass("is-open"))
    })

    test("should display operation description when expanded", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      const operation = page.locator("#operations-Search-searchWithQuery")
      // Cypress `exist` passes with 1+ matches; several wrappers render here
      await expect(
        operation.locator(".opblock-description-wrapper").first()
      ).toBeAttached()
      // Cypress `contain.text` ran over the concatenated text of all matches
      await expect(
        operation
          .locator(".renderedMarkdown")
          .filter({ hasText: "QUERY HTTP method" })
          .first()
      ).toBeAttached()
    })
  })

  test.describe("QUERY Operation Request Body", () => {
    test("should render request body section", async ({ page, swaggerUi }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      await expect(page.locator(".opblock-section-request-body")).toBeAttached()
    })

    test("should show request body is required", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      const requestBody = page.locator(".opblock-section-request-body")
      await expect(requestBody).toBeAttached()
      await expect(
        requestBody.locator(".opblock-description-wrapper")
      ).toBeAttached()
    })

    test("should render request body schema with properties", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      const requestBody = page.locator(".opblock-section-request-body")
      await expect(requestBody).toContainText("query")
      await expect(requestBody).toContainText("filters")
      await expect(requestBody).toContainText("pagination")
    })
  })

  test.describe("QUERY Operation Responses", () => {
    test("should render response section", async ({ page, swaggerUi }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      await expect(page.locator(".responses-wrapper")).toBeAttached()
    })

    test("should display 200 response", async ({ page, swaggerUi }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      const responses = page.locator(".responses-wrapper")
      await expect(responses).toContainText("200")
      await expect(responses).toContainText("Search results")
    })

    test("should display error responses", async ({ page, swaggerUi }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchWithQuery")
      const responses = page.locator(".responses-wrapper")
      await expect(responses).toContainText("400")
      await expect(responses).toContainText("413")
    })
  })

  test.describe("Mixed Operations on Same Path", () => {
    test("should render both GET and QUERY operations for /products/search", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(
        page.locator("#operations-Search-searchProducts")
      ).toBeAttached()
      await expect(
        page.locator("#operations-Search-advancedSearchProducts")
      ).toBeAttached()
    })

    test("should distinguish GET and QUERY operations visually", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const getOperation = page.locator("#operations-Search-searchProducts")
      await expect(getOperation).toHaveClass(hasClass("opblock-get"))
      await expect(
        getOperation.locator(".opblock-summary-method")
      ).toContainText("GET")

      const queryOperation = page.locator(
        "#operations-Search-advancedSearchProducts"
      )
      await expect(queryOperation).toHaveClass(hasClass("opblock-query"))
      await expect(
        queryOperation.locator(".opblock-summary-method")
      ).toContainText("QUERY")
    })

    test("should show GET operation with query parameters", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation("#operations-Search-searchProducts")
      const operation = page.locator("#operations-Search-searchProducts")
      await expect(operation).toContainText("Parameters")
      await expect(operation).toContainText("q")
    })

    test("should show QUERY operation with request body", async ({
      page,
      swaggerUi,
    }) => {
      await page.goto(baseUrl)
      await swaggerUi.toggleOperation(
        "#operations-Search-advancedSearchProducts"
      )
      const requestBody = page.locator(".opblock-section-request-body")
      await expect(requestBody).toBeAttached()
      await expect(requestBody).toContainText("priceRange")
      await expect(requestBody).toContainText("specifications")
    })
  })

  test.describe("OAS Version Detection", () => {
    test("should display OAS 3.2 badge", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".info .version-stamp")).toContainText(
        "OAS 3.2"
      )
    })
  })
})
