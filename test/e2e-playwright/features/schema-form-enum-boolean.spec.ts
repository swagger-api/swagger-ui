/**
 * @prettier
 */
import type { Locator } from "@playwright/test"
import { test, expect } from "../support/fixtures"

const hasClass = (name: string) => new RegExp(`(^|\\s)${name}(\\s|$)`)

test.describe("JSON Schema Form: Enum & Boolean in a Parameter", () => {
  // Cypress aliases (`@enumIsRequired`, ...) re-query lazily; locators do too.
  let executeBtn: Locator
  let enumIsRequired: Locator
  let booleanIsOptional: Locator
  let booleanIsRequired: Locator

  test.beforeEach(async ({ page, swaggerUi }) => {
    await page.goto("/?url=/documents/features/schema-form-enum-boolean.yaml")
    await swaggerUi.toggleOperation("#operations-pet-findPetsByStatus")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    // @alias Execute Button
    executeBtn = page.locator(".execute.opblock-control__btn")
    // @alias Parameters
    const selects = page.locator(
      ".opblock-section tbody > tr > .parameters-col_description > select"
    )
    enumIsRequired = selects.nth(0)
    booleanIsOptional = selects.nth(1)
    booleanIsRequired = selects.nth(2)
  })

  test("should render @enumIsRequired with list of three options", async () => {
    await expect(enumIsRequired).toContainText("available")
    await expect(enumIsRequired).toContainText("pending")
    await expect(enumIsRequired).toContainText("sold")
    await expect(enumIsRequired).not.toContainText("--")
    await expect(enumIsRequired.locator("option")).toHaveCount(3)
  })
  test("should render @booleanIsOptional with default empty string value (display '--')", async () => {
    await expect(booleanIsOptional).toHaveValue("")
    await expect(booleanIsOptional).toContainText("--")
  })
  test("should render @booleanIsRequired with default empty string value (display '--')", async () => {
    await expect(booleanIsRequired).toHaveValue("")
    await expect(booleanIsRequired).toContainText("--")
  })
  test("should NOT be able to execute with empty @enumIsRequired and @booleanIsRequired values", async ({
    page,
  }) => {
    // Execute
    await executeBtn.click()
    await expect(enumIsRequired).toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).toHaveClass(hasClass("invalid"))
    // cURL component
    await expect(page.locator(".responses-wrapper .curl-command")).toHaveCount(
      0
    )
  })
  test("should NOT be able to execute with empty @booleanIsRequired value, but valid @enumIsRequired", async ({
    page,
  }) => {
    await enumIsRequired.selectOption("pending")
    // Execute
    await executeBtn.click()
    await expect(enumIsRequired).not.toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).toHaveClass(hasClass("invalid"))
    // cURL component
    await expect(page.locator(".responses-wrapper .curl-command")).toHaveCount(
      0
    )
  })
  test("should NOT be able to execute with empty @enumIsRequired value, but valid @booleanIsRequired", async ({
    page,
  }) => {
    await booleanIsRequired.selectOption("false")
    // Execute
    await executeBtn.click()
    await expect(enumIsRequired).toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).not.toHaveClass(hasClass("invalid"))
    // cURL component
    await expect(page.locator(".responses-wrapper .curl-command")).toHaveCount(
      0
    )
  })
  test("should execute, if @booleanIsOptional value is 'false'", async ({
    page,
  }) => {
    await enumIsRequired.selectOption("pending")
    await booleanIsRequired.selectOption("false")
    await booleanIsOptional.selectOption("false")
    // Execute
    await executeBtn.click()
    await expect(enumIsRequired).not.toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).not.toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).not.toContainText("expectIsOptional")
    // cURL component
    await expect(
      page.locator(".responses-wrapper .curl-command")
    ).toBeAttached()
    // Cypress `contains.text` on a multi-element set checks the joined text
    const curlSpans = page.locator(".responses-wrapper .curl-command span")
    await expect(curlSpans.first()).toBeAttached()
    await expect
      .poll(async () => (await curlSpans.allTextContents()).join(""))
      .toContain("expectIsOptional=false")
  })
  test("should execute, but NOT send @booleanIsOptional value if not provided", async ({
    page,
  }) => {
    await enumIsRequired.selectOption("pending")
    await booleanIsRequired.selectOption("false")
    // Execute
    await executeBtn.click()
    await expect(enumIsRequired).not.toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).not.toHaveClass(hasClass("invalid"))
    await expect(booleanIsRequired).not.toContainText("expectIsOptional")
    // cURL component
    await expect(
      page.locator(".responses-wrapper .curl-command")
    ).toBeAttached()
    const curlSpans = page.locator(".responses-wrapper .curl-command span")
    await expect(curlSpans.first()).toBeAttached()
    await expect
      .poll(async () => (await curlSpans.allTextContents()).join(""))
      .not.toContain("expectIsOptional")
  })
})
