/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6627: XML example when defined as array", () => {
  test("should render xml like json", async ({ page, swaggerUi }) => {
    const expected =
      '<?xml version="1.0" encoding="UTF-8"?>\n<Users>\n\t<User id="123" name="bob">\n\t</User>\n\t<User id="456" name="jane">\n\t</User>\n</Users>'
    await page.goto("/?url=/documents/bugs/6627.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_users")
    // toContainText normalizes whitespace like cy.contains
    await expect(page.locator(".microlight")).toContainText(expected)
  })
})
