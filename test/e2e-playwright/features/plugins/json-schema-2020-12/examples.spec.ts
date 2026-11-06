/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("JSON Schema 2020-12 examples keyword", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-2020-12-examples.yaml"
    )
  })

  test("should render `Examples` section", async ({ schemaUi }) => {
    await schemaUi.accordion().click()
    await expect(schemaUi.keyword("examples")).toBeAttached()
  })

  test("should render primitive examples value", async ({ page, schemaUi }) => {
    await schemaUi.accordion().click()
    // cy.contains is case-sensitive, so use a RegExp instead of a string
    await page.getByText(/Examples/).click()

    const primitiveExample = schemaUi.keyword("examples").getByText(/#0/)
    await expect(primitiveExample).toBeAttached()

    // cy `.siblings(sel)` -> parent's children matching sel
    await expect(
      schemaUi.jsonViewerValue(primitiveExample).getByText(/1/)
    ).toBeAttached()
  })

  test("should render array examples value", async ({ page, schemaUi }) => {
    await schemaUi.accordion().click()
    await page.getByText(/Examples/).click()

    // cy.contains prefers the closest `button`, here the accordion wrapping the `#1` name
    const arrayExample = schemaUi
      .keyword("examples")
      .locator("button")
      .filter({ hasText: /#1/ })
    await expect(arrayExample).toBeAttached()

    await arrayExample.click()

    const arrayExampleItem = arrayExample.locator("xpath=..").getByText(/#0/)
    await expect(arrayExampleItem).toBeAttached()

    await expect(
      schemaUi.jsonViewerValue(arrayExampleItem).getByText(/2/)
    ).toBeAttached()
  })

  test("should render object examples values", async ({ page, schemaUi }) => {
    await schemaUi.accordion().click()
    await page.getByText(/Examples/).click()

    // cy.contains prefers the closest `button`, here the accordion wrapping the `#2` name
    const objectExample = schemaUi
      .keyword("examples")
      .locator("button")
      .filter({ hasText: /#2/ })
    await expect(objectExample).toBeAttached()

    await objectExample.click()

    const objectExampleProperty = objectExample
      .locator("xpath=..")
      .getByText(/prop/)
    await expect(objectExampleProperty).toBeAttached()

    await expect(
      schemaUi.jsonViewerValue(objectExampleProperty).getByText(/3/)
    ).toBeAttached()
  })
})
