/**
 * @prettier
 */

describe("OpenAPI 3.2 QUERY operation rendering", () => {
  const baseUrl = "/?url=/documents/features/oas32-query-operation.yaml"

  it("should render QUERY operation with all fields", () => {
    cy.visit(baseUrl)
      .get("#operations-Search-searchWithQuery")
      .should("exist")
      .find(".opblock-summary-method")
      .should("contain", "QUERY")
      .get("#operations-Search-searchWithQuery")
      .click()
      .should("have.class", "is-open")
      .find(".opblock-body")
      .should("exist")
  })

  it("should render multiple operations including QUERY", () => {
    cy.visit(baseUrl)
      .get("#operations-Search-searchProducts")
      .should("exist")
      .get("#operations-Search-advancedSearchProducts")
      .should("exist")
      .get("#operations-Search-searchWithQuery")
      .should("exist")
  })
})
