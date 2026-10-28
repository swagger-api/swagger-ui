/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"

/**
 * Documents that carry `$schema` but are not standalone JSON Schema documents must render
 * exactly as they did before the json-schema-document plugin existed: OpenAPI and Swagger
 * documents with `$schema` at the root and in Schema Objects, a document whose only `$schema`
 * is nested, and AsyncAPI and Arazzo documents with a root `$schema` (which Swagger UI doesn't
 * render). The ARIA snapshots in `json-schema-document-regression.spec.ts-snapshots/` were
 * recorded on `main` (e32bda50), before the plugin; any difference fails the test.
 */
const baseLayout = ".swagger-container > .swagger-ui"
const documents = "/documents/json-schema-document"
const expanded =
  "&docExpansion=full&defaultModelsExpandDepth=5&defaultModelExpandDepth=5"

const apiDescriptions = [
  {
    name: "swagger-2-0",
    file: "swagger-2-0-dollar-schema.yaml",
    title: "Swagger 2.0 with $schema",
    legacyModels: true,
  },
  {
    name: "oas-3-0",
    file: "oas-3-0-dollar-schema.yaml",
    title: "OpenAPI 3.0 with $schema at the root and in a Schema Object",
    legacyModels: true,
  },
  {
    name: "oas-3-1",
    file: "oas-3-1-dollar-schema.yaml",
    title: "OpenAPI 3.1.0 with $schema at the root and in a Schema Object",
  },
  {
    name: "oas-3-2",
    file: "oas-3-2-dollar-schema.yaml",
    title: "OpenAPI 3.2.0 with $schema at the root and in a Schema Object",
  },
]

const notRendered = [
  { name: "nested-only", file: "nested-only-dollar-schema.yaml" },
  { name: "asyncapi-3-0", file: "asyncapi-3-0-dollar-schema.yaml" },
  { name: "arazzo-1-0-1", file: "arazzo-1-0-1-dollar-schema.yaml" },
]

test.describe("JSON Schema document detection leaves other documents alone", () => {
  for (const { name, file, title, legacyModels } of apiDescriptions) {
    test(`${name}: renders as before`, async ({ page }) => {
      await page.goto(`/?url=${documents}/${file}${expanded}`)

      await expect(page.locator(".information-container .title")).toContainText(
        title
      )
      // the response schema and the Pet model are resolved and expanded
      await expect(
        page.locator(".opblock-body").getByText("tag").first()
      ).toBeVisible()
      if (legacyModels) {
        // the json-schema-5 models don't follow defaultModelExpandDepth here
        await page.locator("#model-Pet .model-box-control").first().click()
      }
      await expect(
        page.locator(".models").getByText("tag").first()
      ).toBeVisible()
      await page.waitForLoadState("networkidle")

      await expect(page.locator(".json-schema-document")).toHaveCount(0)
      await expect(page.locator(".version-pragma__message")).toHaveCount(0)
      await expect(page.locator(baseLayout)).toMatchAriaSnapshot({
        name: `${name}.aria.yml`,
      })
    })
  }

  for (const { name, file } of notRendered) {
    test(`${name}: keeps the missing-version message`, async ({ page }) => {
      await page.goto(`/?url=${documents}/${file}`)

      await expect(
        page.locator(".version-pragma__message--missing")
      ).toContainText(
        "The provided definition does not specify a valid version field."
      )
      await page.waitForLoadState("networkidle")

      await expect(page.locator(".json-schema-document")).toHaveCount(0)
      await expect(page.locator(".json-schema-2020-12")).toHaveCount(0)
      await expect(page.locator(baseLayout)).toMatchAriaSnapshot({
        name: `${name}.aria.yml`,
      })
    })
  }
})
