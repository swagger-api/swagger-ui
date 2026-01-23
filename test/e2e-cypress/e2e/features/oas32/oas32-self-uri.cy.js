/**
 * @prettier
 */

describe("OpenAPI 3.2.0 - $self Field", () => {
  it("should display $self URI when present", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/oas32-features.yaml")

    // Check if the base URI from $self is displayed
    cy.get(".information-container .info__tos")
      .should("contain", "Base URI")
      .and("contain", "https://api.example.com/oas32-features")
  })

  it("should render $self as a clickable link", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/oas32-features.yaml")

    cy.get(".information-container .info__tos a")
      .should("have.attr", "href", "https://api.example.com/oas32-features")
      .and("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer")
  })

  it("should not display $self section when field is not present", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/component-only.yaml")

    // This spec doesn't have $self, so the section should not appear
    cy.get(".information-container .info__tos")
      .contains("Base URI")
      .should("not.exist")
  })
})
