/**
 * @prettier
 */

describe("OpenAPI 3.2 QUERY operation rendering", () => {
  it("should render QUERY operation in operations list", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      .get("#operations-default-searchPets")
      .should("exist")
      .should("be.visible")
  })

  it("should display QUERY method badge", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      .get("#operations-default-searchPets")
      .find(".opblock-summary-method")
      .should("contain", "QUERY")
  })

  it("should expand QUERY operation when clicked", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      .get("#operations-default-searchPets")
      .click()
      .get("#operations-default-searchPets")
      .should("have.class", "is-open")
  })

  it("should show request body for QUERY operation", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      .get("#operations-default-searchPets")
      .click()
      .get("#operations-default-searchPets")
      .find(".opblock-body")
      .should("exist")
      .find(".body-param")
      .should("exist")
  })

  it("should show parameters section for QUERY operation", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      .get("#operations-default-searchPets")
      .click()
      .get("#operations-default-searchPets")
      .find(".parameters-container")
      .should("exist")
  })

  it("should render multiple operations including QUERY", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      // Should have GET operation
      .get("#operations-default-getPets")
      .should("exist")
      // Should have POST operation
      .get("#operations-default-createPet")
      .should("exist")
      // Should have QUERY operation
      .get("#operations-default-searchPets")
      .should("exist")
  })

  it("should allow executing QUERY operation", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      .get("#operations-default-searchPets")
      .click()
      .get("#operations-default-searchPets")
      .find(".try-out__btn")
      .click()
      .get("#operations-default-searchPets")
      .find(".execute-wrapper")
      .should("exist")
  })

  it("should validate OAS 3.2 spec with QUERY operation", () => {
    cy.visit("/?url=/documents/features/oas32-query-operation.yaml")
      // Wait for spec to load
      .get(".information-container")
      .should("exist")
      // Check for version indicator
      .get(".version-pragma")
      .should("contain", "OAS")
  })
})
