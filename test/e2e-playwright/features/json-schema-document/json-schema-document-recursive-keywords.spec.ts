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

// a keyword of a schema's own body (not of its subschemas)
const ownKeyword = (schema: Locator, keyword: string) =>
  schema.locator(
    `:scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--${keyword.replace(/\$/g, "\\$")}`
  )

/**
 * `$recursiveAnchor` and `$recursiveRef`, which the JSON Schema 2020-12 default meta-schema keeps
 * from 2019-09: renamed to `$dynamicAnchor` and `$dynamicRef` "with behavior modification" (core
 * specification, Appendix G), so they are shown as written and not resolved.
 */
test.describe("Standalone JSON Schema 2020-12: $recursiveAnchor and $recursiveRef", () => {
  const url = `/?url=${documents}/recursive-keywords.yaml`

  test("shows $recursiveAnchor as written, right after $dynamicAnchor", async ({
    page,
  }) => {
    await page.goto(url)
    const root = page
      .locator(".json-schema-document .json-schema-2020-12")
      .first()
    const recursiveAnchor = ownKeyword(root, "$recursiveAnchor")

    await expect(recursiveAnchor).toBeVisible()
    await expect(
      root.locator(
        ":scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--\\$dynamicAnchor + .json-schema-2020-12-keyword--\\$recursiveAnchor"
      )
    ).toHaveCount(1)
    await expect(
      recursiveAnchor.locator(".json-schema-2020-12-keyword__name")
    ).toHaveText("$recursiveAnchor")
    await expect(
      recursiveAnchor.locator(".json-schema-2020-12-keyword__value")
    ).toHaveText("node")
  })

  test("shows 2019-09's boolean $recursiveAnchor as written", async ({
    page,
  }) => {
    await page.goto(`${url}&defaultModelExpandDepth=5`)
    const legacy = property(page.locator(".json-schema-document"), "legacy")

    await expect(
      ownKeyword(
        legacy.locator(":scope > .json-schema-2020-12"),
        "$recursiveAnchor"
      ).locator(".json-schema-2020-12-keyword__value")
    ).toHaveText("true")
  })

  test("shows $recursiveRef as written, unresolved, in a schema it makes expandable", async ({
    page,
  }) => {
    await page.goto(`${url}&defaultModelExpandDepth=2`)
    const children = property(page.locator(".json-schema-document"), "children")
    const items = children
      .locator(".json-schema-2020-12-keyword--items")
      .first()
      .locator(".json-schema-2020-12")
      .first()
    const head = items.locator(":scope > .json-schema-2020-12-head")

    // the items schema (level 2) is collapsed by defaultModelExpandDepth 2, and
    // $recursiveRef is all it has to show
    await expect(
      items.locator(":scope > .json-schema-2020-12-body")
    ).toHaveClass(/json-schema-2020-12-body--collapsed/)
    await head.locator(".json-schema-2020-12-accordion").click()

    const recursiveRef = ownKeyword(items, "$recursiveRef")
    await expect(
      recursiveRef.locator(".json-schema-2020-12-keyword__name")
    ).toHaveText("$recursiveRef")
    await expect(
      recursiveRef.locator(".json-schema-2020-12-keyword__value")
    ).toHaveText("#")
    await expect(page.locator(".errors-wrapper")).toHaveCount(0)
  })

  test("doesn't list them as extension keywords", async ({ page }) => {
    await page.goto(`${url}&showExtensions=true&defaultModelExpandDepth=5`)
    const document = page.locator(".json-schema-document")
    await expect(
      document.locator(".json-schema-2020-12-keyword--\\$recursiveAnchor")
    ).toHaveCount(2)
    await expect(
      document.locator(".json-schema-2020-12-keyword--\\$recursiveRef")
    ).toHaveCount(1)

    await expect(
      document.locator(".json-schema-2020-12-keyword--extension-keywords")
    ).toHaveCount(0)
  })

  test.describe("in an OpenAPI 3.1 Schema Object", () => {
    const oasUrl = `/?url=${documents}/recursive-keywords-oas-3-1.yaml&defaultModelsExpandDepth=5`

    test("keep no meaning: hidden by default", async ({ page }) => {
      await page.goto(oasUrl)
      const model = page.locator(".models .json-schema-2020-12").first()
      await expect(property(model, "children")).toBeVisible()

      await expect(page.locator(".json-schema-document")).toHaveCount(0)
      for (const keyword of ["$recursiveAnchor", "$recursiveRef"]) {
        await expect(
          model.locator(
            `.json-schema-2020-12-keyword--${keyword.replace(/\$/g, "\\$")}`
          )
        ).toHaveCount(0)
      }
      await expect(
        model.locator(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveCount(0)
    })

    test("keep no meaning: extension keywords with showExtensions", async ({
      page,
    }) => {
      await page.goto(`${oasUrl}&showExtensions=true`)
      const model = page.locator(".models .json-schema-2020-12").first()
      await expect(property(model, "children")).toBeVisible()

      for (const keyword of ["$recursiveAnchor", "$recursiveRef"]) {
        await expect(
          model.locator(
            `.json-schema-2020-12-keyword--${keyword.replace(/\$/g, "\\$")}`
          )
        ).toHaveCount(0)
        // expanded: defaultModelsExpandDepth 5
        await expect(
          model.locator(".json-schema-2020-12-json-viewer-extension-keyword", {
            hasText: keyword,
          })
        ).toHaveCount(1)
      }
    })
  })
})
