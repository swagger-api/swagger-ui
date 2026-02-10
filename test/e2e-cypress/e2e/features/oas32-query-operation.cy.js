/**
 * @prettier
 */

describe("OpenAPI 3.2 QUERY operation rendering", () => {
  const baseUrl = "/?url=/documents/features/oas32-query-operation.yaml"

  it("should render QUERY operation with all fields", () => {
    cy.visit(baseUrl)
      .get("#operations-default-searchPets")
      .should("exist")
      .find(".opblock-summary-method")
      .should("contain", "QUERY")
      .get("#operations-default-searchPets")
      .click()
      .should("have.class", "is-open")
      .find(".opblock-body")
      .should("exist")
      .find(".body-param")
      .should("exist")
  })

  it("should render multiple operations including QUERY", () => {
    cy.visit(baseUrl)
      .get("#operations-default-getPets")
      .should("exist")
      .get("#operations-default-createPet")
      .should("exist")
      .get("#operations-default-searchPets")
      .should("exist")
  })
})
