/**
 * @prettier
 */
import type { Locator, Page } from "@playwright/test"
import { test, expect } from "../../../support/fixtures"

const FIXTURES = "/documents/features/json-schema-unified"
const documents = [
  { version: "2.0", url: `${FIXTURES}/keywords.swagger2.yaml` },
  { version: "3.0", url: `${FIXTURES}/keywords.openapi30.yaml` },
  { version: "3.1", url: `${FIXTURES}/keywords.openapi31.yaml` },
  { version: "3.2", url: `${FIXTURES}/keywords.openapi32.yaml` },
]

const topLevelSchema = (page: Page, name: string): Locator =>
  page.locator(
    `[data-json-schema-unified-models] [data-json-schema-unified][data-json-schema-level="0"][data-schema-name="${name}"]`
  )

// the layout key of a named schema: what a host passes to `layoutActions.show`
const showSchema = (
  page: Page,
  key: string[],
  isShown: boolean
): Promise<void> =>
  page.evaluate(
    ([path, value]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped app global
      ;(window as any).ui.layoutActions.show(path, value)
    },
    [key, isShown] as const
  )

for (const { version, url } of documents) {
  test.describe(`Unified JSON Schema: layout state, OpenAPI ${version}`, () => {
    const key = (name: string) =>
      version === "2.0"
        ? ["definitions", name]
        : ["components", "schemas", name]

    test.beforeEach(async ({ page }) => {
      await page.goto(`/?url=${url}&unifiedJSONSchemaEnabled=true`)
    })

    test("expands a schema shown through layoutActions.show and collapses the previous one", async ({
      page,
    }) => {
      const pet = topLevelSchema(page, "Pet")
      const tag = topLevelSchema(page, "Tag")
      await expect(pet).toHaveAttribute("data-expanded", "false")
      await expect(tag).toHaveAttribute("data-expanded", "false")

      await showSchema(page, key("Pet"), true)
      await expect(pet).toHaveAttribute("data-expanded", "true")
      await expect(pet.locator('[data-keyword="properties"]')).toBeVisible()

      await showSchema(page, key("Pet"), false)
      await showSchema(page, key("Tag"), true)
      await expect(pet).toHaveAttribute("data-expanded", "false")
      await expect(tag).toHaveAttribute("data-expanded", "true")
    })

    test("gives each schema an element with the id model-<name>", async ({
      page,
    }) => {
      await expect(page.locator("#model-Pet")).toHaveCount(1)
      await expect(page.locator("#model-Pet")).toHaveAttribute(
        "data-schema-name",
        "Pet"
      )
    })

    test("keeps a schema opened by a click in step with the layout state", async ({
      page,
    }) => {
      const pet = topLevelSchema(page, "Pet")

      await pet.locator(":scope > div > button[data-expanded]").click()
      await expect(pet).toHaveAttribute("data-expanded", "true")
      // collapsing it from outside works after a click opened it
      await showSchema(page, key("Pet"), false)
      await expect(pet).toHaveAttribute("data-expanded", "false")
    })
  })
}
