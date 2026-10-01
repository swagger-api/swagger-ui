/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

const descriptionCol = (code: string) =>
  `tr.response[data-code='${code}'] td.response-col_description`

test.describe("Response extension feature", () => {
  test.describe("in Swagger 2", () => {
    const swagger2BaseUrl =
      "/?showExtensions=true&docExpansion=full&url=/documents/features/response-extension.swagger.yaml"

    test.describe("without x- values", () => {
      test("should omit response extensions section", async ({ page }) => {
        await page.goto(swagger2BaseUrl)
        await expect(
          page.locator(`${descriptionCol("200")} div.response__extension`)
        ).toHaveCount(0)
      })
    })

    test.describe("with x- values", () => {
      test("should list each value", async ({ page }) => {
        await page.goto(swagger2BaseUrl)

        await expect(
          page.locator(
            `${descriptionCol("404")} div.response__extension:nth-child(2)`
          )
        ).toHaveText("x-error: true")

        await expect(
          page.locator(
            `${descriptionCol("404")} div.response__extension:nth-child(3)`
          )
        ).toHaveText('x-error-codes: List [ "NOT_FOUND" ]')
      })
    })
  })

  test.describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl =
      "/?showExtensions=true&docExpansion=full&url=/documents/features/response-extension.openapi.yaml"

    test.describe("without x- values", () => {
      test("should omit response extensions section", async ({ page }) => {
        await page.goto(openAPI3BaseUrl)
        await expect(
          page.locator(`${descriptionCol("200")} div.response__extension`)
        ).toHaveCount(0)
      })
    })

    test.describe("with x- values", () => {
      test("should list each value", async ({ page }) => {
        await page.goto(openAPI3BaseUrl)

        await expect(
          page.locator(
            `${descriptionCol("404")} div.response__extension:nth-child(2)`
          )
        ).toHaveText("x-error: true")

        await expect(
          page.locator(
            `${descriptionCol("404")} div.response__extension:nth-child(3)`
          )
        ).toHaveText('x-error-codes: List [ "NOT_FOUND" ]')
      })
    })
  })
})
