/**
 * @prettier
 */
import type { Locator, Page } from "@playwright/test"
import { test, expect } from "../../../support/fixtures"

const documents = [
  {
    version: "3.1",
    url: "/documents/features/json-schema-unified/keywords.openapi31.yaml",
  },
  {
    version: "3.2",
    url: "/documents/features/json-schema-unified/keywords.openapi32.yaml",
  },
]

const section = (page: Page): Locator =>
  page.locator("[data-json-schema-unified-models]")

const topLevelSchema = (page: Page, name: string): Locator =>
  section(page).locator(
    `[data-json-schema-unified][data-json-schema-level="0"][data-schema-name="${name}"]`
  )

// a schema's own expansion toggle (the first one in its head)
const toggle = (schema: Locator): Locator =>
  schema.locator(":scope > div > button[data-expanded]")

const expandAll = (schema: Locator): Promise<void> =>
  schema
    .locator(":scope > div")
    .getByRole("button", { name: "Expand all" })
    .click()

const property = (schema: Locator, name: string): Locator =>
  schema
    .locator(
      `[data-keyword="properties"] [data-json-schema-unified][data-schema-name="${name}"]`
    )
    .first()

for (const { version, url } of documents) {
  const open = (page: Page, query = "") =>
    page.goto(`/?url=${url}&unifiedJSONSchemaEnabled=true${query}`)

  test.describe(`Unified JSON Schema: OpenAPI ${version} Schemas section`, () => {
    test("renders the Schemas section with the unified view", async ({
      page,
    }) => {
      await open(page)

      await expect(section(page)).toBeVisible()
      await expect(section(page)).toHaveAttribute("data-expanded", "true")
      await expect(
        section(page).getByRole("heading", { name: "Schemas" })
      ).toBeVisible()
      for (const name of ["Pet", "Tag", "Owner", "Dog", "Node", "Contact"]) {
        await expect(topLevelSchema(page, name)).toBeVisible()
      }
      await expect(page.locator(".json-schema-2020-12")).toHaveCount(0)
      await expect(page.locator("section.models")).toHaveCount(0)
    })

    test("collapses and expands the Schemas section", async ({ page }) => {
      await open(page)
      const control = section(page).getByRole("button", { name: "Schemas" })

      await expect(control).toHaveAttribute("aria-expanded", "true")
      await control.click()
      await expect(section(page)).toHaveAttribute("data-expanded", "false")
      await expect(control).toHaveAttribute("aria-expanded", "false")
      await expect(
        section(page).locator("[data-json-schema-unified]")
      ).toHaveCount(0)

      await control.click()
      await expect(section(page)).toHaveAttribute("data-expanded", "true")
      await expect(topLevelSchema(page, "Pet")).toBeVisible()
    })

    test("expands and collapses a schema", async ({ page }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")

      await expect(pet).toHaveAttribute("data-expanded", "false")
      await expect(pet.locator('[data-keyword="properties"]')).toHaveCount(0)

      await toggle(pet).click()
      await expect(pet).toHaveAttribute("data-expanded", "true")
      await expect(toggle(pet)).toHaveAttribute("data-expanded", "true")
      await expect(pet.locator('[data-keyword="properties"]')).toBeVisible()

      await toggle(pet).click()
      await expect(pet).toHaveAttribute("data-expanded", "false")
      await expect(pet.locator('[data-keyword="properties"]')).toHaveCount(0)
    })

    test("renders nested properties, $ref, allOf, oneOf and items", async ({
      page,
    }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await expandAll(pet)

      // a referenced schema is dereferenced into its properties
      const owner = property(pet, "owner")
      await expect(owner).toHaveAttribute("data-expanded", "true")
      await expect(owner.locator('[data-keyword="type"]').first()).toHaveText(
        "object"
      )
      await expect(property(owner, "fullName")).toBeVisible()

      // array items
      const tags = property(pet, "tags")
      await expect(tags.locator('[data-keyword="type"]').first()).toHaveText(
        "array<object>"
      )
      const items = tags.locator('[data-keyword="items"]')
      await expect(items.getByText("Items", { exact: true })).toBeVisible()
      await expect(property(items, "label")).toBeVisible()

      // allOf (merged by the resolver) of a referenced and an inline schema
      const dog = topLevelSchema(page, "Dog")
      await expandAll(dog)
      await expect(property(dog, "fullName")).toBeVisible()
      await expect(property(dog, "barkVolume")).toBeVisible()

      // oneOf
      const contact = topLevelSchema(page, "Contact")
      await expandAll(contact)
      const oneOf = contact.locator('[data-keyword="oneOf"]')
      await expect(oneOf).toHaveAttribute("data-expanded", "true")
      await expect(oneOf.getByText("One of", { exact: true })).toBeVisible()
      await expect(
        oneOf.locator('[data-json-schema-unified][data-schema-name="#0 Email"]')
      ).toBeVisible()
      await expect(
        oneOf.locator('[data-json-schema-unified][data-schema-name="#1 Phone"]')
      ).toBeVisible()

      // a circular reference keeps its $ref
      const node = topLevelSchema(page, "Node")
      await toggle(node).click()
      const next = property(node, "next")
      await toggle(next).click()
      await expect(next.locator('[data-keyword="$ref"]')).toContainText(
        "#/components/schemas/Node"
      )
    })

    test("renders constraint chips", async ({ page }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()

      const constraint = (name: string) =>
        property(pet, name).locator(
          ':scope > div > [data-keyword="constraint"]'
        )

      await expect(
        constraint("id").and(page.locator('[data-constraint-scope="number"]'))
      ).toHaveText("[1, 1000]")
      await expect(
        constraint("id").and(page.locator('[data-constraint-scope="string"]'))
      ).toHaveText("int64")
      await expect(constraint("name")).toHaveText("[1, 64] characters")
      await expect(constraint("name")).toHaveAttribute(
        "data-constraint-scope",
        "string"
      )
      await expect(constraint("tags")).toHaveText("[1, 10] items")
      await expect(constraint("tags")).toHaveAttribute(
        "data-constraint-scope",
        "array"
      )
    })

    test("renders enum, const and default", async ({ page }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await expandAll(pet)

      const enumKeyword = property(pet, "petType").locator(
        '[data-keyword="enum"]'
      )
      await expect(enumKeyword).toHaveAttribute("data-expanded", "true")
      await expect(enumKeyword.getByText('"dog"')).toBeVisible()
      await expect(enumKeyword.getByText('"cat"')).toBeVisible()

      await expect(
        property(pet, "kind").locator('[data-keyword="const"]')
      ).toHaveText(/Const\s*"pet"/)
      await expect(
        property(pet, "status").locator('[data-keyword="default"]')
      ).toHaveText(/Default\s*"available"/)
    })

    test("renders discriminator, xml, externalDocs and example", async ({
      page,
    }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()

      const discriminator = pet.locator('[data-keyword="discriminator"]')
      const xml = pet.locator('[data-keyword="xml"]')
      const externalDocs = pet.locator('[data-keyword="externalDocs"]')
      const example = pet.locator('[data-keyword="example"]')

      await expect(discriminator).toHaveAttribute("data-expanded", "false")
      await expect(discriminator).toContainText("petType")
      await discriminator.getByRole("button", { name: "Discriminator" }).click()
      await expect(discriminator).toHaveAttribute("data-expanded", "true")
      await expect(
        discriminator.getByText("dog", { exact: true })
      ).toBeVisible()
      await expect(
        discriminator.getByText("#/components/schemas/Dog")
      ).toBeVisible()

      await xml.getByRole("button", { name: "XML" }).click()
      await expect(xml.getByText("name", { exact: true })).toBeVisible()
      await expect(xml.getByText("pet", { exact: true })).toBeVisible()
      await expect(xml.getByText("prefix", { exact: true })).toBeVisible()

      await externalDocs
        .getByRole("button", { name: "External documentation" })
        .click()
      await expect(externalDocs.getByText("More about pets")).toBeVisible()
      await expect(
        externalDocs.getByRole("link", { name: "https://example.com/pets" })
      ).toHaveAttribute("href", "https://example.com/pets")

      await example.getByRole("button", { name: "Example" }).click()
      await expect(example.getByText('"Rex"')).toBeVisible()
    })

    test("renders the description as Markdown", async ({ page }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()

      const description = pet.locator(
        ':scope > div > [data-keyword="description"]'
      )
      await expect(description).toContainText("A pet of the store.")
      await expect(description.locator("strong")).toHaveText("pet")
      await expect(
        description.getByRole("link", { name: "store" })
      ).toHaveAttribute("href", "https://example.com/store")
      await expect(description).not.toContainText("**")
    })

    test("shows extension keywords only with showExtensions", async ({
      page,
    }) => {
      await open(page, "&showExtensions=true")
      let pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()
      const extensions = pet.locator('[data-keyword="extensionKeywords"]')
      await expect(extensions).toBeVisible()
      await extensions
        .getByRole("button", { name: "Extension Keywords" })
        .click()
      await expect(extensions.getByText("x-pet-extension")).toBeVisible()
      await expect(extensions.getByText('"pet extension value"')).toBeVisible()

      await open(page)
      pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()
      await expect(pet.locator('[data-keyword="properties"]')).toBeVisible()
      await expect(
        pet.locator('[data-keyword="extensionKeywords"]')
      ).toHaveCount(0)
      await expect(page.getByText("x-pet-extension")).toHaveCount(0)
    })

    test("hides the Schemas section with defaultModelsExpandDepth=-1", async ({
      page,
    }) => {
      await open(page, "&defaultModelsExpandDepth=-1")

      await expect(page.locator(".opblock").first()).toBeVisible()
      await expect(section(page)).toHaveCount(0)
      await expect(page.locator("section.models")).toHaveCount(0)
    })

    test("renders the Schema tab of an operation with the unified view", async ({
      page,
    }) => {
      await open(page)
      await page.locator("#operations-default-addPet").click()

      const requestBody = page.locator(".opblock-section-request-body")
      await requestBody.getByRole("tab", { name: "Schema" }).click()

      const model = requestBody.locator("[data-json-schema-unified-model]")
      await expect(model).toBeVisible()
      const pet = model.locator(
        '[data-json-schema-unified][data-json-schema-level="0"]'
      )
      await expect(pet).toHaveAttribute("data-schema-name", "Pet")
      await expect(pet).toHaveAttribute("data-expanded", "true")
      await expect(property(pet, "name")).toBeVisible()
      await expect(page.locator(".model-box .json-schema-2020-12")).toHaveCount(
        0
      )
    })
  })
}
