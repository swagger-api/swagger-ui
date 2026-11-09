/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.0 spec with allOf containing a circular reference", () => {
  test("should render correct title and properties", async ({
    page,
    schemaUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-all-of-circular-ref.yaml")

    await schemaUi.modelToggle(schemaUi.model("OneOfParent"), "button").click()
    // cy `.siblings()` -> all other children of the parent; the alias is re-resolved on each use
    const additionalData = schemaUi.propertyModel("additionalData")
    await schemaUi.modelToggle(additionalData, "button").click()
    if (schemaUi.unified) {
      await schemaUi
        .accordion(schemaUi.keyword("oneOf", additionalData))
        .first()
        .click()
    }
    // cy.contains prefers the closest `button` ancestor of the matched text (the matched
    // `.model-hint` span is display:none), so target the button that wraps the title
    const firstOneOf = schemaUi
      .nestedModelToggle(additionalData, "span button")
      .filter({ hasText: /FirstOneOf/ })
      .first()
    await expect(firstOneOf).toBeAttached()
    await firstOneOf.click()
    await expect(
      schemaUi.nestedModelName(additionalData, "span", /numberProp/)
    ).toBeAttached()
    await expect(
      schemaUi.nestedModelName(additionalData, "span", /additionalData/)
    ).toBeAttached()
  })
})
