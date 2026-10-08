/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("When trying it out", () => {
  test("should render the response headers as comma separated lists", async ({
    page,
    swaggerUi,
  }) => {
    // page.route stub replaces cy.intercept (GET https://httpbin.org/response-headers*)
    await page.route(
      (url) =>
        url.hostname === "httpbin.org" &&
        /^\/response-headers/.test(url.pathname),
      async (route) => {
        if (route.request().method() !== "GET") {
          await route.fallback()
          return
        }
        await route.fulfill({
          status: 200,
          json: {
            "Access-Control-Expose-Headers":
              "X-Header1, X-Header2, X-Header3, Access-Control-Expose-Headers",
            "Content-Length": "289",
            "Content-Type": "application/json",
            "X-Header1": "value1,value2",
            "X-Header2": "value3,value4",
            "X-Header3": ["value5", "value6"],
          },
          headers: {
            "access-control-expose-headers":
              "X-Header1,X-Header2,X-Header3,Access-Control-Expose-Headers",
            "content-type": "application/json",
            "x-header1": "value1,value2",
            "x-header2": "value3,value4",
            "x-header3": "value5,value6",
            // Cypress adds this automatically to stubbed responses; the page origin differs from httpbin.org
            "access-control-allow-origin": "*",
          },
        })
      }
    )

    await page.goto("/?url=/documents/bugs/6183.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_response_headers")
    await swaggerUi.tryItOut()
    await page.locator(".btn.execute").click()

    // spans are matched case-sensitively like jQuery `:contains`; auto-waiting replaces cy.wait(1000)
    const headers = page.locator(".response-col_description .microlight")
    for (const value of ["value1,value2", "value3,value4", "value5,value6"]) {
      await expect(
        headers.locator("span").filter({ hasText: new RegExp(value) })
      ).not.toHaveCount(0)
    }
  })
})
