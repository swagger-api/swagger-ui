/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"

const documents = "/documents/json-schema-document"

/**
 * A root `$schema` that isn't the identifier of a supported dialect is refused:
 * the document isn't rendered, neither as the dialect it names nor as 2020-12.
 */
const refused = [
  {
    name: "a custom meta-schema",
    file: "refused-custom-meta-schema.yaml",
    $schema: "https://example.com/schemas/custom-meta-schema",
  },
  {
    name: "the OpenAPI 3.1 dialect",
    file: "refused-oas-dialect.yaml",
    $schema: "https://spec.openapis.org/oas/3.1/dialect/base",
  },
  {
    name: "the http:// form of the 2020-12 identifier",
    file: "refused-http-scheme.yaml",
    $schema: "http://json-schema.org/draft/2020-12/schema",
  },
  {
    name: "JSON Schema 2019-09 (not supported yet)",
    file: "refused-2019-09.json",
    $schema: "https://json-schema.org/draft/2019-09/schema",
  },
  {
    name: "JSON Schema Draft 7 (not supported yet)",
    file: "refused-draft-07.yaml",
    $schema: "http://json-schema.org/draft-07/schema#",
  },
]

test.describe("JSON Schema documents of unsupported dialects", () => {
  for (const { name, file, $schema } of refused) {
    test(`are refused: ${name}`, async ({ page }) => {
      await page.goto(`/?url=${documents}/${file}`)
      const message = page.locator(
        ".version-pragma__message--unsupported-dialect"
      )

      await expect(message.locator("h3")).toHaveText(
        "Unable to render this definition"
      )
      await expect(message).toContainText(
        `names a JSON Schema dialect that is not supported: ${$schema}.`
      )
      await expect(message.locator(".version-pragma__dialects li")).toHaveText([
        "https://json-schema.org/draft/2020-12/schema (JSON Schema 2020-12)",
      ])

      await expect(page.locator(".json-schema-document")).toHaveCount(0)
      await expect(page.locator(".json-schema-2020-12")).toHaveCount(0)
      await expect(
        page.locator(".version-pragma__message--missing")
      ).toHaveCount(0)
      await expect(page.locator(".information-container")).toHaveCount(0)
    })
  }
})
