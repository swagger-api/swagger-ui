/**
 * @prettier
 */
// http://github.com/swagger-api/swagger-ui/issues/6351
import { test, expect } from "../support/fixtures"

interface SwaggerUiWindow {
  ui: {
    oas3Actions: { setSelectedServer: (server: string) => void }
  }
}

test.describe("#6351: Server dropdown should change when switched via oas3Actions.setSelectedServer", () => {
  test("should show different selected server", async ({ page }) => {
    await page.goto("/?url=/documents/bugs/6351.yaml")
    await expect(page.locator("select")).toHaveValue("http://testserver1.com")
    // cy.window().then(win => ...) -> page.evaluate against the global `ui`
    await page.evaluate(() =>
      (window as unknown as SwaggerUiWindow).ui.oas3Actions.setSelectedServer(
        "http://testserver2.com"
      )
    )
    await expect(page.locator("select")).toHaveValue("http://testserver2.com")
  })
})
