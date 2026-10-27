/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"
import type { Locator } from "@playwright/test"

const documents = "/documents/json-schema-document"

// the type label of each property of a schema, by name
const propertyTypes = async (schema: Locator) => {
  const heads = schema.locator(
    ":scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--properties > ul > .json-schema-2020-12-property > .json-schema-2020-12 > .json-schema-2020-12-head"
  )
  // every property of the fixtures
  await expect(heads).toHaveCount(7)
  const names = await heads
    .locator(".json-schema-2020-12__title")
    .allTextContents()
  const types = await heads
    .locator(".json-schema-2020-12__attribute--primary")
    .allTextContents()

  return Object.fromEntries(names.map((name, i) => [name, types[i]]))
}

/**
 * OpenAPI defines the formats int32, int64, float and double for numbers; JSON Schema 2020-12
 * doesn't, so in a JSON Schema document a schema without `type` gets no type from them.
 */
test.describe("Standalone JSON Schema 2020-12: OpenAPI number formats", () => {
  test("imply no type without `type`", async ({ page }) => {
    await page.goto(`/?url=${documents}/number-formats.yaml`)
    const root = page
      .locator(".json-schema-document .json-schema-2020-12")
      .first()

    expect(await propertyTypes(root)).toEqual({
      count: "any",
      total: "any",
      ratio: "any",
      mean: "any",
      id: "integer",
      takenAt: "string",
      weight: "number | integer",
    })
  })

  test("still imply integer and number in an OpenAPI 3.1 Schema Object", async ({
    page,
  }) => {
    await page.goto(
      `/?url=${documents}/number-formats-oas-3-1.yaml&defaultModelsExpandDepth=5`
    )
    const model = page.locator(".models .json-schema-2020-12").first()

    expect(await propertyTypes(model)).toEqual({
      count: "integer",
      total: "integer",
      ratio: "number",
      mean: "number",
      id: "integer",
      takenAt: "string",
      weight: "number",
    })
  })
})
