/**
 * @prettier
 */

describe("Validation errors", () => {
  it("should correctly format validation errors for Map items", () => {
    cy.visit("/?url=/documents/petstore.swagger.yaml")
      .get("#operations-pet-addPet")
      .click()
      .get("button.try-out__btn")
      .click()
      .get("textarea.body-param__text")
      .clear()
      .type(`{backspace}"id": "test", "name": 1}`)
      .get("button.execute")
      .click()
      .get("div.validation-errors.errors-wrapper")
      .contains("id: Value must be an integer")
      .should("exist")
      .get("div.validation-errors.errors-wrapper")
      .contains("name: Value must be a string")
      .should("exist")
  })
})
