/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"
import type { Page, Request } from "@playwright/test"

const AUTHORIZE_PASSWORD_BUTTON =
  "div.modal-ux-content > div:nth-child(1) > div > div:nth-child(2) > div > div.auth-btn-wrapper > button.btn.modal-btn.auth.authorize.button"

test.describe("OAuth2 Password flow", () => {
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

  // `.type()` on the empty username/password fields and `.clear().type()` on the
  // client fields are all expressed as fill().
  async function authorizeAndExecute(
    page: Page,
    passwordType: string
  ): Promise<void> {
    await page.goto("/?url=http://localhost:3231/swagger.yaml")
    await page.locator(".btn.authorize").click()
    await page.locator("#oauth_username").fill("swagger")
    await page.locator("#oauth_password").fill("password")
    await page.locator("#password_type").selectOption(passwordType)
    await page.locator("#client_id_password").fill("application")
    await page.locator("#client_secret_password").fill("secret")
    await page.locator(AUTHORIZE_PASSWORD_BUTTON).click()
    await page.locator("button.close-modal").click()
    await page.locator("#operations-default-get_password").click()
    await page.locator(".btn.try-out__btn").click()
    await page.locator(".btn.execute").click()
  }

  test("should make a password flow Authorization header request", async ({
    page,
  }) => {
    await authorizeAndExecute(page, "basic")

    await expect.poll(() => tokenRequests.length).toBeGreaterThan(0)
    const tokenRequest = tokenRequests[0]
    const body = tokenRequest.postData() ?? ""
    expect(body).toContain("grant_type=password")
    expect(body).toContain("username=swagger")
    expect(body).toContain("password=password")
    expect(body).not.toContain("client_id")
    expect(body).not.toContain("client_secret")

    expect((await tokenRequest.allHeaders())["authorization"]).toBe(
      "Basic YXBwbGljYXRpb246c2VjcmV0"
    )

    // the header cell shares this class, so filter like cy.contains("200") does
    await expect(
      page
        .locator(".live-responses-table .response-col_status")
        .filter({ hasText: /200/ })
    ).toBeAttached()
  })

  test("should make a Password flow request-body request", async ({ page }) => {
    await authorizeAndExecute(page, "request-body")

    await expect.poll(() => tokenRequests.length).toBeGreaterThan(0)
    const tokenRequest = tokenRequests[0]
    const body = tokenRequest.postData() ?? ""
    expect(body).toContain("grant_type=password")
    expect(body).toContain("username=swagger")
    expect(body).toContain("password=password")
    expect(body).toContain("client_id=application")
    expect(body).toContain("client_secret=secret")

    expect(await tokenRequest.allHeaders()).not.toHaveProperty("authorization")

    // the header cell shares this class, so filter like cy.contains("200") does
    await expect(
      page
        .locator(".live-responses-table .response-col_status")
        .filter({ hasText: /200/ })
    ).toBeAttached()
  })
})
