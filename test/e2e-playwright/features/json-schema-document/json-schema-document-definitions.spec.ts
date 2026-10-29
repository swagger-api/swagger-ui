/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"
import type { Locator } from "@playwright/test"

const documents = "/documents/json-schema-document"

// the named property of a schema, as rendered by the json-schema-2020-12 renderer
const property = (scope: Locator, name: string) =>
  scope
    .locator(".json-schema-2020-12-property")
    .filter({
      has: scope
        .page()
        .locator(
          ":scope > .json-schema-2020-12 > .json-schema-2020-12-head .json-schema-2020-12__title",
          { hasText: new RegExp(`^${name}$`) }
        ),
    })
    .first()

// the head titles of the subschemas a keyword lists
const subschemaTitles = (keyword: Locator) =>
  keyword.locator(
    ":scope > .json-schema-2020-12-keyword__children > .json-schema-2020-12-property > .json-schema-2020-12 > .json-schema-2020-12-head .json-schema-2020-12__title"
  )

/**
 * `definitions`, which the JSON Schema 2020-12 default meta-schema keeps from earlier drafts:
 * "implementations SHOULD assume that "$defs" and "definitions" have the same behavior when that
 * meta-schema is used" (validation specification, Appendix A).
 */
test.describe("Standalone JSON Schema 2020-12: definitions", () => {
  const url = `/?url=${documents}/definitions.yaml`

  test("renders definitions like $defs, right after it", async ({ page }) => {
    await page.goto(url)
    const root = page
      .locator(".json-schema-document .json-schema-2020-12")
      .first()
    const body = root.locator(":scope > .json-schema-2020-12-body")
    const $defs = body.locator(":scope > .json-schema-2020-12-keyword--\\$defs")
    const definitions = body.locator(
      ":scope > .json-schema-2020-12-keyword--definitions"
    )

    await expect(definitions).toBeVisible()
    await expect(
      body.locator(
        ":scope > .json-schema-2020-12-keyword--\\$defs + .json-schema-2020-12-keyword--definitions"
      )
    ).toHaveCount(1)
    await expect(
      definitions.locator(".json-schema-2020-12-keyword__name").first()
    ).toHaveText("definitions")
    await expect(
      definitions.locator(".json-schema-2020-12__attribute").first()
    ).toHaveText("object")

    // collapsed below the root (defaultModelExpandDepth 1), as $defs
    await expect(subschemaTitles(definitions)).toHaveCount(0)
    await definitions.locator(".json-schema-2020-12-accordion").first().click()
    await expect(subschemaTitles(definitions)).toHaveText(["Product", "Price"])

    await $defs.locator(".json-schema-2020-12-accordion").first().click()
    await expect(subschemaTitles($defs)).toHaveText(["Currency"])
  })

  test("renders the $refs into definitions resolved", async ({ page }) => {
    await page.goto(`${url}&defaultModelExpandDepth=5`)
    const document = page.locator(".json-schema-document")
    await expect(document).toBeVisible()

    const product = property(document, "product")
    await expect(property(product, "price")).toContainText("> 0")
    await expect(page.locator(".errors-wrapper")).toHaveCount(0)

    // swagger-client's json-schema-2020-12-apidom strategy doesn't dereference inside
    // `definitions` (ApiDOM's 2020-12 namespace drops it as a schema keyword), so a $ref
    // within a definition stays as written; every other $ref is resolved
    const definitions = document
      .locator(".json-schema-2020-12")
      .first()
      .locator(
        ":scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--definitions"
      )
    await expect(
      document.locator(".json-schema-2020-12-keyword--\\$ref")
    ).toHaveCount(1)
    await expect(
      property(property(definitions, "Product"), "price").locator(
        ".json-schema-2020-12-keyword--\\$ref"
      )
    ).toContainText("#/definitions/Price")
  })

  test("expands a subschema whose only body keyword is definitions", async ({
    page,
  }) => {
    await page.goto(url)
    const tag = property(page.locator(".json-schema-document"), "tag")
    const head = tag.locator(
      ":scope > .json-schema-2020-12 > .json-schema-2020-12-head"
    )

    await head.locator(".json-schema-2020-12-accordion").click()

    const definitions = tag.locator(".json-schema-2020-12-keyword--definitions")
    await expect(definitions).toBeVisible()
    await definitions.locator(".json-schema-2020-12-accordion").first().click()
    await expect(subschemaTitles(definitions)).toHaveText(["Slug"])
  })

  test("doesn't list definitions as an extension keyword", async ({ page }) => {
    await page.goto(`${url}&showExtensions=true&defaultModelExpandDepth=5`)
    const document = page.locator(".json-schema-document")
    await expect(
      document.locator(".json-schema-2020-12-keyword--definitions")
    ).toHaveCount(2)

    await expect(
      document.locator(".json-schema-2020-12-keyword--extension-keywords")
    ).toHaveCount(0)
  })

  test.describe("in an OpenAPI 3.1 Schema Object", () => {
    const oasUrl = `/?url=${documents}/definitions-oas-3-1.yaml&defaultModelsExpandDepth=5`

    test("keeps no meaning: hidden by default", async ({ page }) => {
      await page.goto(oasUrl)
      const model = page.locator(".models .json-schema-2020-12").first()
      await expect(
        model.locator(".json-schema-2020-12__title").first()
      ).toHaveText("Catalog")

      await expect(page.locator(".json-schema-document")).toHaveCount(0)
      await expect(
        model.locator(".json-schema-2020-12-keyword--definitions")
      ).toHaveCount(0)
      await expect(
        model.locator(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveCount(0)
      await expect(model).not.toContainText("Price")
    })

    test("keeps no meaning: an extension keyword with showExtensions", async ({
      page,
    }) => {
      await page.goto(`${oasUrl}&showExtensions=true`)
      const model = page.locator(".models .json-schema-2020-12").first()
      const extensionKeywords = model
        .locator(".json-schema-2020-12-keyword--extension-keywords")
        .first()
      await expect(extensionKeywords).toBeVisible()

      await expect(
        model.locator(".json-schema-2020-12-keyword--definitions")
      ).toHaveCount(0)
      // expanded: defaultModelsExpandDepth 5
      await expect(
        extensionKeywords.locator(
          ".json-schema-2020-12-json-viewer-extension-keyword",
          { hasText: "definitions" }
        )
      ).toHaveCount(1)
    })
  })
})
