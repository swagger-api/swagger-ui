/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("External docs feature", () => {
  test.describe("in Swagger 2", () => {
    ExternalDocsTest("/?url=/documents/features/external-docs.swagger.yaml")
  })
  test.describe("in OpenAPI 3", () => {
    ExternalDocsTest("/?url=/documents/features/external-docs.openapi.yaml")
  })
})

function ExternalDocsTest(baseUrl: string) {
  test.describe("for Root", () => {
    test("should display link to external docs with description", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const extDocs = page.locator(".info__extdocs")
      await expect(extDocs).toBeAttached()
      await expect(extDocs).toContainText("Read external docs")
      await expect(extDocs).toHaveAttribute("href", "http://swagger.io/")
    })

    test("should display link to external docs without description", async ({
      page,
    }) => {
      // cy.intercept with handler: strip conditional headers, then rewrite the
      // response body to drop the root `externalDocs.description`.
      await page.route(
        (url) =>
          /^\/documents\/features\/external-docs\.(swagger|openapi)\.yaml$/.test(
            url.pathname
          ) && url.search === "?intercept",
        async (route) => {
          const headers = { ...route.request().headers() }
          delete headers["if-none-match"]
          delete headers["if-modified-since"]
          const response = await route.fetch({ headers })
          const body = (await response.text()).replace(
            "  description: Read external docs\n",
            ""
          )
          await route.fulfill({ response, body })
        }
      )
      await page.goto(`${baseUrl}?intercept`)
      const extDocs = page.locator(".info__extdocs")
      await expect(extDocs).toBeAttached()
      await expect(extDocs).toContainText("http://swagger.io")
      await expect(extDocs).toHaveAttribute("href", "http://swagger.io/")
    })
  })

  test.describe("for Tags", () => {
    test("should display link to external docs with description", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const container = page.locator(
        `.opblock-tag[data-tag="pet"] .info__externaldocs`
      )
      await expect(container).toBeAttached()
      const link = container.locator("a")
      await expect(link).toContainText("Pet Documentation")
      await expect(link).toHaveAttribute("href", "http://swagger.io/")
    })

    test("should display link to external docs without description", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const container = page.locator(
        `.opblock-tag[data-tag="petWithoutDescription"] .info__externaldocs`
      )
      await expect(container).toBeAttached()
      const link = container.locator("a")
      await expect(link).toContainText("http://swagger.io")
      await expect(link).toHaveAttribute("href", "http://swagger.io/")
    })
  })

  test.describe("for Schemas", () => {
    function SchemaTestFactory(type: string) {
      return () => {
        test("should display link with description", async ({ page }) => {
          await page.goto(baseUrl)
          await page.locator(`.models #model-${type} button`).click()
          const link = page.locator(`.models #model-${type} .external-docs a`)
          await expect(link).toContainText(`${type} Docs`)
          await expect(link).toHaveAttribute("href", "http://swagger.io/")
        })

        test("should display link without description", async ({ page }) => {
          await page.goto(baseUrl)
          await page
            .locator(`.models #model-${type}WithoutDescription button`)
            .click()
          const link = page.locator(
            `.models #model-${type}WithoutDescription .external-docs a`
          )
          await expect(link).toContainText("http://swagger.io")
          await expect(link).toHaveAttribute("href", "http://swagger.io/")
        })
      }
    }

    test.describe("Primitive Schema", SchemaTestFactory("Primitive"))
    test.describe("Array Schema", SchemaTestFactory("Array"))
    test.describe("Object Schema", SchemaTestFactory("Object"))
  })

  test.describe("for Operation", () => {
    test("should display link to external docs with description", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await page
        .locator("#operations-pet-updatePet button.opblock-summary-control")
        .click()
      await expect(
        page.locator(
          "#operations-pet-updatePet .opblock-external-docs-wrapper .opblock-external-docs__description"
        )
      ).toContainText("More details about putting a pet")
      await expect(
        page.locator(
          "#operations-pet-updatePet .opblock-external-docs-wrapper .opblock-external-docs__link"
        )
      ).toHaveAttribute("href", "http://swagger.io/")
    })

    test("should display link to external docs without description", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await page
        .locator("#operations-pet-addPet button.opblock-summary-control")
        .click()
      await expect(
        page.locator(
          "#operations-pet-addPet .opblock-external-docs-wrapper .opblock-external-docs__description"
        )
      ).toHaveCount(0)
      await expect(
        page.locator(
          "#operations-pet-addPet .opblock-external-docs-wrapper .opblock-external-docs__link"
        )
      ).toHaveAttribute("href", "http://swagger.io/")
    })
  })
}
