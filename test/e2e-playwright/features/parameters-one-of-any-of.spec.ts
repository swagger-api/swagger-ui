/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Parameter with oneOf and anyOf keywords in OpenAPI 3.0.x", () => {
  test("should render correct form fields", async ({ page, swaggerUi }) => {
    await page.goto(
      "/?url=/documents/features/parameters-one-of-any-of-oas3.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_")
    const descriptions = page.locator(".parameters-col_description")

    const select = descriptions.nth(1).locator("select")
    await expect(select).toBeAttached()
    await expect(select).toHaveValue("ascending")

    const input = descriptions.nth(2).locator("input")
    await expect(input).toBeAttached()
    await expect(input).toHaveValue("test")

    const textarea = descriptions.nth(3).locator("textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toContainText('"eq": "active"')
  })
})

test.describe("Parameter with oneOf and anyOf keywords in OpenAPI 3.1.0.", () => {
  test("should render correct form fields", async ({ page, swaggerUi }) => {
    await page.goto(
      "/?url=/documents/features/parameters-one-of-any-of-oas31.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-get_")
    const descriptions = page.locator(".parameters-col_description")

    const select = descriptions.nth(1).locator("select")
    await expect(select).toBeAttached()
    await expect(select).toHaveValue("ascending")

    const input = descriptions.nth(2).locator("input")
    await expect(input).toBeAttached()
    await expect(input).toHaveValue("test")

    const textarea = descriptions.nth(3).locator("textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toContainText('"eq": "active"')
  })
})
