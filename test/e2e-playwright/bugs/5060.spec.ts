/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5060: unwanted smart quotes in rendered Markdown", () => {
  test("should not convert regular quotes to smart quotes", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/5060.yaml")
    // Cypress inspected `$el.get(0).textContent` (first match, retried)
    await expect(async () => {
      const text =
        (await page.locator("div.description").first().textContent()) ?? ""
      expect(text).toContain(
        `Example of a simple GET request via curl with bearer HTTP Authentication`
      )
      expect(text).toContain(`curl -X GET "https://foobar.com/stuff"`)
      expect(text).toContain(`-H "Accept: application/json"`)
      expect(text).toContain(`-H "Authorization: Bearer abc123.xyz.789"`)
      expect(text.indexOf(`“`)).toBe(-1)
    }).toPass()
  })
})
