/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"
import type { Request } from "@playwright/test"

test.describe("OAuth2 Application flow", () => {
  let tokenRequests: Request[]

  test.beforeEach(async ({ page }) => {
    // cy.intercept("POST", "**/oauth/*").as("tokenRequest") only spied, so
    // record matching requests instead of stubbing them.
    tokenRequests = []
    page.on("request", (request) => {
      if (
        request.method() === "POST" &&
        /\/oauth\/[^/]*$/.test(new URL(request.url()).pathname)
      ) {
        tokenRequests.push(request)
      }
    })
  })

  // https://github.com/swagger-api/swagger-ui/issues/6395
  test("should have first authorization input autofocused", async ({
    page,
  }) => {
    await page.goto("/?url=http://localhost:3231/swagger.yaml")
    await page.locator(".btn.authorize").click()

    // cy.focused()
    await expect(page.locator(":focus")).toHaveId("oauth_username")
  })

  test("should have specific OAuth2 description for authorization button", async ({
    page,
  }) => {
    await page.goto("/?url=http://localhost:3231/swagger.yaml")
    await page.locator(".btn.authorize").click()
    // three flows render this button; Cypress's `have.attr` checked the first
    await expect(
      page.locator(".auth-btn-wrapper > .authorize").first()
    ).toHaveAttribute("aria-label", "Apply given OAuth2 credentials")
  })

  test("should make an application flow Authorization header request", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=http://localhost:3231/swagger.yaml")
    await page.locator(".btn.authorize").click()

    const applicationFlow = page.locator(
      "div.modal-ux-content > div:nth-child(2)"
    )
    // `.clear().type(x)` -> fill(x)
    await applicationFlow
      .locator("#client_id_application")
      .fill("confidentialApplication")
    await applicationFlow
      .locator("#client_secret_application")
      .fill("topSecret")
    await applicationFlow
      .locator("button.btn.modal-btn.auth.authorize.button")
      .click()

    await page.locator("button.close-modal").click()

    await swaggerUi.toggleOperation("#operations-default-get_application")
    await swaggerUi.tryItOut()
    await swaggerUi.execute()

    await expect.poll(() => tokenRequests.length).toBeGreaterThan(0)
    const tokenRequest = tokenRequests[0]
    expect(tokenRequest.postData()).toBe("grant_type=client_credentials")
    expect((await tokenRequest.allHeaders())["authorization"]).toBe(
      "Basic Y29uZmlkZW50aWFsQXBwbGljYXRpb246dG9wU2VjcmV0"
    )

    // the header cell shares this class, so filter like cy.contains("200") does
    await expect(
      page
        .locator(".live-responses-table .response-col_status")
        .filter({ hasText: /200/ })
    ).toBeAttached()
  })
})
