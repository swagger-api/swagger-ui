/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../../../support/fixtures"

const unifiedView =
  "[data-json-schema-unified-models], [data-json-schema-unified-model], [data-json-schema-unified]"

const unifiedOption = (page: Page) =>
  page.evaluate(
    () =>
      (
        window as unknown as {
          ui: { getConfigs: () => Record<string, unknown> }
        }
      ).ui.getConfigs().unifiedJSONSchemaEnabled
  )

test.describe("Unified JSON Schema: option off", () => {
  for (const { version, document } of [
    { version: "3.1", document: "keywords.openapi31.yaml" },
    { version: "3.2", document: "keywords.openapi32.yaml" },
  ]) {
    test(`renders the classic view of an OpenAPI ${version} document`, async ({
      page,
    }) => {
      await page.goto(
        `/?url=/documents/features/json-schema-unified/${document}`
      )

      await expect(
        page.locator(".models .json-schema-2020-12").first()
      ).toBeVisible()
      expect(await unifiedOption(page)).toBe(false)

      await page.locator("#operations-default-addPet").click()
      const requestBody = page.locator(".opblock-section-request-body")
      await requestBody.getByRole("tab", { name: "Schema" }).click()
      await expect(
        requestBody.locator(".model-box .json-schema-2020-12").first()
      ).toBeVisible()

      await expect(page.locator(unifiedView)).toHaveCount(0)
    })
  }
})

const legacyDocuments = [
  {
    version: "3.0",
    document: "classic.openapi30.yaml",
    heading: "Schemas",
    tab: "Schema",
  },
  {
    version: "2.0",
    document: "classic.swagger.yaml",
    heading: "Models",
    tab: "Model",
  },
]

test.describe("Unified JSON Schema: OpenAPI 2.0 / 3.0 documents", () => {
  for (const { version, document, heading, tab } of legacyDocuments) {
    test(`renders the classic view of an OpenAPI ${version} document with the option on`, async ({
      page,
    }) => {
      await page.goto(
        `/?url=/documents/features/json-schema-unified/${document}&unifiedJSONSchemaEnabled=true`
      )

      await expect(page.locator("section.models h4")).toHaveText(heading)
      await expect(page.locator("#model-Pet .model-box").first()).toBeVisible()
      expect(await unifiedOption(page)).toBe(true)

      await page.locator("#operations-default-addPet").click()
      await page
        .locator(".opblock-body")
        .getByRole("tab", { name: tab, exact: true })
        .first()
        .click()
      await expect(
        page.locator(".opblock-body .model-example .model-box").first()
      ).toBeVisible()

      await expect(page.locator(unifiedView)).toHaveCount(0)
    })
  }
})
