/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#9556: SwaggerUI doesn't render response bodies for non-200 responses", () => {
  test.beforeEach(async ({ page }) => {
    // cy.intercept("GET", "/400-any", staticResponse)
    await page.route("**/400-any", async (route) => {
      if (route.request().method() !== "GET") {
        await route.fallback()
        return
      }
      await route.fulfill({
        status: 400,
        headers: { "content-type": "plain/text" },
        body: "This should render",
      })
    })
  })

  test("should render response body for a response with 400 status code", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(
      "?url=/documents/features/try-it-out-non-200-response-body.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_400_any")
    await swaggerUi.tryItOut()
    // cy.wait("@request"): register the wait before the triggering click
    const requestSent = page.waitForRequest(
      (request) =>
        request.method() === "GET" &&
        new URL(request.url()).pathname === "/400-any"
    )
    await swaggerUi.execute()
    await requestSent
    await expect(
      page.locator(".response-col_description .highlight-code .microlight")
    ).toHaveText("This should render")
  })
})
