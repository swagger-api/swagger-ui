/**
 * @prettier
 */
import type { Locator, Page } from "@playwright/test"
import { test, expect } from "../../../support/fixtures"

const FIXTURES = "/documents/features/json-schema-unified"

const pet = (page: Page): Locator =>
  page.locator(
    '[data-json-schema-unified-models] [data-json-schema-unified][data-json-schema-level="0"][data-schema-name="Pet"]'
  )

// opens Pet and everything below it
const openDeep = async (schema: Locator) => {
  await schema.locator(":scope > div > button[data-expanded]").click()
  await schema.getByRole("button", { name: "Expand all" }).first().click()
}

test.describe("Unified JSON Schema: editing the spec while a schema is open", () => {
  test("keeps a reference resolved in a 3.1 document", async ({ page }) => {
    await page.goto(
      `/?url=${FIXTURES}/edit-open-schema.openapi31.yaml&unifiedJSONSchemaEnabled=true`
    )
    const schema = pet(page)
    await openDeep(schema)
    await expect(schema.getByText("ownerName", { exact: true })).toBeVisible()

    await page.evaluate(async (url) => {
      const text = await (await fetch(url)).text()
      const edited = text
        .replace(
          "        owner:",
          "        newPetProp:\n          type: integer\n        owner:"
        )
        .replace(
          "        ownerName:\n          type: string",
          "        ownerName:\n          type: string\n        ownerExtra:\n          type: string"
        )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped app global
      ;(window as any).ui.specActions.updateSpec(edited)
    }, `${FIXTURES}/edit-open-schema.openapi31.yaml`)

    await expect(schema.getByText("newPetProp", { exact: true })).toBeVisible()
    // the reference is resolved again, not left as a `$ref` row
    await expect(schema.getByText("ownerExtra", { exact: true })).toBeVisible()
    await expect(schema.locator('[data-keyword="$ref"]')).toHaveCount(0)
  })

  test("keeps an external reference resolved in a 3.0 document", async ({
    page,
  }) => {
    await page.goto(
      `/?url=${FIXTURES}/edit-open-schema.openapi30.yaml&unifiedJSONSchemaEnabled=true`
    )
    const schema = pet(page)
    await openDeep(schema)
    await expect(schema.getByText("ownerName", { exact: true })).toBeVisible()

    await page.evaluate(async (url) => {
      const text = await (await fetch(url)).text()
      const edited = text.replace(
        "        owner:",
        "        newPetProp:\n          type: integer\n        owner:"
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped app global
      ;(window as any).ui.specActions.updateSpec(edited)
    }, `${FIXTURES}/edit-open-schema.openapi30.yaml`)

    await expect(schema.getByText("newPetProp", { exact: true })).toBeVisible()
    await expect(schema.getByText("ownerName", { exact: true })).toBeVisible()
    await expect(schema.locator('[data-keyword="$ref"]')).toHaveCount(0)
  })
})
