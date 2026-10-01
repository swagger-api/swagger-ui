/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("defaultModelRendering set to model", () => {
  test("should not render schemas for responses with no defined schemas", async ({
    page,
    swaggerUi,
  }) => {
    // `[data-code=200]` (unquoted number) is invalid CSS in Playwright's engine; the quoted form matches the same attribute
    const description = (code: number) =>
      page.locator(
        `#operations-default-get_ [data-code="${code}"] .response-col_description__inner`
      )
    const modelExample = (code: number) =>
      page.locator(
        `#operations-default-get_ [data-code="${code}"] .model-example`
      )

    await page.goto(
      "/?defaultModelRendering=model&url=/documents/features/default-model-rendering.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_")
    await expect(description(200)).toContainText("no content")
    await expect(modelExample(200)).toHaveCount(0)
    await expect(description(201)).toContainText("no schema but an example")
    await expect(modelExample(201)).toContainText('"foo": "bar"')
    await expect(description(202)).toContainText("no schema but examples")
    await expect(modelExample(202)).toContainText('"foo": "bar"')
    await expect(description(203)).toContainText("no schema no example")
    await expect(modelExample(203)).toHaveCount(0)
  })
})
