/**
 * @prettier
 */

describe("OpenAPI 3.2.0 - Version Detection", () => {
  it("should correctly detect OAS 3.2.0 spec", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/oas32-features.yaml")

    // Should render the spec (not show version error)
    cy.get(".information-container").should("exist")
    cy.get(".version-pragma__message--missing").should("not.exist")
    cy.get(".version-pragma__message--ambiguous").should("not.exist")
  })

  it("should display spec title from OAS 3.2.0 spec", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/oas32-features.yaml")

    cy.get(".information-container .title")
      .should("exist")
      .and("contain", "OAS 3.2.0 Basic Features")
  })

  it("should display spec description from OAS 3.2.0 spec", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/oas32-features.yaml")

    cy.get(".information-container .description")
      .should("exist")
      .and("contain", "basic features implemented for OpenAPI 3.2.0")
  })

  it("should display info summary field from OAS 3.2.0 spec", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/oas32-features.yaml")

    cy.get(".information-container .info__summary")
      .should("exist")
      .and("contain", "Demonstrates basic OpenAPI 3.2.0 implementation")
  })
})
