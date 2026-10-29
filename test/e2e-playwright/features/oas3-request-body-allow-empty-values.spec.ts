/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Page } from "@playwright/test"

const SPEC_URL = "/?url=/documents/features/petstore-only-pet.openapi.yaml"
const contentTypeSelect =
  ".opblock-section .opblock-section-request-body .body-param-content-type > select"
const executeButton = ".execute.opblock-control__btn"

// `.parameters:nth-child(n) > .parameters-col_description <suffix>` inside the request body
const bodyParam = (page: Page, nth: number, suffix: string) =>
  page.locator(
    `.opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(${nth}) > .parameters-col_description ${suffix}`
  )
const emptyToggle = (page: Page, nth: number) =>
  bodyParam(page, nth, ".parameter__empty_value_toggle input")
const curlSpans = (page: Page) =>
  page.locator(".responses-wrapper .curl-command span")
// jQuery `.text()` over the set of `.curl-command span` concatenates every span's text.
const curlText = (page: Page) => () =>
  curlSpans(page)
    .allTextContents()
    .then((texts) => texts.join(""))

test.describe("OpenAPI 3.0 Allow Empty Values in Request Body", () => {
  test.beforeEach(async ({ page, swaggerUi }) => {
    await page.goto(SPEC_URL)
    await swaggerUi.toggleOperation("#operations-pet-addPet")
    await page
      .locator(contentTypeSelect)
      .selectOption("application/x-www-form-urlencoded")
    // Expand Try It Out
    await swaggerUi.tryItOut()
  })

  test("should not apply or render to required fields", async ({ page }) => {
    // Request Body
    await expect(emptyToggle(page, 2)).toHaveCount(0)
  })

  test("by default, should be checked for all non-required fields", async ({
    page,
  }) => {
    // Request Body
    await bodyParam(page, 5, ".json-schema-form-item-remove").click()
    await expect(emptyToggle(page, 5)).toBeChecked()
    await bodyParam(page, 6, "select").selectOption("--")
    await expect(emptyToggle(page, 6)).toBeChecked()
  })

  test("checkbox should be toggle-able", async ({ page }) => {
    // Request Body
    await bodyParam(page, 5, ".json-schema-form-item-remove").click()
    await expect(emptyToggle(page, 5)).toBeChecked()
    await emptyToggle(page, 5).uncheck()
    await expect(emptyToggle(page, 5)).not.toBeChecked()
  })

  test("on execute, should allow send with all empty values", async ({
    page,
  }) => {
    // Remove example values
    await bodyParam(page, 5, ".json-schema-form-item-remove").click()
    await bodyParam(page, 6, "select").selectOption("--")
    // Execute
    await page.locator(executeButton).click()
    // cURL component
    await expect(
      page.locator(".responses-wrapper .curl-command")
    ).toBeAttached()
    await expect.poll(curlText(page)).toContain("tags=&status=")
  })

  test("on execute, should allow send with some empty values", async ({
    page,
  }) => {
    // Request Body
    await bodyParam(page, 5, ".json-schema-form-item-remove").click()
    await emptyToggle(page, 5).uncheck()
    // add item to pass required validation
    await page
      .locator(
        ".opblock-body .opblock-section .opblock-section-request-body .parameters:nth-child(4) input"
      )
      .fill("")
    // Execute
    await page.locator(executeButton).click()
    // cURL component
    await expect(
      page.locator(".responses-wrapper .curl-command")
    ).toBeAttached()
    await expect.poll(curlText(page)).toContain("&status=")
    await expect.poll(curlText(page)).not.toContain("tags=")
  })

  test("on execute, should allow send with skip all empty values", async ({
    page,
  }) => {
    // Request Body
    await bodyParam(page, 5, ".json-schema-form-item-remove").click()
    await emptyToggle(page, 5).uncheck()
    await bodyParam(page, 6, "select").selectOption("--")
    await emptyToggle(page, 6).uncheck()
    // Execute
    await page.locator(executeButton).click()
    // cURL component
    await expect(
      page.locator(".responses-wrapper .curl-command")
    ).toBeAttached()
    // Cypress asserted on the (possibly not yet rendered) spans; wait for the
    // cURL command text first so the negative assertions are meaningful.
    await expect(
      page.locator(".responses-wrapper .curl-command")
    ).toContainText("curl")
    await expect.poll(curlText(page)).not.toContain("tags=")
    await expect.poll(curlText(page)).not.toContain("status=")
  })
})
