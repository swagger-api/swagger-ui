/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Entries should be valid property name", () => {
  test("should render a OAS3.0 definition that uses 'entries' as a 'components' property name", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/6016-oas3.yaml")
    await expect(page.locator("#operations-tag-default")).toBeAttached()
  })
  test("should render expanded Operations of OAS3.0 definition that uses 'entries' as a 'components' property name", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/6016-oas3.yaml")
    await swaggerUi.toggleOperation("#operations-default-test_test__get")
    await expect(
      page.locator("#operations-default-test_test__get > div .opblock-body")
    ).toBeAttached()
  })
  test("should render expanded Models of OAS3.0 definition that uses 'entries' as a 'components' property name", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/6016-oas3.yaml")
    await page.locator("#model-Testmodel > span .model-box").click()
    // Cypress `should("exist")` passes when at least one element matches
    await expect(page.locator("div .model-box")).not.toHaveCount(0)
  })
  test("should render a OAS2.0 definition that uses 'entries' as a 'definitions' property name", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/6016-oas2.yaml")
    await expect(page.locator("#operations-default-post_pet")).toBeAttached()
  })
  test("should render expanded Operations of OAS2.0 definition that uses 'entries' as a 'definitions' property name", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/6016-oas2.yaml")
    await swaggerUi.toggleOperation("#operations-default-post_pet")
    await expect(
      page.locator("#operations-default-post_pet > div .opblock-body")
    ).toBeAttached()
  })
  test("should render expanded Models of OAS2.0 definition that uses 'entries' as a 'defintions' property name", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/6016-oas2.yaml")
    await page.locator("#model-Pet > span .model-box").click()
    // Cypress `should("exist")` passes when at least one element matches
    await expect(page.locator("div .model-box")).not.toHaveCount(0)
  })
})
