/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

const OAUTH_BUTTON =
  ".scheme-container > .schemes > .auth-wrapper > .btn > span"
const CLIENT_ID_INPUT =
  "div > div > .wrapper > .block-tablet > #client_id_implicit"

test.describe("Security: CSS Sequential Import Chaining", () => {
  test.describe("in OpenAPI 3.0", () => {
    test.describe("CSS Injection via Markdown", () => {
      test("should filter <style> tags out of Markdown fields", async ({
        page,
      }) => {
        await page.goto(
          "/?url=/documents/security/sequential-import-chaining/openapi.yaml"
        )
        await expect(page.locator("div.information-container")).toBeAttached()
        await expect(
          page.locator("div.information-container style")
        ).toHaveCount(0)
      })
      test("should not apply `@import`ed CSS stylesheets", async ({ page }) => {
        await page.goto(
          "/?url=/documents/security/sequential-import-chaining/openapi.yaml"
        )
        // replaces the Cypress `wait(500)` hack: let any `@import` request settle
        await page.waitForLoadState("networkidle")
        await expect(page.locator("div.info h4")).toHaveCount(1)
        await expect(page.locator("div.info h4")).toBeVisible()
      })
    })
    test.describe("Value Exfiltration via CSS", () => {
      test("should not allow OAuth credentials to be visible via HTML `value` attribute", async ({
        page,
      }) => {
        await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
        await page.locator(OAUTH_BUTTON).click()
        // `.clear().type("abc")` -> fill()
        await page.locator(CLIENT_ID_INPUT).fill("abc")
        await expect(page.locator(CLIENT_ID_INPUT)).not.toHaveAttribute(
          "value",
          "abc"
        )
      })
    })
  })
  test.describe("in Swagger 2.0", () => {
    test.describe("CSS Injection via Markdown", () => {
      test("should filter <style> tags out of Markdown fields", async ({
        page,
      }) => {
        await page.goto(
          "/?url=/documents/security/sequential-import-chaining/swagger.yaml"
        )
        await expect(page.locator("div.information-container")).toBeAttached()
        await expect(
          page.locator("div.information-container style")
        ).toHaveCount(0)
      })
      test("should not apply `@import`ed CSS stylesheets", async ({ page }) => {
        await page.goto(
          "/?url=/documents/security/sequential-import-chaining/swagger.yaml"
        )
        // replaces the Cypress `wait(500)` hack: let any `@import` request settle
        await page.waitForLoadState("networkidle")
        await expect(page.locator("div.info h4")).toHaveCount(1)
        await expect(page.locator("div.info h4")).toBeVisible()
      })
    })
    test.describe("Value Exfiltration via CSS", () => {
      test("should not allow OAuth credentials to be visible via HTML `value` attribute", async ({
        page,
      }) => {
        await page.goto("/?url=/documents/petstore.swagger.yaml")
        await page.locator(OAUTH_BUTTON).click()
        // `.clear().type("abc")` -> fill()
        await page.locator(CLIENT_ID_INPUT).fill("abc")
        await expect(page.locator(CLIENT_ID_INPUT)).not.toHaveAttribute(
          "value",
          "abc"
        )
      })
    })
  })
})
