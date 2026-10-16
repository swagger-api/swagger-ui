/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

const baseUrl = "/?url=/documents/features/oas32-json-schema-rendering.yaml"

test.describe("OpenAPI 3.2 JSON Schema 2020-12 rendering", () => {
  test.describe("Schemas section", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseUrl)
    })

    test("should render the schemas section using JSON Schema 2020-12", async ({
      page,
    }) => {
      await expect(page.locator(".json-schema-2020-12").first()).toBeAttached()
    })

    test("should render schema properties with JSON Schema 2020-12 property classes", async ({
      page,
    }) => {
      // cy.contains yields the deepest element with the text, so click that rather than the wrapper
      await page
        .locator(".json-schema-2020-12")
        .getByText("My Pet")
        .first()
        .click()
      await expect(
        page
          .locator(".json-schema-2020-12-property")
          .filter({ hasText: "id" })
          .first()
      ).toBeAttached()
      await expect(
        page
          .locator(".json-schema-2020-12-property")
          .filter({ hasText: "name" })
          .first()
      ).toBeAttached()
    })

    test("should render the schema description keyword", async ({ page }) => {
      await page
        .locator(".json-schema-2020-12")
        .getByText("My Pet")
        .first()
        .click()
      const description = page.locator(
        ".json-schema-2020-12-keyword--description"
      )
      await expect(description.first()).toBeAttached()
      await expect(description).toContainText("A pet in the system")
    })

    test("should render the Discriminator keyword", async ({ page }) => {
      await page
        .locator(".json-schema-2020-12")
        .getByText("My Pet")
        .first()
        .click()
      await expect(
        page
          .locator(".json-schema-2020-12-keyword__name")
          .filter({ hasText: "Discriminator" })
          .first()
      ).toBeAttached()
    })

    test("should render the External documentation keyword", async ({
      page,
    }) => {
      await page
        .locator(".json-schema-2020-12")
        .getByText("My Pet")
        .first()
        .click()
      await expect(
        page
          .locator(".json-schema-2020-12-keyword__name")
          .filter({ hasText: "External documentation" })
          .first()
      ).toBeAttached()
    })

    test("should render the XML keyword", async ({ page }) => {
      await page
        .locator(".json-schema-2020-12")
        .getByText("My Pet")
        .first()
        .click()
      await expect(
        page.locator(".json-schema-2020-12-keyword--xml").first()
      ).toBeAttached()
    })

    test("should render the Examples keyword", async ({ page }) => {
      await page
        .locator(".json-schema-2020-12")
        .getByText("My Pet")
        .first()
        .click()
      await expect(
        page.locator(".json-schema-2020-12-keyword--examples").first()
      ).toBeAttached()
    })
  })

  test.describe("Request body schema", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(baseUrl)
      await page
        .locator(".opblock-summary-path span")
        .filter({ hasText: "/pets" })
        .click()
      await page.locator("button").filter({ hasText: "Try it out" }).click()
    })

    test("should render request body schema using JSON Schema 2020-12", async ({
      page,
    }) => {
      await page
        .locator(".model-example button")
        .filter({ hasText: "Schema" })
        // the responses section has a Schema tab too; cy.contains yields the first (request body) one
        .first()
        .click()
      await expect(
        page.locator(".model-example .json-schema-2020-12").first()
      ).toBeAttached()
    })

    test("should render example for properties with union type including object", async ({
      page,
    }) => {
      const textarea = page.locator(".model-example textarea")
      await expect(textarea).toBeAttached()
      await expect(textarea).toHaveValue(
        '{\n  "objectTypeUnion": {\n    "id": "string",\n    "name": "string"\n  }\n}'
      )
    })
  })
})
