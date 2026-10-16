/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("XSS: OAuth2 authorizationUrl sanitization", () => {
  test("should filter out a javascript URL", async ({ page }) => {
    // cy.stub(win, "open") -> record window.open() arguments on the Node side.
    // The stub is installed before navigation so it is in place on first render.
    const openCalls: unknown[][] = []
    await page.exposeFunction("recordWindowOpen", (args: unknown[]) => {
      openCalls.push(args)
    })
    await page.addInitScript(() => {
      const recordWindowOpen = (
        window as unknown as { recordWindowOpen: (args: unknown[]) => void }
      ).recordWindowOpen
      window.open = (...args: unknown[]) => {
        recordWindowOpen(args)
        return null
      }
    })

    await page.goto("/?url=/documents/security/xss-oauth2.yaml")
    await page.locator(".authorize").click()
    await page.locator(".modal-btn.authorize").click()

    // replaces cy.wait(100): poll until the stub has been called
    await expect.poll(() => openCalls.length).toBeGreaterThan(0)
    expect(openCalls[0][0]).toMatch(/^about:blank/)
  })
})
