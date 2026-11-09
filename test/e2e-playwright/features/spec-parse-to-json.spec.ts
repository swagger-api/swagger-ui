/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Parse YAML as YAML@1.2 with json_schema for all JSON-supported types", () => {
  test("should have date string even without quotes", async ({
    page,
    swaggerUi,
    schemaUi,
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
    await schemaUi.propertyRowToggle(1).click()
    // first element, without-quotes
    await expect(schemaUi.propertyRowExample(1)).toHaveText(
      schemaUi.unified ? '"1999-11-31"' : "example: 1999-11-31"
    )
    await schemaUi.propertyRowToggle(2).click()
    // second element, with quotes
    await expect(schemaUi.propertyRowExample(2)).toHaveText(
      schemaUi.unified ? '"1999-12-31"' : "example: 1999-12-31"
    )
  })
})
