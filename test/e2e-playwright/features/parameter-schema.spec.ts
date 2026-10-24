/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Operation parameters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?url=/documents/features/parameter-schema.yaml")
  })

  test("should render example for parameters of type object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/object" })
      .click()

    const textarea = page.locator(".model-example textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toHaveValue(
      '{\n  "id": "string",\n  "name": "string"\n}'
    )
  })

  test("should render schema for parameters of type object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/object" })
      .click()

    await page
      .locator(".model-example button")
      .filter({ hasText: "Schema" })
      .click()
    // Cypress `exist` passes with 1+ matches; several `.model` nodes render here
    await expect(page.locator(".model-example .model").first()).toBeAttached()
  })

  test("should render example for parameters of type array of objects", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/features/parameter-schema.yaml")

    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayOfObjects" })
      .click()

    const textarea = page.locator(".model-example textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toHaveValue(
      '{\n  "id": "string",\n  "name": "string"\n}'
    )
  })

  test("should render schema for parameters of type array of objects", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayOfObjects" })
      .click()

    await page
      .locator(".model-example button")
      .filter({ hasText: "Schema" })
      .click()
    // Cypress `exist` passes with 1+ matches; several `.model` nodes render here
    await expect(page.locator(".model-example .model").first()).toBeAttached()
  })
})
