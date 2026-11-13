/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("Unified JSON Schema: dark mode", () => {
  test("changes the text color of a schema title", async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-unified/keywords.openapi31.yaml&unifiedJSONSchemaEnabled=true"
    )
    const title = page
      .locator(
        '[data-json-schema-unified-models] [data-json-schema-unified][data-schema-name="Pet"]'
      )
      .first()
      .locator("[data-json-schema-title]")
      .first()
    await expect(title).toHaveText("Pet")
    const color = () => title.evaluate((el) => getComputedStyle(el).color)
    const lightColor = await color()

    await page.evaluate(() =>
      document.documentElement.classList.add("dark-mode")
    )
    await expect.poll(color).not.toBe(lightColor)
    const darkColor = await color()

    await page.evaluate(() =>
      document.documentElement.classList.remove("dark-mode")
    )
    await expect.poll(color).toBe(lightColor)
    expect(darkColor).not.toBe(lightColor)
  })
})
