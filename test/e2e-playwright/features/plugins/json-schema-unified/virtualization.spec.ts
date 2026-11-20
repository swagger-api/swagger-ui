/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"
import {
  MANY_SCHEMAS_URL,
  routeManySchemasDocument,
} from "../../../support/many-schemas"

// Upper bound of mounted schemas: the visible window plus the overscan,
// far below the 1,000 schemas of the document.
const MAX_MOUNTED_SCHEMAS = 60

test.describe("Unified JSON Schema: virtualized Schemas section", () => {
  test("mounts a window of 1,000 schemas and expands the last one", async ({
    page,
  }) => {
    await routeManySchemasDocument(page, 1000)
    await page.goto(
      `/?url=${MANY_SCHEMAS_URL}&unifiedJSONSchemaEnabled=true&docExpansion=none`
    )
    const section = page.locator("[data-json-schema-unified-models]")
    const mountedSchemas = section.locator(
      '[data-json-schema-unified][data-json-schema-level="0"]'
    )
    const schema = (name: string) =>
      section.locator(
        `[data-json-schema-unified][data-json-schema-level="0"][data-schema-name="${name}"]`
      )

    await expect(section).toHaveAttribute("data-expanded", "false")
    await section.getByRole("button", { name: "Schemas" }).click()
    await expect(section).toHaveAttribute("data-expanded", "true")
    await expect(schema("PerfModel0001")).toBeVisible()
    const mountedAtTop = await mountedSchemas.count()
    expect(mountedAtTop).toBeGreaterThan(1)
    expect(mountedAtTop).toBeLessThanOrEqual(MAX_MOUNTED_SCHEMAS)

    // scroll the list's own scroll container to its end; item heights are
    // measured while scrolling, so repeat until the last schema is mounted
    const scrollContainer = section.locator("div:has(> div > [data-index])")
    await expect(async () => {
      await scrollContainer.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })
      await expect(schema("PerfModel1000")).toBeVisible({ timeout: 1_000 })
    }).toPass()
    await expect(schema("PerfModel0001")).toHaveCount(0)
    expect(await mountedSchemas.count()).toBeLessThanOrEqual(
      MAX_MOUNTED_SCHEMAS
    )

    const last = schema("PerfModel1000")
    await expect(last).toHaveAttribute("data-expanded", "false")
    await last.locator(":scope > div > button[data-expanded]").click()
    await expect(last).toHaveAttribute("data-expanded", "true")
    await expect(
      last.locator(
        '[data-keyword="properties"] [data-json-schema-unified][data-schema-name="tags"]'
      )
    ).toBeVisible()
    await expect(last.locator('[data-keyword="description"]')).toHaveText(
      "Generated perf schema 1000"
    )
  })
})
