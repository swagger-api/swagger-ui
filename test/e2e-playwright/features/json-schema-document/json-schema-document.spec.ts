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

test.describe("Standalone JSON Schema 2020-12 documents", () => {
  test.describe("given a YAML document", () => {
    const url = `/?url=${documents}/person.yaml`

    test("renders the root schema instead of the version message", async ({
      page,
    }) => {
      await page.goto(url)
      const document = page.locator(".json-schema-document")

      await expect(document).toBeVisible()
      await expect(page.locator(".version-pragma__message")).toHaveCount(0)
      await expect(page.locator(".information-container .info")).toHaveCount(1)
      await expect(
        page.locator(".information-container .info .title")
      ).toContainText("Person")
      await expect(
        page.locator(".information-container .info .version-stamp .version")
      ).toHaveText("JSON Schema")
      await expect(page.locator("#operations")).toHaveCount(0)

      const root = document.locator(".json-schema-2020-12").first()
      await expect(
        root.locator(".json-schema-2020-12__title").first()
      ).toHaveText("Person")
      // defaultModelExpandDepth (1): the root is open, its subschemas closed
      await expect(property(document, "name")).toBeVisible()
      await expect(property(document, "nickname")).toBeVisible()
      await expect(property(document, "age")).toBeVisible()
      await expect(
        property(document, "name").locator(".json-schema-2020-12-body")
      ).toHaveClass(/json-schema-2020-12-body--collapsed/)
      await expect(
        document.locator(".json-schema-2020-12-property--required")
      ).toHaveCount(1)
    })

    test("renders descriptions as plain text and every property", async ({
      page,
    }) => {
      await page.goto(url)
      const description = page
        .locator(
          ".json-schema-document .json-schema-2020-12-keyword--description"
        )
        .first()

      await expect(description).toHaveText(
        "A person. Plain text, so **this** isn't bold."
      )
      await expect(description.locator("strong")).toHaveCount(0)
      // no readOnly/writeOnly filtering as in OpenAPI models
      await expect(page.locator(".json-schema-document")).toContainText(
        "read-only"
      )
      await expect(page.locator(".json-schema-document")).toContainText(
        "write-only"
      )
    })

    test("shows $schema and $id as written", async ({ page }) => {
      await page.goto(url)
      const document = page.locator(".json-schema-document")

      await expect(
        document.locator(".json-schema-2020-12-keyword--\\$schema").first()
      ).toContainText("https://json-schema.org/draft/2020-12/schema#")
      await expect(
        document.locator(".json-schema-2020-12-keyword--\\$id").first()
      ).toContainText("https://example.com/schemas/person")
    })

    test("gives OpenAPI keywords no meaning", async ({ page }) => {
      await page.goto(`${url}&showExtensions=true`)
      const document = page.locator(".json-schema-document")
      await expect(document).toBeVisible()

      for (const keyword of [
        "example",
        "discriminator",
        "xml",
        "externalDocs",
      ]) {
        await expect(
          document.locator(`.json-schema-2020-12-keyword--${keyword}`)
        ).toHaveCount(0)
      }
      const extensionKeywords = document
        .locator(".json-schema-2020-12-keyword--extension-keywords")
        .first()
      await extensionKeywords.locator(".json-schema-2020-12-accordion").click()
      for (const keyword of [
        "example",
        "discriminator",
        "xml",
        "externalDocs",
      ]) {
        await expect(
          extensionKeywords.locator(
            ".json-schema-2020-12-json-viewer-extension-keyword",
            { hasText: keyword }
          )
        ).toHaveCount(1)
      }
    })

    test("hides unknown keywords by default", async ({ page }) => {
      await page.goto(url)

      await expect(page.locator(".json-schema-document")).toBeVisible()
      await expect(
        page.locator(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveCount(0)
    })
  })

  test.describe("given a JSON document with references", () => {
    const url = `/?url=${documents}/order.json&defaultModelExpandDepth=5`

    test("renders every $ref resolved", async ({ page }) => {
      await page.goto(url)
      const document = page.locator(".json-schema-document")
      await expect(document).toBeVisible()

      // internal JSON Pointer
      const customer = property(document, "customer")
      await expect(customer).toHaveClass(
        /json-schema-2020-12-property--required/
      )
      await expect(property(customer, "customerName")).toBeVisible()

      // $anchor
      const status = property(document, "status")
      await expect(
        status.locator(".json-schema-2020-12-keyword--enum").first()
      ).toContainText('"open"')

      // external file, and a JSON Pointer inside it
      const address = property(document, "address")
      await expect(property(address, "street")).toBeVisible()
      await expect(property(address, "country")).toContainText("2 characters")

      // $id-relative: an embedded resource, and an external file next to $id
      const total = property(document, "total")
      await expect(property(total, "amount")).toContainText("> 0")
      const item = document
        .locator(".json-schema-2020-12-keyword--items")
        .first()
      const product = property(item, "product")
      await expect(property(product, "sku")).toContainText(
        "matches ^[A-Z]{3}-[0-9]{4}$"
      )

      // nothing left unresolved, no resolver errors
      await expect(
        document.locator(".json-schema-2020-12-keyword--\\$ref")
      ).toHaveCount(0)
      await expect(page.locator(".errors-wrapper")).toHaveCount(0)
    })

    test("leaves every $dynamicRef as written", async ({ page }) => {
      await page.goto(url)
      const metadata = property(
        page.locator(".json-schema-document"),
        "metadata"
      )

      await expect(
        metadata.locator(".json-schema-2020-12-keyword--\\$dynamicRef")
      ).toContainText("#meta")
    })

    test("doesn't show swagger-client's $$ref annotation", async ({ page }) => {
      await page.goto(`${url}&showExtensions=true`)
      const document = page.locator(".json-schema-document")
      await expect(property(document, "customerName")).toBeVisible()

      await expect(
        document.locator(".json-schema-2020-12-keyword--extension-keywords")
      ).toHaveCount(0)
      await expect(document).not.toContainText("$$ref")
    })
  })

  test("is registered as SwaggerUI.plugins.JSONSchemaDocument", async ({
    page,
  }) => {
    await page.goto(`/?url=${documents}/person.yaml`)
    await expect(page.locator(".json-schema-document")).toBeVisible()

    const registration = await page.evaluate(() => {
      const w = window as unknown as {
        SwaggerUIBundle: { plugins: Record<string, unknown> }
        ui: {
          getSystem: () => {
            getComponents: (name: string) => unknown
            specSelectors: {
              isJSONSchemaDocument: () => boolean
              jsonSchemaDialect: () => string | null
            }
          }
        }
      }
      const system = w.ui.getSystem()
      return {
        plugin: typeof w.SwaggerUIBundle.plugins.JSONSchemaDocument,
        component: typeof system.getComponents("JSONSchemaDocument"),
        isJSONSchemaDocument: system.specSelectors.isJSONSchemaDocument(),
        jsonSchemaDialect: system.specSelectors.jsonSchemaDialect(),
      }
    })

    expect(registration).toEqual({
      plugin: "function",
      component: "function",
      isJSONSchemaDocument: true,
      jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
    })
  })
})
