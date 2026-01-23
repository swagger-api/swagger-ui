/**
 * @prettier
 */

describe("OpenAPI 3.2.0 - Component-Only Specification", () => {
  it("should render component-only spec without errors", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/component-only.yaml")

    // Should not show version errors
    cy.get(".version-pragma__message--missing").should("not.exist")
    cy.get(".version-pragma__message--ambiguous").should("not.exist")

    // Should render information container
    cy.get(".information-container").should("exist")
  })

  it("should display spec title for component-only spec", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/component-only.yaml")

    cy.get(".information-container .title")
      .should("exist")
      .and("contain", "Component-Only Specification")
  })

  it("should display spec description for component-only spec", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/component-only.yaml")

    cy.get(".information-container .description")
      .should("exist")
      .and("contain", "valid OAS 3.2.0 specification")
  })

  it("should not display paths section when no paths are present", () => {
    cy.visit("/e2e-cypress/static/documents/oas32/component-only.yaml")

    // Since there are no paths, there should be no operations blocks
    cy.get(".opblock-tag-section").should("not.exist")
  })
})
