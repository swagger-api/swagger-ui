/**
 * @prettier
 */

describe("Response examples", () => {
  it("should render a generated example when an empty examples object is provided", () => {
    cy.visit("/?url=/documents/features/response-empty-examples-object.yaml")
      .get("#operations-TEST-test")
      .click()
      .get(".example.microlight")
      .should("exist")
      .contains("{}")
      .get(".examples-select-element")
      .should("not.exist")
  })
})
