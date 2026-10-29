/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Locator, Page, Request } from "@playwright/test"

const clickTryItOutAndExecute = async (scope: Locator): Promise<void> => {
  await scope.locator(".btn.try-out__btn").click() // expand "try it out"
  await scope.locator(".btn.execute").click() // execute request
}

const fillInApiKeyAndAuthorise = async (
  scope: Locator,
  apiKey: string
): Promise<void> => {
  await scope.locator("section>input").fill(apiKey) // type api key into input
  await scope.locator(".auth-btn-wrapper > .authorize").click() // authorise button
}

const clickLogoutAndReauthorise = async (scope: Locator): Promise<void> => {
  await scope.locator(".auth-btn-wrapper button:nth-child(1)").click() // logout button
  await scope.locator(".auth-btn-wrapper > .authorize").click() // authorise button
}

// cy.wait("@request") on the `/4641*` intercept -> waitForRequest, registered before the action
const waitForApiRequest = (page: Page): Promise<Request> =>
  page.waitForRequest((req) => /^\/4641/.test(new URL(req.url()).pathname))

test.describe("#4641: The Logout button in Authorize popup not clearing API Key", () => {
  test.beforeEach(async ({ page }) => {
    // cy.intercept("GET", "/4641*", { body: "OK" }); matched on pathname so
    // the spec document `/documents/bugs/4641.yaml` is not stubbed
    await page.route(
      (url) => /^\/4641/.test(url.pathname),
      (route) => route.fulfill({ body: "OK" })
    )
  })

  test("should include the given api key in requests", async ({ page }) => {
    await page.goto("/?url=/documents/bugs/4641.yaml")
    await page.locator("button.btn.authorize").click() // open authorize popup
    // only deal with api_key_1 for this test
    await fillInApiKeyAndAuthorise(
      page.locator(".modal-ux-content > :nth-child(1)"),
      "my_api_key"
    )
    await page.locator(".close-modal").click() // close authorise popup button
    await page.locator("#operations-default-get_4641_1").click() // expand the route details onClick
    const requestPromise = waitForApiRequest(page)
    await clickTryItOutAndExecute(
      page.locator("#operations-default-get_4641_1")
    )
    const request = await requestPromise
    expect(request.headers(), "request headers").toHaveProperty(
      "api_key_1",
      "my_api_key"
    )
  })

  test("should not remember the previous auth value when you logout and reauthorise", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/4641.yaml")
    await page.locator("button.btn.authorize").click() // open authorize popup
    // only deal with api_key_1 for this test
    await fillInApiKeyAndAuthorise(
      page.locator(".modal-ux-content > :nth-child(1)"),
      "my_api_key"
    )
    await clickLogoutAndReauthorise(
      page.locator(".modal-ux-content > :nth-child(1)")
    )
    await page.locator(".close-modal").click() // close authorise popup button
    await page.locator("#operations-default-get_4641_1").click() // expand the route details onClick
    const requestPromise = waitForApiRequest(page)
    await clickTryItOutAndExecute(
      page.locator("#operations-default-get_4641_1")
    )
    const request = await requestPromise
    expect(request.headers(), "request headers").not.toHaveProperty("api_key_1")
  })

  test("should only forget the value of the auth the user logged out from", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/4641.yaml")
    await page.locator("button.btn.authorize").click() // open authorize popup
    // deal with api_key_1
    await fillInApiKeyAndAuthorise(
      page.locator(".modal-ux-content > :nth-child(1)"),
      "my_api_key"
    )
    // deal with api_key_2
    await fillInApiKeyAndAuthorise(
      page.locator(".modal-ux-content > :nth-child(2)"),
      "my_second_api_key"
    )
    // deal with api_key_1 again
    await clickLogoutAndReauthorise(
      page.locator(".modal-ux-content > :nth-child(1)")
    )
    await page.locator(".close-modal").click() // close authorise popup button
    await page.locator("#operations-default-get_4641_2").click() // expand the route details onClick
    const requestPromise = waitForApiRequest(page)
    await clickTryItOutAndExecute(
      page.locator("#operations-default-get_4641_2")
    )
    const request = await requestPromise
    expect(request.headers(), "request headers").not.toHaveProperty("api_key_1")
    expect(request.headers(), "request headers").toHaveProperty(
      "api_key_2",
      "my_second_api_key"
    )
  })
})
