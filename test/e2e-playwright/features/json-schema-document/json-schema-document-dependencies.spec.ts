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

// the "Required when defined" list a property gets from dependentRequired
const requiredWhenDefined = (scope: Locator) =>
  scope.locator(
    ":scope > .json-schema-2020-12 > .json-schema-2020-12-body > .json-schema-2020-12-keyword--dependentRequired li"
  )

/**
 * `dependencies`, which the JSON Schema 2020-12 default meta-schema keeps from earlier drafts:
 * "The schema form has been moved to Core and renamed to "dependentSchemas" ... The property
 * name array form is retained here and renamed to "dependentRequired"" (validation
 * specification, Appendix A).
 */
test.describe("Standalone JSON Schema 2020-12: dependencies", () => {
  const url = `/?url=${documents}/dependencies.yaml`

  test("renders the schema entries like dependentSchemas, right after it", async ({
    page,
  }) => {
    await page.goto(url)
    const body = page
      .locator(".json-schema-document .json-schema-2020-12")
      .first()
      .locator(":scope > .json-schema-2020-12-body")
    const dependentSchemas = body.locator(
      ":scope > .json-schema-2020-12-keyword--dependentSchemas"
    )
    const dependencies = body.locator(
      ":scope > .json-schema-2020-12-keyword--dependencies"
    )

    await expect(dependencies).toBeVisible()
    await expect(
      body.locator(
        ":scope > .json-schema-2020-12-keyword--dependentSchemas + .json-schema-2020-12-keyword--dependencies"
      )
    ).toHaveCount(1)
    await expect(
      dependencies.locator(".json-schema-2020-12-keyword__name").first()
    ).toHaveText("Dependencies")
    await expect(
      dependencies.locator(".json-schema-2020-12__attribute").first()
    ).toHaveText("object")

    // collapsed below the root (defaultModelExpandDepth 1), as dependentSchemas;
    // only the schema form: the array form renders on the properties
    await expect(subschemaTitles(dependencies)).toHaveCount(0)
    await dependencies.locator(".json-schema-2020-12-accordion").first().click()
    await expect(subschemaTitles(dependencies)).toHaveText(["giftWrap"])

    await dependentSchemas
      .locator(".json-schema-2020-12-accordion")
      .first()
      .click()
    await expect(subschemaTitles(dependentSchemas)).toHaveText(["name"])
  })

  test("renders the array entries like dependentRequired", async ({ page }) => {
    await page.goto(`${url}&defaultModelExpandDepth=5`)
    const document = page.locator(".json-schema-document")
    await expect(document).toBeVisible()

    // creditCard from dependencies, name from dependentRequired
    await expect(
      requiredWhenDefined(property(document, "billingAddress"))
    ).toHaveText(["name", "creditCard"])
    await expect(requiredWhenDefined(property(document, "name"))).toHaveCount(0)
    await expect(
      requiredWhenDefined(property(document, "creditCard"))
    ).toHaveCount(0)
  })

  test("renders a schema entry's subschemas", async ({ page }) => {
    await page.goto(`${url}&defaultModelExpandDepth=5`)
    const document = page.locator(".json-schema-document")
    const dependencies = document
      .locator(".json-schema-2020-12")
      .first()
      .locator(
        ":scope > .json-schema-2020-12-body > .json-schema-2020-12-keyword--dependencies"
      )
    const giftWrap = property(dependencies, "giftWrap")

    await expect(
      giftWrap.locator(".json-schema-2020-12-property--required")
    ).toHaveCount(1)
    // swagger-client's json-schema-2020-12-apidom strategy doesn't dereference inside
    // `dependencies` (ApiDOM's 2020-12 namespace drops it as a schema keyword), so a $ref
    // within a schema entry stays as written
    await expect(
      property(giftWrap, "giftMessage").locator(
        ".json-schema-2020-12-keyword--\\$ref"
      )
    ).toContainText("#/$defs/Message")
    await expect(page.locator(".errors-wrapper")).toHaveCount(0)
  })

  test("expands a subschema whose only body keyword is a schema dependency", async ({
    page,
  }) => {
    await page.goto(url)
    const delivery = property(page.locator(".json-schema-document"), "delivery")
    const head = delivery.locator(
      ":scope > .json-schema-2020-12 > .json-schema-2020-12-head"
    )

    await head.locator(".json-schema-2020-12-accordion").click()

    const dependencies = delivery.locator(
      ".json-schema-2020-12-keyword--dependencies"
    )
    await expect(dependencies).toBeVisible()
    await dependencies.locator(".json-schema-2020-12-accordion").first().click()
    await expect(subschemaTitles(dependencies)).toHaveText(["express"])
  })

  test("doesn't list dependencies as an extension keyword", async ({
    page,
  }) => {
    await page.goto(`${url}&showExtensions=true&defaultModelExpandDepth=5`)
    const document = page.locator(".json-schema-document")
    await expect(
      document.locator(".json-schema-2020-12-keyword--dependencies")
    ).toHaveCount(2)

    await expect(
      document.locator(".json-schema-2020-12-keyword--extension-keywords")
    ).toHaveCount(0)
  })

  test.describe("in an OpenAPI 3.1 Schema Object", () => {
    const oasUrl = `/?url=${documents}/dependencies-oas-3-1.yaml&defaultModelsExpandDepth=5`

    test("keeps no meaning: hidden by default", async ({ page }) => {
      await page.goto(oasUrl)
      const model = page.locator(".models .json-schema-2020-12").first()
      await expect(property(model, "billingAddress")).toBeVisible()

      await expect(page.locator(".json-schema-document")).toHaveCount(0)
      await expect(
        model.locator(".json-schema-2020-12-keyword--dependencies")
      ).toHaveCount(0)
      await expect(
        model.locator(".json-schema-2020-12-keyword--dependentRequired")
      ).toHaveCount(0)
      await expect(
        model.locator(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveCount(0)
    })

    test("keeps no meaning: an extension keyword with showExtensions", async ({
      page,
    }) => {
      await page.goto(`${oasUrl}&showExtensions=true`)
      const model = page.locator(".models .json-schema-2020-12").first()
      const extensionKeywords = model
        .locator(".json-schema-2020-12-keyword--extension-keywords")
        .first()
      // expanded: defaultModelsExpandDepth 5
      await expect(
        extensionKeywords.locator(
          ".json-schema-2020-12-json-viewer-extension-keyword",
          { hasText: "dependencies" }
        )
      ).toHaveCount(1)

      await expect(
        model.locator(".json-schema-2020-12-keyword--dependencies")
      ).toHaveCount(0)
      await expect(
        model.locator(".json-schema-2020-12-keyword--dependentRequired")
      ).toHaveCount(0)
    })
  })
})
