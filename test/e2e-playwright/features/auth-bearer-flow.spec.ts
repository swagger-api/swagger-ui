/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Request } from "@playwright/test"

test.describe("OAuth2 Bearer flow", () => {
  let tokenRequests: Request[]

  test.beforeEach(async ({ page }) => {
    tokenRequests = []
    // cy.intercept("GET", "/get*", staticResponse): match any origin's /get path
    // (the spec's server is http://localhost:3231) and stub the response.
    await page.route(
      (url) => /^\/get[^/]*$/.test(url.pathname),
      async (route) => {
        const request = route.request()
        // the Authorization header triggers a CORS preflight on this cross-origin call
        const cors = { "access-control-allow-origin": "*" }
        if (request.method() === "OPTIONS") {
          await route.fulfill({
            status: 204,
            headers: {
              ...cors,
              "access-control-allow-headers": "*",
              "access-control-allow-methods": "*",
            },
          })
          return
        }
        tokenRequests.push(request)
        await route.fulfill({
          status: 200,
          headers: cors,
          json: { name: "not a random secret for test" },
        })
      }
    )
  })

  test("should be focused on input field with aria-label", async ({ page }) => {
    await page.goto("/?url=/documents/features/auth-bearer-flow.yaml")
    await page.locator("button.authorize").click()
    // cy.focused()
    await expect(page.locator(":focus")).toHaveAttribute(
      "aria-label",
      "auth-bearer-value"
    )
  })
  test("should make a header request with proper sample cURL header", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/auth-bearer-flow.yaml")
    await page.locator("button.authorize").click()
    await page.locator("section > input").fill("secret_token")
    await page.locator(".auth-btn-wrapper > .authorize").click()
    await page.locator("button.close-modal").click()
    // Try-it-out
    await swaggerUi.toggleOperation("#operations-default-get_get")
    await swaggerUi.tryItOut()
    await swaggerUi.execute()
    // cy.wait("@tokenRequest")
    await expect.poll(() => tokenRequests.length).toBeGreaterThan(0)
    expect((await tokenRequests[0].allHeaders())["authorization"]).toBe(
      "Bearer secret_token"
    )
    await expect(page.locator(".curl")).toContainText(
      "Authorization: Bearer secret_token"
    )
    await expect(page.locator(".curl")).toBeVisible()
  })
})
