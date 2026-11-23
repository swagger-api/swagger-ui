/**
 * @prettier
 */
import type { Locator } from "@playwright/test"
import { test, expect } from "../../../support/fixtures"

const property = (model: Locator, name: string): Locator =>
  model.locator(
    `[data-keyword="properties"] [data-json-schema-unified][data-schema-name="${name}"]`
  )

test.describe("Unified JSON Schema: readOnly and writeOnly in the Schema tab", () => {
  test("hides readOnly in the request schema and writeOnly in the response schema", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-unified/read-write-only.openapi31.yaml&unifiedJSONSchemaEnabled=true"
    )
    await page.locator("#operations-default-createUser").click()

    // request body first
    const requestBody = page.locator(".opblock-section-request-body")
    await requestBody.getByRole("tab", { name: "Schema" }).click()
    const requestModel = requestBody.locator("[data-json-schema-unified-model]")
    await expect(requestModel).toBeVisible()
    await expect(property(requestModel, "name")).toBeVisible()
    await expect(property(requestModel, "password")).toBeVisible()
    await expect(property(requestModel, "id")).toHaveCount(0)

    // then the response of the same schema
    const response = page.locator(".responses-wrapper")
    await response.getByRole("tab", { name: "Schema" }).click()
    const responseModel = response.locator("[data-json-schema-unified-model]")
    await expect(responseModel).toBeVisible()
    await expect(property(responseModel, "name")).toBeVisible()
    await expect(property(responseModel, "id")).toBeVisible()
    await expect(
      property(responseModel, "id").locator('[data-keyword="readOnly"]')
    ).toHaveText("read-only")
    await expect(property(responseModel, "password")).toHaveCount(0)

    // the request schema keeps its own filtering
    await expect(property(requestModel, "password")).toBeVisible()
    await expect(
      property(requestModel, "password").locator('[data-keyword="writeOnly"]')
    ).toHaveText("write-only")
    await expect(property(requestModel, "id")).toHaveCount(0)
  })
})
