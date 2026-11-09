/**
 * @prettier
 */
import type { Locator, Page } from "@playwright/test"
import { test, expect } from "../../../support/fixtures"

const section = (page: Page): Locator =>
  page.locator("[data-json-schema-unified-models]")

const topLevelSchema = (page: Page, name: string): Locator =>
  section(page).locator(
    `[data-json-schema-unified][data-json-schema-level="0"][data-schema-name="${name}"]`
  )

// a schema's own expansion toggle (the first one in its head)
const toggle = (schema: Locator): Locator =>
  schema.locator(":scope > div > button[data-expanded]")

const head = (schema: Locator): Locator =>
  schema.locator(":scope > div").first()

const property = (schema: Locator, name: string): Locator =>
  schema
    .locator(
      `[data-keyword="properties"] [data-json-schema-unified][data-schema-name="${name}"]`
    )
    .first()

const items = (schema: Locator): Locator =>
  schema.locator(
    ':scope > div > [data-keyword="items"] > [data-json-schema-unified]'
  )

const constraint = (schema: Locator): Locator =>
  head(schema).locator('[data-keyword="constraint"]')

const typeOf = (schema: Locator): Locator =>
  head(schema).locator('[data-keyword="type"]')

const refPath = (schema: Locator): Locator =>
  head(schema).locator('[data-keyword="$$ref"]')

const schemaName = (schema: Locator): Locator =>
  head(schema).locator('[data-keyword="schemaName"]')

const documents = [
  {
    version: "2.0",
    url: "/documents/features/json-schema-unified/keywords.swagger2.yaml",
    heading: "Models",
    tab: "Model",
    schemasPointer: "#/definitions/",
  },
  {
    version: "3.0",
    url: "/documents/features/json-schema-unified/keywords.openapi30.yaml",
    heading: "Schemas",
    tab: "Schema",
    schemasPointer: "#/components/schemas/",
  },
]

for (const { version, url, heading, tab, schemasPointer } of documents) {
  const open = (page: Page, query = "") =>
    page.goto(`/?url=${url}&unifiedJSONSchemaEnabled=true${query}`)

  const schemaTab = async (page: Page, operation: string, area: Locator) => {
    await area.getByRole("tab", { name: tab, exact: true }).click()
    const model = area.locator("[data-json-schema-unified-model]")
    await expect(model).toBeVisible()
    return model.locator(
      ':scope > [data-json-schema-unified][data-json-schema-level="0"]'
    )
  }

  const requestArea = (page: Page, operation: string): Locator =>
    version === "2.0"
      ? page.locator(`#operations-default-${operation} .parameters`)
      : page.locator(
          `#operations-default-${operation} .opblock-section-request-body`
        )

  const responseArea = (page: Page, operation: string): Locator =>
    page.locator(`#operations-default-${operation} .responses-wrapper`)

  test.describe(`Unified JSON Schema: OpenAPI ${version} dialect`, () => {
    test(`renders the ${heading} section with the unified view`, async ({
      page,
    }) => {
      await open(page)

      await expect(section(page)).toHaveAttribute("data-expanded", "true")
      await expect(
        section(page).getByRole("heading", { name: heading, exact: true })
      ).toBeVisible()
      for (const name of ["Pet", "Category", "Tag", "Dog", "Node"]) {
        await expect(topLevelSchema(page, name)).toBeVisible()
      }
      await expect(page.locator("section.models")).toHaveCount(0)

      // the section's layout key is the version's schemas path
      await section(page)
        .getByRole("button", { name: heading, exact: true })
        .click()
      await expect(section(page)).toHaveAttribute("data-expanded", "false")
      const isShown = await page.evaluate(
        (path) =>
          (
            window as unknown as {
              ui: {
                layoutSelectors: {
                  isShown: (path: string[], def: boolean) => boolean
                }
              }
            }
          ).ui.layoutSelectors.isShown(path, true),
        version === "2.0" ? ["definitions"] : ["components", "schemas"]
      )
      expect(isShown).toBe(false)
    })

    test("renders boolean exclusive bounds", async ({ page }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()

      await expect(constraint(property(pet, "age"))).toHaveText("[0, 30)")
      await expect(constraint(property(pet, "weight"))).toHaveText("> 0")
      await expect(constraint(property(pet, "score"))).toHaveText("(1, 10]")
    })

    test("names a nested schema next to its property", async ({ page }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()

      const category = property(pet, "category")
      await expect(schemaName(category)).toHaveText("Category")

      const tags = property(pet, "tags")
      await toggle(tags).click()
      await expect(schemaName(items(tags))).toHaveText("Tag")
    })

    test("shows the reference path of an expanded nested schema", async ({
      page,
    }) => {
      await open(page)
      const pet = topLevelSchema(page, "Pet")
      await toggle(pet).click()

      const category = property(pet, "category")
      await expect(refPath(category)).toHaveCount(0)
      await toggle(category).click()
      await expect(refPath(category)).toHaveText(`${schemasPointer}Category`)
      await expect(property(category, "name")).toBeVisible()

      const tags = property(pet, "tags")
      await toggle(tags).click()
      await expect(typeOf(tags)).toHaveText("array<object>")
      await toggle(items(tags)).click()
      await expect(refPath(items(tags))).toHaveText(`${schemasPointer}Tag`)
    })

    test("keeps a recursive model expandable", async ({ page }) => {
      await open(page)
      let node = topLevelSchema(page, "Node")
      await toggle(node).click()

      for (let depth = 1; depth <= 2; depth += 1) {
        const children = property(node, "children")
        await toggle(children).click()
        const item = items(children)
        await expect(item).toHaveAttribute("data-expanded", "false")
        await expect(typeOf(item)).toHaveText("object")
        await toggle(item).click()
        await expect(item).toHaveAttribute("data-expanded", "true")
        await expect(refPath(item)).toHaveText(`${schemasPointer}Node`)
        await expect(property(item, "name")).toBeVisible()
        node = item
      }
      await expect(property(node, "children")).toBeVisible()
    })

    test("renders the Schema tab of an operation with the unified view", async ({
      page,
    }) => {
      await open(page)
      await page.locator("#operations-default-addPet").click()

      const pet = await schemaTab(page, "addPet", requestArea(page, "addPet"))
      await expect(pet).toHaveAttribute("data-schema-name", "Pet")
      await expect(pet).toHaveAttribute("data-expanded", "true")
      await expect(property(pet, "name")).toBeVisible()
      await expect(page.locator(".model-box .model")).toHaveCount(0)
    })

    test("hides readOnly in the request schema and writeOnly in the response schema", async ({
      page,
    }) => {
      await open(page)
      await page.locator("#operations-default-createUser").click()

      const request = await schemaTab(
        page,
        "createUser",
        requestArea(page, "createUser")
      )
      await expect(property(request, "name")).toBeVisible()
      await expect(property(request, "password")).toBeVisible()
      await expect(property(request, "id")).toHaveCount(0)

      const response = await schemaTab(
        page,
        "createUser",
        responseArea(page, "createUser")
      )
      await expect(property(response, "name")).toBeVisible()
      await expect(property(response, "id")).toBeVisible()
      await expect(
        property(response, "id").locator('[data-keyword="readOnly"]')
      ).toHaveText("read-only")
      // writeOnly is not a 2.0 keyword, but 2.0 responses hide it as json-schema-5 does
      await expect(property(response, "password")).toHaveCount(0)
      if (version === "3.0") {
        await expect(
          property(request, "password").locator('[data-keyword="writeOnly"]')
        ).toHaveText("write-only")
      }
      // the request schema keeps its own filtering
      await expect(property(request, "id")).toHaveCount(0)
    })
  })
}

test.describe("Unified JSON Schema: OpenAPI 2.0 keywords", () => {
  const url =
    "/?url=/documents/features/json-schema-unified/keywords.swagger2.yaml&unifiedJSONSchemaEnabled=true"

  test("renders discriminator as a property name", async ({ page }) => {
    await page.goto(url)
    const pet = topLevelSchema(page, "Pet")
    await toggle(pet).click()

    const discriminator = pet.locator(
      ':scope > div > [data-keyword="discriminator"]'
    )
    await expect(discriminator).toContainText("Discriminator")
    await expect(discriminator).toContainText(/pettype/i)
    await expect(discriminator).not.toHaveAttribute("data-expanded")
  })

  test("does not render oneOf, const or nullable as keywords", async ({
    page,
  }) => {
    await page.goto(url)
    const mixed = topLevelSchema(page, "Mixed")
    await mixed.getByRole("button", { name: "Expand all" }).first().click()

    await expect(typeOf(mixed)).toHaveText("object")
    await expect(mixed.locator('[data-keyword="oneOf"]')).toHaveCount(0)
    await expect(mixed.locator('[data-keyword="const"]')).toHaveCount(0)

    await page.goto(`${url}&showExtensions=true`)
    const withExtensions = topLevelSchema(page, "Mixed")
    await toggle(withExtensions).click()
    const extensions = withExtensions.locator(
      ':scope > div > [data-keyword="extensionKeywords"]'
    )
    await extensions.getByRole("button", { name: "Extension Keywords" }).click()
    await expect(extensions.getByText("oneOf", { exact: true })).toBeVisible()
  })

  test("names a dereferenced schema after its decoded reference", async ({
    page,
  }) => {
    await page.goto(url)
    await page.locator("#operations-default-addOdd").click()
    const area = page.locator("#operations-default-addOdd .parameters")
    await area.getByRole("tab", { name: "Model", exact: true }).click()

    await expect(
      area.locator(
        '[data-json-schema-unified-model] > [data-json-schema-unified][data-json-schema-level="0"]'
      )
    ).toHaveAttribute("data-schema-name", "Weird~Name/Slash")
  })

  test("renders type file", async ({ page }) => {
    await page.goto(url)
    await page.locator("#operations-default-getFile").click()
    const area = page.locator("#operations-default-getFile .responses-wrapper")
    await area.getByRole("tab", { name: "Model", exact: true }).click()

    await expect(
      area.locator(
        '[data-json-schema-unified-model] > [data-json-schema-unified] [data-keyword="type"]'
      )
    ).toHaveText("file")
  })
})

test.describe("Unified JSON Schema: OpenAPI 3.0 keywords", () => {
  const url =
    "/?url=/documents/features/json-schema-unified/keywords.openapi30.yaml&unifiedJSONSchemaEnabled=true"

  test("renders nullable, deprecated, discriminator and 2020-12 keywords", async ({
    page,
  }) => {
    await page.goto(url)
    const pet = topLevelSchema(page, "Pet")
    await toggle(pet).click()

    await expect(typeOf(property(pet, "name"))).toHaveText("string | null")
    await expect(
      head(property(pet, "status")).locator('[data-keyword="deprecated"]')
    ).toHaveText("deprecated")
    await expect(
      property(pet, "kind").locator('[data-keyword="const"]')
    ).toHaveCount(0)

    const discriminator = pet.locator(
      ':scope > div > [data-keyword="discriminator"]'
    )
    await expect(discriminator).toContainText(/pettype/i)
    await discriminator.getByRole("button", { name: "Discriminator" }).click()
    await expect(discriminator.getByText("dog", { exact: true })).toBeVisible()
    await expect(
      discriminator.getByText("#/components/schemas/Dog")
    ).toBeVisible()
  })

  test("names oneOf members after their title or reference", async ({
    page,
  }) => {
    await page.goto(url)
    const contact = topLevelSchema(page, "Contact")
    await contact.getByRole("button", { name: "Expand all" }).first().click()

    const oneOf = contact.locator('[data-keyword="oneOf"]')
    for (const name of ["#0 Email", "#1 Phone", "#2 Weird~Name/Slash"]) {
      await expect(
        oneOf.locator(`[data-json-schema-unified][data-schema-name="${name}"]`)
      ).toBeVisible()
    }
  })

  test("keeps an allOf with a circular reference expandable", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/features/oas3-all-of-circular-ref.yaml&unifiedJSONSchemaEnabled=true"
    )
    let parent = topLevelSchema(page, "OneOfParent")
    await toggle(parent).click()

    for (let depth = 1; depth <= 2; depth += 1) {
      const additionalData = property(parent, "additionalData")
      await toggle(additionalData).click()
      const oneOf = additionalData.locator(
        ':scope > div > [data-keyword="oneOf"]'
      )
      await oneOf.getByRole("button", { name: "One of" }).click()
      const first = oneOf.locator(
        '[data-json-schema-unified][data-schema-name="#0 FirstOneOf"]'
      )
      await toggle(first).click()
      await expect(property(first, "numberProp")).toBeVisible()
      await expect(property(first, "additionalData")).toBeVisible()
      parent = first
    }
  })
})
