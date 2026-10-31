/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

// the app exposes its system as `window.ui`
interface UiWindow {
  ui: {
    authSelectors: { getConfigs: () => Record<string, unknown> }
    authActions: { configureAuth: (configs: Record<string, unknown>) => void }
  }
}

test.describe("Check client_secret for OAuth2 Authorization Code flow with and without PKCE (#6290)", () => {
  test("should display client_secret field for authorization code flow with PKCE", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/features/auth-code-flow-pkce-without-secret.yaml"
    )
    // set auth config to use PKCE
    await page.evaluate(() => {
      const { ui } = window as unknown as UiWindow
      const authConfigs = ui.authSelectors.getConfigs()
      ui.authActions.configureAuth({
        ...authConfigs,
        usePkceWithAuthorizationCodeGrant: true,
      })
    })
    await page.locator("button.authorize").click()
    // cy.contains is case-sensitive, hence regex filters (`.first()` mirrors its yield)
    await expect(
      page
        .locator("h4")
        .filter({ hasText: /authorizationCode with PKCE/ })
        .first()
    ).toBeAttached()
    await expect(
      page
        .locator(".flow")
        .filter({ hasText: /authorizationCode with PKCE/ })
        .first()
    ).toBeAttached()
    await expect(
      page.locator("#client_secret_authorizationCode")
    ).toBeAttached()
  })

  test("should display client_secret field for authorization code flow without PKCE", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/features/auth-code-flow-pkce-without-secret.yaml"
    )
    // set auth config to not use PKCE
    await page.evaluate(() => {
      const { ui } = window as unknown as UiWindow
      const authConfigs = ui.authSelectors.getConfigs()
      ui.authActions.configureAuth({
        ...authConfigs,
        usePkceWithAuthorizationCodeGrant: false,
      })
    })
    await page.locator("button.authorize").click()
    await expect(
      page
        .locator("h4")
        .filter({ hasText: /authorizationCode/ })
        .first()
    ).toBeAttached()
    await expect(
      page
        .locator(".flow")
        .filter({ hasText: /authorizationCode/ })
        .first()
    ).toBeAttached()
    await expect(
      page.locator("#client_secret_authorizationCode")
    ).toBeAttached()
  })
})
