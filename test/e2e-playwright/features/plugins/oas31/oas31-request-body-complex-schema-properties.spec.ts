/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

const objectExample = '{\n  "id": "string",\n  "name": "string"\n}'
const arrayExample = '[\n  {\n    "id": "string",\n    "name": "string"\n  }\n]'

test.describe("Request body properties with schema and union type", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/oas31-request-body-complex-schema-properties.yaml"
    )
  })

  test("should render example for properties with union type including object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/objectTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    const textarea = page.locator(".model-example textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toHaveValue(objectExample)
  })

  test("should render schema for properties with union type including object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/objectTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    await page
      .locator(".model-example button")
      .filter({ hasText: "Schema" })
      .click()
    await expect(
      page.locator(".model-example .json-schema-2020-12").first()
    ).toBeAttached()
  })

  test("should render example for properties with union type including array of objects", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    const textarea = page.locator(".model-example textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toHaveValue(arrayExample)
  })

  test("should render schema for properties with union type including array of objects", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    await page
      .locator(".model-example button")
      .filter({ hasText: "Schema" })
      .click()
    await expect(
      page.locator(".model-example .json-schema-2020-12").first()
    ).toBeAttached()
  })

  test("should render example for properties of type array with union type of items including object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayItemTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    const textarea = page.locator(".model-example textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toHaveValue(objectExample)
  })

  test("should render schema for properties of type array with union type of items including object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayItemTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    await page
      .locator(".model-example button")
      .filter({ hasText: "Schema" })
      .click()
    await expect(
      page.locator(".model-example .json-schema-2020-12").first()
    ).toBeAttached()
  })

  test("should render example for properties with union type including array and union type of items including object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayTypeAndItemTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    const textarea = page.locator(".model-example textarea")
    await expect(textarea).toBeAttached()
    await expect(textarea).toHaveValue(arrayExample)
  })

  // The Cypress original titled this test "should render example ...", duplicating the previous test's title (Playwright rejects duplicate titles); renamed to match what it asserts.
  test("should render schema for properties with union type including array and union type of items including object", async ({
    page,
  }) => {
    await page
      .locator(".opblock-summary-path span")
      .filter({ hasText: "/arrayTypeAndItemTypeUnion" })
      .click()
    await page.locator("button").filter({ hasText: "Try it out" }).click()

    await page
      .locator(".model-example button")
      .filter({ hasText: "Schema" })
      .click()
    await expect(
      page.locator(".model-example .json-schema-2020-12").first()
    ).toBeAttached()
  })
})
