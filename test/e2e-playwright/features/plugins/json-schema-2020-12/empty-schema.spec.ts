/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("Empty JSON Schema 2020-12", () => {
  test("should render as schema of type `any`", async ({ page, schemaUi }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-2020-12-empty-schema.yaml"
    )

    await expect(schemaUi.title()).toContainText("Test")
    await expect(schemaUi.attribute()).toContainText("any")
  })
})
