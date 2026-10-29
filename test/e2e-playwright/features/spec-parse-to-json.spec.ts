/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Parse YAML as YAML@1.2 with json_schema for all JSON-supported types", () => {
  test("should have date string even without quotes", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/spec-parse-to-json.yaml")
    await swaggerUi.toggleOperation("#operations-default-get_foo")
    // Responses -> example value tab
    await expect(page.locator(".language-json > :nth-child(3)")).toHaveText(
      '"without-quotes"'
    )
    await expect(page.locator(".language-json > :nth-child(5)")).toHaveText(
      '"1999-11-31"'
    )
    // Responses -> schema tab
    await page.locator(".model-example > .tab > :nth-child(2)").click()
    await page
      .locator(":nth-child(1) > :nth-child(2) > .model > :nth-child(1)")
      .click()
    // first element, without-quotes
    await expect(
      page.locator(
        ":nth-child(1) > :nth-child(2) > .model > :nth-child(1) > .prop > .property"
      )
    ).toHaveText("example: 1999-11-31")
    await page
      .locator(":nth-child(2) > :nth-child(2) > .model > :nth-child(1)")
      .click()
    // second element, with quotes
    await expect(
      page.locator(
        ":nth-child(2) > :nth-child(2) > .model > :nth-child(1) > .prop > .property"
      )
    ).toHaveText("example: 1999-12-31")
  })
})
