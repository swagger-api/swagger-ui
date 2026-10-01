/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("Request body with complex schema properties", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/oas3-request-body-complex-schema-properties.yaml"
    )
  })

  test("should render example for properties of type object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: /\/object/ })
      .click()
    await page
      .locator("button")
      .filter({ hasText: /Try it out/ })
      .click()

    await expect(page.locator(".model-example textarea")).toHaveValue(
      '{\n  "id": "string",\n  "name": "string"\n}'
    )
  })

  test("should render schema for properties of type object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: /\/object/ })
      .click()
    await page
      .locator("button")
      .filter({ hasText: /Try it out/ })
      .click()

    await page
      .locator(".model-example button")
      .filter({ hasText: /Schema/ })
      .click()
    // cy "exist" passes with one or more matches (several `.model` elements render)
    await expect(page.locator(".model-example .model")).not.toHaveCount(0)
  })

  test("should render example for properties of type array of objects", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: /\/arrayOfObjects/ })
      .click()
    await page
      .locator("button")
      .filter({ hasText: /Try it out/ })
      .click()

    await expect(page.locator(".model-example textarea")).toHaveValue(
      '{\n  "id": "string",\n  "name": "string"\n}'
    )
  })

  test("should render schema for properties of type array of objects", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: /\/arrayOfObjects/ })
      .click()
    await page
      .locator("button")
      .filter({ hasText: /Try it out/ })
      .click()

    await page
      .locator(".model-example button")
      .filter({ hasText: /Schema/ })
      .click()
    // cy "exist" passes with one or more matches (several `.model` elements render)
    await expect(page.locator(".model-example .model")).not.toHaveCount(0)
  })
})
